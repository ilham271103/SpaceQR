let qrReader;
let loginAttempted = false;

function setScannerHint(message) {
  const hintEl = document.getElementById("scannerHint");
  if (!hintEl) return;
  hintEl.textContent = message;
}

function resolveHotspotName() {
  const params = new URLSearchParams(window.location.search);
  const host = (params.get("host") || "").trim();
  return host || location.hostname || "hotspot";
}

function renderHotspotName() {
  const el = document.getElementById("hotspotName");
  if (!el) return;
  el.textContent = resolveHotspotName();
}

async function requestCameraPermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setScannerHint("Browser tidak mendukung akses kamera.");
    return false;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    stream.getTracks().forEach((track) => track.stop());
    setScannerHint("Akses kamera diizinkan.");
    return true;
  } catch (_) {
    setScannerHint("Akses kamera ditolak. Izinkan kamera di browser/WebView lalu coba lagi.");
    return false;
  }
}

function initCameraAccessButton() {
  const btn = document.getElementById("cameraAccessBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const granted = await requestCameraPermission();
    if (!granted) return;
    loginAttempted = false;
    startScanner();
  });
}

function tryOpenExternalBrowser() {
  const currentUrl = window.location.href;
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    const noProto = currentUrl.replace(/^https?:\/\//, "");
    const intentUrl = `intent://${noProto}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
    return;
  }

  window.open(currentUrl, "_blank", "noopener,noreferrer");
}

function initOpenBrowserButton() {
  const btn = document.getElementById("openBrowserBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    tryOpenExternalBrowser();
  });
}

function resolveBackLoginUrl() {
  const params = new URLSearchParams(window.location.search);
  const host = (params.get("host") || "").trim();
  const proto = ((params.get("proto") || "http").trim() || "http").replace(":", "");

  if (host) {
    return `${proto}://${host}/login`;
  }

  return "";
}

function initBackLoginButton() {
  const btn = document.getElementById("backLoginBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const backUrl = resolveBackLoginUrl();
    if (backUrl) {
      window.location.href = backUrl;
      return;
    }

    if (document.referrer) {
      window.location.href = document.referrer;
      return;
    }

    window.history.back();
  });
}

function startScanner() {
  if (loginAttempted) return;
  setScannerHint("Memulai kamera...");

  qrReader = new Html5Qrcode("qr-reader");

  qrReader
    .start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: undefined,
        aspectRatio: 1
      },
      (decodedText) => {
        loginAttempted = true;
        if (window.SpaceStars) {
          window.SpaceStars.stop();
        }
        qrReader.stop().then(() => {
          setScannerHint("QR terdeteksi, mengalihkan...");
          setTimeout(() => {
            window.location.href = decodedText;
          }, 1500);
        });
      }
    )
    .catch(() => {
      loginAttempted = false;
      setScannerHint("Kamera gagal dibuka. Tekan 'akses kamera' lalu izinkan permission.");
    });
}
