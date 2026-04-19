/* ═══════════════════════════════════════════
   BH FIGHT GRAJAÚ — main.js
   ═══════════════════════════════════════════ */

"use strict";

/* ─── NAVBAR: scroll + hamburger ─── */
const navbar     = document.getElementById("navbar");
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hamburger.classList.toggle("open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

// Fecha o menu ao clicar em qualquer link interno
document.querySelectorAll("[data-close-menu]").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
  });
});

// Fecha ao clicar fora do menu
document.addEventListener("click", (e) => {
  if (
    mobileMenu.classList.contains("open") &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }
});

/* ─── SCROLL SUAVE (âncoras internas) ─── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || 68
    );
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ─── SCROLL REVEAL ─── */
const revealTargets = document.querySelectorAll(
  ".reveal, .reveal-left, .reveal-right"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealTargets.forEach((el) => revealObserver.observe(el));

/* ─── NAVBAR LINK ATIVO (destaque automático) ─── */
const sections    = document.querySelectorAll("section[id]");
const navAnchors  = document.querySelectorAll(".nav-links a[href^='#']");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => a.classList.remove("active"));
        const active = document.querySelector(
          `.nav-links a[href="#${entry.target.id}"]`
        );
        if (active) active.classList.add("active");
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((s) => sectionObserver.observe(s));

/* ─── GALERIA: lightbox simples ─── */
const galeriaItems = document.querySelectorAll(".galeria-item");

// Cria o overlay do lightbox
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
lightbox.innerHTML = `
  <div id="lightbox-backdrop"></div>
  <div id="lightbox-inner">
    <button id="lightbox-close" aria-label="Fechar">&times;</button>
    <img id="lightbox-img" src="" alt="Foto BH Fight" />
    <button id="lightbox-prev" aria-label="Anterior">&#8249;</button>
    <button id="lightbox-next" aria-label="Próximo">&#8250;</button>
  </div>
`;
document.body.appendChild(lightbox);

// Estilos inline do lightbox (autônomo, sem depender do CSS externo)
const lbStyle = document.createElement("style");
lbStyle.textContent = `
  #lightbox {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 99999;
    align-items: center;
    justify-content: center;
  }
  #lightbox.active { display: flex; }
  #lightbox-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.92);
    cursor: pointer;
  }
  #lightbox-inner {
    position: relative;
    z-index: 1;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #lightbox-img {
    max-width: 88vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 20px 80px rgba(0,0,0,0.8);
    animation: lbFadeIn 0.25s ease;
  }
  @keyframes lbFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  #lightbox-close {
    position: absolute;
    top: -44px; right: 0;
    background: #e30613;
    color: #fff;
    border: none;
    width: 36px; height: 36px;
    border-radius: 50%;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #lightbox-prev, #lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    width: 44px; height: 44px;
    border-radius: 50%;
    font-size: 26px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
  }
  #lightbox-prev:hover, #lightbox-next:hover { background: #e30613; }
  #lightbox-prev { left: -60px; }
  #lightbox-next { right: -60px; }
  @media (max-width: 600px) {
    #lightbox-prev { left: -48px; }
    #lightbox-next { right: -48px; }
  }
`;
document.head.appendChild(lbStyle);

// Adiciona estilo de link ativo na navbar
const navActiveStyle = document.createElement("style");
navActiveStyle.textContent = `
  .nav-links a.active {
    color: #fff !important;
    border-bottom: 2px solid #e30613;
    padding-bottom: 2px;
  }
`;
document.head.appendChild(navActiveStyle);

let currentIndex = 0;
const images = [];

galeriaItems.forEach((item, i) => {
  const img = item.querySelector("img");
  if (img) images.push({ src: img.src, alt: img.alt });

  item.addEventListener("click", () => openLightbox(i));
});

function openLightbox(index) {
  currentIndex = index;
  updateLightboxImage();
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function updateLightboxImage() {
  const lbImg = document.getElementById("lightbox-img");
  lbImg.style.animation = "none";
  lbImg.offsetHeight; // reflow para reiniciar animação
  lbImg.style.animation = "";
  lbImg.src = images[currentIndex].src;
  lbImg.alt = images[currentIndex].alt;
}

document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
document.getElementById("lightbox-backdrop").addEventListener("click", closeLightbox);

document.getElementById("lightbox-prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateLightboxImage();
});

document.getElementById("lightbox-next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateLightboxImage();
});

// Navegação por teclado no lightbox
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  if (e.key === "Escape")      closeLightbox();
  if (e.key === "ArrowLeft")   { currentIndex = (currentIndex - 1 + images.length) % images.length; updateLightboxImage(); }
  if (e.key === "ArrowRight")  { currentIndex = (currentIndex + 1) % images.length; updateLightboxImage(); }
});

/* ─── CONTADOR ANIMADO (hero stats) ─── */
function animateCount(el, target, suffix = "", duration = 1200) {
  const start     = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current  = eased * target;
    el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll(".hero-stat-number");
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach((el) => {
        const raw    = el.textContent.trim();
        const num    = parseFloat(raw.replace(/[^\d.]/g, ""));
        const suffix = raw.replace(/[\d.]/g, "");
        if (!isNaN(num)) animateCount(el, num, suffix);
      });
    }
  },
  { threshold: 0.5 }
);

if (statNumbers.length) statsObserver.observe(statNumbers[0].closest(".hero-stats") || statNumbers[0]);

/* ─── HORÁRIO ATUAL: destaca o dia de hoje ─── */
(function highlightToday() {
  const days = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const today = days[new Date().getDay()];
  const rows  = document.querySelectorAll(".horario-row");

  rows.forEach((row) => {
    const label = row.querySelector(".horario-dia");
    if (!label) return;
    const text = label.textContent.toLowerCase();
    const match =
      text.includes(today) ||
      (today === "segunda"  && text.includes("segunda")) ||
      (today === "sábado"   && text.includes("sábado"))  ||
      (today === "domingo"  && text.includes("domingo"));

    if (match) {
      row.style.background       = "rgba(227,6,19,0.08)";
      row.style.borderLeft       = "3px solid #e30613";
      label.style.color          = "#fff";
      label.style.fontWeight     = "700";
    }
  });
})();

/* ─── LOG ─── */
console.log("%c🥊 BH Fight Grajaú", "font-size:18px; font-weight:bold; color:#e30613;");
console.log("%cSite carregado com sucesso!", "color:#25D366; font-size:13px;");