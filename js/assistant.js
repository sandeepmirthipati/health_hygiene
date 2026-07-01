'use strict';

const AI_CONFIG = {
  provider: 'groq',
  apiKey: 'PASTE_YOUR_GROQ_API_KEY_HERE',
  model: 'llama-3.3-70b-versatile',
  fallbackModel: 'llama-3.1-8b-instant',
  endpoint: 'https://api.groq.com/openai/v1/chat/completions',
  maxTokens: 900,
  temperature: 0.65,
  requestCooldownMs: 1200
};

const SYSTEM_PROMPT = `You are HealthWise AI, a friendly educational health and hygiene learning assistant for students, families, and local communities.
Explain health and hygiene concepts clearly using practical, easy-to-follow advice.
Do not diagnose diseases, prescribe medicine, or replace professional medical care.
For emergencies, severe symptoms, treatment decisions, medicines, or personal medical concerns, encourage consulting qualified healthcare professionals or local emergency services.
Format helpful answers in Markdown with headings, short bullets, numbered steps when useful, and an educational disclaimer when relevant.`;

const LOCAL_KNOWLEDGE = [
  { keys: ['hand', 'wash', 'hygiene', 'soap'], title: 'Hand Washing', body: 'Hand washing is one of the simplest ways to reduce the spread of germs. Use soap and clean running water for at least 20 seconds, covering palms, backs of hands, fingers, thumbs, nails, and wrists.' },
  { keys: ['diet', 'nutrition', 'food', 'balanced', 'lunch'], title: 'Healthy Diet', body: 'A balanced plate includes vegetables, fruit, whole grains, protein foods, and safe water. Limit sugary drinks, excess salt, and highly packaged snacks when possible.' },
  { keys: ['water', 'hydration', 'drink'], title: 'Water Intake', body: 'Drink safe water regularly through the day. Keep a bottle nearby, drink after waking, with meals, and after exercise, and check urine color as a simple hydration clue.' },
  { keys: ['exercise', 'activity', 'fitness', 'move'], title: 'Daily Exercise', body: 'Aim for regular movement: brisk walking, stretching, games, cycling, dancing, or sports. Start gently and build consistency before intensity.' },
  { keys: ['sleep', 'rest', 'bed'], title: 'Better Sleep', body: 'Keep a regular sleep time, reduce screens before bed, avoid late caffeine, keep the room comfortable, and use a calm wind-down routine.' },
  { keys: ['stress', 'exam', 'anxiety', 'mental', 'mood'], title: 'Mental Health', body: 'Use short breathing breaks, split work into small steps, move your body, protect sleep, and speak with someone trusted. Seek professional support if distress is intense or persistent.' },
  { keys: ['vaccine', 'vaccination', 'immunization'], title: 'Vaccination', body: 'Vaccination trains the immune system to prevent serious illness. Follow local health schedules, keep records, and ask a health worker about missed doses.' },
  { keys: ['first aid', 'burn', 'cut', 'wound', 'nosebleed'], title: 'First Aid', body: 'For serious injuries or symptoms, contact emergency services. For small cuts, wash hands, rinse the wound, apply clean pressure, and cover it. Cool minor burns under running water.' }
];

const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
const HISTORY_KEY = 'HealthWise-ai-history-v4';
const STATE_KEY = 'HealthWise-ai-tools-v1';
let messages = [];
let isResponding = false;
let lastPrompt = '';
let lastRequestAt = 0;
let washInterval = null;

function isConfigured() {
  return AI_CONFIG.provider === 'groq' && AI_CONFIG.apiKey && AI_CONFIG.apiKey !== 'PASTE_YOUR_GROQ_API_KEY_HERE';
}

function timeLabel() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[ch]));
}

function renderMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  html = html.replace(/^### (.*)$/gm, '<h4>$1</h4>').replace(/^## (.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/^\d+\. (.*)$/gm, '<li class="ordered">$1</li>').replace(/^- (.*)$/gm, '<li>$1</li>').replace(/^• (.*)$/gm, '<li>$1</li>');
  html = html.replace(/((?:<li(?: class="ordered")?>.*?<\/li>\n?)+)/gs, match => match.includes('ordered') ? `<ol>${match.replace(/ class="ordered"/g, '')}</ol>` : `<ul>${match}</ul>`);
  return html.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
}

