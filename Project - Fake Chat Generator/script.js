/* ═══════════════════════════════════════════════════════════
   FAKECHAT STUDIO — script.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. STATE
───────────────────────────────────────────────────────────── */
const state = {
  messages: [],        // Array of message objects
  nextId: 1,           // Auto-increment message IDs
  messageType: 'received',
  chatStyle: 'whatsapp',
  bg: '#e5ddd5',
  sentColor: '#dcf8c6',
  recvColor: '#ffffff',
  contactName: 'Alex Johnson',
  contactStatus: 'online',
  contactAvatar: '',
  myName: 'You',
  statusTime: '',
  batteryLevel: 87,
  showTyping: false,
  dragSrcIdx: null,    // For drag-and-drop reorder
  editingId: null,     // Currently editing message ID
};

/* ─────────────────────────────────────────────────────────────
   2. DOM REFERENCES
───────────────────────────────────────────────────────────── */
const dom = {
  // Nav
  btnTheme:      document.getElementById('btn-theme-toggle'),
  btnSave:       document.getElementById('btn-save'),
  btnLoad:       document.getElementById('btn-load'),
  btnExport:     document.getElementById('btn-export'),

  // Tabs
  tabBtns:       document.querySelectorAll('.tab-btn'),
  tabPanes:      document.querySelectorAll('.tab-pane'),

  // Contact
  avatarUploader: document.getElementById('avatar-uploader'),
  avatarInput:    document.getElementById('avatar-input'),
  avatarPreview:  document.getElementById('avatar-preview'),
  avatarPlaceholder: document.getElementById('avatar-placeholder'),
  contactName:    document.getElementById('contact-name'),
  contactStatus:  document.getElementById('contact-status'),

  // Compose
  btnReceived:    document.getElementById('btn-received'),
  btnSent:        document.getElementById('btn-sent'),
  msgInput:       document.getElementById('message-input'),
  emojiToggle:    document.getElementById('emoji-toggle'),
  emojiPicker:    document.getElementById('emoji-picker'),
  emojiGrid:      document.getElementById('emoji-grid'),
  msgTime:        document.getElementById('msg-time'),
  msgReceipt:     document.getElementById('msg-receipt'),
  showTyping:     document.getElementById('show-typing'),
  btnAddMsg:      document.getElementById('btn-add-message'),

  // Messages list
  msgList:        document.getElementById('messages-list'),
  emptyHint:      document.getElementById('empty-list-hint'),
  btnClearAll:    document.getElementById('btn-clear-all'),

  // Customize
  bgSwatches:     document.getElementById('bg-swatches'),
  bgCustomColor:  document.getElementById('bg-custom-color'),
  sentColor:      document.getElementById('sent-color'),
  recvColor:      document.getElementById('recv-color'),
  styleOptions:   document.querySelectorAll('.style-btn'),
  statusTime:     document.getElementById('status-time'),
  batteryLevel:   document.getElementById('battery-level'),
  myName:         document.getElementById('my-name'),

  // Templates
  templateGrid:   document.getElementById('template-grid'),

  // Phone preview
  phoneFrame:     document.getElementById('phone-frame'),
  sbTime:         document.getElementById('sb-time'),
  batteryBar:     document.getElementById('battery-bar'),
  chatMessages:   document.getElementById('chat-messages'),
  headerAvatar:   document.getElementById('header-avatar'),
  headerAvatarPh: document.getElementById('header-avatar-placeholder'),
  headerName:     document.getElementById('header-name'),
  headerStatus:   document.getElementById('header-status'),
  onlineDot:      document.getElementById('online-dot'),
  typingIndicator: document.getElementById('typing-indicator'),

  // Modals
  modalEdit:      document.getElementById('modal-edit'),
  modalEditClose: document.getElementById('modal-edit-close'),
  modalEditCancel: document.getElementById('modal-edit-cancel'),
  modalEditSave:  document.getElementById('modal-edit-save'),
  editTextarea:   document.getElementById('edit-textarea'),
  editTime:       document.getElementById('edit-time'),
  editReceipt:    document.getElementById('edit-receipt'),

  modalLoad:      document.getElementById('modal-load'),
  modalLoadClose: document.getElementById('modal-load-close'),
  savedChatsList: document.getElementById('saved-chats-list'),

  // Toast
  toastContainer: document.getElementById('toast-container'),
};

