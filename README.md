# Maker Arcade — Living Atlas (local prototype)

**Make something. Keep it. Then explore how the world works.**

This repository contains the Cordova Android container and the first local-first
Maker Arcade prototype. It is a small, honest foundation for the broader Living
Atlas concept—not a claim that all previously discussed labs, 44 fields, or the
Integrated Research workbench have already been integrated.

## Included in this prototype

- **Wave & Tone:** adjustable sine-wave frequency and amplitude visualization.
- **Orbit Bench:** circular orbital speed from the Newtonian approximation
  `v = sqrt(GM/r)`.
- **Matter & Density:** mass divided by volume, with input validation.
- **Pattern Forge:** descriptive statistics for a finite comma-separated
  numeric sequence.
- **Saved work:** stores short experiment summaries in local device storage.
- **Local-first behavior:** no account, camera, network service, or external
  runtime dependency is required by the current labs.

All results are educational models. They are not professional scientific,
medical, engineering, or safety advice.

## Development

Requirements: Node.js 20, npm, Java 17, and Android SDK platform/build-tools 35
for the Android build.

Install and run the lab calculation tests:

```bash
npm ci
npm test
node --check www/js/app.js
```

Prepare and build a debug APK:

```bash
npx cordova prepare android
cd platforms/android
./tools/gradlew assembleDebug
```

The APK output is
`platforms/android/app/build/outputs/apk/debug/app-debug.apk`.

GitHub Actions runs the Node tests, checks source files, prepares Cordova, builds
a debug APK, and uploads that APK as the `maker-arcade-debug-apk` workflow
artifact. A debug APK is for installation/testing, not a signed Play Store
release.

## Project status and next integration steps

The canonical source for the Cordova web app is `www/`. Do not edit generated
`platforms/android/app/src/main/assets/www/` files directly; run
`cordova prepare android` after source changes.

This prototype currently includes four working lab calculations and a local
save list. The broader product plan still includes additional fields and labs,
the Integrated Research workbench, accessibility and device testing, broader
browser tests, packaging/signing, licensing review, and release validation.
Those features should be added as verified increments rather than implied by
the product name.

## Security and privacy notes

- The current content-security policy blocks network connections from the app.
- Saved summaries remain in this device's browser storage until cleared or
  app data is removed.
- No encryption is applied to local saved summaries.
- Do not store secrets, credentials, or sensitive personal information in the
  local notebook.
