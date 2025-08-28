// Seleção de elementos
const menuBtn = document.querySelector("#menu");
const closeMenuBtn = document.querySelector("#close-menu");
const menu = document.querySelector("#mobile-navbar");

const desktopLinks = document.querySelectorAll("#navbar a");
const mobileLinks = document.querySelectorAll("#mobile-navbar a");
const allLinks = [...desktopLinks, ...mobileLinks];

const slides = document.querySelectorAll(".banner");
const dots = document.querySelectorAll(".dot");
let slideIndex = 0;

const header = document.querySelector('header');
const headerH = header ? header.offsetHeight : 0;
// ...
const offsetTop = document.querySelector(href).offsetTop - headerH;
window.scrollTo({ top: offsetTop, behavior: 'smooth' });


// Funções
function smoothScroll(e) {
  e.preventDefault();

  const href = this.getAttribute("href");
  const offsetTop = document.querySelector(href).offsetTop;

  scroll({
    top: offsetTop,
    behavior: "smooth",
  });

  setTimeout(() => {
    if (menu.classList.contains("menu-active")) {
      menu.classList.remove("menu-active");
    }
  }, 500);
}

function showSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active");
    dots[i].classList.remove("active");
  }

  slideIndex++;

  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  slides[slideIndex - 1].classList.add("active");
  dots[slideIndex - 1].classList.add("active");

  setTimeout(showSlides, 3000);
}

// Eventos
[menuBtn, closeMenuBtn].forEach((btn) => {
  btn.addEventListener("click", (e) => {
    menu.classList.toggle("menu-active");
  });
});

allLinks.forEach((link) => {
  link.addEventListener("click", smoothScroll);
});

// Inicialização
showSlides();

  (function () {
    const btn = document.querySelector('.whatsapp-float-mini.smart');
    const THRESHOLD = 120; // px de rolagem para mudar o estilo

    function updateBtn() {
      if (!btn) return;
      if (window.scrollY > THRESHOLD) {
        btn.classList.add('scrolled');
      } else {
        btn.classList.remove('scrolled');
      }
    }

    // Atualiza ao carregar e ao rolar
    window.addEventListener('load', updateBtn, { passive: true });
    window.addEventListener('scroll', updateBtn, { passive: true });
  });


(function () {
  const form = document.getElementById('contact-form');
  const btn  = document.getElementById('submitBtn');
  const ok   = document.getElementById('form-success');
  const err  = document.getElementById('form-error');

  // ✅ SUA URL do Google Apps Script (apenas UMA, entre aspas)
  const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxQ_mu7COo245kJdBvNVOzZzoydFr_aVFqqVFauhJx87RWtORhFGZnxwgLJDW7tcozbVA/exec';

  // ✅ Funções utilitárias (com checagem para evitar erro se el for null)
  function show(el){ if (el) el.hidden = false; }
  function hide(el){ if (el) el.hidden = true; }

  if (!form) {
    console.error('Formulário #contact-form não encontrado.');
    return;
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    hide(ok); hide(err);
    if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }

    // Coleta dados do form + metadados úteis
    const fd = new FormData(form);
    fd.append('page_url', location.href);
    fd.append('user_agent', navigator.userAgent);

    // 1) Envio para Web3Forms (email + antispam deles)
    const w3fPromise = fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    });

    // 2) Envio para Google Sheets (Apps Script) em paralelo
    const json = {};
    fd.forEach((v, k) => { json[k] = v; });

    const gasPromise = fetch(GAS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json)
    }).catch(() => { /* não trava caso falhe */ });

    try {
      const resp = await w3fPromise;
      if (resp.ok) {
        await gasPromise;         // tenta salvar na planilha também
        form.reset();
        show(ok);
      } else {
        show(err);
      }
    } catch (e) {
      console.error(e);
      show(err);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Enviar'; }
    }
  });
})();

