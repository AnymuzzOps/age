// Interacciones principales: navegación, animaciones, contadores, carrusel y formulario.
const siteHeader = document.querySelector('#siteHeader');
const menuToggle = document.querySelector('#menuToggle');
const mainNav = document.querySelector('#mainNav');
const animatedWord = document.querySelector('#animatedWord');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.counter');
const logoTrack = document.querySelector('#logoTrack');
const prevButton = document.querySelector('.carousel__button--prev');
const nextButton = document.querySelector('.carousel__button--next');
const contactForm = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');

// Header sticky con sombra sutil al hacer scroll.
const updateHeaderState = () => {
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
};

window.addEventListener('scroll', updateHeaderState, { passive: true });
updateHeaderState();

// Menú hamburguesa para mobile.
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Texto animado del hero.
const heroWords = ['Confianza', 'Experiencia', 'Profesionalismo', 'Atención Personalizada', 'Trazabilidad', 'Seguridad'];
let currentWord = 0;

setInterval(() => {
  animatedWord.classList.add('is-changing');

  setTimeout(() => {
    currentWord = (currentWord + 1) % heroWords.length;
    animatedWord.textContent = heroWords[currentWord];
    animatedWord.classList.remove('is-changing');
  }, 260);
}, 2400);

// Aparición suave de secciones con IntersectionObserver.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

// Contadores animados al entrar en pantalla.
const formatNumber = (number) => new Intl.NumberFormat('es-CL').format(number);

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 1600;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    counter.textContent = `+${formatNumber(value)}`;

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

// Carrusel automático de logos ficticios.
let carouselIndex = 0;
let autoplay;

const visibleLogos = () => {
  if (window.innerWidth <= 620) return 2;
  if (window.innerWidth <= 1080) return 3;
  return 6;
};

const updateCarousel = () => {
  const cards = logoTrack.querySelectorAll('.logo-card');
  const gap = parseFloat(getComputedStyle(logoTrack).gap) || 0;
  const cardWidth = cards[0].getBoundingClientRect().width + gap;
  const maxIndex = Math.max(cards.length - visibleLogos(), 0);

  carouselIndex = Math.min(Math.max(carouselIndex, 0), maxIndex);
  logoTrack.style.transform = `translateX(-${carouselIndex * cardWidth}px)`;
};

const moveCarousel = (direction) => {
  const cardCount = logoTrack.querySelectorAll('.logo-card').length;
  const maxIndex = Math.max(cardCount - visibleLogos(), 0);

  carouselIndex = direction === 'next'
    ? (carouselIndex >= maxIndex ? 0 : carouselIndex + 1)
    : (carouselIndex <= 0 ? maxIndex : carouselIndex - 1);

  updateCarousel();
};

const restartAutoplay = () => {
  clearInterval(autoplay);
  autoplay = setInterval(() => moveCarousel('next'), 3000);
};

nextButton.addEventListener('click', () => {
  moveCarousel('next');
  restartAutoplay();
});

prevButton.addEventListener('click', () => {
  moveCarousel('prev');
  restartAutoplay();
});

window.addEventListener('resize', updateCarousel);
updateCarousel();
restartAutoplay();

// Validación básica del formulario del footer.
const requiredValidators = {
  name: (value) => value.trim().length >= 3,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message: (value) => value.trim().length >= 10,
};

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  let isValid = true;

  Object.entries(requiredValidators).forEach(([field, validator]) => {
    const input = contactForm.elements[field];
    const fieldIsValid = validator(input.value);
    input.classList.toggle('is-invalid', !fieldIsValid);
    isValid = isValid && fieldIsValid;
  });

  if (!isValid) {
    formMessage.textContent = 'Por favor, completa nombre, correo y mensaje antes de enviar.';
    formMessage.className = 'form-message is-error';
    return;
  }

  formMessage.textContent = 'Gracias, hemos recibido tu mensaje.';
  formMessage.className = 'form-message is-success';
  contactForm.reset();
});
