# Cycle Alarm APK

This repository contains a mobile alarm/countdown web app and an Android wrapper that can be built into an APK with GitHub Actions.

## Run locally

From the project folder:

```powershell
npm.cmd start
```

Then open:

```text
http://localhost:8000
```

If you are using Command Prompt instead of PowerShell, `npm start` also works.

## Build APK with GitHub Actions

1. Create a GitHub repository.
2. Upload all files from this folder, including `.github/` and `android/`.
3. Open the repository on GitHub.
4. Go to **Actions**.
5. Run **Build Android APK** manually, or push to `main` / `master`.
6. Download the artifact named `cycle-alarm-debug-apk`.

The APK file is:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

## Notes

This APK wraps the current web app inside Android WebView. It works offline because the app files are bundled inside the APK.

The APK also starts a native Android foreground service when the timer starts. This keeps the timer and alarm running while the phone is locked and shows notification actions for pause/resume and stop.

On some phones, Android battery optimization can still restrict background work. If the alarm is delayed, open Android settings for the app and disable battery optimization for Cycle Alarm.