/* ─────────────────────────────────────────────────────────────
   3. EMOJI DATA
───────────────────────────────────────────────────────────── */
const EMOJIS = [
  '😀','😂','🥰','😍','🤩','😎','🥳','🤔',
  '😅','😭','😱','🤯','😡','🥺','🙏','👍',
  '👎','❤️','🔥','✨','💯','🎉','🎊','🙌',
  '👏','🤝','💪','🫶','😘','🤗','😏','😒',
  '🙄','😴','🤢','🤮','💀','👻','🤖','💩',
  '🌟','⭐','💫','🎵','🎶','🏆','🚀','🌈',
  '🍕','🍔','🍟','🌮','🍣','🍜','☕','🧃',
  '🍺','🥂','🍾','🎂','🍰','🧁','🍭','🍫',
];

/* ─────────────────────────────────────────────────────────────
   4. BACKGROUND SWATCHES DATA
───────────────────────────────────────────────────────────── */
const BG_SWATCHES = [
  '#e5ddd5', '#d0f0c0', '#c2e4f5', '#ffd6e7',
  '#ffe4c4', '#dcd3f5', '#1a1a2e', '#0d1b2a',
  '#f9f3e3', '#e8e8e8',
];

/* ─────────────────────────────────────────────────────────────
   5. TEMPLATE SCENARIOS
───────────────────────────────────────────────────────────── */
const TEMPLATES = [
  {
    id: 'funny',
    emoji: '😂',
    name: 'Funny Banter',
    desc: 'Hilarious back-and-forth exchange',
    contactName: 'Best Friend',
    contactStatus: 'last seen today',
    messages: [
      { type: 'received', text: 'Bro did you just eat my entire pizza?? 🍕', time: '2:14 PM', receipt: 'none' },
      { type: 'sent',     text: 'What pizza? 😇', time: '2:15 PM', receipt: 'read' },
      { type: 'received', text: 'THE ONE WITH YOUR NAME ON IT IN THE FRIDGE', time: '2:15 PM', receipt: 'none' },
      { type: 'sent',     text: 'ohhhh THAT pizza. Yeah that was delicious btw 😂', time: '2:16 PM', receipt: 'read' },
      { type: 'received', text: 'I hate you', time: '2:16 PM', receipt: 'none' },
      { type: 'sent',     text: 'No you don\'t ❤️', time: '2:17 PM', receipt: 'read' },
      { type: 'received', text: '...no I don\'t 😭', time: '2:17 PM', receipt: 'none' },
    ],
  },
  {
    id: 'breakup',
    emoji: '💔',
    name: 'The Breakup',
    desc: 'Dramatic relationship ending',
    contactName: 'Ex 💔',
    contactStatus: 'last seen 3 days ago',
    messages: [
      { type: 'sent',     text: 'We need to talk...', time: '8:00 PM', receipt: 'read' },
      { type: 'received', text: 'About what? Is everything okay?', time: '8:02 PM', receipt: 'none' },
      { type: 'sent',     text: 'I don\'t think this is working anymore 😞', time: '8:05 PM', receipt: 'read' },
      { type: 'received', text: 'What? Where is this coming from??', time: '8:06 PM', receipt: 'none' },
      { type: 'sent',     text: 'I think we both know we\'ve grown apart', time: '8:09 PM', receipt: 'read' },
      { type: 'received', text: 'I... I had no idea you felt this way', time: '8:11 PM', receipt: 'none' },
      { type: 'sent',     text: 'I\'m sorry. Take care of yourself 💙', time: '8:14 PM', receipt: 'delivered' },
    ],
  },
  {
    id: 'savage',
    emoji: '💅',
    name: 'Savage Clapback',
    desc: 'No-nonsense savage replies',
    contactName: 'Karen 🙄',
    contactStatus: 'online',
    messages: [
      { type: 'received', text: 'I need you to redo the entire project by tomorrow', time: '11:55 PM', receipt: 'none' },
      { type: 'sent',     text: 'Lol no', time: '11:56 PM', receipt: 'read' },
      { type: 'received', text: 'Excuse me?? Do you know who I am?', time: '11:56 PM', receipt: 'none' },
      { type: 'sent',     text: 'Yes. Someone texting me at midnight with impossible requests 🥱', time: '11:57 PM', receipt: 'read' },
      { type: 'received', text: 'I will tell the manager!', time: '11:58 PM', receipt: 'none' },
      { type: 'sent',     text: 'Great. My manager knows I work 9-5. Goodnight 💅', time: '11:58 PM', receipt: 'read' },
    ],
  },
  {
    id: 'crush',
    emoji: '😍',
    name: 'Texting Crush',
    desc: 'Nervous but sweet flirting',
    contactName: 'Jamie ✨',
    contactStatus: 'online',
    messages: [
      { type: 'sent',     text: 'Hey... hope your day was good 😊', time: '7:30 PM', receipt: 'read' },
      { type: 'received', text: 'It is now! How about yours? 😁', time: '7:31 PM', receipt: 'none' },
      { type: 'sent',     text: 'Better now 😅', time: '7:32 PM', receipt: 'read' },
      { type: 'received', text: 'Was that... are you flirting with me? 👀', time: '7:33 PM', receipt: 'none' },
      { type: 'sent',     text: 'Maybe a little 😏', time: '7:34 PM', receipt: 'read' },
      { type: 'received', text: 'Good. Don\'t stop 😘', time: '7:35 PM', receipt: 'none' },
    ],
  },
  {
    id: 'mom',
    emoji: '👩‍👦',
    name: 'Mom Texts',
    desc: 'Classic overprotective mom',
    contactName: 'Mom 💛',
    contactStatus: 'last seen 1 min ago',
    messages: [
      { type: 'received', text: 'Did you eat?', time: '12:00 PM', receipt: 'none' },
      { type: 'sent',     text: 'Yes mom', time: '12:05 PM', receipt: 'read' },
      { type: 'received', text: 'What did you eat', time: '12:05 PM', receipt: 'none' },
      { type: 'sent',     text: 'Food lol', time: '12:06 PM', receipt: 'read' },
      { type: 'received', text: 'Are you being smart with me 🙄', time: '12:06 PM', receipt: 'none' },
      { type: 'received', text: 'Call me. I don\'t like texting', time: '12:07 PM', receipt: 'none' },
      { type: 'sent',     text: 'I\'m literally at work mom 😭', time: '12:08 PM', receipt: 'read' },
      { type: 'received', text: 'Ok but call me on your lunch break. I love you ❤️', time: '12:08 PM', receipt: 'none' },
    ],
  },
];

