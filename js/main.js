/* ================================================================
   DAVID MARCO — main.js
   ================================================================

   TELEGRAM SETUP (2 минуты):
   ─────────────────────────────────────────────────────────────
   1. Открой Telegram → напиши @BotFather → /newbot
      → придумай имя и username → скопируй токен
   2. Напиши @userinfobot → скопируй свой "Id"
   3. Вставь оба значения ниже ↓
   ───────────────────────────────────────────────────────────── */
const TG_TOKEN   = '8478743673:AAEeH8Bq47_I43NdF-0N4Y6DyzP1uxqj4TQ';
const TG_CHAT_ID = '137117498';

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

  document.querySelectorAll('.anim').forEach(el => io.observe(el));
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
let lang = localStorage.getItem('dm_lang') || 'ru';

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
   CONTACT FORM → TELEGRAM
   ================================================================ */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const msgSuccess = document.getElementById('formSuccess');
const msgError   = document.getElementById('formError');

form.addEventListener('submit', async (e) => {
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

  // Loading state
  const origText = submitBtn.textContent;
  submitBtn.disabled   = true;
  submitBtn.textContent = lang === 'ru' ? 'Отправляю...' : 'Sending...';
  msgSuccess.classList.remove('show');
  msgError.classList.remove('show');

  const text = [
    '🆕 *Новая заявка с сайта davidmarco*',
    '',
    `👤 *Имя:* ${name}`,
    `📱 *WhatsApp/Telegram:* ${phone}`,
    `📧 *Email:* ${email || '—'}`,
    `💬 *Сообщение:* ${message || '—'}`,
  ].join('\n');

  try {
    // Demo mode guard
    if (TG_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
      await fakeDelay(800);
      showFormMsg('success');
      form.reset();
      return;
    }

    const res = await fetch(
      `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    TG_CHAT_ID,
          text,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!res.ok) throw new Error('tg_error');

    form.reset();
    showFormMsg('success');

  } catch {
    showFormMsg('error');
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = origText;
  }
});

function showFormMsg(type) {
  const el = type === 'success' ? msgSuccess : msgError;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 6000);
}

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

function fakeDelay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
