# MikroTik Hotspot QR Scanner

Space-themed QR Code scanner page for MikroTik Hotspot login.

This project provides a web-based QR scanner designed to integrate with a MikroTik captive portal.  
The QR code contains a full login URL (including username & password parameters), allowing automatic redirect and authentication after scanning.

---

## 🚀 Features

- Camera-based QR scanner (browser compatible)
- Direct redirect to MikroTik login URL
- UI consistent with hotspot login page
- Optimized for GitHub Pages deployment
- Lightweight and dependency-free (local assets)

---

## 🧠 How It Works

1. User connects to WiFi hotspot
2. Captive portal login page appears
3. User selects "QR Mode"
4. Browser opens this scanner page (GitHub Pages)
5. QR is scanned
6. If QR contains a login URL:
   ```
   http://domain/login?username=xxx&password=xxx
   ```
   The page redirects automatically
7. MikroTik authenticates user

No credential handling, no API calls, no cross-domain POST.

---

## 🌐 Deployment (GitHub Pages)

1. Push repository to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch
4. Access via:
   ```
   https://yourusername.github.io/repository-name/
   ```

---

## 🔧 MikroTik Configuration

Add GitHub Pages to walled garden:

```
ip hotspot walled-garden add dst-host=yourusername.github.io
```

This allows scanner page access before login.

---

## ⚠️ Requirements

- Modern browser (Chrome recommended)
- HTTPS (GitHub Pages already secure)
- Camera permission enabled

Captive portal mini WebView may block camera access on some devices.
Opening in Chrome ensures compatibility.

---

## 📂 Project Structure

```
/assets
  /css
  /js
  /img
index.html
README.md
```

---

## 📜 License

MIT License
