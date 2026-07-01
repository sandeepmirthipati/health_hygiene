'use strict';

const HEALTH_ICONS = {
  activity: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  apple: '<path d="M12 7c-2.8-2-6.5-.2-6.5 4 0 4.8 3.7 8 6.5 8s6.5-3.2 6.5-8c0-4.2-3.7-6-6.5-4Z"/><path d="M12 7c0-2 1.2-3.5 3-4"/>',
  book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v17H6.5A2.5 2.5 0 0 1 4 17.5Z"/><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20"/>',
  bot: '<rect x="5" y="8" width="14" height="10" rx="3"/><path d="M12 8V4"/><path d="M9 13h.01"/><path d="M15 13h.01"/><path d="M9 18v2h6v-2"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3v1a4 4 0 0 0 0 8v1a3 3 0 0 0 5 2.2"/><path d="M15 4a3 3 0 0 1 3 3v1a4 4 0 0 1 0 8v1a3 3 0 0 1-5 2.2"/><path d="M12 6v13"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  droplet: '<path d="M12 3s6 6.2 6 11a6 6 0 0 1-12 0c0-4.8 6-11 6-11Z"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  heart: '<path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21l8.8-8a5.2 5.2 0 0 0 0-7.4Z"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/>',
  leaf: '<path d="M5 19c9 0 14-5 14-14-9 0-14 5-14 14Z"/><path d="M5 19c3-5 7-8 14-14"/>',
  lungs: '<path d="M12 4v8"/><path d="M12 12c-3-4-6-4-7-1-1 4-1 8 2 9 3 1 4-3 5-8Z"/><path d="M12 12c3-4 6-4 7-1 1 4 1 8-2 9-3 1-4-3-5-8Z"/>',
  moon: '<path d="M21 13A8 8 0 1 1 11 3a7 7 0 0 0 10 10Z"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8Z"/>',
  stethoscope: '<path d="M6 3v5a4 4 0 0 0 8 0V3"/><path d="M10 12v3a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="11" r="2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
  tooth: '<path d="M8 3c1.8 0 2.5 1 4 1s2.2-1 4-1c2.2 0 4 1.8 4 4 0 3-1.6 5.3-2.2 8.4-.4 2-1.5 5.6-3.4 5.6-1.3 0-1.4-3-2.4-3s-1.1 3-2.4 3c-1.9 0-3-3.6-3.4-5.6C5.6 12.3 4 10 4 7c0-2.2 1.8-4 4-4Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 15h10l1-15"/><path d="M10 10v7M14 10v7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  users: '<path d="M16 21a6 6 0 0 0-12 0"/><circle cx="10" cy="8" r="4"/><path d="M22 21a5 5 0 0 0-5-5"/><path d="M17 4a4 4 0 0 1 0 8"/>',
  wind: '<path d="M3 8h12a3 3 0 1 0-3-3"/><path d="M3 13h17a3 3 0 1 1-3 3"/><path d="M3 18h9"/>'
};

function healthIcon(name) {
  const path = HEALTH_ICONS[name] || HEALTH_ICONS.leaf;
  return `<svg class="health-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

function hydrateHealthIcons() {
  const fallbacks = [
    ['.nav-logo-mark', 'leaf'],
    ['.loader-icon', 'leaf'],
    ['.fc-icon', 'droplet'],
    ['.hc-avatar', 'activity'],
    ['.cat-hygiene .cat-icon', 'shield'],
    ['.cat-eating .cat-icon', 'apple'],
    ['.cat-water .cat-icon', 'droplet'],
    ['.cat-exercise .cat-icon', 'activity'],
    ['.cat-mental .cat-icon', 'brain'],
    ['.cat-sleep .cat-icon', 'moon'],
    ['.cat-vaccine .cat-icon', 'stethoscope'],
    ['.cat-environ .cat-icon', 'leaf'],
    ['.cat-lifestyle .cat-icon', 'heart'],
    ['.ri-icon', 'check'],
    ['.tip-pill-icon', 'sparkle'],
    ['.em-icon', 'stethoscope'],
    ['.social-link', 'users'],
    ['.welcome-icon', 'leaf'],
    ['.msg-avatar', 'leaf']
  ];

  fallbacks.forEach(([selector, icon]) => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.dataset.icon && !el.textContent.trim() && !el.querySelector('svg')) {
        el.dataset.icon = icon;
      }
    });
  });

  document.querySelectorAll('[data-icon]').forEach(el => {
    el.innerHTML = healthIcon(el.dataset.icon);
  });
}

document.addEventListener('DOMContentLoaded', hydrateHealthIcons);


