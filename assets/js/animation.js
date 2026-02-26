function bubbleChat(lines, containerId, delay = 600, errorText = "") {
  const container = document.getElementById(containerId);

  lines.forEach((line, i) => {
    setTimeout(() => {
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble";
      bubble.innerHTML = line;
      container.appendChild(bubble);
      container.scrollTop = container.scrollHeight; // auto scroll
    }, i * delay);
  });

  if (errorText) {
    setTimeout(() => {
      const bubble = document.createElement("div");
      bubble.className = "chat-bubble error-bubble";
      bubble.style.borderColor = "#ff4d4d";
      bubble.style.background = "rgba(255, 77, 77, 0.1)";
      bubble.style.color = "#ffcccc";
      bubble.textContent = errorText;
      container.appendChild(bubble);
      container.scrollTop = container.scrollHeight;
    }, lines.length * delay);
  }
}


// Ambil error dari HTML
const errorMessage = document.getElementById("mikrotikError").textContent.trim();
const isRealError = errorMessage !== "" && !errorMessage.includes("$(");

let errorBubbleActive = false;

const form = document.getElementById("loginForm");
const voucherBtn = document.getElementById("voucherBtn");
const memberBtn = document.getElementById("memberBtn");
const qrBtn = document.getElementById("qrBtn");
/* =====================================================
   PRO ANIMATION ENGINE
   ===================================================== */

const body = document.body;
const sky = document.querySelector(".sky");

let animationActive = true;
let shootingStarCount = 0;
const MAX_SHOOTING_STAR = 3;

/* =====================
   DEVICE / MODE DETECT
   ===================== */
function detectProTier() {
  // 🔥 WAJIB: bersihkan tier lama
  body.classList.remove("pro-lite", "pro-normal", "pro-full");

  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 2;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isMobile =
    window.matchMedia("(pointer: coarse)").matches ||
    /Android|iPhone|iPad/i.test(navigator.userAgent);

  const screenSize = Math.max(screen.width, screen.height);

  // 1️⃣ device lemah / aksesibilitas
  if (reduceMotion || mem <= 2 || cores <= 2) {
    body.classList.add("pro-lite");
    return;
  }

  // 2️⃣ MOBILE FLAGSHIP SAJA YANG BOLEH FULL
  if (isMobile && cores >= 8 && screenSize >= 720) {
    body.classList.add("pro-full");
    return;
  }

  // 3️⃣ MOBILE BIASA (Redmi 9A MASUK SINI)
  if (isMobile) {
    body.classList.add("pro-normal");
    return;
  }

  // 4️⃣ DESKTOP
  if (mem >= 8 && cores >= 8) {
    body.classList.add("pro-full");
  } else {
    body.classList.add("pro-normal");
  }
}


/* =====================
   STAR FIELD
   ===================== */
function createStars(count = 10) {
  if (!animationActive) return;
  if (body.classList.contains("pro-lite")) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";

    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.style.top = Math.random() * 100 + "vh";
    star.style.left = Math.random() * 100 + "vw";

    sky.appendChild(star);
  }
}

/* =====================
   SHOOTING STAR (LIMITED)
   ===================== */
let shootingStarActive = false;

function createShootingStar() {
  if (shootingStarActive) return;

  shootingStarActive = true;

  const star = document.createElement("div");
  star.className = "shooting-star";
  star.style.top = Math.random() * 50 + "vh";
  star.style.left = Math.random() * 100 + "vw";
  sky.appendChild(star);

  setTimeout(() => {
    star.remove();
    shootingStarActive = false;
  }, 2000);
}


/* =====================
   ANIMATION START
   ===================== */
function startAnimations() {
  detectProTier();

  createStars(10);

  if (body.classList.contains("pro-normal")) {
    setTimeout(createShootingStar, 1200);
  }

  if (body.classList.contains("pro-full")) {
  setTimeout(createShootingStar, 1200); // star 1
  setTimeout(createShootingStar, 3500); // star 2
  setTimeout(createShootingStar, 6200); // star 3
}
}

/* =====================
   STOP ALL ANIMATIONS
   ===================== */
function stopAnimations() {
  animationActive = false;
  body.classList.add("pro-lite");

  document.querySelectorAll(".shooting-star").forEach(el => el.remove());
}

/* =====================
   HOOK SUBMIT EVENTS
   ===================== */
