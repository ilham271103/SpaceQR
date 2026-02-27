let qrReader;
let loginAttempted = false;

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

function maybeForceExternalBrowser() {
  const params = new URLSearchParams(window.location.search);
  const forceBrowser = params.get("forceBrowser") === "1";
  if (!forceBrowser) return;

  const isAndroid = /Android/i.test(navigator.userAgent);
  const isWebView =
    /\bwv\b/i.test(navigator.userAgent) ||
    /; wv\)/i.test(navigator.userAgent) ||
    /WebView/i.test(navigator.userAgent);
  if (!(isAndroid && isWebView)) return;

  const alreadyTried = sessionStorage.getItem("scanner_force_browser_tried") === "1";
  if (alreadyTried) return;
  sessionStorage.setItem("scanner_force_browser_tried", "1");

  setTimeout(() => {
    tryOpenExternalBrowser();
  }, 300);
}

function bubbleChat(lines, containerId, delay = 600) {
  const container = document.getElementById(containerId);
  if (!container) return;

  lines.forEach((line, i) => {
    setTimeout(() => {
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.innerHTML = line;
      container.appendChild(bubble);
      container.scrollTop = container.scrollHeight;
    }, i * delay);
  });
}

function startScanner() {
  if (loginAttempted) return;

  qrReader = new Html5Qrcode("qr-reader");

  qrReader.start(
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
      bubbleChat(["✅ QR Terdeteksi", "⏳ Redirect..."], "welcomeMessage", 700);
      setTimeout(() => {
        window.location.href = decodedText;
      }, 1500);
    });
  }
);
}

function retryScanner() {
  loginAttempted = false;

  if (qrReader) {
    qrReader.stop().then(() => {
      startScanner();
    });
  } else {
    startScanner();
  }
}

maybeForceExternalBrowser();