/* ─────────────────────────────────────────────────────────────
   6. UTILITIES
───────────────────────────────────────────────────────────── */

/** Show a toast notification */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : ''}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('out');
    setTimeout(() => toast.remove(), 350);
  }, 2600);
}

/** Get current time as HH:MM */
function getCurrentTime() {
  const now = new Date();
  return now.toTimeString().slice(0, 5);
}

/** Escape HTML to prevent XSS */
function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/** Get receipt icon HTML */
function getReceiptHtml(receipt, type) {
  if (type !== 'sent' || receipt === 'none') return '';
  const map = {
    sent:      { icon: '✔',  cls: 'sent' },
    delivered: { icon: '✔✔', cls: 'delivered' },
    read:      { icon: '✔✔', cls: 'read' },
  };
  const r = map[receipt];
  return r ? `<span class="receipt-icon ${r.cls}">${r.icon}</span>` : '';
}

/* ─────────────────────────────────────────────────────────────
   7. CLOCK
───────────────────────────────────────────────────────────── */
function updateStatusBarTime() {
  const custom = dom.statusTime.value.trim();
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  dom.sbTime.textContent = custom || `${hh}:${mm}`;
}

setInterval(updateStatusBarTime, 10000);

/* ─────────────────────────────────────────────────────────────
   8. RENDER FUNCTIONS
───────────────────────────────────────────────────────────── */