function hookSubmitStop() {
  document.addEventListener("click", (e) => {
    if (
      e.target.id === "voucherSubmit" ||
      e.target.id === "memberSubmit" ||
      e.target.closest("button[type='submit']")
    ) {
      stopAnimations();
    }
  });
}

/* =====================
   INIT
   ===================== */
window.addEventListener("load", () => {
  startAnimations();
  hookSubmitStop();
});


function renderVoucherMode(showGreeting = true) {
  document.getElementById("welcomeMessage").innerHTML = ""; // ⬅️ reset chat
  form.className = "input-area";
  form.innerHTML = `
    <input type="text" name="username" id="voucherInput" placeholder="Ketik kode voucher di sini..." required>
    <input type="hidden" name="password" id="voucherPass" value="">
   <button type="submit" id="voucherSubmit">
  <i class="fas fa-rocket" aria-hidden="true"></i>
</button>
  `;
  // disable any built-in onsubmit handler (doLogin) while in voucher mode
  loginFormElement.removeAttribute("onsubmit");
  const voucherInput = document.getElementById("voucherInput");
  const voucherPass = document.getElementById("voucherPass");

  voucherInput.addEventListener("input", () => {
    voucherPass.value = voucherInput.value;
  });

  // ensure Enter on this field also triggers submission and bubble
  voucherInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleVoucherSubmit();
    }
  });

  if (showGreeting) {
    bubbleChat([
      'Selamat datang <i class="fas fa-hand-paper" aria-hidden="true" style=color:yellow;></i>, masukkan voucher Anda di bawah',
      "Pastikan kode voucher sudah benar",
      "Terima kasih!"
    ], "welcomeMessage", 700);
  }
  // Tampilkan ulang error jika aktif
  if (errorBubbleActive) {
    bubbleChat([], "welcomeMessage", 700, errorMessage);
  }
}

// form submit handler will take care of Enter key as well as button taps
// the old global keydown listener is no longer needed

let submitting = false;

// keep the click handler so the rocket button still works when tapped
// but the real work is extracted into a function that submit event can also call
function handleVoucherSubmit() {
  if (submitting) return;
  submitting = true;

  const voucherInput = document.getElementById("voucherInput");
  const voucherCode = voucherInput.value.trim();
  if (!voucherCode) {
    submitting = false;
    return;
  }

  // 1️⃣ ISI FORM LANGSUNG
  document.forms["login"].username.value = voucherCode;
  document.forms["login"].password.value = voucherCode;
  document.forms["sendin"].username.value = voucherCode;
  document.forms["sendin"].password.value = voucherCode;

  const container = document.getElementById("welcomeMessage");

  // 2️⃣ Bubble user
  addUserBubble(voucherCode, "welcomeMessage");

  // 3️⃣ Bubble sistem (langsung tampil)
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble";
  typingBubble.textContent = "Memverifikasi voucher...";
  container.appendChild(typingBubble);
  // gunakan scrollIntoView supaya pasti terlihat
  typingBubble.scrollIntoView({ behavior: "smooth", block: "end" });

  // 4️⃣ SUBMIT setelah memberi waktu melihat bubble (sebelumnya 400ms)
  //    angkanya bisa disesuaikan; 1200ms memberi waktu lebih bagi animasi
  setTimeout(() => {
    document.forms["sendin"].submit();
  }, 1200);
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "voucherSubmit") {
    handleVoucherSubmit();
  }
});


function addUserBubble(text, containerId) {
  const container = document.getElementById(containerId);
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble user-bubble";
  bubble.textContent = text;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}


function renderMemberMode(showGreeting = true) {
  document.getElementById("welcomeMessage").innerHTML = "";
  form.className = "vertical-form";
  form.innerHTML = `
    <input type="text" name="username" id="memberUser" placeholder="Username Member" required>
    <input type="password" name="password" id="memberPass" placeholder="Password Member" required>
    <button type="submit" id="memberSubmit">🚀</button>
  `;
  // likewise, don't run doLogin when we submit manually via JS
  loginFormElement.removeAttribute("onsubmit");

  if (showGreeting) {
    bubbleChat([
      "Mode member aktif 👤",
      "Masukkan username dan password Anda",
    ], "welcomeMessage", 700);
  }
  // Tampilkan ulang error jika aktif
  if (errorBubbleActive) {
    bubbleChat([], "welcomeMessage", 700, errorMessage);
  }
}

