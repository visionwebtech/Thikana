const navToggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#menu');
const headerLinks = document.querySelectorAll('#menu a');
const yearEl = document.querySelector('#year');
const revealEls = document.querySelectorAll('.reveal');
const parallaxMedia = document.querySelector('.parallax img');
const lightbox = document.querySelector('#lightbox');
const lightboxImg = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const galleryButtons = document.querySelectorAll('[data-lightbox]');
const form = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

if (yearEl) yearEl.textContent = new Date().getFullYear();

if (navToggle && menu) {
  navToggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  headerLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealEls.forEach(el => revealObserver.observe(el));

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    const offset = window.scrollY;
    if (parallaxMedia) {
      const translate = Math.min(offset * 0.12, 48);
      parallaxMedia.style.transform = `scale(1.08) translateY(${translate}px)`;
    }
    ticking = false;
  });
}, { passive: true });

document.querySelectorAll('.ripple').forEach(button => {
  button.addEventListener('click', function (event) {
    const circle = document.createElement('span');
    const diameter = Math.max(this.clientWidth, this.clientHeight);
    const radius = diameter / 2;
    const rect = this.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;

    const existing = this.querySelector('span');
    if (existing) existing.remove();

    this.appendChild(circle);
  });
});

galleryButtons.forEach(button => {
  button.addEventListener('click', () => {
    const src = button.getAttribute('data-lightbox');
    if (!src || !lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.querySelector('#name')?.value.trim();
    const phone = form.querySelector('#phone')?.value.trim();
    const message = form.querySelector('#message')?.value.trim();

    if (!name || !phone || !message) {
      formStatus.textContent = 'Please complete all fields before sending your message.';
      formStatus.className = 'form-status error';
      return;
    }

    const whatsappMessage = encodeURIComponent(`Hello Thikana,%0A%0AName: ${name}%0APhone: ${phone}%0ARequest: ${message}`);
    formStatus.textContent = 'Opening WhatsApp...';
    formStatus.className = 'form-status success';

    setTimeout(() => {
      window.open(`https://wa.me/919262212437?text=${whatsappMessage}`, '_blank');
    }, 250);
  });
}
