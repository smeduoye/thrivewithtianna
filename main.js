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

  // Client login modal
  const loginModal = document.getElementById('login-modal');
  document.getElementById('client-login-btn').addEventListener('click', () => {
    openModal(loginModal);
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
    e.preventDefault();
    closeModal(bookingModal);
    showToast('Booking request received! Tianna will be in touch soon.');
    e.target.reset();
  });

  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    closeModal(loginModal);
    showToast('Client portal coming soon — thanks for your interest!');
    e.target.reset();
  });

  // Contact form
  document.getElementById('contact-form').addEventListener('submit', e => {
    e.preventDefault();
    showToast('Thank you! Your consultation request has been received.');
    e.target.reset();
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