document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "memberSubmit") {
    handleMemberSubmit();
  }
});

// member mode will rely on form submit too; Enter handling not needed here

function handleMemberSubmit() {
  const username = document.getElementById("memberUser").value.trim();
  const password = document.getElementById("memberPass").value.trim();
  if (!username || !password) return;

  const container = document.getElementById("welcomeMessage");

  // 1. Bubble user
  addUserBubble(`${username} •••••`, "welcomeMessage");

  // 2. Bubble sistem "..."
  const typingBubble = document.createElement("div");
  typingBubble.className = "chat-bubble";
  typingBubble.textContent = "...";
  container.appendChild(typingBubble);
  container.scrollTop = container.scrollHeight;

  // 3. Balasan sistem
  setTimeout(() => {
    typingBubble.remove();
    bubbleChat([
      "👤 Memverifikasi akun...",
      "Mohon tunggu sebentar..."
    ], "welcomeMessage", 700);
  }, 800);

  // 4. Submit ke Mikrotik (biarkan waktu supaya pengguna lihat balasan)
  setTimeout(() => {
    document.forms["login"].username.value = username;
    document.forms["login"].password.value = password;
    document.forms["sendin"].username.value = username;
    document.forms["sendin"].password.value = password;
    document.forms["sendin"].submit();
  }, 2000); // durasi 2s sudah agak lama, bisa disesuaikan jika perlu
}


function renderQRMode() {
  document.getElementById("welcomeMessage").innerHTML = ""; // ⬅️ reset chat
  form.className = "vertical-form";
    // tampilkan bubble singkat lalu redirect ke halaman scanner (GitHub Pages)
    bubbleChat([
      "Mode QR aktif 📷",
      "Mengarahkan ke halaman pemindai QR..."
    ], "welcomeMessage", 700);

    // Bangun URL scanner; gunakan GitHub Pages repo Anda (HTTPS)
    const scannerBase = 'https://ilham271103.github.io/space-qr-scanner/';
    // prioritaskan parameter host jika tersedia di query string
    const hostParam = new URLSearchParams(window.location.search).get('host') || location.hostname;
    const scannerUrl = scannerBase + '?host=' + encodeURIComponent(hostParam);

    // beri jeda supaya bubble terlihat, lalu buka scanner di tab baru
    setTimeout(() => {
      window.open(scannerUrl, '_blank');
    }, 1200);

  // restore the original onsubmit (doLogin) in QR mode so hashing works
  if (originalOnSubmit) {
    loginFormElement.setAttribute("onsubmit", originalOnSubmit);
  }
}

// Tombol mode login
voucherBtn.addEventListener("click", () => {
  renderVoucherMode(!isRealError);
  localStorage.setItem("loginMode", "voucher");
});
memberBtn.addEventListener("click", () => {
  renderMemberMode(!isRealError);
  localStorage.setItem("loginMode", "member");
});
qrBtn.addEventListener("click", () => {
  renderQRMode();
  localStorage.setItem("loginMode", "qr");
});

// form submit dispatcher – handle enter key or submit button
// grab the form element and remember its original onsubmit (if any)
const loginFormElement = document.forms["login"];
const originalOnSubmit = loginFormElement.getAttribute("onsubmit");

loginFormElement.addEventListener("submit", function(e) {
  // decide which mode is active
  if (document.getElementById("voucherInput")) {
    // voucher mode uses JS handler and must not run doLogin
    e.preventDefault();
    handleVoucherSubmit();
  } else if (document.getElementById("memberUser")) {
    // member mode also uses JS handler
    e.preventDefault();
    handleMemberSubmit();
  }
  // qr mode simply falls through so the form can submit normally, which
  // may trigger the original onsubmit/doLogin logic (and should happen only
  // when we restored the attribute in renderQRMode()).
});

// Saat halaman dimuat
window.addEventListener("load", () => {
  startAnimations();
  hookSubmitStop();

  const savedMode = localStorage.getItem("loginMode");

  if (savedMode === "member") renderMemberMode(!isRealError);
  else if (savedMode === "qr") renderQRMode();
  else renderVoucherMode(!isRealError);

  if (isRealError) {
    errorBubbleActive = true;
    bubbleChat([], "welcomeMessage", 700, errorMessage);
  }
});