function setStatus(text, active = false) {
  const status = $('#ai-status-text');
  if (status) status.innerHTML = `<span class="status-dot${active ? ' thinking' : ''}"></span> ${text}`;
}

function localAnswer(prompt) {
  const q = prompt.toLowerCase();
  if (/(urgent|emergency|chest pain|can't breathe|cant breathe|unconscious|stroke|severe bleeding)/.test(q)) {
    return '## Emergency Guidance\n\nIf this may be an emergency, call local emergency services immediately. In India, you can call **112** for emergency help or **108** for ambulance support.\n\n> Educational information only. HealthWise AI cannot handle emergencies or replace professional care.';
  }
  const hit = LOCAL_KNOWLEDGE.find(item => item.keys.some(key => q.includes(key)));
  if (!hit) {
    return '## HealthWise AI\n\nI can help you learn about hygiene, nutrition, water intake, exercise, sleep, mental health, vaccination, disease prevention, healthy communities, and first aid.\n\n### Try asking\n- How do I build a simple healthy daily routine?\n- What are the steps of hand washing?\n- How can students manage exam stress?\n\n> Educational information only. Consult a healthcare professional for medical advice.';
  }
  return `## ${hit.title}\n\n${hit.body}\n\n### Practical Steps\n1. Start with one habit you can repeat today.\n2. Keep the habit visible and easy.\n3. Ask a qualified professional for personal medical concerns.\n\n### Quick Tip\nSmall daily actions are easier to maintain than a large change done once.\n\n> Educational information only. Consult a healthcare professional for medical advice.`;
}

const HealthWiseAI = {
  async complete(prompt) {
    if (!isConfigured()) return localAnswer(prompt);
    const wait = Math.max(0, AI_CONFIG.requestCooldownMs - (Date.now() - lastRequestAt));
    if (wait) await new Promise(resolve => setTimeout(resolve, wait));
    lastRequestAt = Date.now();
    const context = messages.slice(-12).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }));
    const payload = { model: AI_CONFIG.model, messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...context, { role: 'user', content: prompt }], max_tokens: AI_CONFIG.maxTokens, temperature: AI_CONFIG.temperature };
    let response = await this.fetchCompletion(payload);
    if (!response && AI_CONFIG.fallbackModel) response = await this.fetchCompletion({ ...payload, model: AI_CONFIG.fallbackModel });
    return response || localAnswer(prompt);
  },
  async fetchCompletion(payload) {
    const res = await fetch(AI_CONFIG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AI_CONFIG.apiKey}` }, body: JSON.stringify(payload) });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Groq request failed (${res.status}) ${detail}`.trim());
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

function addMessage(role, content, stream = false) {
  const box = $('#chat-messages');
  const welcome = $('#chat-welcome');
  if (!box) return;
  if (welcome) welcome.style.display = 'none';
  const row = document.createElement('div');
  row.className = `msg ${role}`;
  row.dataset.text = content.toLowerCase();
  row.innerHTML = `<div class="msg-avatar" data-icon="${role === 'ai' ? 'bot' : 'user'}"></div><div class="msg-wrap"><div class="msg-bubble"></div><div class="msg-meta"><span>${timeLabel()}</span>${role === 'ai' ? '<button type="button" class="msg-copy-btn">Copy</button><button type="button" class="msg-regenerate-btn">Regenerate</button><button type="button" class="msg-like-btn">Like</button><button type="button" class="msg-dislike-btn">Dislike</button>' : ''}</div></div>`;
  box.appendChild(row);
  window.hydrateHealthIcons?.();
  const bubble = $('.msg-bubble', row);
  if (role === 'ai' && stream) streamInto(bubble, renderMarkdown(content));
  else bubble.innerHTML = role === 'ai' ? renderMarkdown(content) : escapeHtml(content);
  $('.msg-copy-btn', row)?.addEventListener('click', async () => { await navigator.clipboard?.writeText(content); window.showToast?.('Copied response'); });
  $('.msg-regenerate-btn', row)?.addEventListener('click', () => lastPrompt && sendMessage(lastPrompt, true));
  $('.msg-like-btn', row)?.addEventListener('click', () => window.showToast?.('Feedback saved'));
  $('.msg-dislike-btn', row)?.addEventListener('click', () => window.showToast?.('Feedback saved'));
  box.scrollTop = box.scrollHeight;
}

