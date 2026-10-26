// ===== 여기만 수정하면 청첩장 내용이 바뀝니다 =====
const CONFIG = {
  // 부모님 이름을 '' 로 비우면 해당 분은 혼주 표기·연락처에서 빠집니다
  groom: { name: '김종철', first: '종철', father: '김OO', mother: '박OO', tel: '010-0000-0000', fatherTel: '010-0000-0000', motherTel: '010-0000-0000' },
  bride: { name: '김민희', first: '민희', father: '', mother: '이현정', tel: '010-0000-0000', fatherTel: '', motherTel: '010-0000-0000' },
  date: '2027-03-27T11:30:00+09:00',
  venue: '반월정',
  mapKeyword: '대구 반월정',
  venueTel: '053-256-8282',
  address: '대구 중구 달구벌대로 2061-2 1층',
  lat: 35.866892, lng: 128.589342,
  heroTextColor: '#3f4f36', // 메인 사진 위 "Wedding Day" 글씨색 (하늘이 어두운 사진이면 '#fff')
  accounts: {
    groom: [
      { who: '신랑 김종철', bank: '은행명', num: '000-0000-0000-00' },
    ],
    bride: [
      { who: '신부 김민희', bank: '은행명', num: '000-0000-0000-00' },
      { who: '어머니 이현정', bank: '은행명', num: '000-0000-0000-00' },
    ],
  },
};

// ===== 사진 교체: photos/ 폴더에 아래 파일명으로 넣으면 자동으로 들어갑니다 =====
// 파일이 없으면 자리에 "사진명 · 권장비율" 안내가 표시됩니다. 자세한 내용은 photos/사진가이드.md
// images/ 로 시작하는 항목은 Gemini 로 만든 기본 디자인 이미지입니다 (원하면 photos/ 경로로 바꿔도 됩니다).
const PHOTOS = {
  main:        'photos/01-main.jpg',
  poem:        'photos/02-poem.jpg',
  invitation:  'photos/03-invitation.jpg',
  groomKid:    'photos/04-groom.jpg',
  brideKid:    'photos/05-bride.jpg',
  timeline1:   'images/timeline-cafe.jpg',
  timeline2:   'photos/06-timeline-1000days.jpg',
  timeline3:   'images/timeline-rings.jpg',
  timeline4:   'photos/07-timeline-wedding.jpg',
  interview:   'photos/08-interview.jpg',
  ending:      'photos/09-ending.jpg',
  gallery: [
    'photos/gallery-01.jpg',
    'photos/gallery-02.jpg',
    'photos/gallery-03.jpg',
    'photos/gallery-04.jpg',
    'photos/gallery-05.jpg',
    'photos/gallery-06.jpg',
  ],
  countdownBg: 'images/countdown-bg.jpg',
  info1:       'images/info-banquet.jpg',
  info2:       'images/info-photobooth.jpg',
  info3:       'images/info-bus.jpg',
};

// 사진이 없을 때 자리에 보여줄 안내 문구
const PHOTO_LABELS = {
  main: '01 메인 · 9:16', poem: '02 시 폴라로이드 · 1:1', invitation: '03 초대글 · 3:2 (흑백)',
  groomKid: '04 신랑 · 1:1', brideKid: '05 신부 · 1:1', timeline1: '타임라인 첫 만남 · 1:1',
  timeline2: '06 타임라인 1000일 · 1:1', timeline3: '타임라인 프로포즈 · 1:1', timeline4: '07 타임라인 웨딩 · 1:1',
  interview: '08 인터뷰 · 3:2', ending: '09 엔딩 · 4:5 (흑백)', countdownBg: '카운트다운 배경',
  info1: '피로연 · 2:1', info2: '포토부스 · 2:1', info3: '전세버스 · 2:1',
};
// =================================================

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const WD = ['일', '월', '화', '수', '목', '금', '토'];
const wedding = new Date(CONFIG.date);

// KST-based parts so the date reads correctly for guests in any timezone
const kst = new Date(wedding.getTime() + 9 * 3600e3);
const Y = kst.getUTCFullYear(), M = kst.getUTCMonth(), D = kst.getUTCDate();
const hh = kst.getUTCHours(), mm = kst.getUTCMinutes();
const timeText = `${hh < 12 ? '오전' : '오후'} ${hh % 12 || 12}시${mm ? ` ${mm}분` : ''}`;
const weekday = WD[new Date(Date.UTC(Y, M, D)).getUTCDay()];

