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
    }
  };

  const cardWord = document.getElementById('card-word');
  const cardPos = document.getElementById('card-pos');
  const cardLevel = document.getElementById('card-level');
  const cardPhonetic = document.getElementById('card-phonetic');
  const cardDef = document.getElementById('card-def');
  const cardContext = document.getElementById('card-context');
  const demoCard = document.getElementById('demo-card');

  let currentWordKey = 'dissect';

  // Subtitle word clicks
  document.querySelectorAll('.subz-word').forEach(span => {
    span.addEventListener('click', () => {
      const key = span.dataset.word;
      if (!wordsData[key]) return;
      currentWordKey = key;
      const data = wordsData[key];

      cardWord.innerText = data.word;
      cardPos.innerText = data.pos;
      cardLevel.innerText = data.level;
      cardPhonetic.innerText = data.phonetic;
      cardDef.innerText = data.definition;
      cardContext.innerHTML = `<strong>IN THIS SCENE:</strong><br>"${data.context}"`;

      demoCard.style.animation = 'none';
      demoCard.offsetHeight; // trigger reflow
      demoCard.style.animation = 'cardFloat 0.25s ease';
    });
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
      saveBtn.style.color = saved ? '#006CF2' : '#64748B';
    });
  }

  // Resume button click
  const resumeBtn = document.getElementById('demo-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      resumeBtn.innerText = 'Resumed! ▶';
      setTimeout(() => {
        resumeBtn.innerText = 'Resume ▶';
      }, 1000);
    });
  }
});