function streamInto(el, html) {
  let index = 0;
  const tick = () => {
    index += 10;
    el.innerHTML = html.slice(0, index);
    const box = $('#chat-messages');
    if (box) box.scrollTop = box.scrollHeight;
    if (index < html.length) window.setTimeout(tick, 12);
  };
  tick();
}

function showTyping() {
  const box = $('#chat-messages');
  const row = document.createElement('div');
  row.className = 'msg ai typing-row';
  row.innerHTML = '<div class="msg-avatar" data-icon="bot"></div><div class="typing-indicator"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  box.appendChild(row);
  window.hydrateHealthIcons?.();
  box.scrollTop = box.scrollHeight;
  return row;
}

async function sendMessage(promptOverride, skipUserEcho = false) {
  const input = $('#chat-input');
  const prompt = (promptOverride || input?.value || '').trim();
  if (!prompt || isResponding) return;
  lastPrompt = prompt;
  if (input) input.value = '';
  if (!skipUserEcho) {
    addMessage('user', prompt);
    messages.push({ role: 'user', content: prompt });
  }
  isResponding = true;
  $('#send-btn')?.setAttribute('disabled', 'disabled');
  setStatus('Thinking...', true);
  const typing = showTyping();
  let answer;
  try { answer = await HealthWiseAI.complete(prompt); }
  catch (error) { console.warn(error); answer = `## Connection Issue\n\nI could not reach the Groq API right now, so here is a safe local learning answer.\n\n${localAnswer(prompt)}`; }
  typing.remove();
  addMessage('ai', answer, true);
  messages.push({ role: 'ai', content: answer });
  persist();
  renderHistory();
  isResponding = false;
  $('#send-btn')?.removeAttribute('disabled');
  setStatus(isConfigured() ? 'AI Ready' : 'Local learning mode');
}

function persist() { localStorage.setItem(HISTORY_KEY, JSON.stringify(messages.slice(-40))); }
function loadHistory() { messages = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); messages.forEach(m => addMessage(m.role, m.content)); if (!messages.length && $('#chat-welcome')) $('#chat-welcome').style.display = ''; renderHistory(); }
function clearChat() { messages = []; localStorage.removeItem(HISTORY_KEY); $$('.msg').forEach(el => el.remove()); if ($('#chat-welcome')) $('#chat-welcome').style.display = ''; renderHistory(); window.showToast?.('Chat cleared'); }
function renderHistory() { const box = $('#conversation-history'); if (!box) return; const recent = messages.filter(m => m.role === 'user').slice(-5).reverse(); box.innerHTML = recent.length ? '' : '<span class="empty-history">No recent chats yet.</span>'; recent.forEach(m => { const btn = document.createElement('button'); btn.className = 'history-item'; btn.type = 'button'; btn.textContent = m.content.slice(0, 56); btn.addEventListener('click', () => sendMessage(m.content)); box.appendChild(btn); }); }
function filterMessages() { const q = ($('#chat-search')?.value || '').toLowerCase(); $$('.msg').forEach(m => { m.style.display = !q || m.dataset.text.includes(q) ? '' : 'none'; }); }

