// Navegación, animaciones y componentes interactivos de la landing page.
const header = document.querySelector('#header');
const navToggle = document.querySelector('#navToggle');
const navMenu = document.querySelector('#navMenu');
const animatedWord = document.querySelector('#animatedWord');
const counters = document.querySelectorAll('.counter');
const revealElements = document.querySelectorAll('.reveal');
const contactForm = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');
const track = document.querySelector('#logoTrack');
const prevButton = document.querySelector('.carousel__btn--prev');
const nextButton = document.querySelector('.carousel__btn--next');

// Header con sombra al hacer scroll.
const updateHeader = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// Menú hamburguesa responsive.
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Texto animado del hero.
const words = [
  'Confianza',
  'Experiencia',
  'Profesionalismo',
  'Atención Personalizada',
  'Trazabilidad en línea',
  'Seguridad',
];
let wordIndex = 0;

setInterval(() => {
  animatedWord.classList.add('is-changing');
  setTimeout(() => {
    wordIndex = (wordIndex + 1) % words.length;
    animatedWord.textContent = words[wordIndex];
    animatedWord.classList.remove('is-changing');
  }, 250);
}, 2400);

// Animaciones de aparición con IntersectionObserver.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealElements.forEach((element) => revealObserver.observe(element));

// Contadores animados al entrar en pantalla.
const formatNumber = (value) => new Intl.NumberFormat('es-CL').format(value);

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 1700;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);
    counter.textContent = `+${formatNumber(current)}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      counter.textContent = `+${formatNumber(target)}`;
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach((counter) => counterObserver.observe(counter));

// Carrusel automático de logos con flechas laterales.
let carouselIndex = 0;
let autoplayId;

const visibleItems = () => {
  if (window.innerWidth <= 620) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 6;
};

const updateCarousel = () => {
  const cards = track.querySelectorAll('.logo-card');
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  const cardWidth = cards[0].getBoundingClientRect().width + gap;
  const maxIndex = Math.max(cards.length - visibleItems(), 0);

  carouselIndex = Math.min(Math.max(carouselIndex, 0), maxIndex);
  track.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;
};

const moveCarousel = (direction) => {
  const cards = track.querySelectorAll('.logo-card');
  const maxIndex = Math.max(cards.length - visibleItems(), 0);
  carouselIndex = direction === 'next'
    ? (carouselIndex >= maxIndex ? 0 : carouselIndex + 1)
    : (carouselIndex <= 0 ? maxIndex : carouselIndex - 1);
  updateCarousel();
};

const startAutoplay = () => {
  clearInterval(autoplayId);
  autoplayId = setInterval(() => moveCarousel('next'), 3200);
};

nextButton.addEventListener('click', () => {
  moveCarousel('next');
  startAutoplay();
});

prevButton.addEventListener('click', () => {
  moveCarousel('prev');
  startAutoplay();
});

window.addEventListener('resize', updateCarousel);
updateCarousel();
startAutoplay();

// Validación básica del formulario de contacto.
const validators = {
  name: (value) => value.trim().length >= 3,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => value.trim().length >= 7,
  company: (value) => value.trim().length >= 2,
  message: (value) => value.trim().length >= 10,
};

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let isValid = true;

  Object.entries(validators).forEach(([field, validate]) => {
    const input = contactForm.elements[field];
    const fieldIsValid = validate(input.value);
    input.classList.toggle('is-invalid', !fieldIsValid);
    isValid = isValid && fieldIsValid;
  });

  if (!isValid) {
    formMessage.textContent = 'Por favor, revisa los campos marcados antes de enviar.';
    formMessage.className = 'form-message is-error';
    return;
  }

  formMessage.textContent = 'Gracias, hemos recibido tu mensaje.';
  formMessage.className = 'form-message is-success';
  contactForm.reset();
});
