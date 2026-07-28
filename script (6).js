/* ==================================================================
   CONFIG + SMALL HELPERS
================================================================== */
const rand = (min, max) => Math.random() * (max - min) + min;
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const vw = () => window.innerWidth;
const vh = () => window.innerHeight;

const scene = document.getElementById('scene');

/* ==================================================================
   1. BACKGROUND SCENE — clouds, birds, grass, flowers, critters,
      ambient sparkles + petals. All generated so the field always
      feels alive, no matter the screen size.
================================================================== */

function buildClouds() {
  const layer = document.getElementById('clouds');
  const count = vw() < 640 ? 3 : 5;
  for (let i = 0; i < count; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    const w = rand(70, 150);
    const h = w * 0.4;
    cloud.style.width = `${w}px`;
    cloud.style.height = `${h}px`;
    cloud.style.top = `${rand(4, 40)}%`;
    cloud.style.left = `${rand(-20, 100)}%`;
    const puff1 = document.createElement('div');
    puff1.style.cssText = `width:${w * 0.55}px;height:${w * 0.55}px;top:${-w * 0.28}px;left:${w * 0.08}px;position:absolute;background:#fff;border-radius:50%;`;
    const puff2 = document.createElement('div');
    puff2.style.cssText = `width:${w * 0.4}px;height:${w * 0.4}px;top:${-w * 0.16}px;left:${w * 0.45}px;position:absolute;background:#fff;border-radius:50%;`;
    cloud.appendChild(puff1);
    cloud.appendChild(puff2);

    const duration = rand(50, 90);
    const delay = rand(-duration, 0);
    gsap.to(cloud, {
      left: '+=130%',
      duration,
      delay,
      repeat: -1,
      ease: 'none',
    });
    layer.appendChild(cloud);
  }
}

