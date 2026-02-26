let qrReader;
let loginAttempted = false;

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