/** Render all messages into the phone preview */
function renderMessages() {
  // Keep date divider, clear rest
  const dateDivider = dom.chatMessages.querySelector('.date-divider');
  dom.chatMessages.innerHTML = '';
  if (dateDivider) dom.chatMessages.appendChild(dateDivider);

  if (state.messages.length === 0) return;

  state.messages.forEach(msg => {
    const wrap = document.createElement('div');
    wrap.className = `chat-bubble-wrap ${msg.type}`;
    wrap.dataset.id = msg.id;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = msg.text;

    const meta = document.createElement('div');
    meta.className = 'bubble-meta';
    meta.innerHTML = `
      <span class="bubble-time">${escapeHtml(msg.time)}</span>
      ${getReceiptHtml(msg.receipt, msg.type)}
    `;

    bubble.appendChild(meta);
    wrap.appendChild(bubble);
    dom.chatMessages.appendChild(wrap);
  });

  // Scroll to bottom
  dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

/** Render messages list in the left panel */
function renderMessagesList() {
  dom.msgList.innerHTML = '';

  if (state.messages.length === 0) {
    dom.msgList.appendChild(dom.emptyHint);
    return;
  }

  state.messages.forEach((msg, idx) => {
    const item = document.createElement('div');
    item.className = 'msg-list-item';
    item.draggable = true;
    item.dataset.idx = idx;

    item.innerHTML = `
      <span class="msg-drag-handle" title="Drag to reorder">⠿</span>
      <span class="msg-type-badge ${msg.type === 'received' ? 'recv' : ''}">
        ${msg.type === 'sent' ? 'S' : 'R'}
      </span>
      <span class="msg-list-text" title="${escapeHtml(msg.text)}">${escapeHtml(msg.text)}</span>
      <div class="msg-list-actions">
        <button class="msg-action-btn" data-action="edit" data-id="${msg.id}" title="Edit">✏️</button>
        <button class="msg-action-btn delete" data-action="delete" data-id="${msg.id}" title="Delete">🗑️</button>
      </div>
    `;

    // Drag events
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragover',  onDragOver);
    item.addEventListener('dragleave', onDragLeave);
    item.addEventListener('drop',      onDrop);
    item.addEventListener('dragend',   onDragEnd);

    dom.msgList.appendChild(item);
  });
}

/** Update phone header from state */
function updatePhoneHeader() {
  dom.headerName.textContent = state.contactName || 'Contact';
  dom.headerStatus.textContent = state.contactStatus || '';
  dom.onlineDot.classList.toggle('visible', state.contactStatus.toLowerCase() === 'online');
}

/** Apply phone background */
function applyBackground() {
  dom.chatMessages.style.background = state.bg;
  dom.phoneFrame.style.setProperty('--phone-bg', state.bg);
}

/** Apply bubble colors */
function applyBubbleColors() {
  document.documentElement.style.setProperty('--bubble-sent', state.sentColor);
  document.documentElement.style.setProperty('--bubble-recv', state.recvColor);
}

/** Apply chat style to phone frame */
function applyChatStyle() {
  dom.phoneFrame.dataset.chatStyle = state.chatStyle;
}

/** Update battery bar */
function updateBattery() {
  const level = Math.max(0, Math.min(100, parseInt(dom.batteryLevel.value) || 87));
  dom.batteryBar.style.width = level + '%';
  dom.batteryBar.style.background = level > 20 ? '#4caf50' : '#f44336';
}

/* ─────────────────────────────────────────────────────────────
   9. ADDING MESSAGES
───────────────────────────────────────────────────────────── */
function addMessage() {
  const text = dom.msgInput.value.trim();
  if (!text) {
    showToast('Please type a message first 💬', 'error');
    dom.msgInput.focus();
    return;
  }

  const msg = {
    id:      state.nextId++,
    type:    state.messageType,
    text,
    time:    dom.msgTime.value || getCurrentTime(),
    receipt: dom.msgReceipt.value,
  };

  state.messages.push(msg);
  dom.msgInput.value = '';
  dom.msgInput.focus();

  renderMessages();
  renderMessagesList();
  showToast(`Message added ✓`);
}

/* ─────────────────────────────────────────────────────────────
   10. EDIT MESSAGE
───────────────────────────────────────────────────────────── */
function openEditModal(id) {
  const msg = state.messages.find(m => m.id === id);
  if (!msg) return;

  state.editingId = id;
  dom.editTextarea.value = msg.text;
  dom.editTime.value = msg.time;
  dom.editReceipt.value = msg.receipt;
  dom.modalEdit.hidden = false;
  dom.editTextarea.focus();
}

function saveEditMessage() {
  const msg = state.messages.find(m => m.id === state.editingId);
  if (!msg) return;

  const newText = dom.editTextarea.value.trim();
  if (!newText) { showToast('Message cannot be empty', 'error'); return; }

  msg.text    = newText;
  msg.time    = dom.editTime.value || msg.time;
  msg.receipt = dom.editReceipt.value;

  closeEditModal();
  renderMessages();
  renderMessagesList();
  showToast('Message updated ✓');
}

function closeEditModal() {
  dom.modalEdit.hidden = true;
  state.editingId = null;
}

/* ─────────────────────────────────────────────────────────────
   11. DELETE MESSAGE
───────────────────────────────────────────────────────────── */
function deleteMessage(id) {
  state.messages = state.messages.filter(m => m.id !== id);
  renderMessages();
  renderMessagesList();
  showToast('Message deleted');
}

/* ─────────────────────────────────────────────────────────────
   12. CLEAR ALL
───────────────────────────────────────────────────────────── */
function clearAllMessages() {
  if (state.messages.length === 0) return;
  if (!confirm('Clear all messages? This cannot be undone.')) return;
  state.messages = [];
  renderMessages();
  renderMessagesList();
  showToast('All messages cleared');
}

/* ─────────────────────────────────────────────────────────────
   13. DRAG AND DROP REORDER
───────────────────────────────────────────────────────────── */
function onDragStart(e) {
  state.dragSrcIdx = parseInt(e.currentTarget.dataset.idx);
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const destIdx = parseInt(e.currentTarget.dataset.idx);
  if (state.dragSrcIdx === null || state.dragSrcIdx === destIdx) return;

  // Reorder messages array
  const [moved] = state.messages.splice(state.dragSrcIdx, 1);
  state.messages.splice(destIdx, 0, moved);

  renderMessages();
  renderMessagesList();
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  state.dragSrcIdx = null;
  // Remove any leftover drag-over classes
  document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
}

/* ─────────────────────────────────────────────────────────────
   14. AVATAR UPLOAD
───────────────────────────────────────────────────────────── */
function handleAvatarUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = e.target.result;
    state.contactAvatar = src;

    // Panel avatar
    dom.avatarPreview.src = src;
    dom.avatarPreview.classList.add('visible');
    dom.avatarPlaceholder.style.display = 'none';

    // Header avatar
    dom.headerAvatar.src = src;
    dom.headerAvatar.classList.add('visible');
    dom.headerAvatarPh.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

/* ─────────────────────────────────────────────────────────────
   15. EMOJI PICKER
───────────────────────────────────────────────────────────── */
function buildEmojiPicker() {
  EMOJIS.forEach(emoji => {
    const span = document.createElement('span');
    span.className = 'emoji-item';
    span.textContent = emoji;
    span.title = emoji;
    span.addEventListener('click', () => {
      const ta = dom.msgInput;
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      ta.value = ta.value.slice(0, start) + emoji + ta.value.slice(end);
      ta.selectionStart = ta.selectionEnd = start + emoji.length;
      ta.focus();
    });
    dom.emojiGrid.appendChild(span);
  });
}

function toggleEmojiPicker() {
  dom.emojiPicker.hidden = !dom.emojiPicker.hidden;
}

/* ─────────────────────────────────────────────────────────────
   16. BACKGROUND SWATCHES
───────────────────────────────────────────────────────────── */
function buildBgSwatches() {
  BG_SWATCHES.forEach(color => {
    const sw = document.createElement('div');
    sw.className = 'bg-swatch';
    if (color === state.bg) sw.classList.add('active');
    sw.style.background = color;
    sw.title = color;
    sw.addEventListener('click', () => {
      state.bg = color;
      dom.bgCustomColor.value = color;
      document.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
      applyBackground();
    });
    dom.bgSwatches.appendChild(sw);
  });
}

/* ─────────────────────────────────────────────────────────────
   17. TEMPLATES
───────────────────────────────────────────────────────────── */
function buildTemplates() {
  TEMPLATES.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `
      <div class="template-card-emoji">${tpl.emoji}</div>
      <div class="template-card-name">${escapeHtml(tpl.name)}</div>
      <div class="template-card-desc">${escapeHtml(tpl.desc)}</div>
    `;
    card.addEventListener('click', () => loadTemplate(tpl));
    dom.templateGrid.appendChild(card);
  });
}