const spaced = s => s.split('').join(' ');
const bind = {
  dateText: `${Y}년 ${M + 1}월 ${D}일 ${weekday}요일 ${timeText}`,
  shortDate: `${String(Y).slice(2)}년 ${M + 1}월 ${D}일`,
  venue: CONFIG.venue,
  address: CONFIG.address,
  groomName: CONFIG.groom.name,
  brideName: CONFIG.bride.name,
  groomFirst: CONFIG.groom.first,
  brideFirst: CONFIG.bride.first,
  groomSpaced: spaced(CONFIG.groom.name),
  brideSpaced: spaced(CONFIG.bride.name),
  groomParents: [CONFIG.groom.father, CONFIG.groom.mother].filter(Boolean).join(' · '),
  brideParents: [CONFIG.bride.father, CONFIG.bride.mother].filter(Boolean).join(' · '),
};
document.documentElement.style.setProperty('--hero-text', CONFIG.heroTextColor);
$$('[data-bind]').forEach(el => { el.textContent = bind[el.dataset.bind] ?? ''; });
$$('[data-bind-href="venueTel"]').forEach(el => { el.href = `tel:${CONFIG.venueTel}`; });

// Placeholder (with slot label) stays visible until the photo file exists
function setPhoto(img, src, label) {
  img.parentElement.dataset.label = label;
  img.addEventListener('error', () => img.classList.add('missing'));
  img.addEventListener('load', () => img.classList.remove('missing'));
  if (src) img.src = src; else img.classList.add('missing');
}
$$('img[data-photo]').forEach(img => {
  const key = img.dataset.photo;
  setPhoto(img, PHOTOS[key], PHOTO_LABELS[key] || key);
});

// ---------- Intro ----------
let introDone = false;
function endIntro() {
  if (introDone) return;
  introDone = true;
  $('#intro').classList.add('hide');
  setTimeout(maybeShowNotice, 900);
}
setTimeout(endIntro, 3600);
$('#intro').addEventListener('click', endIntro);

// ---------- Petals ----------
const petalBox = $('#petals');
for (let i = 0; i < 9; i++) {
  const p = document.createElement('span');
  p.className = 'petal';
  p.textContent = '✿';
  p.style.left = `${Math.random() * 100}%`;
  p.style.fontSize = `${12 + Math.random() * 12}px`;
  p.style.setProperty('--dx', `${(Math.random() - .5) * 160}px`);
  p.style.animationDuration = `${9 + Math.random() * 8}s`;
  p.style.animationDelay = `${-Math.random() * 15}s`;
  petalBox.appendChild(p);
}

// ---------- BGM ----------
const bgm = $('#bgm'), bgmBtn = $('#bgmBtn');
bgmBtn.classList.add('off');
bgmBtn.addEventListener('click', () => {
  if (bgm.paused) {
    bgm.play().then(() => bgmBtn.classList.remove('off')).catch(() => toast('bgm.mp3 파일을 추가하면 음악이 재생됩니다'));
  } else {
    bgm.pause();
    bgmBtn.classList.add('off');
  }
});

// ---------- Modals ----------
function openModal(id) {
  $$('.modal.open').forEach(m => m.classList.remove('open'));
  $(`#${id}`).classList.add('open');
  document.body.classList.add('lock');
}
function closeModal(el) {
  el.classList.remove('open');
  if (!$('.modal.open, .lightbox.open')) document.body.classList.remove('lock');
}
$$('[data-open]').forEach(b => b.addEventListener('click', () => openModal(b.dataset.open)));
$$('.modal, .lightbox').forEach(m => {
  m.addEventListener('click', e => {
    if (e.target === m || e.target.closest('[data-close]')) closeModal(m);
  });
});

const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

function maybeShowNotice() {
  if (store.get('skipNotice') === new Date().toDateString()) return;
  openModal('noticeModal');
}
$('#skipToday').addEventListener('change', e => {
  if (e.target.checked) {
    store.set('skipNotice', new Date().toDateString());
    closeModal($('#noticeModal'));
  }
});

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('show'), 2000);
}