function buildBirds() {
  const layer = document.getElementById('birds');
  const spawnBird = () => {
    const bird = document.createElement('div');
    bird.className = 'bird';
    bird.style.top = `${rand(8, 30)}%`;
    bird.style.left = '-5%';
    bird.innerHTML = `<svg viewBox="0 0 22 10"><path d="M1 6 Q5.5 0 11 6 Q16.5 0 21 6"/></svg>`;
    layer.appendChild(bird);
    const path = bird.querySelector('path');
    gsap.to(path, { attr: { d: 'M1 6 Q5.5 10 11 6 Q16.5 10 21 6' }, duration: 0.25, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    gsap.to(bird, {
      left: '110%',
      top: `+=${rand(-40, 40)}`,
      duration: rand(9, 15),
      ease: 'none',
      onComplete: () => bird.remove(),
    });
  };
  spawnBird();
  setInterval(spawnBird, rand(9000, 15000));
}

function buildGrassBlades() {
  const layer = document.getElementById('grass');
  const count = vw() < 640 ? 30 : 60;
  for (let i = 0; i < count; i++) {
    const blade = document.createElement('div');
    blade.className = 'blade';
    blade.style.left = `${rand(0, 100)}%`;
    blade.style.height = `${rand(16, 30)}px`;
    blade.style.animationDuration = `${rand(2.6, 4.2)}s`;
    blade.style.animationDelay = `-${rand(0, 4)}s`;
    layer.appendChild(blade);
  }
}

const FLOWER_COLORS = ['#ff9ec7', '#ffd166', '#c9a6ff', '#ff8f70', '#8fd3ff'];

function makeFlower(left, bottom) {
  const flower = document.createElement('div');
  flower.className = 'flower';
  flower.style.left = `${left}%`;
  flower.style.bottom = `${bottom}px`;
  flower.style.animationDelay = `-${rand(0, 4)}s`;

  const color = choice(FLOWER_COLORS);
  const petals = [0, 60, 120, 180, 240, 300]
    .map((deg) => `<div class="petal" style="background:${color};transform:translate(-50%,-50%) rotate(${deg}deg) translate(6px);"></div>`)
    .join('');

  flower.innerHTML = `
    <div class="stem"></div>
    <div class="bloom">${petals}<div class="center"></div></div>
  `;
  flower.style.animationDuration = `${rand(3.4, 5)}s`;
  return flower;
}

function buildFlowers() {
  const layer = document.getElementById('flowers');
  const count = vw() < 640 ? 10 : 18;
  for (let i = 0; i < count; i++) {
    layer.appendChild(makeFlower(rand(2, 96), rand(0, 24)));
  }
}

function makeButterfly() {
  const el = document.createElement('div');
  el.className = 'critter butterfly';
  const color = choice(['#ffb3d9', '#ffd18f', '#b9a4ff', '#9fe0ff']);
  el.innerHTML = `
    <svg width="20" height="16" viewBox="0 0 20 16">
      <path d="M10 8 C6 0, 0 1, 0 5 C0 9, 6 9, 10 8 Z" fill="${color}"/>
      <path d="M10 8 C14 0, 20 1, 20 5 C20 9, 14 9, 10 8 Z" fill="${color}"/>
      <line x1="10" y1="3" x2="10" y2="13" stroke="#5a4a3a" stroke-width="1.4" stroke-linecap="round"/>
    </svg>`;
  return el;
}

function makeBee() {
  const el = document.createElement('div');
  el.className = 'critter bee';
  el.innerHTML = `
    <svg width="16" height="12" viewBox="0 0 16 12">
      <ellipse cx="8" cy="7" rx="5" ry="4" fill="#ffd166"/>
      <path d="M4 5h8M4 7h8M4 9h8" stroke="#3a2a1a" stroke-width="1"/>
      <ellipse class="bee-wing" cx="6" cy="3" rx="3" ry="2" fill="#eaf7ff" opacity="0.8"/>
      <ellipse class="bee-wing" cx="10" cy="3" rx="3" ry="2" fill="#eaf7ff" opacity="0.8"/>
    </svg>`;
  return el;
}

function makeLadybug() {
  const el = document.createElement('div');
  el.className = 'critter ladybug';
  el.innerHTML = `
    <svg width="14" height="12" viewBox="0 0 14 12">
      <ellipse cx="7" cy="7" rx="6" ry="5" fill="#ff5a5a"/>
      <line x1="7" y1="2" x2="7" y2="12" stroke="#2a1a1a" stroke-width="1"/>
      <circle cx="4" cy="6" r="1" fill="#2a1a1a"/>
      <circle cx="10" cy="6" r="1" fill="#2a1a1a"/>
      <circle cx="5" cy="9" r="1" fill="#2a1a1a"/>
      <circle cx="4" cy="2.5" r="2" fill="#2a1a1a"/>
    </svg>`;
  return el;
}

function buildCritters() {
  const layer = document.getElementById('critters');

  const flyAround = (el, boundsTop, boundsBottom) => {
    layer.appendChild(el);
    const fly = () => {
      gsap.to(el, {
        left: `${rand(2, 92)}%`,
        top: `${rand(boundsTop, boundsBottom)}%`,
        duration: rand(3, 6),
        ease: 'sine.inOut',
        onComplete: fly,
      });
    };
    el.style.left = `${rand(2, 92)}%`;
    el.style.top = `${rand(boundsTop, boundsBottom)}%`;
    fly();
  };

  for (let i = 0; i < 5; i++) flyAround(makeButterfly(), 50, 92);
  for (let i = 0; i < 3; i++) flyAround(makeBee(), 55, 88);
  for (let i = 0; i < 3; i++) {
    const bug = makeLadybug();
    bug.style.left = `${rand(2, 92)}%`;
    bug.style.bottom = `${rand(2, 20)}px`;
    layer.appendChild(bug);
  }
}

function buildAmbientParticles() {
  const layer = document.getElementById('ambient-particles');
  const spawnSparkle = () => {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = `${rand(0, 100)}%`;
    s.style.top = `${rand(20, 90)}%`;
    s.style.animationDuration = `${rand(3, 5)}s`;
    layer.appendChild(s);
    setTimeout(() => s.remove(), 5200);
  };
  const spawnPetal = () => {
    const p = document.createElement('div');
    p.className = 'petal';
    p.style.background = choice(FLOWER_COLORS);
    p.style.left = `${rand(0, 100)}%`;
    p.style.top = `-2%`;
    p.style.setProperty('--dx', `${rand(-40, 40)}px`);
    p.style.animationDuration = `${rand(6, 10)}s`;
    layer.appendChild(p);
    setTimeout(() => p.remove(), 10500);
  };
  setInterval(spawnSparkle, 400);
  setInterval(spawnPetal, 1200);
}

/* ==================================================================
   2. THE COOKIE — stretches, squishes, wiggles, cracks, and clears
      the way for the photo.
================================================================== */

function crumbBurst(originX, originY) {
  for (let i = 0; i < 14; i++) {
    const crumb = document.createElement('div');
    crumb.className = 'crumb';
    crumb.style.left = `${originX}px`;
    crumb.style.top = `${originY}px`;
    document.body.appendChild(crumb);
    gsap.to(crumb, {
      x: rand(-70, 70),
      y: rand(20, 120),
      rotation: rand(0, 360),
      opacity: 0,
      duration: rand(0.8, 1.4),
      ease: 'power1.in',
      onComplete: () => crumb.remove(),
    });
  }
}

function sparkleBurst(originX, originY, count = 18) {
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'burst-spark';
    s.style.left = `${originX}px`;
    s.style.top = `${originY}px`;
    const angle = rand(0, Math.PI * 2);
    const dist = rand(40, 130);
    s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

function heartBurst(container, count = 8, radius = 60) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'floating-heart';
    h.textContent = choice(['❤️', '💕', '💗']);
    h.style.left = `${50 + rand(-radius, radius)}%`;
    h.style.top = `${50 + rand(-radius, radius) * 0.5}%`;
    h.style.animationDelay = `${rand(0, 0.6)}s`;
    container.appendChild(h);
    setTimeout(() => h.remove(), 1800);
  }
}

function confettiBurst(originX, originY, count = 24) {
  const colors = ['#ff9ec7', '#ffd166', '#a8dcff', '#b8f0c0', '#c9a6ff'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = `${originX}px`;
    c.style.top = `${originY}px`;
    c.style.background = choice(colors);
    c.style.setProperty('--dx', `${rand(-90, 90)}px`);
    c.style.setProperty('--dy', `${rand(100, 220)}px`);
    c.style.setProperty('--rot', `${rand(180, 540)}deg`);
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1700);
  }
}