function loadTemplate(tpl) {
  if (state.messages.length > 0) {
    if (!confirm(`Load "${tpl.name}" template? Current messages will be replaced.`)) return;
  }
  state.messages = tpl.messages.map((m, i) => ({ ...m, id: state.nextId++ }));
  dom.contactName.value = tpl.contactName;
  dom.contactStatus.value = tpl.contactStatus;
  state.contactName = tpl.contactName;
  state.contactStatus = tpl.contactStatus;

  updatePhoneHeader();
  renderMessages();
  renderMessagesList();
  // Switch to compose tab
  switchTab('compose');
  showToast(`Template "${tpl.name}" loaded! ✓`);
}

/* ─────────────────────────────────────────────────────────────
   18. LOCAL STORAGE — SAVE / LOAD
───────────────────────────────────────────────────────────── */
const LS_KEY = 'fakechat_saves';

function getSavedChats() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch { return []; }
}

function saveCurrentChat() {
  const name = prompt('Enter a name for this chat save:', state.contactName || 'My Chat');
  if (name === null) return; // user cancelled
  if (!name.trim()) { showToast('Please enter a name', 'error'); return; }

  const saves = getSavedChats();
  const save = {
    id: Date.now(),
    name: name.trim(),
    date: new Date().toLocaleDateString(),
    messages: state.messages,
    nextId: state.nextId,
    contactName: state.contactName,
    contactStatus: state.contactStatus,
    contactAvatar: state.contactAvatar,
    myName: state.myName,
    bg: state.bg,
    sentColor: state.sentColor,
    recvColor: state.recvColor,
    chatStyle: state.chatStyle,
    batteryLevel: state.batteryLevel,
  };
  saves.unshift(save); // newest first
  // Keep at most 20 saves
  if (saves.length > 20) saves.length = 20;
  localStorage.setItem(LS_KEY, JSON.stringify(saves));
  showToast(`Chat saved as "${save.name}" 💾`);
}

