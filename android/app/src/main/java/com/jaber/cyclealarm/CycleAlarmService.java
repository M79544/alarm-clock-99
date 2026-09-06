package com.jaber.cyclealarm;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.AlarmManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.media.AudioManager;
import android.media.ToneGenerator;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;
import android.os.VibrationEffect;
import android.os.Vibrator;

public class CycleAlarmService extends Service {
    public static final String ACTION_START = "com.jaber.cyclealarm.START";
    public static final String ACTION_UPDATE = "com.jaber.cyclealarm.UPDATE";
    public static final String ACTION_PAUSE_RESUME = "com.jaber.cyclealarm.PAUSE_RESUME";
    public static final String ACTION_STOP = "com.jaber.cyclealarm.STOP";
    public static final String ACTION_PHASE_EXPIRED = "com.jaber.cyclealarm.PHASE_EXPIRED";
    public static final String EXTRA_DURATION_SECONDS = "durationSeconds";
    public static final String EXTRA_RING_SECONDS = "ringSeconds";
    public static final String EXTRA_TARGET = "target";
    public static final String EXTRA_TONE = "tone";
    public static final String EXTRA_LANGUAGE = "language";

    private static final String CHANNEL_ID = "cycle_alarm_running_v2";
    private static final int NOTIFICATION_ID = 42;
    private static final int PHASE_ALARM_REQUEST_CODE = 77;
    private static final String PREFS = "cycle_alarm_service";

    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable ticker = this::tick;

    private PowerManager.WakeLock wakeLock;
    private ToneGenerator toneGenerator;
    private long phaseEndAt;
    private long remainingMs;
    private int durationSeconds = 300;
    private int ringSeconds = 5;
    private int target = 10;
    private int completed = 0;
    private String tone = "classic";
    private String language = "ar";
    private Mode mode = Mode.IDLE;
    private boolean completeAfterRing = false;

    private enum Mode {
        IDLE,
        RUNNING,
        PAUSED,
        RINGING,
        COMPLETE
    }

    @Override
    public void onCreate() {
        super.onCreate();
        createChannel();
        toneGenerator = new ToneGenerator(AudioManager.STREAM_ALARM, 100);
        loadState();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? null : intent.getAction();

        if (action == null) {
            restoreRunningService();
        } else if (ACTION_START.equals(action)) {
            startFromIntent(intent);
        } else if (ACTION_UPDATE.equals(action)) {
            updateFromIntent(intent);
        } else if (ACTION_PAUSE_RESUME.equals(action)) {
            pauseOrResume();
        } else if (ACTION_STOP.equals(action)) {
            stopAlarm();
        } else if (ACTION_PHASE_EXPIRED.equals(action)) {
            handlePhaseExpired();
        }

        return START_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacks(ticker);
        cancelPhaseAlarm();
        releaseWakeLock();
        if (toneGenerator != null) {
            toneGenerator.release();
            toneGenerator = null;
        }
        super.onDestroy();
    }

    private void startFromIntent(Intent intent) {
        durationSeconds = Math.max(1, intent.getIntExtra(EXTRA_DURATION_SECONDS, 300));
        ringSeconds = Math.max(1, intent.getIntExtra(EXTRA_RING_SECONDS, 5));
        target = Math.max(1, intent.getIntExtra(EXTRA_TARGET, 10));
        tone = intent.getStringExtra(EXTRA_TONE) == null ? "classic" : intent.getStringExtra(EXTRA_TONE);
        language = intent.getStringExtra(EXTRA_LANGUAGE) == null ? "ar" : intent.getStringExtra(EXTRA_LANGUAGE);
        completed = 0;
        completeAfterRing = false;
        acquireWakeLock();
        beginCountdown();
    }