function startCookieSequence() {
  const wrap = document.getElementById('cookie-wrap');
  const cookie = document.getElementById('cookie');
  const left = document.getElementById('cookie-left');
  const right = document.getElementById('cookie-right');
  const face = document.getElementById('cookie-face');
  const rect = cookie.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  wrap.classList.add('cracking');
  cookie.style.animation = 'none'; // stop idle bob, GSAP takes over

  const tl = gsap.timeline();

  // Soft dough stretch + squish
  tl.to(cookie, { scaleY: 1.25, scaleX: 0.85, duration: 0.22, ease: 'power1.out' })
    .to(cookie, { scaleY: 0.8, scaleX: 1.2, duration: 0.22, ease: 'power1.inOut' })
    .to(cookie, { scaleY: 1.1, scaleX: 0.92, duration: 0.18, ease: 'power1.inOut' })
    // Wiggle
    .to(cookie, { rotation: -8, duration: 0.1 })
    .to(cookie, { rotation: 8, duration: 0.1 })
    .to(cookie, { rotation: -6, duration: 0.1 })
    .to(cookie, { rotation: 0, scaleX: 1, scaleY: 1, duration: 0.15 })
    // Fade the face away as it starts to crack
    .to(face, { opacity: 0, duration: 0.2 }, '<')
    // Crack open: halves rotate apart
    .to(left, { rotate: -28, x: -14, transformOrigin: '100% 100%', duration: 0.5, ease: 'back.out(1.5)' }, '+=0.05')
    .to(right, { rotate: 28, x: 14, transformOrigin: '0% 100%', duration: 0.5, ease: 'back.out(1.5)' }, '<')
    .call(() => {
      crumbBurst(cx, cy);
      sparkleBurst(cx, cy, 20);
    })
    // Halves drift apart and fade
    .to(left, { x: -90, y: 30, rotate: -60, opacity: 0, duration: 0.6, ease: 'power1.in' }, '+=0.1')
    .to(right, { x: 90, y: 30, rotate: 60, opacity: 0, duration: 0.6, ease: 'power1.in' }, '<')
    .to(wrap, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => wrap.classList.add('hidden'),
    }, '-=0.2')
    .call(revealPhoto);

  wrap.style.pointerEvents = 'none';
}

/* ==================================================================
   3. THE PHOTO — pops in, glows, gathers little hearts, then the
      final message fades in underneath.
================================================================== */

function revealPhoto() {
  const stage = document.getElementById('photo-stage');
  const frame = document.getElementById('photo-frame');
  const message = document.getElementById('final-message');
  const orbit = document.getElementById('hearts-orbit');

  stage.style.opacity = 1;
  stage.classList.add('revealed');

  gsap.to(frame, {
    scale: 1,
    duration: 0.7,
    ease: 'back.out(1.8)',
    onComplete: () => {
      frame.classList.add('floaty');
      heartBurst(orbit, 10, 70);
      setTimeout(() => message.classList.add('shown'), 300);
      setTimeout(startPigParade, 900);
      // Let the pigs enjoy the photo for a while, then quietly move on to chapter two
      setTimeout(beginChapterTwoTransition, 900 + 10000);
    },
  });
}

/* ==================================================================
   4. THE PIGS — the fun part. Each pig walks in, finds a spot near
      the photo, leans in for a kiss, blushes, then either lingers,
      wanders off, or comes back later for another kiss.
================================================================== */

let actOneEnded = false; // flips true when chapter two begins; pigs stop starting new moves

const PIG_COUNT = vw() < 640 ? 6 : 10;
const pigLayer = document.getElementById('pig-layer');

// Slots arranged in an arc below/around the photo so pigs never pile up.
let arrivalSlots = [];
function buildArrivalSlots() {
  const frame = document.getElementById('photo-frame');
  const r = frame.getBoundingClientRect();
  const centerX = r.left + r.width / 2;
  const centerY = r.top + r.height + 10; // just under the frame
  const radius = r.width * 0.62;
  arrivalSlots = [];
  const slotCount = 10;
  for (let i = 0; i < slotCount; i++) {
    const angle = Math.PI * 0.15 + (Math.PI * 0.7 * i) / (slotCount - 1); // fan out below the photo
    arrivalSlots.push({
      x: centerX + Math.cos(angle) * radius - 20,
      y: centerY + Math.sin(angle) * radius * 0.55 - 20,
      taken: false,
    });
  }
}

function claimSlot() {
  const free = arrivalSlots.filter((s) => !s.taken);
  if (!free.length) return arrivalSlots[Math.floor(rand(0, arrivalSlots.length))];
  const slot = choice(free);
  slot.taken = true;
  return slot;
}
function releaseSlot(slot) { if (slot) slot.taken = false; }

