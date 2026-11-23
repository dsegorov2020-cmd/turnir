(() => {
  const script = document.currentScript;
  const frame = script.previousElementSibling;
  const page = new URL(frame.dataset.src);
  page.searchParams.set("v", "ready");
  try {
    const key = "turnir-site-visitor-v1";
    let visitor = localStorage.getItem(key);
    if (!visitor && globalThis.crypto?.randomUUID) {
      visitor = globalThis.crypto.randomUUID();
      localStorage.setItem(key, visitor);
    }
    if (visitor) page.searchParams.set("visitor", visitor);
  } catch {
    // The tournament remains available when browser storage is disabled.
  }
  const status = document.getElementById("embed-status");
  const message = document.getElementById("embed-message");
  const timeout = setTimeout(() => {
    message.textContent = "Турнир ещё не открылся. Попробуйте прямую ссылку.";
  }, 10000);

  function isFrameOrChild(candidate, source, remaining = 5) {
    if (candidate === source) return true;
    if (!candidate || !remaining) return false;
    for (let i = 0; i < candidate.length; i++) {
      if (isFrameOrChild(candidate.frames[i], source, remaining - 1)) return true;
    }
    return false;
  }
  function showTournament(event) {
    if (event.data !== "turnir:ready" || !event.source) return;
    if (!isFrameOrChild(frame.contentWindow, event.source)) return;
    clearTimeout(timeout);
    frame.classList.add("embed-ready");
    status.hidden = true;
    window.removeEventListener("message", showTournament);
  }
  window.addEventListener("message", showTournament);
  frame.src = page.href;
})();