    private void updateFromIntent(Intent intent) {
        long now = System.currentTimeMillis();
        long previousDurationMs = Math.max(1000L, durationSeconds * 1000L);
        long currentRemainingMs = mode == Mode.RUNNING
                ? Math.max(0L, phaseEndAt - now)
                : remainingMs;
        double remainingRatio = Math.max(0.0, Math.min(1.0, currentRemainingMs / (double) previousDurationMs));

        durationSeconds = Math.max(1, intent.getIntExtra(EXTRA_DURATION_SECONDS, durationSeconds));
        ringSeconds = Math.max(1, intent.getIntExtra(EXTRA_RING_SECONDS, ringSeconds));
        target = Math.max(1, intent.getIntExtra(EXTRA_TARGET, target));
        tone = intent.getStringExtra(EXTRA_TONE) == null ? tone : intent.getStringExtra(EXTRA_TONE);
        language = intent.getStringExtra(EXTRA_LANGUAGE) == null ? language : intent.getStringExtra(EXTRA_LANGUAGE);
        completed = Math.min(completed, target);
        completeAfterRing = completed >= target;

        if (mode == Mode.RUNNING) {
            remainingMs = Math.max(1000L, Math.round(durationSeconds * 1000L * remainingRatio));
            phaseEndAt = now + remainingMs;
            schedulePhaseAlarm(phaseEndAt);
            scheduleTick();
        } else if (mode == Mode.PAUSED) {
            remainingMs = Math.max(1000L, Math.round(durationSeconds * 1000L * remainingRatio));
        }

        saveState();

        if (mode != Mode.IDLE) {
            startForeground(NOTIFICATION_ID, buildNotification());
        }
    }

    private void beginCountdown() {
        mode = Mode.RUNNING;
        remainingMs = durationSeconds * 1000L;
        phaseEndAt = System.currentTimeMillis() + remainingMs;
        saveState();
        startForeground(NOTIFICATION_ID, buildNotification());
        schedulePhaseAlarm(phaseEndAt);
        scheduleTick();
    }

    private void finishCycle() {
        completed += 1;
        completeAfterRing = completed >= target;
        mode = Mode.RINGING;
        phaseEndAt = System.currentTimeMillis() + ringSeconds * 1000L;
        saveState();
        playRingTone();
        vibrate();
        startForeground(NOTIFICATION_ID, buildNotification());
        schedulePhaseAlarm(phaseEndAt);
        scheduleTick();
    }

    private void completeTarget() {
        mode = Mode.COMPLETE;
        handler.removeCallbacks(ticker);
        cancelPhaseAlarm();
        saveState();
        playCompleteTone();
        vibrate();
        releaseWakeLock();
        startForeground(NOTIFICATION_ID, buildNotification());
    }

    private void tick() {
        long now = System.currentTimeMillis();

        if (mode == Mode.RUNNING) {
            remainingMs = Math.max(0, phaseEndAt - now);
            if (remainingMs <= 0) {
                finishCycle();
                return;
            }
        }

        if (mode == Mode.RINGING) {
            if (now >= phaseEndAt) {
                if (completeAfterRing) {
                    completeTarget();
                } else {
                    beginCountdown();
                }
                return;
            }
            playRingTone();
            vibrate();
        }

        startForeground(NOTIFICATION_ID, buildNotification());
        scheduleTick();
    }

    private void scheduleTick() {
        handler.removeCallbacks(ticker);
        handler.postDelayed(ticker, mode == Mode.RINGING ? 900L : 1000L);
    }

    private void handlePhaseExpired() {
        acquireWakeLock();

        if (mode == Mode.RUNNING) {
            finishCycle();
            return;
        }

        if (mode == Mode.RINGING) {
            if (completeAfterRing) {
                completeTarget();
            } else {
                beginCountdown();
            }
        }
    }

    private void pauseOrResume() {
        if (mode == Mode.RUNNING || mode == Mode.RINGING) {
            remainingMs = Math.max(0, phaseEndAt - System.currentTimeMillis());
            mode = Mode.PAUSED;
            saveState();
            startForeground(NOTIFICATION_ID, buildNotification());
            handler.removeCallbacks(ticker);
            cancelPhaseAlarm();
            return;
        }

        if (mode == Mode.PAUSED) {
            mode = Mode.RUNNING;
            phaseEndAt = System.currentTimeMillis() + Math.max(1000L, remainingMs);
            saveState();
            startForeground(NOTIFICATION_ID, buildNotification());
            schedulePhaseAlarm(phaseEndAt);
            scheduleTick();
        }
    }