function pigSVG(id, isSmoocher) {
  // The smoocher wears a tiny bow so she's easy to spot in the crowd
  const bow = isSmoocher
    ? `<g class="bow" transform="translate(24,10)">
         <polygon points="0,0 -10,-6 -10,6" fill="#ff4d7d"/>
         <polygon points="0,0 10,-6 10,6" fill="#ff4d7d"/>
         <circle cx="0" cy="0" r="3.2" fill="#e0335f"/>
       </g>`
    : '';
  return `
    <svg viewBox="0 0 100 90">
      <ellipse class="tail" cx="8" cy="46" rx="6" ry="3" fill="none" stroke="var(--pig-pink-dark)" stroke-width="4" stroke-linecap="round"/>
      <ellipse class="leg back" cx="30" cy="72" rx="7" ry="14" fill="var(--pig-pink-dark)"/>
      <ellipse class="leg back" cx="66" cy="72" rx="7" ry="14" fill="var(--pig-pink-dark)"/>
      <ellipse cx="50" cy="52" rx="34" ry="26" fill="var(--pig-pink)"/>
      <ellipse class="leg front" cx="38" cy="76" rx="7" ry="14" fill="var(--pig-pink)"/>
      <ellipse class="leg front" cx="74" cy="76" rx="7" ry="14" fill="var(--pig-pink)"/>
      <polygon class="ear left" points="30,20 20,4 42,18" fill="var(--pig-pink)"/>
      <polygon class="ear right" points="70,20 80,4 58,18" fill="var(--pig-pink)"/>
      ${bow}
      <ellipse cx="80" cy="52" rx="16" ry="13" fill="var(--pig-pink)"/>
      <ellipse cx="86" cy="53" rx="7" ry="5.5" fill="var(--pig-pink-dark)"/>
      <circle cx="82.5" cy="52" r="1.6" fill="#5a3a1a"/>
      <circle cx="88.5" cy="52" r="1.6" fill="#5a3a1a"/>
      <g>
        <circle cx="68" cy="44" r="4" fill="#3a2a1a"/>
        <rect class="eye-lid" style="--blink-delay:${(id % 5) * 0.4}s" x="64" y="40" width="8" height="8" fill="var(--pig-pink)"/>
      </g>
      <path d="M76 60 Q80 63 84 60" stroke="#8a5a6a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <ellipse class="blush" cx="66" cy="54" rx="6" ry="3.5" fill="#ff8fab"/>
    </svg>`;
}

function createPig(index) {
  const pig = document.createElement('div');
  const isSmoocher = index === 0; // the very first pig is our dedicated smoocher
  pig.className = isSmoocher ? 'pig walking smoocher' : 'pig walking';
  pig.dataset.id = index;
  pig.dataset.smoocher = isSmoocher ? 'true' : 'false';
  pig.innerHTML = pigSVG(index, isSmoocher);
  pigLayer.appendChild(pig);
  return pig;
}

function lipMarkSVG() {
  // A simple lipstick "kiss print": two overlapping lip shapes
  return `
    <svg viewBox="0 0 26 18">
      <path d="M13 4 C10 -1 4 1 4 6 C4 9 8 10 10 8 C9 11 5 12 3 10 C4 15 10 17 13 14 C16 17 22 15 23 10 C21 12 17 11 16 8 C18 10 22 9 22 6 C22 1 16 -1 13 4 Z"
            fill="#e0335f" opacity="0.8"/>
    </svg>`;
}

function pointOnPhoto() {
  // Picks one spot on the circular photo and returns both its
  // frame-local coords (for the mark) and page coords (for the pig).
  const frame = document.getElementById('photo-frame');
  const rect = frame.getBoundingClientRect();
  const size = rect.width;
  const radius = size / 2 - 24; // stay inset from the circular edge
  const angle = rand(0, Math.PI * 2);
  const dist = Math.sqrt(Math.random()) * radius; // uniform spread across the circle
  const frameX = size / 2 + Math.cos(angle) * dist;
  const frameY = size / 2 + Math.sin(angle) * dist;
  return {
    frameX,
    frameY,
    pageX: rect.left + frameX,
    pageY: rect.top + frameY,
  };
}

function stampLipMark(point) {
  const frame = document.getElementById('photo-frame');
  const mark = document.createElement('div');
  mark.className = 'lip-mark';
  mark.style.left = `${point.frameX}px`;
  mark.style.top = `${point.frameY}px`;
  mark.style.setProperty('--rot', `${rand(-35, 35)}deg`);
  mark.innerHTML = lipMarkSVG();
  frame.appendChild(mark);

  gsap.fromTo(mark, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.25, ease: 'back.out(2)' });

  // Keep it from getting too cluttered — fade the oldest marks out over time
  const marks = frame.querySelectorAll('.lip-mark');
  if (marks.length > 22) {
    const oldest = marks[0];
    gsap.to(oldest, { opacity: 0, duration: 0.8, onComplete: () => oldest.remove() });
  }
}

function spawnKissHearts(pageX, pageY) {
  for (let i = 0; i < 3; i++) {
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = '💕';
    h.style.left = `${pageX}px`;
    h.style.top = `${pageY}px`;
    h.style.setProperty('--dx', `${rand(-20, 20)}px`);
    h.style.setProperty('--dy', `${rand(-50, -80)}px`);
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 1000);
  }
}

function bob(pig) {
  // Bouncing walk cadence layered on top of left/top movement.
  return gsap.to(pig, { y: -8, duration: 0.22, yoyo: true, repeat: -1, ease: 'sine.inOut' });
}

