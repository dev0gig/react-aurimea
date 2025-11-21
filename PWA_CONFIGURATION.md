# PWA-Konfiguration für GitHub Pages

## 📋 Variablen (Ausgangslage)

- **[[TLD_URL]]**: `https://dev0gig.github.io`
- **[[SUBFOLDER_NAME]]**: `react-aurimea`
- **[[SUBFOLDER_URL]]**: `https://dev0gig.github.io/react-aurimea`

---

## 🔧 1. Konfiguration für das Hauptprojekt (PWA 1) auf der Root-Domain

### `package.json` (Auszug)

```json
{
  "name": "main-pwa",
  "private": true,
  "version": "1.0.0",
  "homepage": "https://dev0gig.github.io",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "devDependencies": {
    "gh-pages": "^6.1.0"
  }
}
```

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
});
```

### `manifest.json`

```json
{
  "name": "Main PWA",
  "short_name": "MainPWA",
  "description": "Haupt-Progressive Web App",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#A6F787",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### `index.tsx` (Cookie-Code)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Cookie explizit auf Root-Pfad setzen
document.cookie = "pwa=main; path=/; SameSite=Lax; Secure";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `index.html` (Service Worker Registration)

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
</script>
```

---

## 🔧 2. Konfiguration für das Unterordner-Projekt (PWA 2) - react-aurimea

### `package.json`

```json
{
  "name": "aurimea",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "homepage": "https://dev0gig.github.io/react-aurimea",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^3.4.1"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.0",
    "gh-pages": "^6.1.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### `vite.config.ts`

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/react-aurimea/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
```

### `public/manifest.json`

**⚠️ WICHTIG**: Die `scope` und `start_url` müssen auf **relative Pfade** (`./`) gesetzt werden!

```json
{
  "name": "AuriMea - Personal Finance Tracker",
  "short_name": "AuriMea",
  "description": "Progressive Web App für persönliches Finanzmanagement",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#10101A",
  "theme_color": "#A6F787",
  "icons": [
    {
      "src": "https://cdn-icons-png.flaticon.com/512/10106/10106199.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### `index.tsx` (Cookie-Code)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Cookie explizit auf Unterordner-Pfad setzen für PWA-Isolation
document.cookie = "pwa=aurimea; path=/react-aurimea/; SameSite=Lax; Secure";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `index.html` (Service Worker Registration)

**⚠️ WICHTIG**: Der Service Worker-Pfad muss **relativ** (`./sw.js`) sein!

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/png" href="https://cdn-icons-png.flaticon.com/512/10106/10106199.png" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AuriMea</title>
</head>

<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
</script>
```

---

## 🚀 Deployment-Schritte

### Für das Unterordner-Projekt (react-aurimea):

1. **Dependencies installieren**:
   ```bash
   npm install
   ```

2. **Build erstellen**:
   ```bash
   npm run build
   ```

3. **Auf GitHub Pages deployen**:
   ```bash
   npm run deploy
   ```

4. **GitHub Pages aktivieren**:
   - Gehe zu: `https://github.com/dev0gig/react-aurimea/settings/pages`
   - Wähle Branch: `gh-pages`
   - Klicke auf "Save"

### Für das Hauptprojekt (dev0gig.github.io):

1. Gleiche Schritte wie oben
2. GitHub Pages sollte bereits auf `gh-pages` Branch konfiguriert sein

---

## 🔍 Troubleshooting & Testing

### PWA-Isolation testen:

1. **Öffne beide PWAs in separaten Tabs**:
   - `https://dev0gig.github.io`
   - `https://dev0gig.github.io/react-aurimea`

2. **Überprüfe die Cookies** (DevTools → Application → Cookies):
   - Root-PWA sollte Cookie mit `path=/` haben
   - Subfolder-PWA sollte Cookie mit `path=/react-aurimea/` haben

3. **Überprüfe den Service Worker Scope** (DevTools → Application → Service Workers):
   - Root-PWA: Scope sollte `https://dev0gig.github.io/` sein
   - Subfolder-PWA: Scope sollte `https://dev0gig.github.io/react-aurimea/` sein

4. **Teste PWA-Installation**:
   - Beide PWAs sollten separat installierbar sein
   - Jede PWA sollte ihre eigenen Daten und Cache haben

### Häufige Probleme:

- **404-Fehler bei Assets**: Stelle sicher, dass `base` in `vite.config.ts` korrekt gesetzt ist
- **Service Worker registriert nicht**: Prüfe, ob der Pfad relativ (`./sw.js`) ist
- **PWAs überschneiden sich**: Überprüfe `scope` in `manifest.json` - muss `./` sein für Subfolder
- **Cookies werden geteilt**: Stelle sicher, dass der `path` Parameter korrekt gesetzt ist

---

## ✅ Checkliste für korrekte Trennung:

### Hauptprojekt (Root):
- [ ] `vite.config.ts`: `base: '/'`
- [ ] `manifest.json`: `scope: "/"`, `start_url: "/"`
- [ ] Cookie: `path=/`
- [ ] Service Worker: `register('/sw.js')`

### Unterordner-Projekt:
- [ ] `vite.config.ts`: `base: '/react-aurimea/'`
- [ ] `manifest.json`: `scope: "./"`, `start_url: "./"` (relativ!)
- [ ] Cookie: `path=/react-aurimea/`
- [ ] Service Worker: `register('./sw.js')` (relativ!)
