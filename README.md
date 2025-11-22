# AuriMea

Run and deploy your AI Studio app

This repository contains everything you need to run the AuriMea finance dashboard locally and deploy it as a PWA.

## Features

- **Progressive Web App** with offline support.
- **Dynamic Settings Modal** with a **Credits** button that reveals a list of used resources:
  - Favicon/PWA Icon (Flaticon)
  - Global font: Ubuntu
  - Icons: Google Fonts Material Symbols
  - Entire site built with Vibe Coding and Gemini AI
- **Footer removed** to provide a cleaner UI.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. Run the app:
   ```bash
   npm run dev
   ```

## Deploy

Deploy to GitHub Pages with:
```bash
npm run deploy
```

## License

MIT
