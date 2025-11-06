# SkateHubba Android Release Playbook

This playbook documents the end-to-end process for preparing, validating, and shipping the SkateHubba™ Android application to the Google Play Store. Follow the checklist in order—each phase is required for a compliant, production-ready release.

> **Scope**: Expo-managed application targeting `com.skatehubba.app` with minimum SDK 23. The process assumes EAS (Expo Application Services) is configured for the SkateHubba project repository and that Design Mainline LLC owns the Google Play Console and payments profiles referenced below.

## 1. Account, Identity, and Security Setup

1. **Google Play Developer Account**
   - Confirm that the Google Play Developer account is registered to **Design Mainline LLC**.
   - Ensure the business profile includes:
     - Legal entity name: `Design Mainline LLC`
     - Business address: `22394 Tehama Rd, Apple Valley, CA 92308`
     - Federal EIN: `39-3033642`
     - Public support email: `support@skatehubba.com`
     - Marketing site: <https://skatehubba.com>
   - Verify that account recovery methods and 2-Step Verification are enabled for every owner/admin.
2. **Identity Verification**
   - Complete Google Play Console identity verification for the organization and each administrator.
   - Store verification receipts in the compliance vault.
3. **Security Hygiene**
   - Enforce hardware security keys or passkeys for console access.
   - Record audit trail of all console roles in the security tracker.

## 2. Production Android App Bundle (AAB)

1. **Prerequisites**
   - Expo CLI ≥ 51 and EAS CLI ≥ 11 installed locally or in CI.
   - Ensure `eas.json` contains a `production` profile configured for managed builds.
   - Confirm `app.json` (or `app.config.ts`) sets `android.package` to `com.skatehubba.app`, `android.minSdkVersion` to `23`, and declares permissions: location, camera, microphone, storage, network state.
2. **Keystore Management**
   - Generate an Expo-managed keystore or import an existing Play App Signing key.
   - Back up the keystore JSON and password to the company secrets vault (Bitwarden collection + offline encrypted archive).
   - Document SHA-1 and SHA-256 fingerprints for Firebase, Play Console, and Crashlytics configuration.
3. **Build Command**
   ```bash
   eas build --platform android --profile production
   ```
   - Confirm the job completes successfully and produces a signed `.aab`.
   - Download artifacts and upload them to the release artifacts bucket (`gs://design-mainline-builds/skatehubba/android/`).
4. **Integrity Checks**
   - Run `bundletool validate --bundle app-release.aab`.
   - Scan output with VirusTotal and record checksum (SHA-256) in the release log.

## 3. Google Play Store Listing

1. **App Details**
   - Title: **SkateHubba™**
   - Short description: `Own your tricks. Play SKATE, find spots, stream sessions.`
   - Long description (copy to Play Console → Main Store Listing → Full Description):
     1. Introduce trick logging, skill progression, and verified trick history.
     2. Explain Remote SKATE challenges and asynchronous trick battles.
     3. Highlight spot discovery, geofenced check-ins, and local leaderboards.
     4. Describe AI SkateBuddy “Heshur” coaching clips and trick tips.
     5. Promote live session streaming, multi-angle uploads, and community moderation.
   - Category: `Sports` → Subcategory `Social`.
   - Age rating questionnaire: 12+ due to user-generated content and social features.
2. **Store Assets**
   - Icon: 512×512 PNG, no transparency, stored in `/attached_assets/play/icon.png`.
   - Feature graphic: 1024×500 JPG, stored in `/attached_assets/play/feature-graphic.jpg`.
   - Phone screenshots: 1080×1920 PNG (≥ 4 images) in `/attached_assets/play/screenshots/phone/`.
   - Tablet screenshots: 1920×1080 PNG (≥ 2 images) in `/attached_assets/play/screenshots/tablet/`.
   - Verify filenames avoid spaces and match Play Console requirements.
3. **Policy Links**
   - Privacy Policy URL: <https://skatehubba.com/privacy> (ensure HTTPS and up-to-date content).
   - App support email: `support@skatehubba.com`, website: <https://skatehubba.com>.
4. **Content Guidelines**
   - Confirm all copy passes legal review and trademark usage for “SkateHubba™”.
   - Provide localization strings if releasing to additional languages.

## 4. Compliance, Privacy, and Data Safety

1. **Data Safety Questionnaire**
   - Declare collection of approximate location (for spot check-ins), camera/microphone (user-generated content), storage access (media uploads), and device identifiers (anti-cheat).
   - Confirm analytics and crash reporting via Firebase (Crashlytics, Performance Monitoring).
   - State that all data is encrypted in transit and users can request deletion via support.
