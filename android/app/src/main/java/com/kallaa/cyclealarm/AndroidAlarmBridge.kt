// المسار المطلوب: android/app/src/main/java/com/kallaa/cyclealarm/AndroidAlarmBridge.kt
package com.kallaa.cyclealarm

import android.content.Context
import android.content.Intent
import android.os.Build
import android.webkit.JavascriptInterface

/**
 * يُحقن في WebView باسم "AndroidAlarm" من MainActivity.
 * التوقيعات هنا تطابق بالضبط ما يستدعيه app.js:
 * window.AndroidAlarm.start(durationSeconds, ringSeconds, target, tone, language)
 * window.AndroidAlarm.pauseOrResume()
 * window.AndroidAlarm.stop()
 * window.AndroidAlarm.update(durationSeconds, ringSeconds, target, tone, language)
 * window.AndroidAlarm.getState() -> JSON string
 */
class AndroidAlarmBridge(private val context: Context) {

    @JavascriptInterface
    fun start(durationSeconds: Int, ringSeconds: Int, target: Int, tone: String, language: String) {
        val intent = Intent(context, CycleAlarmService::class.java)
            .setAction(CycleAlarmService.ACTION_START)
            .putExtra(CycleAlarmService.EXTRA_DURATION, durationSeconds)
            .putExtra(CycleAlarmService.EXTRA_RING, ringSeconds)
            .putExtra(CycleAlarmService.EXTRA_TARGET, target)
            .putExtra(CycleAlarmService.EXTRA_TONE, tone)
            .putExtra(CycleAlarmService.EXTRA_LANG, language)
        startServiceCompat(intent)
    }

    @JavascriptInterface
    fun pauseOrResume() {
        startServiceCompat(Intent(context, CycleAlarmService::class.java).setAction(CycleAlarmService.ACTION_PAUSE_RESUME))
    }

    @JavascriptInterface
    fun stop() {
        startServiceCompat(Intent(context, CycleAlarmService::class.java).setAction(CycleAlarmService.ACTION_STOP))
    }

    @JavascriptInterface
    fun update(durationSeconds: Int, ringSeconds: Int, target: Int, tone: String, language: String) {
        val intent = Intent(context, CycleAlarmService::class.java)
            .setAction(CycleAlarmService.ACTION_UPDATE)
            .putExtra(CycleAlarmService.EXTRA_DURATION, durationSeconds)
            .putExtra(CycleAlarmService.EXTRA_RING, ringSeconds)
            .putExtra(CycleAlarmService.EXTRA_TARGET, target)
            .putExtra(CycleAlarmService.EXTRA_TONE, tone)
            .putExtra(CycleAlarmService.EXTRA_LANG, language)
        startServiceCompat(intent)
    }

    @JavascriptInterface
    fun getState(): String = CycleAlarmService.readStateJson(context)

    private fun startServiceCompat(intent: Intent) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }
    }
}