function kissPhoto(pig, slot) {
  pig.classList.remove('walking');
  if (pig._bobTween) pig._bobTween.kill();
  gsap.set(pig, { y: 0 });

  const restLeft = parseFloat(pig.style.left);
  const restTop = parseFloat(pig.style.top);

  // Pick the exact spot on the photo first, then aim the pig's snout at it —
  // the mark is stamped the instant contact happens, not at a random time.
  const point = pointOnPhoto();
  const pigRect = pig.getBoundingClientRect();
  const facing = point.pageX < pigRect.left + pigRect.width / 2 ? 'left' : 'right';
  pig.dataset.facing = facing;
  pig.style.transform = facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)';

  // The snout sits near the head ellipse in the SVG (~86% across, ~58% down);
  // mirror that offset when the pig is facing left.
  const snoutOffsetX = facing === 'left' ? pigRect.width * 0.14 : pigRect.width * 0.86;
  const snoutOffsetY = pigRect.height * 0.58;
  const lungeLeft = point.pageX - snoutOffsetX;
  const lungeTop = point.pageY - snoutOffsetY;

  pig.classList.add('kissing');

  const tl = gsap.timeline();
  tl.to(pig, { left: lungeLeft, top: lungeTop, duration: 0.35, ease: 'power2.in' })
    .call(() => {
      stampLipMark(point);
      pig.classList.add('blushing');
      spawnKissHearts(point.pageX, point.pageY);
    })
    .to(pig, { left: restLeft, top: restTop, duration: 0.45, ease: 'power2.out' })
    .call(() => {
      pig.classList.remove('kissing');
      setTimeout(() => decidePigNextMove(pig, slot), 350);
    });
}

function walkTo(pig, x, y, onArrive) {
  pig.classList.add('walking');
  if (!pig._bobTween) pig._bobTween = bob(pig);
  else pig._bobTween.restart();

  const currentLeft = parseFloat(pig.style.left) || 0;
  pig.dataset.facing = x < currentLeft ? 'left' : 'right';
  pig.style.transform = pig.dataset.facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)';

  gsap.to(pig, {
    left: x,
    top: y,
    duration: rand(2.2, 3.4),
    ease: 'sine.inOut',
    onComplete: onArrive,
  });
}

function decidePigNextMove(pig, slot) {
  if (actOneEnded) return;
  if (pig.dataset.smoocher === 'true') {
    // The dedicated smoocher: steps back for a breath, then comes
    // straight back in for another kiss, over and over.
    releaseSlot(slot);
    pig.classList.remove('kissing', 'blushing');
    const nearbyX = parseFloat(pig.style.left) + rand(-60, 60);
    const nearbyY = parseFloat(pig.style.top) + rand(-20, 20);
    walkTo(pig, nearbyX, nearbyY, () => {
      pig.classList.remove('walking');
      if (pig._bobTween) pig._bobTween.pause();
      gsap.set(pig, { y: 0 });
      setTimeout(() => sendPigToKiss(pig), rand(900, 2200));
    });
    return;
  }

  const roll = Math.random();
  if (roll < 0.35) {
    // Stay put, content, occasional idle wiggle
    pig.classList.remove('kissing');
    return;
  }
  if (roll < 0.65) {
    // Wander off into the grass for a while, maybe come back
    releaseSlot(slot);
    pig.classList.remove('kissing', 'blushing');
    const gx = rand(vw() * 0.1, vw() * 0.9);
    const gy = rand(vh() * 0.72, vh() * 0.92);
    walkTo(pig, gx, gy, () => {
      pig.classList.remove('walking');
      if (pig._bobTween) pig._bobTween.pause();
      gsap.set(pig, { y: 0 });
      setTimeout(() => {
        if (Math.random() < 0.6) sendPigToKiss(pig); // come back for another kiss
      }, rand(3000, 7000));
    });
    return;
  }
  // Step aside slightly and stay nearby
  pig.classList.remove('kissing');
  const rect = pig.getBoundingClientRect();
  walkTo(pig, parseFloat(pig.style.left) + rand(-30, 30), parseFloat(pig.style.top) + rand(-10, 10), () => {
    pig.classList.remove('walking');
    if (pig._bobTween) pig._bobTween.pause();
    gsap.set(pig, { y: 0 });
  });
}

function sendPigToKiss(pig) {
  if (actOneEnded) return;
  const slot = claimSlot();
  walkTo(pig, slot.x, slot.y, () => kissPhoto(pig, slot));
}

function spawnPigEntry(index) {
  if (actOneEnded) return;
  const pig = createPig(index);
  const entryType = choice(['left', 'right', 'grass']);
  const grassTop = rand(vh() * 0.68, vh() * 0.9);

  if (entryType === 'left') {
    pig.style.left = `-80px`;
    pig.style.top = `${grassTop}px`;
  } else if (entryType === 'right') {
    pig.style.left = `${vw() + 80}px`;
    pig.style.top = `${grassTop}px`;
  } else {
    pig.style.left = `${rand(vw() * 0.1, vw() * 0.9)}px`;
    pig.style.top = `${grassTop}px`;
    pig.style.transform = 'scale(0)';
    gsap.to(pig, { scale: 1, duration: 0.5, ease: 'back.out(2)' });
  }

  setTimeout(() => sendPigToKiss(pig), rand(200, 900));
}

function startPigParade() {
  buildArrivalSlots();
  window.addEventListener('resize', buildArrivalSlots);
  for (let i = 0; i < PIG_COUNT; i++) {
    setTimeout(() => spawnPigEntry(i), i * rand(500, 1100));
  }
}

/* ==================================================================
   5. INTERACTIONS — hover float (CSS handles this), and a happy
      celebration burst when the photo itself is clicked.
================================================================== */