2. **Privacy Policy Alignment**
   - Validate that privacy policy explicitly covers: geolocation usage, media uploads, authentication, subscriptions, and data retention.
   - Cross-check declared purposes and sharing with backend implementation.
3. **Compliance Testing**
   - Launch the app on a clean device (Android 13+) and verify permissions are requested contextually.
   - Confirm there are no startup crashes, unhandled promise rejections, or red screen errors.
   - Review Play Console policy status for restricted content, ads disclosures (if applicable), and target audience compliance.

## 5. Testing & Pre-Launch Validation

1. **Internal Testing Track**
   - Upload the `.aab` to the Internal Testing track.
   - Invite ≤ 100 testers via Google Groups or direct emails; ensure NDAs are on file.
   - Share release notes and known issues via the internal test changelog.
2. **Pre-Launch Report**
   - Trigger automated device testing in Play Console.
   - Address all warnings: battery optimizations, ANR, 64-bit compliance, screenshot issues, security vulnerabilities.
   - Rebuild and re-upload if Play Console flags regressions.
3. **Firebase Monitoring**
   - Confirm Crashlytics dashboard reports 0 crashes for the test build.
   - Verify Performance Monitoring traces capture startup time and network requests.

## 6. Production Release & Monetization

1. **Monetization Configuration**
   - Integrate Play Billing Library v5+ within the app (check `android/build.gradle` or Expo In-App Purchases module configuration).
   - Ensure server-side receipt validation endpoint is deployed and secrets stored in the vault.
   - Create the following managed products in Play Console → Monetization setup:
     - `skatehubba_pro_monthly` — Subscription — USD $4.99
     - `skatehubba_pro_yearly` — Subscription — USD $29.99
     - `founder_pass` — One-time in-app product — USD $19.99
   - Add localized pricing where applicable and review tax settings.
2. **Policy Forms**
   - Complete “Content Rating” questionnaire (confirm mild violence via user content → rating 12+).
   - Fill “Target Audience and Content” (13+; enable parental gate for UGC interactions if necessary).
   - Verify Ads declaration (select “No” unless AdMob/ads SDK is integrated).
3. **Payments Profile**
   - Link Design Mainline LLC payments profile (W-9 on file, banking verified).
   - Confirm payouts are routed to the corporate account and tax information is current.
4. **Rollout**
   - Promote the approved build from internal → closed → production track.
   - Use staged rollout (e.g., 20%) if desired, otherwise push 100% once stability metrics are confirmed.
   - Monitor installs, crash-free sessions (>99%), and payment success (>96%) for the first 72 hours.

## 7. Post-Launch Operations

1. **Monitoring**
   - Keep Firebase Crashlytics, Performance Monitoring, and Google Play Vitals dashboards bookmarked in the on-call rotation.
   - Set up PagerDuty or Opsgenie alerts for crash spikes and ANR thresholds.
2. **Cadence & Changelog**
   - Adopt versioning scheme `1.0.x` for hotfixes; bump minor version for feature releases.
   - Update `CHANGELOG.md` and `RELEASE_NOTES.md` with user-facing summaries for every submission.
   - Schedule weekly build health checks and monthly feature updates.
3. **Key Management**
   - Back up Expo keystore, Google Play signing key certificate fingerprints, and Play Console service account keys in redundant secure storage.
   - Review access quarterly and rotate service account keys annually.
4. **Incident Response**
   - Maintain runbooks for subscription billing issues, privacy requests, and security incidents.
   - Document any post-launch issues in the release retrospective.

## 8. Audit Checklist

Use this quick checklist before submitting to production:

- [ ] Google Play account ownership and 2FA verified.
- [ ] Identity verification approved for Design Mainline LLC.
- [ ] Keystore fingerprints stored securely.
- [ ] Production `.aab` built, validated, virus scanned, and archived.
- [ ] Store listing (title, descriptions, assets) updated and legal-approved.
- [ ] Data Safety, Privacy Policy, and Content Rating forms completed.
- [ ] Internal testing track published and pre-launch report clear.
- [ ] Crashlytics + Performance Monitoring reporting healthy metrics.
- [ ] Play Billing products configured and server validation live.
- [ ] Payments profile verified and payouts tested.
- [ ] Production rollout plan approved, staged rollout (if any) documented.
- [ ] Monitoring, changelog, and backup tasks scheduled post-release.

Archive the signed checklist alongside release artifacts for compliance and auditing.
