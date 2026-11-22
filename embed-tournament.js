(() => {
  const script = document.currentScript;
  const frame = script.previousElementSibling;
  const page = new URL(frame.dataset.src);
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
  frame.src = page.href;
})();