    private void stopAlarm() {
        handler.removeCallbacks(ticker);
        cancelPhaseAlarm();
        clearState();
        releaseWakeLock();
        stopForeground(true);
        stopSelf();
    }

    private Notification buildNotification() {
        Intent openIntent = new Intent(this, MainActivity.class);
        PendingIntent openPendingIntent = PendingIntent.getActivity(
                this,
                1,
                openIntent,
                pendingIntentFlags()
        );

        PendingIntent pauseIntent = serviceAction(2, ACTION_PAUSE_RESUME);
        PendingIntent stopIntent = serviceAction(3, ACTION_STOP);

        String title = text("المنبه يعمل", "Alarm çalışıyor", "Alarm running");
        String status;
        if (mode == Mode.RUNNING) {
            status = text("الدورة ", "Tur ", "Cycle ") + (completed + 1) + " / " + target + " - " + formatTime(remainingMs);
        } else if (mode == Mode.RINGING) {
            status = text("تنبيه الدورة ", "Tur alarmı ", "Cycle alarm ") + completed + " / " + target;
        } else if (mode == Mode.PAUSED) {
            status = text("متوقف مؤقتًا - المكتمل ", "Duraklatıldı - tamamlanan ", "Paused - completed ") + completed + " / " + target;
        } else if (mode == Mode.COMPLETE) {
            title = text("اكتمل العدد", "Sayı tamamlandı", "Count complete");
            status = completed + " / " + target;
        } else {
            status = "";
        }

        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(this, CHANNEL_ID)
                : new Notification.Builder(this);

        builder
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentTitle(title)
                .setContentText(status)
                .setContentIntent(openPendingIntent)
                .setOngoing(mode != Mode.COMPLETE)
                .setOnlyAlertOnce(mode != Mode.RINGING && mode != Mode.COMPLETE)
                .setCategory(Notification.CATEGORY_ALARM)
                .setPriority(Notification.PRIORITY_HIGH)
                .setVisibility(Notification.VISIBILITY_PUBLIC)
                .setShowWhen(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N && mode == Mode.RUNNING) {
            builder.setWhen(phaseEndAt);
            builder.setUsesChronometer(true);
            builder.setChronometerCountDown(true);
        }

        if (mode != Mode.COMPLETE) {
            builder.addAction(R.drawable.ic_launcher, mode == Mode.PAUSED ? text("متابعة", "Devam", "Resume") : text("إيقاف مؤقت", "Duraklat", "Pause"), pauseIntent);
            builder.addAction(R.drawable.ic_launcher, text("إيقاف", "Durdur", "Stop"), stopIntent);
        } else {
            builder.addAction(R.drawable.ic_launcher, text("إيقاف", "Durdur", "Stop"), stopIntent);
        }

        return builder.build();
    }

    private PendingIntent serviceAction(int requestCode, String action) {
        Intent intent = new Intent(this, CycleAlarmService.class);
        intent.setAction(action);
        return PendingIntent.getService(this, requestCode, intent, pendingIntentFlags());
    }

