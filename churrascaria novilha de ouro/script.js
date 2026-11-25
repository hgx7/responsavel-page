// Configure o WhatsApp e os dados reais antes de publicar.
const SITE_CONFIG = {
  // Formato: código do país + DDD + número, somente dígitos.
  whatsapp: "551938545750"
};

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function updateHeader() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!open));
  menuToggle.setAttribute("aria-label", open ? "Abrir menu" : "Fechar menu");
  mainNav?.classList.toggle("is-open", !open);
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Abrir menu");
}));

// Filtros instantâneos do cardápio.
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const cards = [...document.querySelectorAll(".menu-card")];
filterButtons.forEach(button => button.addEventListener("click", () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  cards.forEach(card => {
    const visible = filter === "todos" || card.dataset.category === filter;
    card.classList.toggle("is-hidden", !visible);
    if (visible) card.animate(
      [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 220, easing: "ease-out" }
    );
  });
}));

// Animação leve com Intersection Observer nativo.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, current) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        current.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

// Links de WhatsApp recebem mensagens diferentes conforme o botão clicado.
function openWhatsApp(message) {
  const number = SITE_CONFIG.whatsapp.replace(/\D/g, "");
  if (!number || number === "") {
    alert("Configure o número real do WhatsApp no arquivo script.js antes de publicar.");
    return;
  }
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}
document.querySelectorAll("[data-whatsapp-message]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openWhatsApp(link.dataset.whatsappMessage || "Olá! Gostaria de informações.");
  });
});
document.querySelectorAll(".order-item").forEach(button => button.addEventListener("click", () => {
  openWhatsApp(`Olá! Gostaria de consultar disponibilidade e valores de: ${button.dataset.product}.`);
}));

// Carrossel simples. Só inclua aqui depoimentos reais, autorizados e confirmados.
const reviews = [
  {
    text: "Adoramos receber você por aqui. Em breve, este espaço vai reunir avaliações reais dos nossos clientes.",
    name: "Espaço reservado para cliente"
  }
];
let reviewIndex = 0;
function renderReview() {
  const review = reviews[reviewIndex];
  document.getElementById("review-text").textContent = `“${review.text}”`;
  document.getElementById("review-name").textContent = review.name;
  document.getElementById("review-count").textContent =
    `${String(reviewIndex + 1).padStart(2, "0")} / ${String(reviews.length).padStart(2, "0")}`;
}
document.getElementById("review-prev").addEventListener("click", () => {
  reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
  renderReview();
});
document.getElementById("review-next").addEventListener("click", () => {
  reviewIndex = (reviewIndex + 1) % reviews.length;
  renderReview();
});
renderReview();

document.getElementById("year").textContent = new Date().getFullYear();

// Bloqueio apenas casual do menu de contexto nas fotos da galeria.
// Não impede capturas de tela, cache, ferramentas do navegador ou cópia por outros meios.
document.querySelectorAll(".gallery-item img").forEach(image => {
  image.addEventListener("contextmenu", event => event.preventDefault());
  image.draggable = false;
});
