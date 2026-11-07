/**
 * Scroll-driven motion. Kept apart from main.js, which owns the demo's logic:
 * if this file failed, the page would still read and the demo would still work.
 */

document.addEventListener('DOMContentLoaded', () => {
  const FIELD_WORDS = ['nuance', 'watch', 'dissect', 'subtitle', 'coherent', 'listen', 'undermine', 'learn', 'eloquent', 'pause', 'resilient', 'replay'];
  const RARE_WORDS = new Set(['nuance', 'dissect', 'coherent', 'undermine', 'eloquent', 'resilient']);
  const FIELD_ROWS = 5;

  function buildWordField() {
    const field = document.getElementById('word-field');
    if (!field) return;
    for (let row = 0; row < FIELD_ROWS; row += 1) {
      const rowEl = document.createElement('div');
      rowEl.className = 'word-row';
      // Rows hold the list twice over so the -50% drift loops without a jump.
      const offset = row * 3;
      const words = [...FIELD_WORDS.slice(offset), ...FIELD_WORDS.slice(0, offset)];
      [...words, ...words, ...words, ...words].forEach((word) => {
        const span = document.createElement('span');
        span.textContent = word;
        if (RARE_WORDS.has(word)) span.className = 'is-rare';
        rowEl.append(span);
      });
      field.append(rowEl);
    }
  }

  function observeOnce(selector, onEnter, options) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onEnter(entry.target);
        observer.unobserve(entry.target);
      });
    }, options);
    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
  }

  function watchRunningSections() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-in', entry.isIntersecting));
    });
    document.querySelectorAll('.tile, .privacy-section').forEach((el) => observer.observe(el));
  }

  function watchStorySteps() {
    const stage = document.getElementById('story-stage');
    const steps = [...document.querySelectorAll('.story-step')];
    if (!stage || !steps.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        steps.forEach((step) => step.classList.toggle('is-active', step === entry.target));
        stage.dataset.step = String(steps.indexOf(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((step) => observer.observe(step));
  }

  buildWordField();
  observeOnce('[data-reveal]', (el) => el.classList.add('is-in'), { rootMargin: '0px 0px -8% 0px' });
  watchRunningSections();
  watchStorySteps();
});