// ---------- Contact ----------
const telRow = (label, name, tel) => `
  <div class="contact-row"><span>${label} <b>${name}</b></span>
    <div><a href="tel:${tel}">전화</a><a href="sms:${tel}">문자</a></div></div>`;
$('#contactList').innerHTML = ['groom', 'bride'].map(side => {
  const p = CONFIG[side], isG = side === 'groom';
  return `<div class="contact-grp"><h5>${isG ? '신랑측' : '신부측'}</h5>
    ${telRow(isG ? '신랑' : '신부', p.name, p.tel)}
    ${p.father ? telRow(`${isG ? '신랑' : '신부'} 아버지`, p.father, p.fatherTel) : ''}
    ${p.mother ? telRow(`${isG ? '신랑' : '신부'} 어머니`, p.mother, p.motherTel) : ''}</div>`;
}).join('');

// ---------- Calendar ----------
(function renderCalendar() {
  const first = new Date(Date.UTC(Y, M, 1)).getUTCDay();
  const days = new Date(Date.UTC(Y, M + 1, 0)).getUTCDate();
  let html = '<tr>';
  for (let i = 0; i < first; i++) html += '<td></td>';
  for (let d = 1; d <= days; d++) {
    const col = (first + d - 1) % 7;
    const cls = [d === D ? 'day-on' : '', col === 0 ? 'sun' : ''].join(' ').trim();
    html += `<td class="${cls}"><span>${d}</span></td>`;
    if (col === 6 && d !== days) html += '</tr><tr>';
  }
  $('#calBody').innerHTML = html + '</tr>';
})();

// ---------- Countdown ----------
const pad = n => String(n).padStart(2, '0');
function tick() {
  const diff = wedding - Date.now();
  const left = Math.max(0, diff);
  $('#cdD').textContent = Math.floor(left / 864e5);
  $('#cdH').textContent = pad(Math.floor(left / 36e5) % 24);
  $('#cdM').textContent = pad(Math.floor(left / 6e4) % 60);
  $('#cdS').textContent = pad(Math.floor(left / 1e3) % 60);
  const days = Math.floor(left / 864e5);
  $('#cdText').innerHTML = diff > 0
    ? `${CONFIG.groom.first} <em>♥</em> ${CONFIG.bride.first}의 결혼식이 <b>${days}일</b> 남았습니다.`
    : `${CONFIG.groom.first} <em>♥</em> ${CONFIG.bride.first} 님이 행복한 결혼식을 마치셨습니다.`;
}
tick();
setInterval(tick, 1000);

// ---------- Gallery ----------
const track = $('#galTrack');
track.innerHTML = PHOTOS.gallery.map(() =>
  `<div class="img-ph gal-item"><img alt="" loading="lazy"></div>`).join('');
$$('img', track).forEach((img, i) =>
  setPhoto(img, PHOTOS.gallery[i], `갤러리 ${String(i + 1).padStart(2, '0')} · 1:1.1`));
track.addEventListener('scroll', () => {
  const max = track.scrollWidth - track.clientWidth;
  $('#galProg').style.left = `${max ? (track.scrollLeft / max) * 84 : 0}%`;
}, { passive: true });
track.addEventListener('click', e => {
  const img = e.target.closest('.gal-item')?.querySelector('img');
  if (!img || img.classList.contains('missing')) return;
  $('#lbImg').src = img.src;
  $('#lightbox').classList.add('open');
  document.body.classList.add('lock');
});

// ---------- Map / navigation ----------
const { lat, lng } = CONFIG;
$('#mapFrame').src = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - .004}%2C${lat - .0025}%2C${lng + .004}%2C${lat + .0025}&layer=mapnik&marker=${lat}%2C${lng}`;
const q = encodeURIComponent(CONFIG.mapKeyword || CONFIG.venue);
$('#navNaver').href = `https://map.naver.com/p/search/${q}`;
$('#navKakao').href = `https://map.kakao.com/link/to/${q},${lat},${lng}`;
$('#navTmap').href = `https://apis.openapi.sk.com/tmap/app/routes?appKey=&name=${q}&lon=${lng}&lat=${lat}`;

