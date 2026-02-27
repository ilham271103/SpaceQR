(function () {
  const body = document.body;
  const sky = document.querySelector(".sky");
  const forcedTier = new URLSearchParams(window.location.search).get("tier");
  const ENABLE_TIER_DEBUG = false;
  const debugTier = ENABLE_TIER_DEBUG && new URLSearchParams(window.location.search).get("debugTier") === "1";

  let animationActive = true;
  let shootingStarActive = false;
  let started = false;
  let currentTier = "pro-normal";

  function detectProTier() {
    body.classList.remove("pro-lite", "pro-normal", "pro-full");

    if (forcedTier === "lite") {
      currentTier = "pro-lite";
      body.classList.add("pro-lite");
      return;
    }
    if (forcedTier === "normal") {
      currentTier = "pro-normal";
      body.classList.add("pro-normal");
      return;
    }
    if (forcedTier === "full") {
      currentTier = "pro-full";
      body.classList.add("pro-full");
      return;
    }

    const mem = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad/i.test(navigator.userAgent);
    const screenSize = Math.max(screen.width, screen.height);

    if (reduceMotion || mem <= 2 || cores <= 2) {
      currentTier = "pro-lite";
      body.classList.add("pro-lite");
      return;
    }

    if (isMobile && cores >= 8 && screenSize >= 720) {
      currentTier = "pro-full";
      body.classList.add("pro-full");
      return;
    }

    if (isMobile) {
      currentTier = "pro-normal";
      body.classList.add("pro-normal");
      return;
    }

    if (mem >= 8 && cores >= 8) {
      currentTier = "pro-full";
      body.classList.add("pro-full");
    } else {
      currentTier = "pro-normal";
      body.classList.add("pro-normal");
    }
  }

  function showTierDebug() {
    if (!debugTier) return;
    const badge = document.createElement("div");
    badge.style.position = "fixed";
    badge.style.top = "10px";
    badge.style.left = "10px";
    badge.style.zIndex = "9999";
    badge.style.padding = "6px 10px";
    badge.style.borderRadius = "8px";
    badge.style.border = "1px solid #00f0ff";
    badge.style.background = "rgba(4, 11, 29, 0.85)";
    badge.style.color = "#d8fbff";
    badge.style.font = "12px/1.4 monospace";
    badge.textContent = "tier=" + currentTier +
      " | mem=" + (navigator.deviceMemory || "na") +
      " | cores=" + (navigator.hardwareConcurrency || "na");
    document.body.appendChild(badge);
  }

  function isDesktopDevice() {
    return !(
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad/i.test(navigator.userAgent)
    );
  }

  function getStarCount() {
    if (body.classList.contains("pro-lite")) return 0;
    if (body.classList.contains("pro-full")) return isDesktopDevice() ? 18 : 10;
    return isDesktopDevice() ? 14 : 8;
  }

  function createStars(count) {
    if (!animationActive || !sky) return;
    if (body.classList.contains("pro-lite")) return;
    if (sky.querySelector(".star")) return;

    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      const size = Math.random() * 2 + 1;
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.top = Math.random() * 100 + "vh";
      star.style.left = Math.random() * 100 + "vw";
      star.style.opacity = (0.45 + Math.random() * 0.45).toFixed(2);
      star.style.animationDuration = (2.7 + Math.random() * 2.1).toFixed(2) + "s";
      star.style.animationDelay = (Math.random() * 1.2).toFixed(2) + "s";
      sky.appendChild(star);
    }
  }

  function createShootingStar() {
    if (!sky || shootingStarActive) return;
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

  function start() {
    if (started) return;
    started = true;

    detectProTier();
    createStars(getStarCount());
    showTierDebug();

    if (body.classList.contains("pro-normal")) {
      setTimeout(createShootingStar, 1200);
    }

    if (body.classList.contains("pro-full")) {
      setTimeout(createShootingStar, 1200);
      setTimeout(createShootingStar, 3500);
      setTimeout(createShootingStar, 6200);
    }
  }

  function stop() {
    animationActive = false;
    body.classList.add("pro-lite");
    document.querySelectorAll(".shooting-star").forEach((el) => el.remove());
  }

  function getTier() {
    return currentTier;
  }

  window.SpaceStars = { start, stop, getTier };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }
})();
