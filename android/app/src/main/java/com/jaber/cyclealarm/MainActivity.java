package com.jaber.cyclealarm;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlarmManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONObject;

public class MainActivity extends Activity {
    private static final int NOTIFICATION_PERMISSION_CODE = 1001;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestNotificationPermission();
        requestExactAlarmPermission();
        requestDisableBatteryOptimization();

        WebView webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        webView.addJavascriptInterface(new AlarmBridge(this), "AndroidAlarm");

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    request.grant(request.getResources());
                }
            }
        });
        webView.loadUrl("file:///android_asset/www/index.html?v=15");
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, NOTIFICATION_PERMISSION_CODE);
        }
    }

    private void requestDisableBatteryOptimization() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
            return;
        }

        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        if (powerManager.isIgnoringBatteryOptimizations(getPackageName())) {
            return;
        }

        Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
        intent.setData(Uri.parse("package:" + getPackageName()));
        try {
            startActivity(intent);
        } catch (Exception ignored) {
            Intent fallbackIntent = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
            startActivity(fallbackIntent);
        }
    }

    private void requestExactAlarmPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
            return;
        }

        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
        if (alarmManager.canScheduleExactAlarms()) {
            return;
        }

        Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
        intent.setData(Uri.parse("package:" + getPackageName()));
        try {
            startActivity(intent);
        } catch (Exception ignored) {
            startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getPackageName())));
        }
    }

    public static class AlarmBridge {
        private final Context context;

        AlarmBridge(Context context) {
            this.context = context.getApplicationContext();
        }

        @JavascriptInterface
        public void start(int durationSeconds, int ringSeconds, int target, String tone, String language) {
            Intent intent = new Intent(context, CycleAlarmService.class);
            intent.setAction(CycleAlarmService.ACTION_START);
            intent.putExtra(CycleAlarmService.EXTRA_DURATION_SECONDS, durationSeconds);
            intent.putExtra(CycleAlarmService.EXTRA_RING_SECONDS, ringSeconds);
            intent.putExtra(CycleAlarmService.EXTRA_TARGET, target);
            intent.putExtra(CycleAlarmService.EXTRA_TONE, tone);
            intent.putExtra(CycleAlarmService.EXTRA_LANGUAGE, language);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent);
            } else {
                context.startService(intent);
            }
        }

        @JavascriptInterface
        public void pauseOrResume() {
            Intent intent = new Intent(context, CycleAlarmService.class);
            intent.setAction(CycleAlarmService.ACTION_PAUSE_RESUME);
            context.startService(intent);
        }

        @JavascriptInterface
        public void update(int durationSeconds, int ringSeconds, int target, String tone, String language) {
            Intent intent = new Intent(context, CycleAlarmService.class);
            intent.setAction(CycleAlarmService.ACTION_UPDATE);
            intent.putExtra(CycleAlarmService.EXTRA_DURATION_SECONDS, durationSeconds);
            intent.putExtra(CycleAlarmService.EXTRA_RING_SECONDS, ringSeconds);
            intent.putExtra(CycleAlarmService.EXTRA_TARGET, target);
            intent.putExtra(CycleAlarmService.EXTRA_TONE, tone);
            intent.putExtra(CycleAlarmService.EXTRA_LANGUAGE, language);
            context.startService(intent);
        }

        @JavascriptInterface
        public void stop() {
            Intent intent = new Intent(context, CycleAlarmService.class);
            intent.setAction(CycleAlarmService.ACTION_STOP);
            context.startService(intent);
        }

        @JavascriptInterface
        public String getState() {
            SharedPreferences prefs = context.getSharedPreferences("cycle_alarm_service", Context.MODE_PRIVATE);
            try {
                JSONObject state = new JSONObject();
                state.put("mode", prefs.getString("mode", "IDLE"));
                state.put("phaseEndAt", prefs.getLong("phaseEndAt", 0L));
                state.put("remainingMs", prefs.getLong("remainingMs", 0L));
                state.put("durationSeconds", prefs.getInt("durationSeconds", 300));
                state.put("ringSeconds", prefs.getInt("ringSeconds", 5));
                state.put("target", prefs.getInt("target", 10));
                state.put("completed", prefs.getInt("completed", 0));
                state.put("tone", prefs.getString("tone", "classic"));
                state.put("language", prefs.getString("language", "ar"));
                state.put("completeAfterRing", prefs.getBoolean("completeAfterRing", false));
                return state.toString();
            } catch (Exception ignored) {
                return "{}";
            }
        }
    }
}
