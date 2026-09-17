// المسار: android/app/src/main/java/com/kallaa/cyclealarm/MainActivity.java
package com.kallaa.cyclealarm;

import android.app.AlarmManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private final ActivityResultLauncher<String> notificationPermissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), granted -> {
                        // لا حاجة لأي إجراء إضافي هنا، مجرد طلب الصلاحية كافٍ
                                });

                                    @Override
                                        public void onCreate(Bundle savedInstanceState) {
                                                super.onCreate(savedInstanceState);

                                                        // حقن الجسر باسم "AndroidAlarm" ليصبح window.AndroidAlarm متاحًا في app.js
                                                                this.bridge.getWebView().addJavascriptInterface(
                                                                            new AndroidAlarmBridge(this),
                                                                                        "AndroidAlarm"
                                                                                                );

                                                                                                        requestNotificationPermissionIfNeeded();
                                                                                                                requestExactAlarmPermissionIfNeeded();
                                                                                                                    }

                                                                                                                        private void requestNotificationPermissionIfNeeded() {
                                                                                                                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                                                                                                                                            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                                                                                                                                                                != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                                                                                                                                                                                notificationPermissionLauncher.launch(android.Manifest.permission.POST_NOTIFICATIONS);
                                                                                                                                                                                            }
                                                                                                                                                                                                    }
                                                                                                                                                                                                        }

                                                                                                                                                                                                            private void requestExactAlarmPermissionIfNeeded() {
                                                                                                                                                                                                                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                                                                                                                                                                                                                                AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
                                                                                                                                                                                                                                            if (alarmManager != null && !alarmManager.canScheduleExactAlarms()) {
                                                                                                                                                                                                                                                            Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                                                                                                                                                                                                                                                            