/**
 * HealthWise Main JavaScript
 * Premium Healthcare Education Platform
 */

'use strict';

/* ====================================================
 CONFIGURATION
 ==================================================== */
const CONFIG = {
 loaderDuration: 2000,
 scrollRevealThreshold: 0.15,
 tiltMax: 12,
 magneticStrength: 0.35,
 tipRunnerSpeed: 30,
};

/* ====================================================
 UTILITIES
 ==================================================== */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on = (el, ev, fn, opts) => el?.addEventListener(ev, fn, opts);
const off = (el, ev, fn) => el?.removeEventListener(ev, fn);

const raf = fn => requestAnimationFrame(fn);

function clamp(val, min, max) { return Math.min(Math.max(val, min), max); }
function lerp(a, b, t) { return a + (b - a) * t; }
function map(val, inMin, inMax, outMin, outMax) {
 return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
}

function debounce(fn, delay) {
 let t;
 return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

function formatTime(date = new Date()) {
 return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ====================================================
 THEME
 ==================================================== */
const Theme = {
 STORAGE_KEY: 'hs-theme',

 get() { return localStorage.getItem(this.STORAGE_KEY) || 'light'; },

 set(val) {
 document.documentElement.setAttribute('data-theme', val);
 localStorage.setItem(this.STORAGE_KEY, val);
 this.updateIcons(val);
 },

 toggle() { this.set(this.get() === 'dark' ? 'light' : 'dark'); },

 init() {
 this.set(this.get());
 $$('[data-theme-toggle], .theme-toggle').forEach(btn => on(btn, 'click', () => this.toggle()));
 },

 updateIcons(theme) {
 const isDark = theme === 'dark';
 const svg = isDark
 ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
 <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
 <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
 <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
 <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
 </svg>`
 : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
 </svg>`;
 $$('[data-theme-toggle], .theme-toggle, #theme-toggle-chat').forEach(btn => { btn.innerHTML = svg; });
 }
};

/* ====================================================
 LOADER
 ==================================================== */
function initLoader() {
 const loader = $('#loader') || $('#page-loader');
 if (!loader) return;

 const msgs = ['Preparing your health journey', 'Loading health insights', 'Almost ready'];
 let i = 0;
 const status = $('.loader-status', loader);

 const interval = setInterval(() => {
 if (++i < msgs.length && status) status.textContent = msgs[i];
 else clearInterval(interval);
 }, CONFIG.loaderDuration / (msgs.length + 1));

 setTimeout(() => {
 loader.classList.add('out');
 setTimeout(() => loader.remove(), 700);
 }, CONFIG.loaderDuration);
}

/* ====================================================
 CUSTOM CURSOR
 ==================================================== */
function initCursor() {
 if (window.matchMedia('(hover: none)').matches) return;

 const cursor = document.createElement('div');
 cursor.className = 'cursor';
 cursor.innerHTML = `<div class="cursor-ring"><div class="cursor-dot-inner"></div></div>`;
 document.body.appendChild(cursor);

 let cx = 0, cy = 0, tx = 0, ty = 0;
 let isHovering = false, isClicking = false;

 on(document, 'mousemove', e => { tx = e.clientX; ty = e.clientY; });

 on(document, 'mousedown', () => { isClicking = true; cursor.classList.add('click'); });
 on(document, 'mouseup', () => { isClicking = false; cursor.classList.remove('click'); });

 const hoverEls = 'a, button, [role="button"], input, textarea, .cat-card, .flip-card, .habit-item, .faq-q';

 on(document, 'mouseover', e => {
 if (e.target.closest(hoverEls)) { isHovering = true; cursor.classList.add('hover'); }
 });

 on(document, 'mouseout', e => {
 if (e.target.closest(hoverEls)) { isHovering = false; cursor.classList.remove('hover'); }
 });

 function loop() {
 cx = lerp(cx, tx, 0.12);
 cy = lerp(cy, ty, 0.12);
 cursor.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;
 raf(loop);
 }
 loop();
}

/* ====================================================
 NAVBAR
 ==================================================== */
function initNavbar() {
 const nav = $('#nav') || $('#navbar');
 const ham = $('.nav-ham') || $('.hamburger');
 const drawer = $('.nav-drawer') || $('.mobile-menu');
 let links = $$('.drawer-link');
 if (!links.length) links = $$('.mobile-nav-link');
 if (!nav) return;

 // Glass on scroll
 let lastScroll = 0;
 const handleScroll = () => {
 const y = window.scrollY;
 nav.classList.toggle('glass', y > 20);
 // Auto-hide on scroll down (optional)
 // nav.style.transform = y > lastScroll && y > 200 ? 'translateY(-100%)' : '';
 lastScroll = y;
 };

 on(window, 'scroll', handleScroll, { passive: true });
 handleScroll();

 // Hamburger
 const toggleMenu = (open) => {
 ham?.classList.toggle('open', open);
 drawer?.classList.toggle('open', open);
 ham?.setAttribute('aria-expanded', String(open));
 document.body.style.overflow = open ? 'hidden' : '';
 };

 on(ham, 'click', () => toggleMenu(!drawer?.classList.contains('open')));

 links.forEach(l => on(l, 'click', () => toggleMenu(false)));

 on(document, 'click', e => {
 if (drawer?.classList.contains('open') && !e.target.closest('#nav') && !e.target.closest('#navbar') && !e.target.closest('.nav-drawer') && !e.target.closest('.mobile-menu')) {
 toggleMenu(false);
 }
 });

 // Active link
 const current = location.pathname.split('/').pop() || 'index.html';
 $$('.nav-link, .drawer-link, .mobile-nav-link').forEach(l => {
 if (l.getAttribute('href') === current) l.classList.add('active');
 });
}

/* ====================================================
 SCROLL PROGRESS
 ==================================================== */
function initScrollProgress() {
 const bar = $('#scroll-progress');
 if (!bar) return;

 on(window, 'scroll', () => {
 const max = document.documentElement.scrollHeight - window.innerHeight;
 bar.style.width = `${(window.scrollY / max) * 100}%`;
 }, { passive: true });
}

/* ====================================================
 BACK TO TOP
 ==================================================== */
function initBackToTop() {
 const btn = $('#back-top') || $('#back-to-top');
 if (!btn) return;

 on(window, 'scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
 on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ====================================================
 REVEAL ON SCROLL
 ==================================================== */
function initReveal() {
 const els = $$('.reveal');
 if (!els.length) return;

 const io = new IntersectionObserver((entries) => {
 entries.forEach(e => {
 if (e.isIntersecting) {
 e.target.classList.add('visible');
 io.unobserve(e.target);
 }
 });
 }, { threshold: CONFIG.scrollRevealThreshold, rootMargin: '0px 0px -40px 0px' });

 els.forEach(el => io.observe(el));
}

/* ====================================================
 3D CARD TILT
 ==================================================== */
function initTilt() {
 if (window.matchMedia('(hover: none)').matches) return;

 $$('.tilt').forEach(card => {
 const strength = parseFloat(card.dataset.tilt || CONFIG.tiltMax);

 on(card, 'mousemove', e => {
 const r = card.getBoundingClientRect();
 const x = ((e.clientX - r.left) / r.width - 0.5) * strength * 2;
 const y = ((e.clientY - r.top) / r.height - 0.5) * strength * -2;
 card.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
 card.style.boxShadow = `${-x * 2}px ${y * 2}px 40px rgba(93,64,55,0.2)`;
 });

 on(card, 'mouseleave', () => {
 card.style.transform = '';
 card.style.boxShadow = '';
 });
 });
}

/* ====================================================
 MAGNETIC BUTTONS
 ==================================================== */
function initMagnetic() {
 if (window.matchMedia('(hover: none)').matches) return;

 $$('.magnetic').forEach(btn => {
 on(btn, 'mousemove', e => {
 const r = btn.getBoundingClientRect();
 const cx = r.left + r.width / 2;
 const cy = r.top + r.height / 2;
 const dx = (e.clientX - cx) * CONFIG.magneticStrength;
 const dy = (e.clientY - cy) * CONFIG.magneticStrength;
 btn.style.transform = `translate(${dx}px, ${dy}px)`;
 });

 on(btn, 'mouseleave', () => {
 btn.style.transform = '';
 btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
 setTimeout(() => btn.style.transition = '', 500);
 });
 });
}

/* ====================================================
 RIPPLE EFFECT
 ==================================================== */
function initRipple() {
 $$('.btn-solid, .btn-accent, .btn-outline').forEach(btn => {
 on(btn, 'click', e => {
 const r = btn.getBoundingClientRect();
 const size = Math.max(r.width, r.height);
 const x = e.clientX - r.left - size / 2;
 const y = e.clientY - r.top - size / 2;
 const ripple = document.createElement('span');
 ripple.className = 'btn-ripple';
 ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
 btn.appendChild(ripple);
 setTimeout(() => ripple.remove(), 600);
 });
 });
}

/* ====================================================
 MOUSE GLOW (HERO)
 ==================================================== */
function initMouseGlow() {
 const hero = $('#hero');
 if (!hero) return;

 const glow = document.createElement('div');
 glow.className = 'mouse-glow';
 hero.appendChild(glow);

 on(hero, 'mousemove', e => {
 const r = hero.getBoundingClientRect();
 glow.style.left = `${e.clientX - r.left}px`;
 glow.style.top = `${e.clientY - r.top}px`;
 glow.style.opacity = '1';
 });

 on(hero, 'mouseleave', () => { glow.style.opacity = '0'; });
}

/* ====================================================
 PARTICLES (HERO)
 ==================================================== */
function initParticles() {
 const wrap = $('.hero-particles');
 if (!wrap) return;

 const count = window.innerWidth > 768 ? 30 : 15;

 for (let i = 0; i < count; i++) {
 const p = document.createElement('div');
 p.className = 'hero-particle';
 const size = Math.random() * 3 + 2;
 const dur = Math.random() * 20 + 15;
 const delay = Math.random() * 20;
 const left = Math.random() * 100;

 p.style.cssText = `
 width: ${size}px; height: ${size}px;
 left: ${left}%;
 bottom: -10px;
 opacity: ${Math.random() * 0.6 + 0.1};
 animation-duration: ${dur}s;
 animation-delay: -${delay}s;
 `;
 wrap.appendChild(p);
 }
}

/* ====================================================
 HERO PULSE LINE SVG
 ==================================================== */
function initHeroPulseLine() {
 const svg = $('.hc-pulse-line svg');
 if (!svg) return;

 const width = 280, height = 32;
 svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

 // Generate smooth heartbeat path
 const points = [
 [0, 16], [30, 16], [50, 16], [60, 4], [70, 28], [80, 8], [90, 22], [100, 16],
 [130, 16], [150, 16], [165, 6], [175, 26], [185, 10], [195, 20], [205, 16],
 [240, 16], [280, 16]
 ];

 const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
 let d = `M ${points[0].join(' ')}`;
 for (let i = 1; i < points.length; i++) {
 d += ` L ${points[i].join(' ')}`;
 }

 path.setAttribute('d', d);
 path.setAttribute('fill', 'none');
 path.setAttribute('stroke', 'rgba(165,199,167,0.8)');
 path.setAttribute('stroke-width', '1.5');
 path.setAttribute('stroke-linecap', 'round');
 path.setAttribute('stroke-linejoin', 'round');
 path.style.strokeDasharray = '500';
 path.style.strokeDashoffset = '500';
 path.style.animation = 'svgDraw 3s ease forwards 0.5s';

 svg.appendChild(path);
}

/* ====================================================
 COUNTER ANIMATION
 ==================================================== */
function initCounters() {
 $$('[data-count]').forEach(el => {
 const io = new IntersectionObserver(([entry]) => {
 if (!entry.isIntersecting) return;
 io.unobserve(el);

 const target = parseInt(el.dataset.count);
 const suffix = el.dataset.suffix || '';
 const dur = 2000;
 const start = performance.now();

 const tick = (now) => {
 const t = Math.min((now - start) / dur, 1);
 const val = Math.round(t * t * (3 - 2 * t) * target); // smootWtep
 el.textContent = val.toLocaleString() + suffix;
 if (t < 1) raf(tick);
 };

 raf(tick);
 }, { threshold: 0.5 });

 io.observe(el);
 });
}

/* ====================================================
 CATEGORY CARDS
 ==================================================== */
function initCategories() {
 $$('.cat-card').forEach(card => {
 on(card, 'click', () => {
 const cat = card.dataset.cat;
 const target = card.dataset.href || `health.html#${cat}`;
 window.location.href = target;
 });

 on(card, 'keydown', e => {
 if (e.key === 'Enter' || e.key === ' ') {
 e.preventDefault();
 card.click();
 }
 });
 });
}

/* ====================================================
 DAILY ROUTINE TABS
 ==================================================== */
function initRoutineTabs() {
 const tabs = $$('.rtab');
 const panels = $$('.routine-panel');
 if (!tabs.length) return;

 tabs.forEach(tab => {
 on(tab, 'click', () => {
 tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
 panels.forEach(p => p.classList.remove('active'));

 tab.classList.add('active');
 tab.setAttribute('aria-selected', 'true');

 const panel = $(`#${tab.dataset.tab}`);
 if (panel) {
 panel.classList.add('active');
 // Re-trigger stagger
 $$('.routine-item', panel).forEach((item, i) => {
 item.style.animationDelay = `${i * 0.08}s`;
 item.style.animation = 'none';
 item.offsetHeight; // reflow
 item.style.animation = '';
 });
 }
 });
 });
}

/* ====================================================
 HABIT TRACKER
 ==================================================== */
function initHabitTracker() {
 const items = $$('.habit-item');
 const ring = $('.progress-ring-fill');
 const ringText = $('.ring-percent');
 const ringLabel = $('.ring-label');
 if (!items.length) return;

 const STORAGE_KEY = 'hs-habits';
 const CIRCUMFERENCE = 2 * Math.PI * 62; // r=62

 if (ring) {
 ring.style.strokeDasharray = CIRCUMFERENCE;
 ring.style.strokeDashoffset = CIRCUMFERENCE;
 }

 // Load saved state
 const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

 function updateRing() {
 const done = items.filter(i => i.classList.contains('done')).length;
 const pct = Math.round((done / items.length) * 100);
 const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

 if (ring) ring.style.strokeDashoffset = offset;
 if (ringText) ringText.textContent = `${pct}%`;
 if (ringLabel) {
 if (pct === 100) ringLabel.textContent = ' Perfect Day!';
 else if (pct >= 75) ringLabel.textContent = 'Almost there!';
 else if (pct >= 50) ringLabel.textContent = 'Keep going!';
 else ringLabel.textContent = 'Daily Progress';
 }

 // Save state
 const state = {};
 items.forEach((item, i) => { state[i] = item.classList.contains('done'); });
 localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
 }

 // Restore state
 items.forEach((item, i) => {
 if (saved[i]) item.classList.add('done');
 });
 updateRing();

 // Toggle
 items.forEach((item, i) => {
 const toggle = () => {
 item.classList.toggle('done');
 updateRing();

 if (item.classList.contains('done')) {
 item.style.animation = 'none';
 item.offsetHeight;
 item.style.animation = 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)';
 showToast(` Habit tracked!`);
 }
 };

 on(item, 'click', toggle);
 on(item, 'keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
 });
}

 /* ====================================================
 CHECKLIST (Health Guide)
 ==================================================== */
 function initChecklist() {
 const items = $$('.checklist-item');
 if (!items.length) return;

 const STORAGE_KEY = 'hs-checklist';
 const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

 const persist = () => {
 const state = {};
 items.forEach((it, i) => { state[i] = it.classList.contains('done'); });
 localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
 };

 const sync = (it, checked) => {
 it.classList.toggle('done', checked);
 it.setAttribute('aria-pressed', String(checked));
 const box = $('.checklist-box', it);
 if (box) box.classList.toggle('checked', checked);
 };

 items.forEach((it, i) => {
 const was = Boolean(saved[i]);
 sync(it, was);

 const toggle = () => {
 const next = !it.classList.contains('done');
 sync(it, next);
 persist();
 window.showToast?.(next ? ' Marked complete' : ' Marked incomplete');
 };

 on(it, 'click', toggle);
 on(it, 'keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
 });
 }

 /* ====================================================
 FLIP CARDS
 ==================================================== */
function initFlipCards() {
 $$('.flip-card').forEach(card => {
 on(card, 'click', () => card.classList.toggle('flipped'));
 on(card, 'keydown', e => {
 if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('flipped'); }
 });
 });
}

/* ====================================================
 ACCORDION / FAQ
 ==================================================== */
function initAccordion() {
 $$('.faq-item').forEach(item => {
 const q = $('.faq-q', item);
 const body = $('.faq-body', item);
 if (!q) return;

 on(q, 'click', () => {
 const isOpen = item.classList.contains('open');
 $$('.faq-item.open').forEach(o => {
 if (o !== item) {
 o.classList.remove('open');
 o.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
 }
 });
 item.classList.toggle('open', !isOpen);
 q.setAttribute('aria-expanded', String(!isOpen));
 });
 });

 // Topic card accordions (Health Guide)
 $$('.tc-accordion-toggle').forEach(btn => {
 on(btn, 'click', () => {
 const body = btn.nextElementSibling;
 const isOpen = btn.classList.contains('open');
 btn.classList.toggle('open', !isOpen);
 body?.classList.toggle('open', !isOpen);
 btn.setAttribute('aria-expanded', String(!isOpen));
 });
 });

 // Custom accordion style used on health.html
 $$('.accordion-toggle').forEach(btn => {
 const body = document.getElementById(btn.getAttribute('aria-controls'));
 on(btn, 'click', () => {
 const isOpen = btn.getAttribute('aria-expanded') === 'true';
 btn.classList.toggle('open', !isOpen);
 btn.setAttribute('aria-expanded', String(!isOpen));
 if (!body) return;
 body.classList.toggle('open', !isOpen);
 body.style.maxHeight = !isOpen ? `${body.scrollHeight}px` : '';
 });
 });
}

/* ====================================================
 GUIDE NAVIGATION
 ==================================================== */
function initGuideNav() {
 const pills = $$('.gnav-pill');
 if (!pills.length) return;

 const io = new IntersectionObserver(entries => {
 entries.forEach(entry => {
 if (entry.isIntersecting) {
 const id = entry.target.id;
 pills.forEach(p => p.classList.toggle('active', p.dataset.target === id));
 }
 });
 }, { rootMargin: '-20% 0px -70% 0px' });

 $$('.guide-section').forEach(s => io.observe(s));

 pills.forEach(pill => {
 on(pill, 'click', () => {
 const target = $(`#${pill.dataset.target}`);
 target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
 });
 });
}

/* ====================================================
 TIPS RUNNER (auto-scroll)
 ==================================================== */
function initTipsRunner() {
 const runner = $('.tips-runner');
 if (!runner) return;

 // Duplicate for seamless loop
 const clone = runner.innerHTML;
 runner.innerHTML += clone;
}

/* ====================================================
 TIPS SLIDER (manual)
 ==================================================== */
function initTipsSlider() {
 const track = $('.tips-track');
 const prevBtn = $('.slider-prev');
 const nextBtn = $('.slider-next');
 if (!track) return;

 const cards = $$('.tip-card', track);
 let current = 0;

 function goto(idx) {
 current = (idx + cards.length) % cards.length;
 const cardW = cards[0]?.offsetWidth + 24;
 track.style.transform = `translateX(-${current * cardW}px)`;
 track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
 }

 on(nextBtn, 'click', () => goto(current + 1));
 on(prevBtn, 'click', () => goto(current - 1));

 // Auto slide
 const auto = setInterval(() => goto(current + 1), 4500);
 on(track, 'mouseenter', () => clearInterval(auto));
}

/* ====================================================
 CATEGORY FILTER (Health Guide)
 ==================================================== */
function initCategoryFilter() {
 const buttons = $$('.cat-btn');
 const cards = $$('.health-topic-card');
 if (!buttons.length) return;

 buttons.forEach(btn => {
 on(btn, 'click', () => {
 buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
 btn.classList.add('active');
 btn.setAttribute('aria-pressed', 'true');

 const cat = btn.dataset.category;
 cards.forEach(card => {
 const show = cat === 'all' || card.dataset.category === cat;
 card.style.display = show ? '' : 'none';
 if (show) {
 card.style.animation = 'scaleIn 0.4s ease both';
 }
 });
 });
 });
}

/* ====================================================
 SCROLL CUE
 ==================================================== */
function initScrollCue() {
 const cue = $('.scroll-cue');
 if (!cue) return;

 on(cue, 'click', () => {
 const next = $('#categories') || $('#about-why');
 next?.scrollIntoView({ behavior: 'smooth' });
 });

 on(window, 'scroll', () => {
 if (window.scrollY > 100) cue.style.opacity = '0';
 else cue.style.opacity = '1';
 }, { passive: true });
}

/* ====================================================
 TOAST
 ==================================================== */
function showToast(message, duration = 2500) {
 const existing = $('.toast');
 if (existing) existing.remove();

 const toast = document.createElement('div');
 toast.className = 'toast';
 toast.innerHTML = `<span>${message}</span>`;
 document.body.appendChild(toast);

 raf(() => {
 raf(() => { toast.classList.add('show'); });
 });

 setTimeout(() => {
 toast.classList.remove('show');
 setTimeout(() => toast.remove(), 400);
 }, duration);
}

/* ====================================================
 BOOKMARK BUTTONS
 ==================================================== */
function initBookmarks() {
 $$('[data-bookmark]').forEach(btn => {
 const key = btn.dataset.bookmark;
 const saved = JSON.parse(localStorage.getItem('hs-bookmarks') || '[]');
 if (saved.includes(key)) { btn.textContent = ''; btn.title = 'Saved'; }

 on(btn, 'click', () => {
 const bookmarks = JSON.parse(localStorage.getItem('hs-bookmarks') || '[]');
 const idx = bookmarks.indexOf(key);

 if (idx === -1) {
 bookmarks.push(key);
 btn.textContent = '';
 btn.title = 'Saved';
 showToast(' Bookmarked!');
 } else {
 bookmarks.splice(idx, 1);
 btn.textContent = '';
 btn.title = 'Bookmark';
 showToast('Bookmark removed');
 }

 localStorage.setItem('hs-bookmarks', JSON.stringify(bookmarks));
 });
 });
}

/* ====================================================
 PARALLAX (Lightweight)
 ==================================================== */
function initParallax() {
 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 if (window.innerWidth < 768) return;

 const blobs = $$('.blob');

 on(window, 'scroll', () => {
 const y = window.scrollY;
 blobs.forEach((blob, i) => {
 const speed = (i + 1) * 0.08;
 blob.style.transform = `translateY(${y * speed}px)`;
 });
 }, { passive: true });
}

/* ====================================================
 SHARE BUTTONS
 ==================================================== */
function initShare() {
 $$('[data-share]').forEach(btn => {
 on(btn, 'click', async () => {
 const title = btn.dataset.shareTitle || document.title;
 const url = btn.dataset.shareUrl || location.href;

 if (navigator.share) {
 await navigator.share({ title, url }).catch(() => {});
 } else {
 await navigator.clipboard.writeText(url).catch(() => {});
 showToast(' Link copied!');
 }
 });
 });
}

/* ====================================================
 PROGRESS BARS (animate on reveal)
 ==================================================== */
function initProgressBars() {
 const bars = $$('.prog-fill');
 if (!bars.length) return;

 const io = new IntersectionObserver(entries => {
 entries.forEach(e => {
 if (e.isIntersecting) {
 e.target.style.width = e.target.dataset.width;
 io.unobserve(e.target);
 }
 });
 }, { threshold: 0.4 });

 bars.forEach(b => {
 b.style.width = '0';
 io.observe(b);
 });
}

/* ====================================================
 WHY CARD HOVER (About page)
 ==================================================== */
function initWhyCards() {
 $$('.why-card').forEach(card => {
 on(card, 'mouseenter', () => {
 const icon = $('.why-icon', card);
 if (icon) { icon.style.transform = 'scale(1.1) rotate(-8deg)'; }
 });
 on(card, 'mouseleave', () => {
 const icon = $('.why-icon', card);
 if (icon) { icon.style.transform = ''; }
 });
 });
}

/* ====================================================
 INIT ALL
 ==================================================== */
document.addEventListener('DOMContentLoaded', () => {
 Theme.init();
 initLoader();
 initCursor();
 initNavbar();
 initScrollProgress();
 initBackToTop();
 initReveal();
 initTilt();
 initMagnetic();
 initRipple();
 initMouseGlow();
 initParticles();
 initHeroPulseLine();
 initCounters();
 initCategories();
 initRoutineTabs();
 initHabitTracker();
 initChecklist();
 initFlipCards();
 initAccordion();
 initGuideNav();
 initTipsRunner();
 initTipsSlider();
 initCategoryFilter();
 initScrollCue();
 initParallax();
 initShare();
 initProgressBars();
 initBookmarks();
 initWhyCards();
});

// Expose showToast for other modules
window.showToast = showToast;