function openLoadModal() {
  renderSavedChatsList();
  dom.modalLoad.hidden = false;
}

function renderSavedChatsList() {
  dom.savedChatsList.innerHTML = '';
  const saves = getSavedChats();

  if (saves.length === 0) {
    dom.savedChatsList.innerHTML = '<p class="empty-saved">No saved chats found.</p>';
    return;
  }

  saves.forEach(save => {
    const item = document.createElement('div');
    item.className = 'saved-chat-item';
    item.innerHTML = `
      <div>
        <div class="saved-chat-name">${escapeHtml(save.name)}</div>
        <div class="saved-chat-date">${escapeHtml(save.date)} · ${save.messages.length} messages</div>
      </div>
      <div class="saved-chat-actions">
        <button class="saved-action-btn" data-action="load" data-id="${save.id}">Load</button>
        <button class="saved-action-btn del" data-action="delete" data-id="${save.id}">✕</button>
      </div>
    `;
    dom.savedChatsList.appendChild(item);
  });
}

function loadSavedChat(id) {
  const saves = getSavedChats();
  const save = saves.find(s => s.id === id);
  if (!save) return;

  // Restore state
  state.messages     = save.messages || [];
  state.nextId       = save.nextId   || (state.messages.length + 1);
  state.contactName  = save.contactName  || 'Contact';
  state.contactStatus = save.contactStatus || '';
  state.contactAvatar = save.contactAvatar || '';
  state.myName       = save.myName       || 'You';
  state.bg           = save.bg           || '#e5ddd5';
  state.sentColor    = save.sentColor    || '#dcf8c6';
  state.recvColor    = save.recvColor    || '#ffffff';
  state.chatStyle    = save.chatStyle    || 'whatsapp';
  state.batteryLevel = save.batteryLevel || 87;

  // Update UI inputs
  dom.contactName.value   = state.contactName;
  dom.contactStatus.value = state.contactStatus;
  dom.myName.value        = state.myName;
  dom.bgCustomColor.value = state.bg;
  dom.sentColor.value     = state.sentColor;
  dom.recvColor.value     = state.recvColor;
  dom.batteryLevel.value  = state.batteryLevel;

  // Avatar
  if (state.contactAvatar) {
    dom.avatarPreview.src = state.contactAvatar;
    dom.avatarPreview.classList.add('visible');
    dom.avatarPlaceholder.style.display = 'none';
    dom.headerAvatar.src = state.contactAvatar;
    dom.headerAvatar.classList.add('visible');
    dom.headerAvatarPh.style.display = 'none';
  }

  // Style buttons
  document.querySelectorAll('.style-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.style === state.chatStyle);
  });

  applyBackground();
  applyBubbleColors();
  applyChatStyle();
  updatePhoneHeader();
  updateBattery();
  renderMessages();
  renderMessagesList();

  dom.modalLoad.hidden = true;
  showToast(`Chat "${save.name}" loaded! 📂`);
}

