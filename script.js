/**
 * HOME Nº 134 — Smooth Architectural Scroll Engine
 * Real-time scroll sync, camera zoom, live nav highlight, audio & modals
 */

function initHome134() {

  // --- DOM References ---
  const sections = Array.from(document.querySelectorAll('.walk-section'));
  const navItems = Array.from(document.querySelectorAll('.nav-item'));
  const railTicks = Array.from(document.querySelectorAll('.rail-tick'));
  const railFill = document.getElementById('rail-fill');
  const railLabel = document.getElementById('rail-label');
  const scrollProgressLine = document.getElementById('scroll-progress-line');
  const counterCurrent = document.getElementById('counter-current');
  const counterTotal = document.getElementById('counter-total');
  const counterPhase = document.getElementById('counter-phase');
  const autotourBtn = document.getElementById('autotour-btn');
  const tourIcon = document.getElementById('tour-icon');
  const tourText = document.getElementById('tour-text');
  const hotspotCard = document.getElementById('hotspot-card');
  const hotspotCardTitle = document.getElementById('hotspot-card-title');
  const hotspotCardDesc = document.getElementById('hotspot-card-desc');

  let currentActiveIndex = 0;
  let autoTourActive = false;
  let autoTourInterval = null;

  // Metadata mapping for each section
  const sectionMeta = [
    { index: 0, num: '01', label: 'ARRIVAL', phase: 'EXTERIOR' },
    { index: 1, num: '01.B', label: 'THRESHOLD', phase: 'ENTERING' },
    { index: 2, num: '02', label: 'LIVING', phase: 'LIVING HALL' },
    { index: 3, num: '03', label: 'KITCHEN', phase: 'CULINARY' },
    { index: 4, num: '04', label: 'BEDROOM', phase: 'MASTER SUITE' },
    { index: 5, num: '05', label: 'BATH', phase: 'SPA SUITE' },
    { index: 6, num: '06', label: 'TERRACE', phase: 'ROOF TERRACE' },
    { index: 7, num: '07', label: 'STUDIO', phase: 'PRESENTATION' }
  ];

  // --- Scroll To Section Function ---
  window.scrollToSection = function(index) {
    if (index < 0 || index >= sections.length) return;
    const targetSection = sections[index];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.nextSection = function() {
    const nextIdx = (currentActiveIndex + 1) % sections.length;
    scrollToSection(nextIdx);
  };

  window.prevSection = function() {
    const prevIdx = (currentActiveIndex - 1 + sections.length) % sections.length;
    scrollToSection(prevIdx);
  };

  // --- Real-time Scroll Listener ---
  let isTicking = false;

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;

    // 1. Update Progress Lines
    if (scrollProgressLine) {
      scrollProgressLine.style.width = `${(scrollProgress * 100).toFixed(2)}%`;
    }
    if (railFill) {
      railFill.style.height = `${(scrollProgress * 100).toFixed(2)}%`;
    }

    // 2. Identify which section is most centered in the viewport
    const viewCenter = scrollTop + window.innerHeight / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    sections.forEach((sec, idx) => {
      const secTop = sec.offsetTop;
      const secCenter = secTop + sec.offsetHeight / 2;
      const dist = Math.abs(viewCenter - secCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIndex = idx;
      }
    });

    if (closestIndex !== currentActiveIndex) {
      setActiveSection(closestIndex);
    }

    // 3. Apply subtle parallax zoom based on section visibility
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const img = sec.querySelector('.room-media');
      if (img && rect.top < window.innerHeight && rect.bottom > 0) {
        // Section is in view
        const visibility = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        const scale = 1.0 + visibility * 0.08;
        img.style.transform = `scale(${scale.toFixed(3)})`;
      }
    });

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(onScroll);
      isTicking = true;
    }
  }, { passive: true });

  function setActiveSection(index) {
    currentActiveIndex = index;
    const meta = sectionMeta[index] || sectionMeta[0];

    // Mark active class on sections
    sections.forEach((sec, idx) => {
      sec.classList.toggle('in-view', idx === index);
    });

    // Update Counter
    if (counterCurrent) counterCurrent.textContent = meta.num;
    if (counterPhase) counterPhase.textContent = meta.phase;
    if (railLabel) railLabel.textContent = meta.label;

    // Update Top Header Nav Items
    navItems.forEach(item => {
      const targetIdx = parseInt(item.getAttribute('data-target'), 10);
      item.classList.toggle('active', targetIdx === index || (index === 1 && targetIdx === 0));
    });

    // Update Right Rail Ticks
    railTicks.forEach(tick => {
      const tickIdx = parseInt(tick.getAttribute('data-index'), 10);
      tick.classList.toggle('active', tickIdx === index);
    });
  }

  // --- Keyboard Navigation ---
  window.addEventListener('keydown', (e) => {
    if (document.querySelector('.modal-overlay.open')) {
      if (e.key === 'Escape') closeAllModals();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSection();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      prevSection();
    } else if (e.key >= '1' && e.key <= '7') {
      const keyMap = [0, 2, 3, 4, 5, 6, 7];
      const num = parseInt(e.key, 10) - 1;
      if (num < keyMap.length) scrollToSection(keyMap[num]);
    } else if (e.key.toLowerCase() === 'a') {
      toggleAutoTour();
    } else if (e.key.toLowerCase() === 'm') {
      toggleAmbientAudio();
    }
  });

  // --- Auto-Tour Engine ---
  window.toggleAutoTour = function() {
    autoTourActive = !autoTourActive;
    if (autoTourActive) {
      tourIcon.textContent = '❚❚';
      tourText.textContent = 'PAUSE';
      autotourBtn.classList.add('bg-white/10', 'border-stone-400', 'text-white');

      autoTourInterval = setInterval(() => {
        let nextIdx = (currentActiveIndex + 1);
        if (nextIdx >= sections.length) nextIdx = 0;
        scrollToSection(nextIdx);
      }, 4500);
    } else {
      clearInterval(autoTourInterval);
      tourIcon.textContent = '▶';
      tourText.textContent = 'AUTO FLYTHROUGH';
      autotourBtn.classList.remove('bg-white/10', 'border-stone-400', 'text-white');
    }
  };

  // Pause auto-tour if user manually interacts
  window.addEventListener('wheel', () => {
    if (autoTourActive) toggleAutoTour();
  }, { passive: true });

  // --- Architectural Hotspots Interaction ---
  const hotspots = document.querySelectorAll('.hotspot');
  hotspots.forEach(spot => {
    spot.addEventListener('mouseenter', (e) => showHotspotCard(spot, e));
    spot.addEventListener('mouseleave', () => hideHotspotCard());
    spot.addEventListener('click', (e) => {
      e.stopPropagation();
      showHotspotCard(spot, e);
    });
  });

  function showHotspotCard(spot) {
    const title = spot.getAttribute('data-title');
    const desc = spot.getAttribute('data-desc');
    const rect = spot.getBoundingClientRect();

    hotspotCardTitle.textContent = title;
    hotspotCardDesc.textContent = desc;

    let topPos = rect.top - 120;
    let leftPos = rect.left + 25;

    if (leftPos + 280 > window.innerWidth) leftPos = rect.left - 290;
    if (topPos < 80) topPos = rect.bottom + 15;

    hotspotCard.style.top = `${topPos}px`;
    hotspotCard.style.left = `${leftPos}px`;
    hotspotCard.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
    hotspotCard.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
  }

  function hideHotspotCard() {
    hotspotCard.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
    hotspotCard.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hotspot') && !e.target.closest('#hotspot-card')) {
      hideHotspotCard();
    }
  });

  // --- Ambient Web Audio Generator ---
  let audioCtx = null;
  let noiseNode = null;
  let filterNode = null;
  let gainNode = null;
  let isAudioPlaying = false;

  window.toggleAmbientAudio = function() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    const audioLabel = document.getElementById('audio-label');

    if (!audioCtx) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();

        const bufferSize = audioCtx.sampleRate * 2;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.08;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        filterNode = audioCtx.createBiquadFilter();
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 420;

        const subOsc = audioCtx.createOscillator();
        subOsc.type = 'sine';
        subOsc.frequency.value = 55;
        const subGain = audioCtx.createGain();
        subGain.gain.value = 0.02;
        subOsc.connect(subGain);

        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.001;

        noiseNode.connect(filterNode);
        filterNode.connect(gainNode);
        subGain.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noiseNode.start();
        subOsc.start();
      } catch (err) {
        console.warn('Web Audio not supported:', err);
        return;
      }
    }

    if (audioCtx.state === 'suspended') audioCtx.resume();

    if (!isAudioPlaying) {
      gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.5);
      isAudioPlaying = true;
      audioBtn.classList.add('audio-playing', 'border-stone-500', 'text-stone-200');
      audioLabel.textContent = 'SOUND: ON';
    } else {
      gainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      isAudioPlaying = false;
      audioBtn.classList.remove('audio-playing', 'border-stone-500', 'text-stone-200');
      audioLabel.textContent = 'SOUND: OFF';
    }
  };

  // --- Modals ---
  window.openModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('open');
  };

  window.closeModal = function(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('open');
  };

  window.closeAllModals = function() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  };

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });

  window.handleFormSubmit = function(event) {
    event.preventDefault();
    const form = document.getElementById('viewing-form');
    const success = document.getElementById('form-success');
    if (form && success) {
      form.classList.add('hidden');
      success.classList.remove('hidden');
    }
  };

  // Initial setup
  setActiveSection(0);
  onScroll();

  console.log('HOME Nº 134 — Smooth Architectural Scrollytelling Engine Ready.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome134);
} else {
  initHome134();
}
