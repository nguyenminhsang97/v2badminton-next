# Mobile testing

## Local emulation

Run the automated mobile smoke suite:

```bash
npm run test:mobile
```

Run the same checks with visible browser windows:

```bash
npm run test:mobile:headed
```

The suite uses Playwright projects in `playwright.config.ts`:

- `mobile-chrome`: Pixel 7 emulation.
- `mobile-safari`: iPhone 15 emulation through Playwright's WebKit/Safari-like device profile.

Current smoke coverage opens the main route and primary landing pages, checks that pages return a non-error status, render a title/body, and do not create horizontal overflow on mobile.

## Real Android device

Android SDK Platform-Tools is installed. Open a new terminal so Windows reloads PATH, then check:

```bash
adb version
adb devices
```

For real-device web testing:

1. Enable Developer Options and USB debugging on the Android phone.
2. Connect by USB and accept the debugging prompt on the phone.
3. Start the app locally with `npm run dev`.
4. Open Chrome on the phone and visit the machine LAN URL, or use Chrome remote debugging from desktop at `chrome://inspect/#devices`.

## Real iPhone / Safari

Windows cannot locally provide true iOS Safari automation. Use a real iPhone manually or a cloud real-device service such as BrowserStack when Safari-specific confidence is needed before release.