function deleteSavedChat(id) {
  let saves = getSavedChats();
  saves = saves.filter(s => s.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(saves));
  renderSavedChatsList();
  showToast('Saved chat deleted');
}

/* ─────────────────────────────────────────────────────────────
   19. EXPORT AS IMAGE
───────────────────────────────────────────────────────────── */
async function exportAsImage() {
  if (typeof html2canvas === 'undefined') {
    showToast('html2canvas not loaded. Check internet connection.', 'error');
    return;
  }

  showToast('Generating image… 📸');

  try {
    const canvas = await html2canvas(dom.phoneFrame, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });

    const link = document.createElement('a');
    link.download = `fakechat-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('Image downloaded! 🎉');
  } catch (err) {
    console.error('Export error:', err);
    showToast('Export failed. Try again.', 'error');
  }
}

/* ─────────────────────────────────────────────────────────────
   20. THEME TOGGLE
───────────────────────────────────────────────────────────── */
function toggleTheme() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  localStorage.setItem('fakechat_theme', html.dataset.theme);
}

function loadTheme() {
  const saved = localStorage.getItem('fakechat_theme');
  if (saved) document.documentElement.dataset.theme = saved;
}

/* ─────────────────────────────────────────────────────────────
   21. TABS
───────────────────────────────────────────────────────────── */
function switchTab(id) {
  dom.tabBtns.forEach(btn => {
    const active = btn.dataset.tab === id;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });
  dom.tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `tab-${id}`);
  });
}

/* ─────────────────────────────────────────────────────────────
   22. EVENT WIRING
───────────────────────────────────────────────────────────── */
function wireEvents() {

  /* — Theme ———————————————————————————————————————— */
  dom.btnTheme.addEventListener('click', toggleTheme);

  /* — Save / Load / Export ————————————————————————— */
  dom.btnSave.addEventListener('click', saveCurrentChat);
  dom.btnLoad.addEventListener('click', openLoadModal);
  dom.btnExport.addEventListener('click', exportAsImage);

  /* — Tabs ————————————————————————————————————————— */
  dom.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  /* — Avatar ——————————————————————————————————————— */
  dom.avatarUploader.addEventListener('click', () => dom.avatarInput.click());
  dom.avatarInput.addEventListener('change', (e) => handleAvatarUpload(e.target.files[0]));

  /* — Contact Info ————————————————————————————————— */
  dom.contactName.addEventListener('input', () => {
    state.contactName = dom.contactName.value;
    updatePhoneHeader();
  });
  dom.contactStatus.addEventListener('input', () => {
    state.contactStatus = dom.contactStatus.value;
    updatePhoneHeader();
  });

  /* — Message Type Toggle ——————————————————————————— */
  dom.btnReceived.addEventListener('click', () => {
    state.messageType = 'received';
    dom.btnReceived.classList.add('active');
    dom.btnSent.classList.remove('active');
  });
  dom.btnSent.addEventListener('click', () => {
    state.messageType = 'sent';
    dom.btnSent.classList.add('active');
    dom.btnReceived.classList.remove('active');
  });

  /* — Emoji ———————————————————————————————————————— */
  dom.emojiToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleEmojiPicker();
  });
  document.addEventListener('click', (e) => {
    if (!dom.emojiPicker.contains(e.target) && e.target !== dom.emojiToggle) {
      dom.emojiPicker.hidden = true;
    }
  });

  /* — Add Message ——————————————————————————————————— */
  dom.btnAddMsg.addEventListener('click', addMessage);
  dom.msgInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addMessage();
  });

  /* — Clear All ———————————————————————————————————— */
  dom.btnClearAll.addEventListener('click', clearAllMessages);

  /* — Message List Actions (delegation) ——————————— */
  dom.msgList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    if (btn.dataset.action === 'edit')   openEditModal(id);
    if (btn.dataset.action === 'delete') deleteMessage(id);
  });

  /* — Typing Indicator ———————————————————————————— */
  dom.showTyping.addEventListener('change', () => {
    state.showTyping = dom.showTyping.checked;
    dom.typingIndicator.hidden = !state.showTyping;
  });

  /* — Background ——————————————————————————————————— */
  dom.bgCustomColor.addEventListener('input', () => {
    state.bg = dom.bgCustomColor.value;
    // Remove active swatch
    document.querySelectorAll('.bg-swatch').forEach(s => s.classList.remove('active'));
    applyBackground();
  });

  /* — Bubble Colors ———————————————————————————————— */
  dom.sentColor.addEventListener('input', () => {
    state.sentColor = dom.sentColor.value;
    applyBubbleColors();
  });
  dom.recvColor.addEventListener('input', () => {
    state.recvColor = dom.recvColor.value;
    applyBubbleColors();
  });

  /* — Chat Style ——————————————————————————————————— */
  dom.styleOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      state.chatStyle = btn.dataset.style;
      dom.styleOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyChatStyle();
    });
  });

  /* — Status Time ——————————————————————————————————— */
  dom.statusTime.addEventListener('input', updateStatusBarTime);

  /* — Battery ——————————————————————————————————————— */
  dom.batteryLevel.addEventListener('input', updateBattery);

  /* — My Name ———————————————————————————————————————— */
  dom.myName.addEventListener('input', () => { state.myName = dom.myName.value; });

  /* — Edit Modal ——————————————————————————————————— */
  dom.modalEditClose.addEventListener('click', closeEditModal);
  dom.modalEditCancel.addEventListener('click', closeEditModal);
  dom.modalEditSave.addEventListener('click', saveEditMessage);
  dom.modalEdit.addEventListener('click', (e) => {
    if (e.target === dom.modalEdit) closeEditModal();
  });
  dom.editTextarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveEditMessage();
  });

  /* — Load Modal ——————————————————————————————————— */
  dom.modalLoadClose.addEventListener('click', () => { dom.modalLoad.hidden = true; });
  dom.modalLoad.addEventListener('click', (e) => {
    if (e.target === dom.modalLoad) dom.modalLoad.hidden = true;
  });
  dom.savedChatsList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    if (btn.dataset.action === 'load')   loadSavedChat(id);
    if (btn.dataset.action === 'delete') deleteSavedChat(id);
  });

  /* — Keyboard shortcuts ——————————————————————————— */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeEditModal();
      dom.modalLoad.hidden = true;
      dom.emojiPicker.hidden = true;
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   23. INIT
───────────────────────────────────────────────────────────── */
function init() {
  loadTheme();

  // Set default time in compose
  dom.msgTime.value = getCurrentTime();
  updateStatusBarTime();
  updateBattery();
  updatePhoneHeader();
  applyBackground();
  applyBubbleColors();
  applyChatStyle();

  // Build dynamic UI elements
  buildEmojiPicker();
  buildBgSwatches();
  buildTemplates();

  // Wire all events
  wireEvents();

  // Initial empty state render
  renderMessagesList();

  // Demo: load a small starter if no saves
  const saves = getSavedChats();
  if (saves.length === 0) {
    // Optionally pre-load the funny template silently
    // loadTemplate(TEMPLATES[0]);
  }

  console.log('%c🚀 FakeChat Studio loaded!', 'color: #00c896; font-size: 14px; font-weight: bold;');
}

// Run on DOM ready
document.addEventListener('DOMContentLoaded', init);