function celebrateClick() {
  const frame = document.getElementById('photo-frame');
  const rect = frame.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  sparkleBurst(cx, cy, 24);
  confettiBurst(cx, cy, 26);
  heartBurst(document.getElementById('hearts-orbit'), 12, 90);

  const pigs = document.querySelectorAll('.pig');
  pigs.forEach((pig) => {
    pig.classList.remove('kissing');
    pig.classList.add('excited');
    setTimeout(() => pig.classList.remove('excited'), 1200);
  });
}

function initInteractions() {
  document.getElementById('cookie').addEventListener('click', startCookieSequence, { once: true });
  document.getElementById('photo-frame').addEventListener('click', celebrateClick);
}

/* ==================================================================
   6. MUSIC WIDGET — play / pause / mute, autoplay disabled by
      default (the browser blocks it anyway; this just makes the
      intent explicit and gives the user visible control).
================================================================== */

function initMusic() {
  const widget = document.getElementById('spotify-widget');
  const toggle = document.getElementById('spotify-toggle');
  toggle.addEventListener('click', () => {
    widget.classList.toggle('open');
  });
}

/* ==================================================================
   7. CHAPTER TWO — the pigs settle down, the sky turns golden, and
      a vintage letter drifts down, opens, and writes itself.
      Everything below lives on this same page/scroll position so
      the music widget is never touched, let alone interrupted.
================================================================== */

let goldenParticleTimer = null;

function spawnGoldenParticle() {
  const layer = document.getElementById('golden-particles');
  const p = document.createElement('div');
  p.className = 'golden-particle';
  const size = rand(4, 9);
  p.style.width = `${size}px`;
  p.style.height = `${size}px`;
  p.style.left = `${rand(0, 100)}%`;
  p.style.top = `${rand(20, 100)}%`;
  layer.appendChild(p);
  gsap.fromTo(
    p,
    { opacity: 0, x: 0, y: 0 },
    {
      opacity: rand(0.5, 0.9),
      x: rand(-50, 50),
      y: -rand(80, 180),
      duration: rand(4.5, 7.5),
      ease: 'sine.out',
      onComplete: () => gsap.to(p, { opacity: 0, duration: 1, onComplete: () => p.remove() }),
    }
  );
}

function startGoldenParticles() {
  spawnGoldenParticle();
  goldenParticleTimer = setInterval(spawnGoldenParticle, 260);
}

/* Gently sends any butterflies still fluttering around off into the distance */
function flyAwayButterflies() {
  document.querySelectorAll('.critter.butterfly').forEach((el) => {
    gsap.killTweensOf(el);
    gsap.to(el, {
      top: '-10%',
      left: `+=${rand(-60, 60)}`,
      opacity: 0,
      duration: rand(1.6, 2.4),
      ease: 'power1.in',
      onComplete: () => el.remove(),
    });
  });
}

/* Freezes every pig exactly where it stands, mid-scene */
function settlePigs() {
  actOneEnded = true;
  document.querySelectorAll('.pig').forEach((pig) => {
    if (pig._bobTween) pig._bobTween.kill();
    gsap.killTweensOf(pig);
    pig.classList.remove('walking', 'kissing', 'blushing', 'excited');
    pig.classList.add('frozen');
    gsap.set(pig, { y: 0 });
  });
}

/* ------------------------------------------------------------
   TRANSITION: quiet down, golden sunset, gentle zoom, photo fades
------------------------------------------------------------ */
function beginChapterTwoTransition() {
  const tl = gsap.timeline();

  tl.call(() => {
    settlePigs();
    flyAwayButterflies();
    startGoldenParticles();
  })
    .to('#sunset-overlay', { opacity: 1, duration: 4, ease: 'sine.inOut' }, 0)
    .to('#scene', { scale: 1.12, duration: 5.5, ease: 'sine.inOut', transformOrigin: '50% 45%' }, 0)
    .to('#critters', { opacity: 0, duration: 2 }, 1.4)
    .to('#ambient-particles', { opacity: 0, duration: 2 }, 1.4)
    .to('#photo-stage', { opacity: 0, scale: 0.94, duration: 2.2, ease: 'power1.inOut' }, 1.8)
    .call(revealEnvelope, null, 4.6);
}

/* ------------------------------------------------------------
   ENVELOPE: floats down from the top, lands with a soft bounce
------------------------------------------------------------ */
let envelopeIdleTween = null;

function revealEnvelope() {
  const chapterTwo = document.getElementById('chapter-two');
  chapterTwo.classList.add('active');
  gsap.to(chapterTwo, { opacity: 1, duration: 1.2, ease: 'sine.inOut' });

  const wrap = document.getElementById('envelope-wrap');
  gsap.set(wrap, { opacity: 1, y: -(vh() * 1.3), rotation: -8 });

  gsap.to(wrap, {
    y: 0,
    rotation: 0,
    duration: 1.9,
    ease: 'power2.in',
    onComplete: () => {
      // a soft little bounce as it touches down
      gsap.to(wrap, {
        y: -16,
        duration: 0.18,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          envelopeIdleTween = gsap.to('#envelope', {
            y: -5,
            duration: 2.2,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });

          let opened = false;
          const triggerOpen = () => {
            if (opened) return;
            opened = true;
            clearTimeout(autoOpenTimer);
            openEnvelope();
          };

          // Still tappable if someone's impatient, but it opens on its own shortly after landing
          document.getElementById('envelope').addEventListener('click', triggerOpen, { once: true });
          const autoOpenTimer = setTimeout(triggerOpen, 1400);
        },
      });
    },
  });
}

