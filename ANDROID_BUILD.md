# Android APK Automation & Build Guide

This project includes an automated **GitHub Actions CI/CD workflow** that builds an installable Android APK (`.apk`) whenever changes are pushed to your repository.

---

## ⚡ How It Works

1. **Trigger**:
   - Triggers automatically whenever you `git push` to `main` or `master`.
   - Also triggers on Pull Requests targeting `main` or `master`.
   - Can be manually triggered at any time under the **Actions** tab on GitHub (**Run workflow** button), with a choice of `debug` or `release` builds.

2. **Build Pipeline**:
   - Checks out the repository.
   - Sets up Node.js 20 and Java JDK 17 (Android LTS).
   - Configures the Android SDK and Gradle caching for fast builds.
   - Builds the production web app (`npm run build`).
   - Syncs assets into the native Android Capacitor project (`npx cap sync android`).
   - Compiles the native APK using Gradle (`./gradlew assembleDebug`).
   - Uploads the resulting `.apk` as a downloadable GitHub Actions artifact named `myTutor-Android-APK`.

---

## 📥 Downloading and Installing the APK

1. In your GitHub repository, click on the **Actions** tab.
2. Select the latest workflow run under **Build Android APK**.
3. Scroll down to the **Artifacts** section at the bottom of the Summary page.
4. Click on **myTutor-Android-APK** to download the zip file containing `myTutor-debug.apk`.
5. Transfer the APK to your Android device (via USB, Google Drive, email, or direct download).
6. Tap the APK file to install. If prompted, toggle on **"Install Unknown Apps"** for your file manager or browser.

---

## 🛠️ Local Development & Manual Build

To build the APK locally on your machine with Android Studio installed:

```bash
# 1. Build the web app and sync assets to Android
npm run cap:sync

# 2. Open the project in Android Studio
npm run cap:open

# 3. Or compile the debug APK directly via command line (requires Android SDK)
npm run build:android
```

The compiled APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔑 Production Release Signing (Google Play Store)

To sign release builds for the Google Play Store:
1. Generate a keystore with `keytool`:
   ```bash
   keytool -genkey -v -keystore mytutor-release.keystore -alias mytutor -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Store your keystore base64 string and credentials in GitHub Repository Secrets (`Settings` > `Secrets and variables` > `Actions`).
