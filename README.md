# Loop — Build Your Streak

A habit-tracking PWA. Add daily habits, mark them done, keep your streak alive, and watch a GitHub-style heatmap fill in over time.

## Features

- Daily habits with custom icon, color, and repeat days
- Streak tracking (current + longest) with a satisfying complete animation
- Per-habit heatmap calendar and overall stats dashboard
- Dark / light / system theme
- Installable as a PWA — add it to your iPhone home screen like a native app
- All data stored locally on-device (no backend, no accounts)

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Deploy it anywhere that serves static files (Netlify, Vercel, GitHub Pages, etc.) over HTTPS — PWAs require HTTPS to install.

## Regenerating icons

App icons live in `public/icons/` and are generated from `scripts/generate-icons.mjs`:

```bash
node scripts/generate-icons.mjs
```

## Publishing to the App Store

This is a PWA, not a native binary, so there's no Xcode/App Store submission step — users install it straight from the browser (Safari → Share → Add to Home Screen). If you later want it in the actual App Store, the easiest path is wrapping it with a tool like Capacitor or PWABuilder, which needs a Mac + Apple Developer account to submit.