/* Tiny synthesized paper-crinkle sound; wrapped safely since some
   browsers block audio until a user gesture — the envelope click
   itself counts as that gesture. */
function playPaperSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.5;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 2200;
    filter.Q.value = 0.7;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter).connect(gainNode).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  } catch (e) {
    /* silently skip sound if the browser blocks it */
  }
}

function waxCrumbBurst(cx, cy) {
  for (let i = 0; i < 8; i++) {
    const crumb = document.createElement('div');
    crumb.className = 'wax-crumb';
    crumb.style.left = `${cx}px`;
    crumb.style.top = `${cy}px`;
    document.body.appendChild(crumb);
    gsap.to(crumb, {
      x: rand(-40, 40),
      y: rand(20, 70),
      rotation: rand(0, 360),
      opacity: 0,
      duration: rand(0.6, 1),
      ease: 'power1.in',
      onComplete: () => crumb.remove(),
    });
  }
}

/* ------------------------------------------------------------
   OPENING: seal cracks, flap lifts, letter slides out + unfolds
------------------------------------------------------------ */
function openEnvelope() {
  if (envelopeIdleTween) envelopeIdleTween.kill();
  gsap.set('#envelope', { y: 0 });
  playPaperSound();

  const seal = document.querySelector('.wax-seal');
  const rect = seal.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const tl = gsap.timeline();

  tl.to(seal, { scale: 1.08, duration: 0.12, ease: 'power1.out' })
    .call(() => waxCrumbBurst(cx, cy))
    .to(seal, { scale: 0.3, opacity: 0, rotation: 25, duration: 0.35, ease: 'power1.in' })
    .to('.env-flap', { rotateX: -168, duration: 0.9, ease: 'power2.inOut', transformOrigin: 'top center' }, '-=0.1')
    .call(() => playPaperSound())
    // slides out partway, then pauses...
    .to('#letter-wrap', { opacity: 1, y: -10, scale: 0.92, duration: 0.6, ease: 'power2.out' }, '+=0.05')
    .to({}, { duration: 0.45 }) // the halfway pause
    // ...then unfolds fully into view
    .to('#letter-wrap', {
      scale: 1,
      y: -35,
      duration: 0.9,
      ease: 'power2.out',
      onComplete: startLetterDecorations,
    });
}

/* ------------------------------------------------------------
   THE WRITING ANIMATION — fountain-pen typewriter, line by line
------------------------------------------------------------ */
const LETTER_LINES = [
  'Dear anurag',
  'You have been my best friend since the day we met. I know your definition for a best friend is different, but for me it’s who I feel safest with, who I laugh the most with, who I have my life’s best moments with. You are love personified anurag. You are everything any girl would ever want. But not any girl. ME. You are everything and more. I feel like the luckiest girl in the world cuz i get to call you mine',
  'Happy birthday my marshmallow<3',
];

function startLetterDecorations() {
  spawnLetterSparkles();
  setTimeout(spawnLetterButterfly, 900);
  setTimeout(sendPigToKissLetter, 1600);
  writeLetter();
}

function writeLetter() {
  const textEl = document.getElementById('letter-text');
  const cursor = document.getElementById('ink-cursor');
  let lineIndex = 0;
  let charIndex = 0;
  let written = '';

  function typeNext() {
    if (lineIndex >= LETTER_LINES.length) {
      cursor.classList.add('done');
      finishLetter();
      return;
    }
    const line = LETTER_LINES[lineIndex];
    if (charIndex <= line.length) {
      written = LETTER_LINES.slice(0, lineIndex).join('\n') +
        (lineIndex > 0 ? '\n' : '') +
        line.slice(0, charIndex);
      textEl.textContent = written;
      textEl.appendChild(cursor);
      charIndex++;
      setTimeout(typeNext, rand(35, 85));
    } else {
      lineIndex++;
      charIndex = 0;
      setTimeout(typeNext, rand(300, 500));
    }
  }
  typeNext();
}

function finishLetter() {
  setTimeout(() => {
    document.getElementById('letter-signature').classList.add('shown');
    setTimeout(peekPigSequence, 900);
  }, 400);
}

/* Small sparkles drifting up around the letter while it's being read/written */
let letterSparkleTimer = null;
function spawnLetterSparkles() {
  const fx = document.getElementById('letter-fx');
  const spawn = () => {
    const s = document.createElement('div');
    s.className = 'letter-sparkle';
    s.style.left = `${rand(-4, 104)}%`;
    s.style.top = `${rand(-4, 104)}%`;
    fx.appendChild(s);
    setTimeout(() => s.remove(), 2700);
  };
  spawn();
  letterSparkleTimer = setInterval(spawn, 550);
  setTimeout(() => clearInterval(letterSparkleTimer), 14000);
}

