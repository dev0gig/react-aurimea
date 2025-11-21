
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
