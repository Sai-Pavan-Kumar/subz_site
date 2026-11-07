/**
 * Subz Landing Page Interactive Logic
 * Powers live subtitle word click preview & pronunciation audio
 */

document.addEventListener('DOMContentLoaded', () => {
  const wordsData = {
    dissect: {
      word: 'Dissect',
      phonetic: '/dɪˈsɛkt/',
      pos: 'verb',
      level: 'Intermediate',
      definition: 'To analyze and examine something in close detail piece by piece.',
      context: 'We need to dissect the subtle nuances of this sentence.'
    },
    nuances: {
      word: 'Nuance',
      phonetic: '/ˈnjuː.ɑːns/',
      pos: 'noun',
      level: 'Advanced',
      definition: 'A subtle or small difference in meaning, sound, or feeling.',
      context: 'We need to dissect the subtle nuances of this sentence.'
    },
    coherent: {
      word: 'Coherent',
      phonetic: '/koʊˈhɪrənt/',
      pos: 'adjective',
      level: 'Advanced',
      definition: 'Clear and logical, with all the parts fitting together.',
      context: 'Her argument stayed coherent from start to finish.'
    },
    undermine: {
      word: 'Undermine',
      phonetic: '/ˌʌndərˈmaɪn/',
      pos: 'verb',
      level: 'Intermediate',
      definition: 'To slowly weaken something or make it less effective.',
      context: 'One small mistake can undermine the whole plan.'
    }
  };

  // Words in {braces} are the ones Subz would highlight on a real video.
  const subtitleLines = [
    'We need to {dissect} the subtle {nuances} of this sentence.',
    'Her argument stayed {coherent} from start to finish.',
    'One small mistake can {undermine} the whole plan.'
  ];
  const SUBTITLE_INTERVAL_MS = 4000;

  const cardWord = document.getElementById('card-word');
  const cardPos = document.getElementById('card-pos');
  const cardLevel = document.getElementById('card-level');
  const cardPhonetic = document.getElementById('card-phonetic');
  const cardDef = document.getElementById('card-def');
  const cardContext = document.getElementById('card-context');
  const demoCard = document.getElementById('demo-card');

  let currentWordKey = 'dissect';

  const subtitleLine = document.getElementById('subtitle-line');
  const player = document.getElementById('demo-player');
  const playerState = document.getElementById('player-state');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lineIndex = 0;
  let subtitleTimer = null;

  function renderSubtitleLine() {
    const parts = subtitleLines[lineIndex].split(/\{(\w+)\}/);
    subtitleLine.replaceChildren(...parts.map((part, i) => {
      if (i % 2 === 0) return document.createTextNode(part);
      const word = document.createElement('button');
      word.type = 'button';
      word.className = 'subz-word';
      word.dataset.word = part;
      word.textContent = part;
      return word;
    }));
  }

  // Clicking a word pauses the video in the real extension, so the demo does too.
  function setPlaying(playing) {
    clearInterval(subtitleTimer);
    player.classList.toggle('is-paused', !playing);
    playerState.textContent = playing ? '❚❚' : '▶';
    if (!playing || reducedMotion) return;
    subtitleTimer = setInterval(() => {
      lineIndex = (lineIndex + 1) % subtitleLines.length;
      renderSubtitleLine();
    }, SUBTITLE_INTERVAL_MS);
  }

  renderSubtitleLine();
  setPlaying(true);

  subtitleLine.addEventListener('click', (event) => {
    const word = event.target.closest('.subz-word');
    if (!word || !wordsData[word.dataset.word]) return;
    const data = wordsData[word.dataset.word];
    currentWordKey = word.dataset.word;

    cardWord.innerText = data.word;
    cardPos.innerText = data.pos;
    cardLevel.innerText = data.level;
    cardPhonetic.innerText = data.phonetic;
    cardDef.innerText = data.definition;
    cardContext.innerHTML = `<strong>IN THIS SCENE:</strong><br>"${data.context}"`;

    demoCard.style.animation = 'none';
    demoCard.offsetHeight; // trigger reflow
    demoCard.style.animation = 'cardFloat 0.25s ease';
    setPlaying(false);
    // The card sits below the player on phones; bring it into view so the tap visibly answers.
    if (window.matchMedia('(max-width: 768px)').matches) {
      demoCard.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  });

  // Audio Pronunciation
  function playAudio(rate = 1.0) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const current = wordsData[currentWordKey];
      const u = new SpeechSynthesisUtterance(current ? current.word : 'Dissect');
      u.rate = rate;
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  }

  const audio1 = document.getElementById('demo-audio-1');
  if (audio1) audio1.addEventListener('click', () => playAudio(1.0));

  const audioSlow = document.getElementById('demo-audio-slow');
  if (audioSlow) audioSlow.addEventListener('click', () => playAudio(0.75));

  // Save button toggle
  const saveBtn = document.getElementById('demo-save-btn');
  if (saveBtn) {
    let saved = true;
    saveBtn.addEventListener('click', () => {
      saved = !saved;
      saveBtn.innerText = saved ? '★ Saved' : '☆ Save';
      saveBtn.style.color = saved ? '' : '#64748B';
    });
  }

  // Resume button click
  const resumeBtn = document.getElementById('demo-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      setPlaying(true);
      resumeBtn.innerText = 'Resumed! ▶';
      setTimeout(() => {
        resumeBtn.innerText = 'Resume ▶';
      }, 1000);
    });
  }

  // The footer is a full-screen brand moment, so the navbar steps aside for it
  // and returns as soon as the reader heads back up the page.
  const navbar = document.querySelector('.navbar');
  const footer = document.querySelector('.footer');
  if (navbar && footer) {
    let footerOnScreen = false;
    let lastScrollY = window.scrollY;

    new IntersectionObserver(([entry]) => {
      footerOnScreen = entry.isIntersecting;
      if (footerOnScreen) navbar.classList.add('navbar--hidden');
      else navbar.classList.remove('navbar--hidden');
    }).observe(footer);

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (footerOnScreen) navbar.classList.toggle('navbar--hidden', scrollY >= lastScrollY);
      lastScrollY = scrollY;
    }, { passive: true });
  }
});
