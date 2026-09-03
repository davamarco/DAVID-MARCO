/* ================================================================
   DAVID MARCO — main.js
   ================================================================ */

/* ================================================================
   PRELOADER
   ================================================================ */
;(function initPreloader() {
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    const pl = document.getElementById('preloader');
    setTimeout(() => {
      pl.classList.add('hidden');
      document.body.style.overflow = '';
      startScrollAnimations();
      triggerHeroAnimations();
    }, 2600);
  });
})();

/* ================================================================
   SMOOTH SCROLL
   ================================================================ */
function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

document.querySelectorAll('.smooth-scroll').forEach(el => {
  el.addEventListener('click', e => {
    const href = el.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      smoothScrollTo(href);
      closeMobileMenu();
    }
  });
});

/* ================================================================
   HEADER — sticky + collapse
   ================================================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 90);
}, { passive: true });

/* ================================================================
   HAMBURGER / MOBILE MENU
   ================================================================ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', open);
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
}

document.addEventListener('click', e => {
  if (!header.contains(e.target)) closeMobileMenu();
});

/* ================================================================
   HERO PARALLAX
   ================================================================ */
const heroWrap = document.getElementById('heroPhotoWrap');

if (heroWrap) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      heroWrap.style.transform = `translateY(${y * 0.10}px)`;
    }
  }, { passive: true });
}

/* ================================================================
   SCROLL ANIMATIONS (Intersection Observer)
   ================================================================ */
function startScrollAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.anim').forEach(el => {
    if (el.closest('.services-timeline')) return; // handled by a repeating observer below
    io.observe(el);
  });

  // Services timeline cards: replay on every scroll pass (both directions),
  // unlike the rest of the site's fire-once reveal.
  const timelineIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.services-timeline .service-card.anim').forEach(el => timelineIO.observe(el));
}

function triggerHeroAnimations() {
  const els = document.querySelectorAll('.fade-up');
  els.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 100 + i * 80);
  });
}

/* ================================================================
   FAQ ACCORDION
   ================================================================ */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ================================================================
   LANGUAGE TOGGLE
   ================================================================ */
let lang = localStorage.getItem('dm_lang') || 'en';

function applyLang(l) {
  lang = l;
  localStorage.setItem('dm_lang', l);
  document.documentElement.lang = l;

  document.querySelectorAll('[data-ru]').forEach(el => {
    const val = el.getAttribute(`data-${l}`);
    if (!val) return;

    // Elements that may contain inner tags (h1, h2 with &nbsp; or <em>)
    const isRich = el.tagName === 'H1' || el.tagName === 'H2'
                || val.includes('<') || val.includes('&');
    if (isRich) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // Update lang buttons (both desktop and mobile)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === l);
  });
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

applyLang(lang); // init on load

/* ================================================================
   BUTTON RIPPLE
   ================================================================ */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const r = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.clientX - r.left}px`;
    ripple.style.top  = `${e.clientY - r.top}px`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ================================================================
   THANK YOU MODAL
   ================================================================ */
const modalOverlay = document.getElementById('thankYouModal');
const modalBox     = document.getElementById('modalBox');
const modalClose   = document.getElementById('modalClose');
const modalOkBtn   = document.getElementById('modalOkBtn');

function openModal(type) {
  modalBox.classList.toggle('is-error', type === 'error');
  modalOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOkBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('show')) closeModal();
});

/* ================================================================
   CONTACT FORM → WHATSAPP
   ================================================================ */
const WA_NUMBER = '19544455820';
const form      = document.getElementById('contactForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('fphone').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();

  if (!name || !phone) {
    shakField(name   ? null : document.getElementById('fname'));
    shakField(phone  ? null : document.getElementById('fphone'));
    return;
  }

  const lines = ['New request from website:', `Name: ${name}`, `Contact: ${phone}`];
  if (email)   lines.push(`Email: ${email}`);
  if (message) lines.push(`Message: ${message}`);

  // Open the modal *before* window.open() — opening a new tab shifts the
  // browser's focus away almost immediately, so the modal must already be
  // rendered in this tab first or the user never sees it.
  form.reset();
  openModal('success');

  const waWindow = window.open(
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`,
    '_blank',
    'noopener,noreferrer'
  );

  if (!waWindow) modalBox.classList.add('is-error');
});

function shakField(input) {
  if (!input) return;
  input.style.borderColor = '#ef4444';
  input.animate(
    [{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' },
     { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }],
    { duration: 300, easing: 'ease' }
  );
  setTimeout(() => (input.style.borderColor = ''), 1200);
}
