// المسار المطلوب: android/app/src/main/java/com/kallaa/cyclealarm/CycleAlarmService.kt
package com.kallaa.cyclealarm

import android.app.AlarmManager
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.RingtoneManager
import android.os.Build
import android.os.IBinder
import android.os.VibrationEffect
import android.os.Vibrator
import androidx.core.app.NotificationCompat
import org.json.JSONObject

class CycleAlarmService : Service() {

    private var mediaPlayer: MediaPlayer? = null
    private var vibrator: Vibrator? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        vibrator = getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action ?: ACTION_KEEP_ALIVE
        when (action) {
            ACTION_START -> handleStart(intent)
            ACTION_PAUSE_RESUME -> handlePauseResume()
            ACTION_STOP -> handleStop()
            ACTION_UPDATE -> handleUpdate(intent)
            ACTION_PHASE_END -> handlePhaseEnd()
        }
        return START_STICKY
    }

    // ---------- إجراءات عامة ----------

    private fun handleStart(intent: Intent?) {
        val durationSeconds = intent?.getIntExtra(EXTRA_DURATION, 300) ?: 300
        val ringSeconds = intent?.getIntExtra(EXTRA_RING, 5) ?: 5
        val target = intent?.getIntExtra(EXTRA_TARGET, 10) ?: 10
        val tone = intent?.getStringExtra(EXTRA_TONE) ?: "classic"
        val language = intent?.getStringExtra(EXTRA_LANG) ?: "ar"

        stopRinging()
        cancelAlarm()

        val prefs = prefs()
        prefs.edit()
            .putString(KEY_MODE, "RUNNING")
            .putInt(KEY_DURATION, durationSeconds)
            .putInt(KEY_RING, ringSeconds)
            .putInt(KEY_TARGET, target)
            .putString(KEY_TONE, tone)
            .putString(KEY_LANG, language)
            .putInt(KEY_COMPLETED, 0)
            .putBoolean(KEY_COMPLETE_AFTER_RING, false)
            .putLong(KEY_PHASE_END, System.currentTimeMillis() + durationSeconds * 1000L)
            .putLong(KEY_REMAINING, 0)
            .apply()

        scheduleAlarm(prefs.getLong(KEY_PHASE_END, 0))
        startForeground(NOTIFICATION_ID, buildNotification(notifTextRunning()))
    }

    private fun handlePauseResume() {
        val prefs = prefs()
        val mode = prefs.getString(KEY_MODE, "IDLE")
        val now = System.currentTimeMillis()

        when (mode) {
            "RUNNING" -> {
                val remaining = (prefs.getLong(KEY_PHASE_END, now) - now).coerceAtLeast(0)
                cancelAlarm()
                prefs.edit()
                    .putString(KEY_MODE, "PAUSED")
                    .putLong(KEY_REMAINING, remaining)
                    .apply()
                updateNotification(notifTextPaused())
            }
            "RINGING" -> {
                val remaining = (prefs.getLong(KEY_PHASE_END, now) - now).coerceAtLeast(1000)
                cancelAlarm()
                stopRinging()
                prefs.edit()
                    .putString(KEY_MODE, "PAUSED")
                    .putLong(KEY_REMAINING, remaining)
                    .apply()
                updateNotification(notifTextPaused())
            }
            "PAUSED" -> {
                val remaining = prefs.getLong(KEY_REMAINING, 0)
                val wasRinging = remaining in 1..prefs.getInt(KEY_RING, 5) * 1000L
                val newMode = if (wasRinging) "RINGING" else "RUNNING"
                val phaseEnd = now + remaining.coerceAtLeast(1000)
                prefs.edit()
                    .putString(KEY_MODE, newMode)
                    .putLong(KEY_PHASE_END, phaseEnd)
                    .apply()
                scheduleAlarm(phaseEnd)
                if (newMode == "RINGING") startRinging()
                updateNotification(notifTextRunning())
            }
        }
    }

    private fun handleStop() {
        cancelAlarm()
        stopRinging()
        prefs().edit().putString(KEY_MODE, "IDLE").apply()
        stopForeground(true)
        stopSelf()
    }

    private fun handleUpdate(intent: Intent?) {
        val prefs = prefs()
        intent?.getIntExtra(EXTRA_DURATION, -1)?.takeIf { it > 0 }?.let { prefs.edit().putInt(KEY_DURATION, it).apply() }
        intent?.getIntExtra(EXTRA_RING, -1)?.takeIf { it > 0 }?.let { prefs.edit().putInt(KEY_RING, it).apply() }
        intent?.getIntExtra(EXTRA_TARGET, -1)?.takeIf { it > 0 }?.let { prefs.edit().putInt(KEY_TARGET, it).apply() }
        intent?.getStringExtra(EXTRA_TONE)?.let { prefs.edit().putString(KEY_TONE, it).apply() }
        intent?.getStringExtra(EXTRA_LANG)?.let { prefs.edit().putString(KEY_LANG, it).apply() }
    }

    private fun handlePhaseEnd() {
        val prefs = prefs()
        val mode = prefs.getString(KEY_MODE, "IDLE")
        val now = System.currentTimeMillis()

        if (mode == "RUNNING") {
            val completed = prefs.getInt(KEY_COMPLETED, 0) + 1
            val target = prefs.getInt(KEY_TARGET, 10)
            val ringSeconds = prefs.getInt(KEY_RING, 5)
            val completeAfterRing = completed >= target

            prefs.edit()
                .putInt(KEY_COMPLETED, completed)
                .putBoolean(KEY_COMPLETE_AFTER_RING, completeAfterRing)
                .putString(KEY_MODE, "RINGING")
                .putLong(KEY_PHASE_END, now + ringSeconds * 1000L)
                .apply()

            scheduleAlarm(now + ringSeconds * 1000L)
            startRinging()
            updateNotification(notifTextRinging())
        } else if (mode == "RINGING") {
            stopRinging()
            val completeAfterRing = prefs.getBoolean(KEY_COMPLETE_AFTER_RING, false)

            if (completeAfterRing) {
                prefs.edit().putString(KEY_MODE, "COMPLETE").apply()
                showCompleteNotification()
                stopForeground(true)
                stopSelf()
            } else {
                val durationSeconds = prefs.getInt(KEY_DURATION, 300)
                val phaseEnd = now + durationSeconds * 1000L
                prefs.edit()
                    .putString(KEY_MODE, "RUNNING")
                    .putLong(KEY_PHASE_END, phaseEnd)
                    .apply()
                scheduleAlarm(phaseEnd)
                updateNotification(notifTextRunning())
            }
        }
    }

    // ---------- منبه النظام (رنة الهاتف الحقيقية) ----------

    private fun startRinging() {
        stopRinging()
        try {
            val uri = RingtoneManager.getActualDefaultRingtoneUri(this, RingtoneManager.TYPE_ALARM)
                ?: RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM)

            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                setDataSource(this@CycleAlarmService, uri)
                isLooping = true
                prepare()
                start()
            }
        } catch (_: Exception) {
            // تجاهل: بعض الأجهزة قد تمنع تشغيل صوت المنبه في ظروف معينة
        }

        val pattern = longArrayOf(0, 500, 300, 500, 300)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator?.vibrate(VibrationEffect.createWaveform(pattern, 0))
        } else {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(pattern, 0)
        }
    }

    private fun stopRinging() {
        try {
            mediaPlayer?.stop()
            mediaPlayer?.release()
        } catch (_: Exception) { /* توقف بالفعل */ }
        mediaPlayer = null
        vibrator?.cancel()
    }

    // ---------- AlarmManager ----------

    private fun scheduleAlarm(triggerAtMillis: Long) {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val pendingIntent = phaseEndPendingIntent()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent)
        } else {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtMillis, pendingIntent)
        }
    }

    private fun cancelAlarm() {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.cancel(phaseEndPendingIntent())
    }

    private fun phaseEndPendingIntent(): PendingIntent {
        val intent = Intent(this, AlarmReceiver::class.java).setAction(ACTION_PHASE_END)
        val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        else PendingIntent.FLAG_UPDATE_CURRENT
        return PendingIntent.getBroadcast(this, REQUEST_CODE, intent, flags)
    }

    // ---------- إشعارات ----------

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "Cycle Timer", NotificationManager.IMPORTANCE_LOW)
            (getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(channel)
        }
    }

    private fun buildNotification(text: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Kallaa Cycle Timer")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setOngoing(true)
            .build()
    }

    private fun updateNotification(text: String) {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, buildNotification(text))
    }

    private fun showCompleteNotification() {
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Kallaa Cycle Timer")
            .setContentText(notifTextComplete())
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setAutoCancel(true)
            .build()
        manager.notify(NOTIFICATION_ID + 1, notification)
    }

    private fun notifTextRunning() = "العداد يعمل • ${prefs().getInt(KEY_COMPLETED, 0)}/${prefs().getInt(KEY_TARGET, 10)}"
    private fun notifTextPaused() = "متوقف مؤقتًا"
    private fun notifTextRinging() = "تنبيه — انتهت دورة"
    private fun notifTextComplete() = "اكتمل العدد المطلوب"

    private fun prefs(): SharedPreferences = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    companion object {
        const val PREFS_NAME = "cycle_alarm_state"
        const val CHANNEL_ID = "cycle_alarm_channel"
        const val NOTIFICATION_ID = 1001
        const val REQUEST_CODE = 2002

        const val ACTION_START = "com.kallaa.cyclealarm.START"
        const val ACTION_PAUSE_RESUME = "com.kallaa.cyclealarm.PAUSE_RESUME"
        const val ACTION_STOP = "com.kallaa.cyclealarm.STOP"
        const val ACTION_UPDATE = "com.kallaa.cyclealarm.UPDATE"
        const val ACTION_PHASE_END = "com.kallaa.cyclealarm.PHASE_END"
        const val ACTION_KEEP_ALIVE = "com.kallaa.cyclealarm.KEEP_ALIVE"

        const val EXTRA_DURATION = "durationSeconds"
        const val EXTRA_RING = "ringSeconds"
        const val EXTRA_TARGET = "target"
        const val EXTRA_TONE = "tone"
        const val EXTRA_LANG = "language"

        const val KEY_MODE = "mode"
        const val KEY_DURATION = "durationSeconds"
        const val KEY_RING = "ringSeconds"
        const val KEY_TARGET = "target"
        const val KEY_TONE = "tone"
        const val KEY_LANG = "language"
        const val KEY_COMPLETED = "completed"
        const val KEY_COMPLETE_AFTER_RING = "completeAfterRing"
        const val KEY_PHASE_END = "phaseEndAt"
        const val KEY_REMAINING = "remainingMs"

        /** يقرأ الحالة الحالية كنص JSON بنفس الصيغة التي يتوقعها app.js في applyAlarmSnapshot() */
        fun readStateJson(context: Context): String {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val json = JSONObject()
            json.put("mode", prefs.getString(KEY_MODE, "IDLE"))
            json.put("durationSeconds", prefs.getInt(KEY_DURATION, 300))
            json.put("ringSeconds", prefs.getInt(KEY_RING, 5))
            json.put("target", prefs.getInt(KEY_TARGET, 10))
            json.put("tone", prefs.getString(KEY_TONE, "classic"))
            json.put("language", prefs.getString(KEY_LANG, "ar"))
            json.put("completed", prefs.getInt(KEY_COMPLETED, 0))
            json.put("completeAfterRing", prefs.getBoolean(KEY_COMPLETE_AFTER_RING, false))
            json.put("phaseEndAt", prefs.getLong(KEY_PHASE_END, 0))
            json.put("remainingMs", prefs.getLong(KEY_REMAINING, 0))
            return json.toString()
        }
    }
}
