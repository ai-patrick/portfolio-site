// ── THEME TOGGLE ──
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  document.documentElement.setAttribute(
    "data-theme",
    current === "dark" ? "light" : "dark",
  );
  localStorage.setItem(
    "theme",
    document.documentElement.getAttribute("data-theme"),
  );
}
(function () {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.setAttribute("data-theme", "dark");
})();

// ── LOGO LOOP ──
const loopItems = [
  {
    label: "Prisma",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.646 18.432l8.045-16.3c.203-.412.761-.412.964 0l8.045 16.3c.162.329-.053.714-.42.73L10 19.29c-.296.015-.558-.177-.652-.455L2.067 19.162c-.367-.016-.582-.401-.42-.73z"/></svg>`,
  },
  {
    label: "GraphQL",
    svg: `<svg viewBox="0 0 24 24" fill="#E10098"><path d="M12 2.25l9.526 5.5v11L12 24.25l-9.526-5.5v-11L12 2.25zm0 1.155L3.474 8.5v11l8.526 4.905L20.526 19.5v-11L12 3.405zM5.78 15.9l1.04-.6 5.18 2.99 5.18-2.99 1.04.6L12 19.19 5.78 15.9zM12 6.81l6.22 3.59v7.2L12 21.19l-6.22-3.59V10.4L12 6.81zm0 1.155L6.78 11v6l5.22 3.01L17.22 17v-6L12 7.965zm0 1.73l3.116 1.8v3.6L12 16.895l-3.116-1.8V11.5L12 9.695z"/></svg>`,
  },
  {
    label: "Redis",
    svg: `<svg viewBox="0 0 24 24" fill="#DC382D"><path d="M10.84 8.334l2.007-.944L15 8.334l-2.153.943zm-7.184 3.89L12 8.334l8.344 3.89L12 16.11zM12 0L.012 5.47l4.578 2.068L0 9.777l5.174 2.339-.65.293 7.477 3.376 7.476-3.376-.649-.293L24 9.777l-4.59-2.239L23.988 5.47zm0 18.669l-7.476-3.375-.65.293L12 19.246l8.125-3.659-.649-.293zm0 3.203l-7.476-3.375-.65.294L12 22.449l8.125-3.658-.649-.294z"/></svg>`,
  },
  {
    label: "AWS",
    svg: `<svg viewBox="0 0 24 24" fill="#FF9900"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.064.056.128.056.184 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.591-.894-.591-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/><path fill="#252F3E" d="M20.16 17.878c-2.43 1.796-5.958 2.75-8.993 2.75-4.254 0-8.08-1.572-10.976-4.187-.228-.207-.024-.487.25-.327 3.127 1.817 6.99 2.911 10.99 2.911 2.695 0 5.657-.56 8.385-1.717.41-.175.757.27.344.57"/><path fill="#252F3E" d="M21.15 16.742c-.31-.398-2.057-.19-2.843-.095-.239.03-.276-.18-.06-.334 1.392-.977 3.676-.695 3.94-.367.265.33-.07 2.623-1.375 3.716-.2.168-.392.079-.304-.143.294-.733.953-2.376.642-2.777"/></svg>`,
  },
  {
    label: "Supabase",
    svg: `<svg viewBox="0 0 24 24" fill="#3ECF8E"><path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.003.507c.015.986 1.26 1.41 1.874.637l9.262-11.652c1.093-1.375.113-3.403-1.647-3.403h-9.58l-.001-.508z"/></svg>`,
  },
  {
    label: "Vercel",
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>`,
  },
  {
    label: "Figma",
    svg: `<svg viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="8" height="8" rx="4" fill="#F24E1E"/><rect x="2" y="10" width="8" height="8" rx="4" fill="#FF7262"/><rect x="10" y="2" width="8" height="8" rx="4" fill="#A259FF"/><rect x="10" y="10" width="8" height="8" rx="0" fill="#1ABCFE"/><circle cx="18" cy="14" r="4" fill="#0ACF83"/></svg>`,
  },
  {
    label: "Vite",
    svg: `<svg viewBox="0 0 24 24" fill="none"><defs><linearGradient id="vg1" x1="6" y1="0" x2="6" y2="24" gradientUnits="userSpaceOnUse"><stop stop-color="#41D1FF"/><stop offset="1" stop-color="#BD34FE"/></linearGradient></defs><path d="M22 4L12.55 19.78a.5.5 0 0 1-.86 0L2 4h4.5l5.5 9 5.5-9H22z" fill="url(#vg1)"/><path d="M22 4l-9.45 5.9L12 10 11.1 10 2 4l9 5.6L22 4z" fill="#FFE44F" opacity="0.8"/></svg>`,
  },
];

(function initLogoLoop() {
  const track = document.getElementById("ll-track");
  if (!track) return;
  const render = () => {
    const items = [...loopItems, ...loopItems, ...loopItems];
    track.innerHTML = items
      .map(
        (i) => `
      <div class="ll-item">
        ${i.svg}
        <span class="ll-label">${i.label}</span>
      </div>`,
      )
      .join("");
  };
  render();

  let offset = 0;
  let paused = false;
  const speed = 50;
  let last = null;

  track.addEventListener("mouseenter", () => (paused = true));
  track.addEventListener("mouseleave", () => (paused = false));

  const singleW = () => {
    const items = track.querySelectorAll(".ll-item");
    const n = loopItems.length;
    if (!items.length) return 0;
    const itemW = items[0].getBoundingClientRect().width + 40;
    return itemW * n;
  };

  function step(ts) {
    if (!last) last = ts;
    const dt = (ts - last) / 1000;
    last = ts;
    if (!paused) {
      offset += speed * dt;
      const sw = singleW();
      if (sw > 0) offset = offset % sw;
      track.style.transform = `translateX(-${offset}px)`;
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

(function () {
  const nav = document.getElementById("navbar");
  const THRESHOLD = 60;
  function update() {
    if (window.scrollY > THRESHOLD) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();