/* An occasional butterfly lands on a corner of the letter, folds its wings, then flits off */
function spawnLetterButterfly() {
  const fx = document.getElementById('letter-fx');
  const corners = [
    { top: '2%', left: '4%' },
    { top: '2%', right: '4%' },
    { top: '92%', left: '6%' },
    { top: '90%', right: '6%' },
  ];
  const corner = choice(corners);
  const el = document.createElement('div');
  el.className = 'letter-butterfly landed';
  Object.assign(el.style, corner);
  const color = choice(['#ffb3d9', '#ffd18f', '#b9a4ff']);
  el.innerHTML = `<svg viewBox="0 0 20 16">
    <path d="M10 8 C6 0, 0 1, 0 5 C0 9, 6 9, 10 8 Z" fill="${color}"/>
    <path d="M10 8 C14 0, 20 1, 20 5 C20 9, 14 9, 10 8 Z" fill="${color}"/>
    <line x1="10" y1="3" x2="10" y2="13" stroke="#5a4a3a" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`;
  fx.appendChild(el);
  setTimeout(() => el.remove(), 3800);
  if (Math.random() < 0.6) setTimeout(spawnLetterButterfly, rand(4000, 7000));
}

/* One piggy waddles over and gives the side of the letter a little kiss.
   Note: by this point #scene has been zoomed (scale) for the chapter-two
   transition, so this pig must NOT live inside #pig-layer (which is
   inside #scene and would inherit that scale, throwing off its
   coordinates). It's appended straight to document.body instead, just
   like the kiss-heart/sparkle bursts already do elsewhere in this file. */
function sendPigToKissLetter() {
  const letter = document.getElementById('letter');
  if (!letter) return;
  const pig = document.createElement('div');
  pig.className = 'pig walking';
  pig.innerHTML = pigSVG(999, false);
  document.body.appendChild(pig);
  const rect = letter.getBoundingClientRect();
  const fromLeft = Math.random() < 0.5;
  const startX = fromLeft ? -80 : vw() + 80;
  const startY = rect.top + rect.height * rand(0.35, 0.65);
  pig.style.left = `${startX}px`;
  pig.style.top = `${startY}px`;

  const targetX = fromLeft ? rect.left - 20 : rect.right - 44;
  const targetY = startY;

  walkTo(pig, targetX, targetY, () => {
    pig.classList.remove('walking');
    if (pig._bobTween) pig._bobTween.kill();
    gsap.set(pig, { y: 0 });
    pig.dataset.facing = fromLeft ? 'right' : 'left';
    pig.style.transform = fromLeft ? 'scaleX(1)' : 'scaleX(-1)';
    pig.classList.add('kissing');

    const kissX = fromLeft ? rect.left + 6 : rect.right - 6;
    const kissY = rect.top + rect.height * rand(0.4, 0.6);
    const lungeX = fromLeft ? targetX + 26 : targetX - 26;

    const tl = gsap.timeline();
    tl.to(pig, { left: lungeX, duration: 0.3, ease: 'power2.in' })
      .call(() => {
        stampLetterLipMark(kissX, kissY, rect);
        pig.classList.add('blushing');
        spawnKissHearts(kissX, kissY);
      })
      .to(pig, { left: targetX, duration: 0.4, ease: 'power2.out' })
      .call(() => {
        pig.classList.remove('kissing');
        setTimeout(() => {
          const exitX = fromLeft ? -80 : vw() + 80;
          walkTo(pig, exitX, targetY, () => pig.remove());
        }, 1200);
      });
  });
}

function stampLetterLipMark(pageX, pageY, letterRect) {
  const fx = document.getElementById('letter-fx');
  const mark = document.createElement('div');
  mark.className = 'letter-lip-mark';
  // fx layer is inset -30px around #letter-wrap, so offset by 30
  mark.style.left = `${pageX - letterRect.left + 30}px`;
  mark.style.top = `${pageY - letterRect.top + 30}px`;
  mark.style.setProperty('--rot', `${rand(-25, 25)}deg`);
  mark.innerHTML = lipMarkSVG();
  fx.appendChild(mark);
  gsap.fromTo(mark, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.85, duration: 0.25, ease: 'back.out(2)' });
}

/* Ending: shy little pigs peek out from behind the letter, giggle, then hide */
function peekPigSequence() {
  const fx = document.getElementById('letter-fx');
  const pig = document.createElement('div');
  pig.className = 'peek-pig';
  pig.innerHTML = pigSVG(1, false);
  fx.appendChild(pig);
  gsap.set(pig, { y: 44, opacity: 0 }); // starts tucked down out of sight

  const tl = gsap.timeline();
  // peek up shyly
  tl.to(pig, { y: 6, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' })
    .to(pig, {}, '+=0.6') // a beat, smiling
    // duck back down
    .to(pig, { y: 40, duration: 0.4, ease: 'power1.in' })
    .to(pig, {}, '+=0.3')
    // giggle out, run around, and hide shyly
    .to(pig, { y: 4, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' })
    .call(() => pig.classList.add('excited'))
    .to(pig, { x: -30, duration: 0.35, ease: 'sine.inOut' })
    .to(pig, { x: 30, duration: 0.5, ease: 'sine.inOut' })
    .to(pig, { x: 0, duration: 0.35, ease: 'sine.inOut' })
    .call(() => pig.classList.remove('excited'))
    .to(pig, { y: 50, opacity: 0, duration: 0.6, ease: 'power1.in', onComplete: () => pig.remove() });
}

/* ==================================================================
   INIT
================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  buildClouds();
  buildBirds();
  buildGrassBlades();
  buildFlowers();
  buildCritters();
  buildAmbientParticles();
  initInteractions();
  initMusic();

  // Chapter two starts hidden/collapsed until beginChapterTwoTransition runs
  gsap.set('#letter-wrap', { scale: 0.85, y: 30 });
});
