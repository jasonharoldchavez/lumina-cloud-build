# License and release review

Status: review required; this file does not grant or change a license.

## Findings checked on 2026-11-18
- `package.json` declares `Apache-2.0`, but no root `LICENSE` file exists on the default branch. The package metadata alone is not a substitute for the complete license text or proof that all included material may be redistributed under that license.
- GitHub Actions run 44387445260 completed `npm ci` and `npm audit --audit-level=high` with zero known npm vulnerabilities reported at audit time. This is a point-in-time dependency check; continue monitoring for new advisories.
- The repository contains legacy vendored dependency content under `lumina_rei_app/node_modules`; confirm whether each component is necessary and preserve its required notices before removing or redistributing it.
- The app's CSP blocks runtime network connections, which is a useful privacy boundary. It does not itself audit dependencies or guarantee that all data is private.
- The current Android workflow builds a debug APK; it is not a signed production release and has not established physical-device compatibility.
- The workflow logs show a non-fatal Git cleanup warning because the repository contains gitlink entries without a matching `.gitmodules` file. The build and audit jobs still passed; investigate the intended submodule destinations before changing or removing those entries.

## Required before commercial distribution
1. Confirm the intended license with the copyright holder and review all contributions and third-party components.
2. Add the appropriate complete license and third-party notices only after the intended licensing decision is confirmed.
3. Run a fresh `npm audit`, inspect each advisory's affected dependency and reachable code, and record the fix/mitigation; do not blindly force major-version upgrades.
4. Build with a currently Play-compliant target SDK and validate Cordova/plugin compatibility, install/upgrade behavior, accessibility, and offline operation on a physical device.
5. Run a historical secret scan; this review did not establish that every past commit is free of secrets.
6. Create and verify a separately signed release build only after the above gates pass.

This checklist is an engineering review, not legal advice or a declaration that the product is release-ready.