// ---------- Info tabs ----------
$$('.tabs button').forEach(btn => btn.addEventListener('click', () => {
  $$('.tabs button').forEach(b => b.classList.toggle('on', b === btn));
  $$('.tab-panel').forEach((p, i) => p.classList.toggle('on', i === +btn.dataset.tab));
}));

// ---------- RSVP (saved in this browser only; connect a backend to collect) ----------
$('#rsvpForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  store.set('rsvp', [...store.get('rsvp', []), { ...data, at: Date.now() }]);
  closeModal($('#rsvpModal'));
  toast('참석 여부가 전달되었습니다. 감사합니다!');
  e.target.reset();
});

// ---------- Guestbook (saved in this browser only) ----------
const seed = [
  { name: '김지은', msg: '두 분의 결혼을 진심으로 축하드립니다! 언제나 행복 가득한 가정 이루시길 바라요 💐', at: Date.now() - 864e5 * 3 },
  { name: '장영수', msg: '정말 축하해요! 늘 웃음 가득한 가정 되세요 🎉', at: Date.now() - 864e5 * 2 },
  { name: '박소연', msg: '서로 아껴주고 사랑하며 행복하게 지내길 바래요. 앞날에 많은 축복이 함께하길! 🌹', at: Date.now() - 864e5 },
];
let gbShown = 3;
const fmt = t => {
  const d = new Date(t);
  return `${String(d.getFullYear()).slice(2)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function renderGb() {
  const mine = store.get('guestbook', []);
  const all = [...mine.map((x, i) => ({ ...x, mine: i })), ...seed].sort((a, b) => b.at - a.at);
  $('#gbList').innerHTML = all.slice(0, gbShown).map(x => `
    <div class="gb-item">${x.mine !== undefined ? `<button class="del" data-del="${x.mine}">×</button>` : ''}
      <b>${esc(x.name)}</b><p>${esc(x.msg)}</p><small>${fmt(x.at)}</small></div>`).join('');
  $('#gbMore').style.display = all.length > gbShown ? '' : 'none';
}
$('#gbList').addEventListener('click', e => {
  const i = e.target.dataset.del;
  if (i === undefined) return;
  const mine = store.get('guestbook', []);
  mine.splice(+i, 1);
  store.set('guestbook', mine);
  renderGb();
});
$('#gbMore').addEventListener('click', () => { gbShown += 3; renderGb(); });
$('#gbForm').addEventListener('submit', e => {
  e.preventDefault();
  const { name, msg } = Object.fromEntries(new FormData(e.target));
  store.set('guestbook', [...store.get('guestbook', []), { name, msg, at: Date.now() }]);
  e.target.reset();
  closeModal($('#gbModal'));
  renderGb();
  toast('방명록이 등록되었습니다');
});
renderGb();

// ---------- Accounts ----------
$('#accounts').innerHTML = ['groom', 'bride'].map(side => `
  <details class="acc-box"><summary>${side === 'groom' ? '신랑' : '신부'} 측 계좌번호</summary>
    ${CONFIG.accounts[side].map(a => `
      <div class="acc-row"><div><small>${a.who}</small>${a.bank} ${a.num}</div>
        <button data-copy="${a.bank} ${a.num}">복사</button></div>`).join('')}
  </details>`).join('');

async function copy(text, msg) {
  try { await navigator.clipboard.writeText(text); } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  toast(msg);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]');
  if (b) copy(b.dataset.copy, '계좌번호가 복사되었습니다');
});

// ---------- Share ----------
$('#copyBtn').addEventListener('click', () => copy(location.href, '링크가 복사되었습니다'));
$('#shareBtn').addEventListener('click', async () => {
  const data = { title: `${CONFIG.groom.first} ♥ ${CONFIG.bride.first} 결혼합니다`, text: bind.dateText, url: location.href };
  if (navigator.share) { try { await navigator.share(data); } catch {} }
  else copy(location.href, '링크가 복사되었습니다');
});

// ---------- Scroll fade-in ----------
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
}), { threshold: .15 });
$$('.fade').forEach(el => io.observe(el));
