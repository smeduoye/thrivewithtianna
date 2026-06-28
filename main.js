(function () {
  'use strict';

  // Header scroll effect
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile nav
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Formspree — contact & booking (GitHub Pages has no backend)
  const FORMSPREE_URL = 'https://formspree.io/f/xwvdbzzw';

  async function submitToFormspree(form, extraFields = {}) {
    const data = new FormData(form);
    Object.entries(extraFields).forEach(([key, value]) => {
      if (value != null && value !== '') data.set(key, value);
    });

    const response = await fetch(FORMSPREE_URL, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || 'Could not send your request. Please try again.');
    }
  }

  async function handleFormSubmit(e, { successMessage, onSuccess, extraFields = {} }) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      await submitToFormspree(form, extraFields);
      showToast(successMessage);
      form.reset();
      onSuccess?.();
    } catch (err) {
      showToast(err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  // Toast
  const toast = document.getElementById('toast');
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // Booking modal
  const bookingModal = document.getElementById('booking-modal');
  const modalTitle = document.getElementById('modal-title');

  document.querySelectorAll('[data-program]').forEach(btn => {
    btn.addEventListener('click', () => {
      modalTitle.textContent = btn.dataset.program;
      openModal(bookingModal);
    });
  });

  // Client login — portal app (localhost in dev, production URL otherwise)
  const portalUrl =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8081'
      : 'https://app.thrivewithtianna.com';
  document.getElementById('client-login-btn').addEventListener('click', () => {
    window.location.href = portalUrl;
  });

  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal').forEach(modal => {
    modal.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));
    modal.querySelector('.modal-overlay').addEventListener('click', () => closeModal(modal));
  });

  document.getElementById('booking-form').addEventListener('submit', e => {
    handleFormSubmit(e, {
      successMessage: 'Booking request received! Wumi will be in touch soon.',
      onSuccess: () => closeModal(bookingModal),
      extraFields: {
        _subject: 'Booking request — Thrive with Tianna',
        form_type: 'booking',
        program: modalTitle.textContent,
      },
    });
  });

  const loginModal = document.getElementById('login-modal');
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    closeModal(loginModal);
    showToast('Client portal coming soon — thanks for your interest!');
    e.target.reset();
  });

  // Contact form
  document.getElementById('contact-form').addEventListener('submit', e => {
    handleFormSubmit(e, {
      successMessage: 'Thank you! Your consultation request has been received.',
      extraFields: {
        _subject: 'Free consultation request — Thrive with Tianna',
        form_type: 'consultation',
      },
    });
  });

  // Testimonials slider
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonialCards.forEach((card, i) => card.classList.toggle('active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    currentTestimonial = index;
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showTestimonial(i));
  });

  setInterval(() => {
    showTestimonial((currentTestimonial + 1) % testimonialCards.length);
  }, 6000);

  // Escape key closes modals
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(closeModal);
    }
  });
})();