    private int pendingIntentFlags() {
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            flags |= PendingIntent.FLAG_IMMUTABLE;
        }
        return flags;
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return;
        }

        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Cycle Alarm",
                NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Persistent alarm timer and lock screen controls");
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        channel.enableVibration(true);
        NotificationManager manager = getSystemService(NotificationManager.class);
        manager.createNotificationChannel(channel);
    }

    private void schedulePhaseAlarm(long triggerAtMillis) {
        AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        PendingIntent pendingIntent = phaseAlarmIntent();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
            alarmManager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
        } else {
            alarmManager.setExact(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent);
        }
    }

    private void restoreRunningService() {
        if (mode == Mode.IDLE || mode == Mode.COMPLETE) {
            return;
        }

        acquireWakeLock();
        startForeground(NOTIFICATION_ID, buildNotification());

        if (mode == Mode.RUNNING || mode == Mode.RINGING) {
            schedulePhaseAlarm(phaseEndAt);
            scheduleTick();
        }
    }

    private void saveState() {
        getSharedPreferences(PREFS, MODE_PRIVATE)
                .edit()
                .putString("mode", mode.name())
                .putLong("phaseEndAt", phaseEndAt)
                .putLong("remainingMs", remainingMs)
                .putInt("durationSeconds", durationSeconds)
                .putInt("ringSeconds", ringSeconds)
                .putInt("target", target)
                .putInt("completed", completed)
                .putString("tone", tone)
                .putString("language", language)
                .putBoolean("completeAfterRing", completeAfterRing)
                .apply();
    }

    private void loadState() {
        SharedPreferences prefs = getSharedPreferences(PREFS, MODE_PRIVATE);
        String savedMode = prefs.getString("mode", Mode.IDLE.name());

        try {
            mode = Mode.valueOf(savedMode);
        } catch (IllegalArgumentException ignored) {
            mode = Mode.IDLE;
        }

        phaseEndAt = prefs.getLong("phaseEndAt", 0L);
        remainingMs = prefs.getLong("remainingMs", durationSeconds * 1000L);
        durationSeconds = prefs.getInt("durationSeconds", durationSeconds);
        ringSeconds = prefs.getInt("ringSeconds", ringSeconds);
        target = prefs.getInt("target", target);
        completed = prefs.getInt("completed", completed);
        tone = prefs.getString("tone", tone);
        language = prefs.getString("language", language);
        completeAfterRing = prefs.getBoolean("completeAfterRing", false);
    }

    private void clearState() {
        getSharedPreferences(PREFS, MODE_PRIVATE).edit().clear().apply();
        mode = Mode.IDLE;
    }

    private void cancelPhaseAlarm() {
        AlarmManager alarmManager = (AlarmManager) getSystemService(Context.ALARM_SERVICE);
        alarmManager.cancel(phaseAlarmIntent());
    }

    private PendingIntent phaseAlarmIntent() {
        Intent intent = new Intent(this, CycleAlarmService.class);
        intent.setAction(ACTION_PHASE_EXPIRED);
        return PendingIntent.getService(this, PHASE_ALARM_REQUEST_CODE, intent, pendingIntentFlags());
    }

    private void acquireWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            return;
        }

        PowerManager powerManager = (PowerManager) getSystemService(Context.POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "CycleAlarm:Timer");
        wakeLock.acquire();
    }

    private void releaseWakeLock() {
        if (wakeLock != null && wakeLock.isHeld()) {
            wakeLock.release();
        }
        wakeLock = null;
    }

    private void playRingTone() {
        if (toneGenerator == null) {
            return;
        }

        if ("soft".equals(tone)) {
            toneGenerator.startTone(ToneGenerator.TONE_PROP_BEEP, 350);
        } else if ("urgent".equals(tone)) {
            toneGenerator.startTone(ToneGenerator.TONE_CDMA_ALERT_CALL_GUARD, 550);
        } else {
            toneGenerator.startTone(ToneGenerator.TONE_CDMA_ALERT_NETWORK_LITE, 450);
        }
    }

    private void playCompleteTone() {
        if (toneGenerator != null) {
            toneGenerator.startTone(ToneGenerator.TONE_CDMA_ALERT_AUTOREDIAL_LITE, 1200);
        }
    }

    private void vibrate() {
        Vibrator vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        if (vibrator == null || !vibrator.hasVibrator()) {
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(450, VibrationEffect.DEFAULT_AMPLITUDE));
        } else {
            vibrator.vibrate(450);
        }
    }

    private String formatTime(long milliseconds) {
        long totalSeconds = Math.max(0, milliseconds / 1000L);
        long minutes = totalSeconds / 60L;
        long seconds = totalSeconds % 60L;
        return String.format("%02d:%02d", minutes, seconds);
    }

    private String text(String arabic, String turkish) {
        return "tr".equals(language) ? turkish : arabic;
    }

    private String text(String arabic, String turkish, String english) {
        if ("en".equals(language)) {
            return english;
        }
        return "tr".equals(language) ? turkish : arabic;
    }
}