function initTools() {
  $('#bmi-calc')?.addEventListener('click', () => { const h = Number($('#bmi-height')?.value) / 100; const w = Number($('#bmi-weight')?.value); if (!h || !w) return $('#bmi-result').textContent = 'Enter both height and weight.'; const bmi = w / (h * h); const label = bmi < 18.5 ? 'underweight range' : bmi < 25 ? 'healthy range' : bmi < 30 ? 'overweight range' : 'higher range'; $('#bmi-result').textContent = `BMI is ${bmi.toFixed(1)}, an educational ${label}. Ask a professional for personal guidance.`; });
  $('#water-calc')?.addEventListener('click', () => { const w = Number($('#water-weight')?.value); $('#water-result').textContent = w ? `Estimated daily water goal: ${(w * 35 / 1000).toFixed(1)} liters, adjusted for weather and activity.` : 'Enter weight to estimate a hydration goal.'; });
  $('#sleep-calc')?.addEventListener('click', () => { const value = $('#wake-time')?.value || '06:30'; const [hh, mm] = value.split(':').map(Number); const wake = new Date(); wake.setHours(hh, mm, 0, 0); const options = [9, 8, 7.5].map(hours => { const d = new Date(wake.getTime() - hours * 60 * 60 * 1000); return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }); $('#sleep-result').textContent = `Suggested bedtimes: ${options.join(', ')} for healthy sleep windows.`; });
  $$('.habit-check').forEach(ch => ch.addEventListener('change', updateHabitProgress));
  $$('.mood-buttons button').forEach(btn => btn.addEventListener('click', () => { $('#mood-result').textContent = `Mood saved: ${btn.dataset.mood}. Pair it with one calming habit today.`; localStorage.setItem(STATE_KEY, JSON.stringify({ mood: btn.dataset.mood })); }));
  $('#timer-start')?.addEventListener('click', startWashTimer);
}
function updateHabitProgress() { const checks = $$('.habit-check'); const done = checks.filter(c => c.checked).length; const pct = checks.length ? Math.round(done / checks.length * 100) : 0; $('#habit-result').textContent = `${pct}% complete today.`; $('#habit-progress-bar').style.width = `${pct}%`; $('#habit-progress-label').textContent = pct === 100 ? 'Excellent. You completed today\'s healthy habit set.' : `${done} of ${checks.length} habits complete.`; }
function startWashTimer() { clearInterval(washInterval); let left = 20; $('#wash-timer').textContent = left; $('#timer-result').textContent = 'Keep scrubbing with soap.'; washInterval = setInterval(() => { left -= 1; $('#wash-timer').textContent = left; if (left <= 0) { clearInterval(washInterval); $('#timer-result').textContent = 'Done. Rinse and dry with a clean towel.'; window.showToast?.('20 second hand wash complete'); } }, 1000); }

function initAssistant() {
  $('#current-date').textContent = new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  setStatus(isConfigured() ? 'AI Ready' : 'Local learning mode');
  loadHistory();
  initTools();
  updateHabitProgress();
  $('#send-btn')?.addEventListener('click', () => sendMessage());
  $('#chat-input')?.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });
  $('#chat-search')?.addEventListener('input', filterMessages);
  $('#clear-chat')?.addEventListener('click', clearChat);
  $('#new-chat-btn')?.addEventListener('click', clearChat);
  $('#focus-search')?.addEventListener('click', () => $('#chat-search')?.focus());
  $$('[data-prompt]').forEach(btn => btn.addEventListener('click', () => { sendMessage(btn.dataset.prompt); $('#assistant-sidebar')?.classList.remove('open'); }));
  $$('[data-scroll-chat]').forEach(btn => btn.addEventListener('click', () => $('#assistant-chat')?.scrollIntoView({ behavior: 'smooth', block: 'start' })));
  $('#sidebar-toggle')?.addEventListener('click', () => { const side = $('#assistant-sidebar'); const open = side.classList.toggle('open'); $('#sidebar-toggle').setAttribute('aria-expanded', String(open)); });
  $('#attach-btn')?.addEventListener('click', () => window.showToast?.('Attachment UI ready for future health document support'));
  $('#emoji-btn')?.addEventListener('click', () => { const input = $('#chat-input'); input.value += ' '; input.focus(); });
  $('#settings-btn')?.addEventListener('click', () => window.showToast?.('AI settings are configured in js/assistant.js'));
  $('#settings-top-btn')?.addEventListener('click', () => window.showToast?.('AI settings are configured in js/assistant.js'));
}

document.addEventListener('DOMContentLoaded', initAssistant);
window.Chat = { send: sendMessage, clearChat, config: AI_CONFIG };
