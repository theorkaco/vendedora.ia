// Configure somente a URL do checkout quando estiver pronta.
const CONFIG = { checkoutUrl: "" };

// Botões de compra.
const note = document.getElementById("notice");
let noteTimer;
document.querySelectorAll("[data-checkout]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    if (/^https:\/\//i.test(CONFIG.checkoutUrl)) {
      window.location.href = CONFIG.checkoutUrl;
      return;
    }
    if (!note) return;
    note.classList.add("show");
    clearTimeout(noteTimer);
    noteTimer = setTimeout(() => note.classList.remove("show"), 4500);
  });
});

// Exibição de imagens reais dos depoimentos.
document.querySelectorAll("img[data-asset]").forEach(img => {
  const slot = img.closest(".slot");
  if (!slot) return;
  const reveal = () => { if (img.naturalWidth > 0) slot.classList.add("loaded"); };
  img.addEventListener("load", reveal);
  if (img.complete) reveal();
});

// CTA fixo no celular: desaparece sobre a demonstração para não cobrir o vídeo.
const mobileCta = document.querySelector(".mobile-cta");
const demoVideo = document.getElementById("demoVideo");
function updateCta() {
  if (!mobileCta) return;
  mobileCta.classList.toggle("visible", window.scrollY > 420);
}
window.addEventListener("scroll", updateCta, { passive: true });
updateCta();
if (demoVideo && mobileCta && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    mobileCta.classList.toggle("suppress-on-video", entries[0].isIntersecting);
  }, { threshold: 0.10 });
  observer.observe(demoVideo);
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Troca de exemplos ilustrativos, sem conexão com IA real.
const demoExamples = {
  produto: {
    question: "Tenho R$ 400 para começar na Shopee. O que posso vender?",
    answer: "Vamos selecionar dois produtos para pesquisar, comparar preços e simular a margem antes de comprar estoque."
  },
  anuncio: {
    question: "Quero melhorar o anúncio de um organizador de gavetas.",
    answer: "Me diga o material, as medidas e as variações. Vou criar títulos e uma descrição clara sem inventar características."
  },
  margem: {
    question: "Compro por R$ 12 e quero vender por R$ 29,90. Vale a pena?",
    answer: "Vamos incluir taxas, impostos, embalagem e frete para descobrir a margem real antes de decidir o preço."
  }
};
document.querySelectorAll(".prompt-option").forEach(button => {
  button.addEventListener("click", () => {
    const example = demoExamples[button.dataset.demo];
    if (!example) return;
    const question = document.getElementById("demo-question");
    const answer = document.getElementById("demo-answer");
    if (question) question.textContent = example.question;
    if (answer) answer.textContent = example.answer;
    document.querySelectorAll(".prompt-option").forEach(item => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
});

// Player com play/pause personalizado, SEM controls nativos.
const demoToggle = document.getElementById("demoToggle");
const videoError = document.getElementById("videoError");
if (demoVideo && demoToggle) {
  const showVideoError = message => {
    if (!videoError) return;
    videoError.textContent = message;
    videoError.hidden = false;
  };
  const syncVideo = () => {
    const playing = !demoVideo.paused && !demoVideo.ended;
    demoVideo.closest(".video-slot")?.classList.toggle("is-playing", playing);
    demoToggle.textContent = playing ? "❚❚" : "▶";
    demoToggle.setAttribute("aria-label", playing ? "Pausar vídeo" : "Reproduzir vídeo");
  };
  async function toggleVideo() {
    if (!demoVideo.paused && !demoVideo.ended) {
      demoVideo.pause();
      return;
    }
    try {
      if (videoError) videoError.hidden = true;
      await demoVideo.play();
    } catch (error) {
      console.warn("Não foi possível reproduzir o vídeo:", error);
      showVideoError("Não foi possível reproduzir o vídeo. Confira o arquivo assets/demonstracao-ia.mp4 e se ele usa H.264.");
      syncVideo();
    }
  }
  demoToggle.addEventListener("click", toggleVideo);
  demoVideo.addEventListener("click", toggleVideo);
  demoVideo.addEventListener("play", syncVideo);
  demoVideo.addEventListener("pause", syncVideo);
  demoVideo.addEventListener("ended", syncVideo);
  demoVideo.addEventListener("error", () => showVideoError("Vídeo não encontrado ou formato incompatível. Confira assets/demonstracao-ia.mp4."));
  syncVideo();
}

// Ampliação dos depoimentos por clique.
const proofImages = document.querySelectorAll(".proof-card .slot img");
if (proofImages.length) {
  const modal = document.createElement("dialog");
  modal.className = "proof-lightbox";
  modal.innerHTML = '<button class="proof-close" type="button" aria-label="Fechar imagem">×</button><img alt="Depoimento ampliado">';
  document.body.appendChild(modal);
  const modalImage = modal.querySelector("img");
  proofImages.forEach(img => {
    img.addEventListener("click", () => {
      if (!img.naturalWidth) return;
      modalImage.src = img.currentSrc || img.src;
      modalImage.alt = img.alt || "Depoimento ampliado";
      modal.showModal();
    });
  });
  modal.querySelector(".proof-close").addEventListener("click", () => modal.close());
  modal.addEventListener("click", event => { if (event.target === modal) modal.close(); });
}
