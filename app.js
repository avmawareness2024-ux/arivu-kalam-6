/* ============================================================
   அறிவுக் களம் 6 — Arivu Kalam 6
   Main Application Script  v1.1  (bug-fixed, enhanced)
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & CONFIG
───────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'arivu_kalam_v2';

const SUBJECTS = [
  { id:'tamil',          name:'தமிழ்',           nameEn:'Tamil',          icon:'📝', color:'#F47C1C', accent:'#fff1e8', shadow:'#b85b00', term:'பருவம் 1' },
  { id:'english',        name:'ஆங்கிலம்',        nameEn:'English',        icon:'🔤', color:'#1B56D3', accent:'#dbe1ff', shadow:'#0F3E9E', term:'Term 1'   },
  { id:'mathematics',    name:'கணிதம்',           nameEn:'Mathematics',    icon:'📐', color:'#0D9658', accent:'#e6f8f0', shadow:'#0A6D3F', term:'பருவம் 1' },
  { id:'science',        name:'அறிவியல்',         nameEn:'Science',        icon:'🔬', color:'#4A6CF7', accent:'#eef0ff', shadow:'#2940c7', term:'பருவம் 1' },
  { id:'social-science', name:'சமூக அறிவியல்',   nameEn:'Social Science', icon:'🌍', color:'#7C3AED', accent:'#f3e8ff', shadow:'#5b21b6', term:'வரலாறு'   }
];

const ALL_BADGES = [
  { id:'first_quiz',    icon:'🌟', name:'முதல் வினாடி வினா',   cond: p => (p.totalQuestions||0) >= 1          },
  { id:'ten_correct',   icon:'🏆', name:'10 சரியான விடை',      cond: p => (p.correctAnswers||0) >= 10         },
  { id:'hundred_points',icon:'💯', name:'100 புள்ளிகள்',       cond: p => (p.points||0) >= 100                },
  { id:'five_lessons',  icon:'📚', name:'5 பாடங்கள்',          cond: p => (p.lessonsCompleted||[]).length >= 5},
  { id:'streak_3',      icon:'🔥', name:'3 நாள் தொடர்ச்சி',   cond: p => (p.streak||0) >= 3                  },
  { id:'all_subjects',  icon:'🎓', name:'அனைத்து பாடங்கள்',   cond: p => SUBJECTS.every(s=>(p.quizResults||{})[s.id]?.total > 0) },
];

const TUTOR_KB = {
  science: {
    greet:'வணக்கம்! 🦉 அறிவியல் பற்றி என்ன கேட்கிறீர்கள்? ஒளிச்சேர்க்கை, உயிரினங்கள், அளவீடுகள் எதுவும் கேளுங்கள்!',
    kw:{
      'ஒளிச்சேர்க்கை':'ஒளிச்சேர்க்கை (Photosynthesis): சூரிய ஒளி + நீர் + CO₂ → உணவு + O₂. பச்சையம் (Chlorophyll) அவசியம்! 🌿',
      'photosynthesis':'Photosynthesis: Sunlight + Water + CO₂ → Food + Oxygen. Chlorophyll absorbs light.',
      'உயிர்':'உயிருள்ளவை: வளர்ச்சி, சுவாசம், இனப்பெருக்கம், உணவு, அசைவு. மரம், விலங்கு எல்லாம் உயிருள்ளவை! 🐾🌱',
      'விலங்கு':'விலங்கு வகைகள்: பாலூட்டி (நாய்,திமிங்கலம்), பறவை (கோழி), ஊர்வன (பாம்பு), நீர்வாழ்வன (தவளை), மீன்.',
      'அளவீடு':'நீளம்=மீட்டர்(m), நிறை=கிலோகிராம்(kg), காலம்=வினாடி(s). 1km=1000m, 1kg=1000g.',
      'திமிங்கலம்':'திமிங்கலம் கடலில் வாழ்ந்தாலும் பாலூட்டி! ஏன்? தாயின் பால் குடிக்கும்.',
    }
  },
  mathematics: {
    greet:'வணக்கம்! 📐 கணிதம் பற்றி என்ன கேள்வி? பின்னங்கள், கோணங்கள், எண்கள் எதுவும் கேளுங்கள்!',
    kw:{
      'பின்னம்':'பின்னம் (Fraction): தகு பின்னம் (3/4 — தொகுதி < பகுதி), தகா பின்னம் (7/4 — தொகுதி > பகுதி), கலப்பு (1¾). 🍕',
      'fraction':'Proper fraction: numerator < denominator (3/4). Improper: numerator ≥ denominator (7/4). Mixed: 1¾.',
      'கோணம்':'கோணங்கள்: கூர்க்கோணம் (<90°), செங்கோணம் (90°), விரிகோணம் (90–180°), நேர்கோணம் (180°).',
      'angle':'Acute (<90°), Right (90°), Obtuse (90–180°), Straight (180°).',
      'இலட்சம்':'1 இலட்சம் = 1,00,000. 1 கோடி = 1,00,00,000 = 100 இலட்சம்.',
      'lcm':'LCM = Least Common Multiple. Example: LCM(2,3) = 6.',
    }
  },
  tamil: {
    greet:'வணக்கம்! 📝 தமிழ் பற்றி என்ன கேட்கிறீர்கள்? எழுத்துக்கள், சொற்கள், இலக்கணம் கேளுங்கள்!',
    kw:{
      'உயிர்':'உயிர் எழுத்துக்கள் 12: அ ஆ இ ஈ உ ஊ எ ஏ ஐ ஒ ஓ ஔ. குறில்=5, நெடில்=7.',
      'மெய்':'மெய் எழுத்துக்கள் 18. வல்லினம் 6, மெல்லினம் 6, இடையினம் 6.',
      'பெயர்ச்சொல்':'பெயர்ச்சொல் = பொருளின் பெயர். வகைகள்: பொருட்பெயர், இடப்பெயர், காலப்பெயர்.',
      'வினைச்சொல்':'வினைச்சொல் = செயலைக் குறிக்கும். வினை முற்று vs வினையெச்சம்.',
      'மாத்திரை':'குறில்=1 மாத்திரை, நெடில்=2 மாத்திரை, மெய்=½ மாத்திரை.',
    }
  },
  english: {
    greet:'Hello! 🔤 What would you like to learn? Nouns, verbs, tenses, vocabulary — ask anything!',
    kw:{
      'noun':'Noun (பெயர்ச்சொல்) = name of person/place/thing. Common (boy), Proper (Chennai), Collective (flock).',
      'verb':'Verb (வினைச்சொல்) = action word. run, eat, read. Helping: is/am/are.',
      'tense':'Present: I play / He plays. Past: played. Future: will play.',
      'adjective':'Adjective = describing word. big, small, beautiful, red.',
    }
  },
  'social-science': {
    greet:'வணக்கம்! 🌍 வரலாறு, புவியியல், குடிமையியல் — எதை படிக்கிறீர்கள்?',
    kw:{
      'சிந்துவெளி':'சிந்துவெளி நாகரிகம்: கி.மு. 2500–1750. நகரங்கள்: மொகஞ்சதாரோ, ஹரப்பா, லோத்தால். திட்டமிட்ட நகரம்!',
      'harappa':'Harappa — Indus Valley Civilisation (2500–1750 BCE). Planned city, granary, drainage.',
      'ஜனநாயகம்':'ஜனநாயகம் = மக்கள் ஆட்சி. 3 பிரிவுகள்: சட்டமன்றம், நிர்வாகம், நீதித்துறை. வாக்குரிமை = 18 வயது.',
      'வேதம்':'4 வேதங்கள்: ரிக்வேதம் (மிக பழமையானது), சாமவேதம், யஜுர்வேதம், அதர்வவேதம்.',
      'புவியியல்':'பூமி அடுக்குகள்: புறணி, மேற்தளம், வெளிமையம், உட்மையம். சுய சுழற்சி = 24 மணி.',
    }
  }
};

/* ─────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────── */
const STATE = {
  screen: 'home',
  subject: null,
  chapter: null,
  quiz: {
    questions:[], current:0, score:0,
    answered:false, answeredIds: new Set(),
    subjectId:'', chapterId:'', mode:'chapter'
  },
  tutor: { subject:'science', history:[] }
};

/* ─────────────────────────────────────────────────────────────
   PROGRESS (localStorage)
───────────────────────────────────────────────────────────── */
function defaultProgress() {
  return {
    points:0, streak:0, lastDate:null,
    lessonsCompleted:[], quizResults:{}, badges:[],
    customQuestions:[], totalQuestions:0, correctAnswers:0,
    timeSpent:0, teacherPin:'1234',
    settings:{ sound:true, tts:true, dark:false, fontSize:16 }
  };
}

let progress = (()=>{
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      // fill missing fields
      return Object.assign(defaultProgress(), p);
    }
  } catch(e) {}
  return defaultProgress();
})();

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch(e) {}
}

/* ─────────────────────────────────────────────────────────────
   DATA LOADING
───────────────────────────────────────────────────────────── */
const _cache = {};
async function loadData(id) {
  if (_cache[id]) return _cache[id];
  try {
    const r = await fetch(`data/${id}.json`);
    if (!r.ok) throw new Error(r.status);
    _cache[id] = await r.json();
    return _cache[id];
  } catch(e) {
    console.error('loadData failed:', id, e);
    return null;
  }
}

/* ─────────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────────── */
function cap(s) {
  return s.charAt(0).toUpperCase() +
         s.slice(1).replace(/-([a-z])/g, (_,c)=>c.toUpperCase());
}

function nav(screen) {
  document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active'));
  const el = document.getElementById('screen' + cap(screen));
  if (el) el.classList.add('active');
  STATE.screen = screen;

  // bottom nav highlight
  const MAP = {home:0, subjects:1, tutor:2, progress:3, parent:4};
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if (MAP[screen] !== undefined)
    document.querySelectorAll('.nav-item')[MAP[screen]]?.classList.add('active');

  window.scrollTo(0,0);

  // screen inits
  if (screen==='home')     renderHome();
  if (screen==='subjects') renderSubjectsFull();
  if (screen==='progress') renderProgress();
  if (screen==='tutor')    initTutor();
  if (screen==='parent')   initParent();
}

// Expose globally so onclick="navigateTo(...)" in HTML still works
window.navigateTo = nav;

/* ─────────────────────────────────────────────────────────────
   STREAK / DATE
───────────────────────────────────────────────────────────── */
function updateStreak() {
  const today = new Date().toDateString();
  if (progress.lastDate === today) return;
  const yest = new Date(Date.now()-86400000).toDateString();
  if (progress.lastDate === yest) progress.streak = (progress.streak||0) + 1;
  else if (progress.lastDate && progress.lastDate !== today) progress.streak = 0;
  progress.lastDate = today;
  save();
}

/* ─────────────────────────────────────────────────────────────
   TOP BAR
───────────────────────────────────────────────────────────── */
function refreshTopBar() {
  document.getElementById('topStreak').textContent = progress.streak||0;
  document.getElementById('topPoints').textContent  = progress.points||0;
}

/* ─────────────────────────────────────────────────────────────
   HOME
───────────────────────────────────────────────────────────── */
function renderHome() {
  updateStreak();
  refreshTopBar();
  document.getElementById('homeStreak').textContent  = progress.streak||0;
  document.getElementById('homePoints').textContent   = progress.points||0;
  document.getElementById('homeLessons').textContent  = (progress.lessonsCompleted||[]).length;
  document.getElementById('homeBadges').textContent   = (progress.badges||[]).length;

  const weak = weakSubject();
  if (weak) document.getElementById('revisionTopic').textContent = weak.name+': மீண்டும் பயிற்சி செய்';

  buildSubjectCards('subjectCards');
}

function weakSubject() {
  let worst=null, worstPct=101;
  for (const s of SUBJECTS) {
    const r = (progress.quizResults||{})[s.id];
    if (r && r.total>0) {
      const p = (r.correct/r.total)*100;
      if (p<worstPct) { worstPct=p; worst=s; }
    }
  }
  return worst;
}

/* ─────────────────────────────────────────────────────────────
   SUBJECT CARDS
───────────────────────────────────────────────────────────── */
function buildSubjectCards(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = '';
  SUBJECTS.forEach(sub => {
    const r   = (progress.quizResults||{})[sub.id] || {correct:0, total:0};
    const pct = r.total>0 ? Math.round((r.correct/r.total)*100) : 0;
    const done = (progress.lessonsCompleted||[]).filter(l=>l.startsWith(sub.id+'-')).length;
    const badge = r.total===0 ? '▶ தொடர்வோம்' :
                  pct>=80    ? '⭐ வெற்றி'      :
                  pct>=60    ? '✅ முடிந்தது'   : '🔄 மீண்டும் பயிற்சி';

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-label', sub.name+' திறக்க');
    card.onclick = () => openSubject(sub.id);
    card.onkeydown = e => { if(e.key==='Enter'||e.key===' ') openSubject(sub.id); };

    card.innerHTML = `
      <div class="subject-card-accent" style="background:${sub.color}"></div>
      <div class="subject-card-body">
        <div class="subject-card-top">
          <div class="subject-card-info">
            <div class="subject-icon" style="background:${sub.accent};color:${sub.color}">${sub.icon}</div>
            <div>
              <div class="subject-name">${sub.name}</div>
              <div class="subject-name-en">${sub.nameEn}</div>
            </div>
          </div>
          <div class="subject-meta">
            <span class="term-badge" style="background:${sub.color}">${sub.term}</span>
            <span class="subject-progress-pct" style="color:${sub.color}">${pct}%</span>
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${pct}%;background:${sub.color}"></div>
        </div>
        <div class="subject-footer">
          <span>${done}/3 அலகுகள் முடிந்தது</span>
          <span style="color:${sub.color};font-weight:600">${badge}</span>
        </div>
      </div>`;
    wrap.appendChild(card);
  });
}

function renderSubjectsFull() { buildSubjectCards('subjectCardsFull'); }

/* ─────────────────────────────────────────────────────────────
   CHAPTERS
───────────────────────────────────────────────────────────── */
async function openSubject(id) {
  STATE.subject = id;
  nav('chapters');
  const sub = SUBJECTS.find(s=>s.id===id);
  document.getElementById('chapterScreenTitle').textContent = sub ? `${sub.icon} ${sub.name}` : 'அலகுகள்';

  const wrap = document.getElementById('chapterList');
  wrap.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--neutral-light)">⏳ ஏற்றுகிறது...</div>';

  const data = await loadData(id);
  if (!data) {
    wrap.innerHTML = '<div style="color:var(--error);padding:1rem">❌ தரவு ஏற்றல் பிழை — server இயங்குகிறதா என சரிபார்க்கவும்.</div>';
    return;
  }
  renderChapters(data, sub);
}
window.openSubject = openSubject;

function renderChapters(data, sub) {
  const wrap = document.getElementById('chapterList');
  wrap.innerHTML = '';
  data.chapters.forEach((ch, idx) => {
    const done = (progress.lessonsCompleted||[]).includes(ch.id);
    const div = document.createElement('div');
    div.className = 'chapter-card';
    div.innerHTML = `
      <div class="chapter-header">
        <span class="chapter-number" style="color:${sub.color};background:${sub.color}22">அலகு ${idx+1}</span>
        <span class="chapter-status"
              style="background:${done?'#e6f8f0':'#f1f3ff'};color:${done?'#0D9658':'#1B56D3'}">
          ${done ? '✅ முடிந்தது' : '📖 படிக்க'}
        </span>
      </div>
      <div class="chapter-title">${ch.name}</div>
      <div class="chapter-title-en">${ch.nameEn}</div>
      <div class="chapter-actions">
        <button class="btn-small"
                style="background:${sub.color};color:white"
                onclick="openLesson('${sub.id}','${ch.id}')">📖 பாடம் படி</button>
        <button class="btn-small"
                style="background:var(--secondary);color:white"
                onclick="startChapterQuiz('${sub.id}','${ch.id}')">📝 வினாடி வினா</button>
      </div>`;
    wrap.appendChild(div);
  });
}
window.openLesson = openLesson;
window.startChapterQuiz = startChapterQuiz;

/* ─────────────────────────────────────────────────────────────
   LESSON
───────────────────────────────────────────────────────────── */
async function openLesson(subjectId, chapterId) {
  STATE.subject = subjectId;
  STATE.chapter = chapterId;
  nav('lesson');

  const sub = SUBJECTS.find(s=>s.id===subjectId);
  document.getElementById('lessonScreenTitle').textContent = sub ? `${sub.icon} ${sub.name}` : 'பாடம்';

  const wrap = document.getElementById('lessonBody');
  wrap.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--neutral-light)">⏳ ஏற்றுகிறது...</div>';

  const data = await loadData(subjectId);
  if (!data) { wrap.innerHTML='<div style="color:var(--error)">❌ தரவு ஏற்றல் பிழை</div>'; return; }

  const ch = data.chapters.find(c=>c.id===chapterId);
  if (!ch) { wrap.innerHTML='<div>அலகு கிடைக்கவில்லை</div>'; return; }

  wrap.innerHTML = '';

  ch.lessons.forEach((lesson, idx) => {
    // Safely encode for data-text attribute
    const safeText = (lesson.explanation||'').replace(/"/g,'&quot;').replace(/\n/g,' ').slice(0,300);
    const ttsEn = (progress.settings||{}).tts !== false;

    const div = document.createElement('div');
    div.innerHTML = `
      <div class="lesson-content">
        <span class="lesson-badge" style="background:${sub.color}22;color:${sub.color}">
          ${sub.icon} பாடம் ${idx+1}
        </span>
        <div class="lesson-title">${lesson.title}</div>
        ${lesson.titleEn ? `<div style="font-size:.8rem;color:var(--neutral-light);margin-bottom:.5rem">${lesson.titleEn}</div>` : ''}
        <div class="lesson-explanation">${lesson.explanation||''}</div>
        ${(lesson.keyPoints||[]).length ? `
          <div class="key-points">
            <div class="key-points-title">🔑 முக்கிய புள்ளிகள்:</div>
            <ul>${lesson.keyPoints.map(p=>`<li>${p}</li>`).join('')}</ul>
          </div>` : ''}
        ${!lesson.verified ? `
          <div class="verification-note">
            ⚠️ ${lesson.verificationNote||'மாதிரி உள்ளடக்கம் — பாடநூலுடன் சரிபார்க்கவும்'}
          </div>` : ''}
        ${ttsEn ? `
          <button class="tts-btn" data-text="${safeText}"
                  onclick="speakDataText(this)">🔊 வாசி</button>` : ''}
      </div>`;
    wrap.appendChild(div);
  });

  // Mark complete
  if (!(progress.lessonsCompleted||[]).includes(chapterId)) {
    progress.lessonsCompleted.push(chapterId);
    progress.points = (progress.points||0) + 20;
    save(); refreshTopBar();
    showReward('+20 ⭐ பாடம் முடிந்தது!');
    checkBadges();
  }

  // Quiz button
  const btn = document.createElement('button');
  btn.className = 'btn-primary';
  btn.style.cssText = 'width:100%;margin:.75rem 0';
  btn.textContent = '📝 வினாடி வினா ஆரம்பி ➜';
  btn.onclick = () => startChapterQuiz(subjectId, chapterId);
  wrap.appendChild(btn);
}

function speakDataText(btn) {
  speakText(btn, btn.dataset.text || '');
}
window.speakDataText = speakDataText;

window.goBackFromLesson = function() { nav('chapters'); };

/* ─────────────────────────────────────────────────────────────
   QUIZ ENGINE
───────────────────────────────────────────────────────────── */
async function startChapterQuiz(subjectId, chapterId) {
  const data = await loadData(subjectId);
  if (!data) return;
  const ch = data.chapters.find(c=>c.id===chapterId);
  if (!ch || !ch.questions?.length) {
    showModal('⚠️','வினாக்கள் இல்லை','இந்த அலகில் இன்னும் வினாக்கள் சேர்க்கப்படவில்லை.',[{label:'சரி',fn:closeModal}]);
    return;
  }
  const custom = (progress.customQuestions||[]).filter(q=>q.subject===subjectId);
  const all    = [...ch.questions, ...custom];
  const qs     = shuffle(all).slice(0,5);

  STATE.quiz = {questions:qs, current:0, score:0, answered:false,
                answeredIds:new Set(), subjectId, chapterId, mode:'chapter'};
  STATE.subject = subjectId;
  STATE.chapter  = chapterId;
  nav('quiz');
  renderQuestion();
}

async function startDailyChallenge() {
  let all = [];
  for (const sub of SUBJECTS) {
    const d = await loadData(sub.id);
    if (d) d.chapters.forEach(ch=>ch.questions.forEach(q=>all.push({...q,subjectId:sub.id})));
  }
  const qs = shuffle(all).slice(0,5);
  STATE.quiz = {questions:qs, current:0, score:0, answered:false,
                answeredIds:new Set(), subjectId:'mixed', chapterId:'', mode:'daily'};
  nav('quiz');
  renderQuestion();
}
window.startDailyChallenge = startDailyChallenge;

function startRevision() {
  const w = weakSubject();
  if (w) openSubject(w.id); else nav('subjects');
}
window.startRevision = startRevision;

/* ── Render one question ── */
function renderQuestion() {
  const q = STATE.quiz.questions[STATE.quiz.current];
  if (!q) { showQuizResult(); return; }

  STATE.quiz.answered = false;
  const tot = STATE.quiz.questions.length;
  const cur = STATE.quiz.current + 1;
  const sub = SUBJECTS.find(s=>s.id===(q.subjectId||STATE.quiz.subjectId)) || SUBJECTS[0];
  const labels = ['அ','ஆ','இ','ஈ'];
  const alreadyDone = STATE.quiz.answeredIds.has(q.id);

  const optHTML = (q.options||[]).map((opt,i)=>`
    <button class="option-btn" id="opt_${i}"
            onclick="pickAnswer(${i},${q.correctAnswer})"
            aria-label="${labels[i]}: ${opt.replace(/"/g,'&quot;')}">
      <span class="option-index">${labels[i]}</span>
      <span style="flex:1">${opt}</span>
      <span class="option-check"></span>
    </button>`).join('');

  const safeQ = (q.question||'').replace(/'/g,"\\'");

  document.getElementById('quizBody').innerHTML = `
    <div class="quiz-header">
      <div class="quiz-progress-info">
        <span class="quiz-step" style="background:${sub.color}22;color:${sub.color}">
          பயிற்சி ${cur}/${tot}
        </span>
        <span class="quiz-q-label">கேள்வி ${cur} / ${tot}</span>
      </div>
      <div class="quiz-points-badge">🪙 +${alreadyDone?'0':'10'}</div>
    </div>
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width:${(cur/tot)*100}%;background:${sub.color}"></div>
    </div>

    <div class="question-card" style="border-left-color:${sub.color}">
      <span class="question-subject-badge" style="background:${sub.color}22;color:${sub.color}">
        ${sub.icon} ${sub.name} •
        ${q.difficulty===1?'எளிது':q.difficulty===2?'நடுத்தரம்':'சவால்'}
      </span>
      <div class="question-text">${q.question||''}</div>
      ${(progress.settings||{}).tts!==false
        ? `<button class="tts-btn" onclick="speakText(this,'${safeQ}')">🔊 வாசி</button>`
        : ''}
    </div>

    <div class="options-list">${optHTML}</div>

    <div class="hint-card" id="hintCard">
      <div class="hint-title">💡 அறிவு நண்பனின் உதவிக்குறிப்பு:</div>
      <div>${q.hint||'கவனமாக யோசியுங்கள்!'}</div>
    </div>

    <div class="explanation-card" id="explanationCard">
      <div class="explanation-title" id="explanationTitle"></div>
      <div class="explanation-text"  id="explanationText"></div>
    </div>

    <div style="display:flex;gap:.75rem;margin-top:.75rem;flex-wrap:wrap">
      <button class="btn-outline" onclick="toggleHint()">💡 குறிப்பு</button>
      <button class="btn-primary" id="nextBtn" style="flex:1;display:none" onclick="nextQuestion()">
        ${cur<tot ? 'அடுத்த கேள்வி ➜' : '📊 முடிவு பார்'}
      </button>
    </div>`;
}
window.pickAnswer = pickAnswer;

function pickAnswer(sel, correct) {
  if (STATE.quiz.answered) return;
  const q = STATE.quiz.questions[STATE.quiz.current];
  const ok = sel === correct;
  const fresh = !STATE.quiz.answeredIds.has(q.id);

  STATE.quiz.answered = true;

  // Style options
  document.querySelectorAll('.option-btn').forEach((btn,i)=>{
    btn.classList.add('disabled');
    if (i===correct)  { btn.classList.add('correct');   btn.querySelector('.option-check').textContent='✅'; }
    if (i===sel&&!ok) { btn.classList.add('incorrect');  btn.querySelector('.option-check').textContent='❌'; }
  });

  // Points — once per unique question
  if (ok && fresh) {
    STATE.quiz.score        += 10;
    progress.points          = (progress.points||0) + 10;
    progress.correctAnswers  = (progress.correctAnswers||0) + 1;
    STATE.quiz.answeredIds.add(q.id);
    showReward('+10 ⭐');
    playSound('correct');
  } else if (!ok) {
    playSound('wrong');
  }
  progress.totalQuestions = (progress.totalQuestions||0) + 1;

  // Per-subject stats
  const sid = q.subjectId || STATE.quiz.subjectId || 'unknown';
  if (!progress.quizResults[sid]) progress.quizResults[sid] = {correct:0,total:0,best:0,attempts:0};
  progress.quizResults[sid].total++;
  if (ok) progress.quizResults[sid].correct++;

  save(); refreshTopBar();

  // Explanation
  const card  = document.getElementById('explanationCard');
  const title = document.getElementById('explanationTitle');
  const text  = document.getElementById('explanationText');
  card.classList.add('show');
  if (ok) {
    card.classList.add('success'); card.classList.remove('fail');
    title.innerHTML = '🎉 சரி! மிகச் சிறப்பு! 🏆';
    title.style.color = 'var(--secondary)';
  } else {
    card.classList.add('fail'); card.classList.remove('success');
    title.innerHTML = '🤔 தவறு — நல்ல முயற்சி! இன்னொரு முறை முயற்சி செய்வோம்.';
    title.style.color = 'var(--tertiary)';
  }
  text.textContent = q.explanation||'';

  document.getElementById('nextBtn').style.display = 'flex';
  checkBadges();
}

window.toggleHint = function() {
  document.getElementById('hintCard')?.classList.toggle('show');
};

window.nextQuestion = function() {
  STATE.quiz.current++;
  if (STATE.quiz.current >= STATE.quiz.questions.length) showQuizResult();
  else renderQuestion();
};

function showQuizResult() {
  const tot   = STATE.quiz.questions.length;
  const score = STATE.quiz.score;
  const max   = tot * 10;
  const pct   = tot>0 ? Math.round((score/max)*100) : 0;

  const [emoji, msg] =
    pct>=80 ? ['🏆','மிகச் சிறப்பு! நீங்கள் வல்லவர்!'] :
    pct>=60 ? ['⭐','நல்ல முயற்சி! இன்னும் கொஞ்சம் பயிற்சி செய்!'] :
    pct>=40 ? ['📖','மேலும் படிப்போம்! நீங்கள் முன்னேறுவீர்கள்!'] :
              ['💪','பயிற்சி தொடர்வோம்! அறிவு நண்பன் உதவி செய்வான்!'];

  const sid = STATE.quiz.subjectId;
  if (sid && progress.quizResults[sid]) {
    if (pct > (progress.quizResults[sid].best||0)) progress.quizResults[sid].best = pct;
    progress.quizResults[sid].attempts = (progress.quizResults[sid].attempts||0)+1;
  }
  if (pct>=60) { progress.points = (progress.points||0)+30; refreshTopBar(); }
  save();

  document.getElementById('quizBody').innerHTML = `
    <div style="text-align:center;padding:1rem">
      <div style="font-size:4rem;margin-bottom:.5rem">${emoji}</div>
      <div style="font-size:2rem;font-weight:800;color:var(--primary)">${score} / ${max}</div>
      <div style="font-weight:600;margin:.25rem 0">${pct}% சரியான விடை</div>
      <div style="font-size:.9rem;color:var(--neutral);margin:.5rem 0 1rem">${msg}</div>

      <div style="background:var(--surface-card);border:1.5px solid var(--neutral-border-light);
                  border-radius:var(--rounded-lg);padding:1rem;margin:.75rem 0;text-align:left">
        <div style="font-weight:700;margin-bottom:.5rem">📊 முடிவு:</div>
        <div style="display:flex;gap:1rem;flex-wrap:wrap">
          <div style="flex:1;text-align:center;padding:.5rem;background:var(--secondary-bg);border-radius:var(--rounded-md)">
            <div style="font-size:1.5rem;font-weight:800;color:var(--secondary)">${Math.round(score/10)}/${tot}</div>
            <div style="font-size:.7rem">சரியான விடைகள்</div>
          </div>
          <div style="flex:1;text-align:center;padding:.5rem;background:var(--gold-bg);border-radius:var(--rounded-md)">
            <div style="font-size:1.5rem;font-weight:800;color:#7a5900">+${score}</div>
            <div style="font-size:.7rem">புள்ளிகள்</div>
          </div>
        </div>
      </div>
      ${pct<60 ? `<div class="revision-card" style="text-align:left;margin:.75rem 0">
        💡 மீண்டும் படிப்போம்! பாடத்தை படித்த பிறகு மீண்டும் வினாடி வினா செய்யுங்கள்.
      </div>` : ''}
      <div style="display:flex;gap:.75rem;margin-top:1rem;flex-wrap:wrap">
        <button class="btn-outline" style="flex:1" onclick="navigateTo('subjects')">📚 பாடங்கள்</button>
        <button class="btn-primary"  style="flex:1" onclick="retryQuiz()">🔄 மீண்டும்</button>
      </div>
      <button class="btn-secondary" style="width:100%;margin-top:.5rem" onclick="navigateTo('home')">🏠 முகப்பு</button>
    </div>`;
}

window.retryQuiz = function() {
  if (STATE.subject && STATE.chapter) startChapterQuiz(STATE.subject, STATE.chapter);
  else startDailyChallenge();
};

window.confirmExitQuiz = function() {
  if (STATE.quiz.current > 0) {
    showModal('⚠️','வினாடி வினா விட்டு செல்வீர்களா?','புள்ளிகள் இழக்கப்படும்.',[
      {label:'தொடர்', fn:closeModal},
      {label:'வெளியேறு', fn:()=>{closeModal();nav('home');}}
    ]);
  } else nav('home');
};

/* ─────────────────────────────────────────────────────────────
   AI TUTOR
───────────────────────────────────────────────────────────── */
function initTutor() {
  if (STATE.tutor.history.length===0) {
    const kb = TUTOR_KB[STATE.tutor.subject] || TUTOR_KB.science;
    STATE.tutor.history.push({type:'bot', text: kb.greet});
  }
  renderChat();
}

window.tutorSelectSubject = function(id) {
  STATE.tutor.subject = id;
  STATE.tutor.history = [];
  // pill highlight
  document.querySelectorAll('#tutorSubjectPills .quick-prompt-btn').forEach(b=>{
    b.style.background=''; b.style.color=''; b.style.borderColor='';
  });
  if (event?.target) {
    event.target.style.background = 'var(--primary)';
    event.target.style.color = 'white';
    event.target.style.borderColor = 'var(--primary)';
  }
  initTutor();
};

function renderChat() {
  const box = document.getElementById('tutorChat');
  if (!box) return;
  box.innerHTML = '';
  STATE.tutor.history.forEach(m=>{
    const d = document.createElement('div');
    d.className = `tutor-message ${m.type}`;
    if (m.type==='bot') d.innerHTML = `<strong>🦉 அறிவு நண்பன்:</strong><br>${m.text}`;
    else d.textContent = m.text;
    box.appendChild(d);
  });
  box.scrollTop = box.scrollHeight;
}

function sendTutorMessage() {
  const inp  = document.getElementById('tutorInput');
  const text = (inp?.value||'').trim();
  if (!text) return;
  STATE.tutor.history.push({type:'user', text});
  inp.value = '';
  renderChat();
  const reply = tutorReply(text, STATE.tutor.subject);
  setTimeout(()=>{ STATE.tutor.history.push({type:'bot',text:reply}); renderChat(); }, 450);
}

function tutorReply(txt, sid) {
  const low = txt.toLowerCase();
  const kb  = TUTOR_KB[sid] || TUTOR_KB.science;
  for (const [kw, ans] of Object.entries(kb.kw||{})) {
    if (low.includes(kw.toLowerCase())) return ans;
  }
  if (/நன்றி|சரி|thank/i.test(low))
    return 'மிக்க மகிழ்ச்சி! 😊 மேலும் கேள்விகள் இருந்தால் கேளுங்கள். ⭐';
  if (/புரியவில்லை|கஷ்டம்/i.test(low))
    return 'பரவாயில்லை! 💪 கொஞ்சம் வேறு வழியில் கேளுங்கள். நான் விளக்குகிறேன்.';
  return `"${txt}" — கொஞ்சம் குறிப்பிட்டு கேளுங்கள். உதாரணம்: "ஒளிச்சேர்க்கை என்றால் என்ன?" என்று கேளுங்கள். 📖`;
}

/* ─────────────────────────────────────────────────────────────
   PROGRESS SCREEN
───────────────────────────────────────────────────────────── */
function renderProgress() {
  const tot = progress.totalQuestions||0;
  const cor = progress.correctAnswers||0;
  const acc = tot>0 ? Math.round((cor/tot)*100) : 0;
  document.getElementById('progTime').textContent     = progress.timeSpent||0;
  document.getElementById('progAccuracy').textContent = acc+'%';

  const chart = document.getElementById('progressChart');
  chart.innerHTML = '';
  SUBJECTS.forEach(sub=>{
    const r   = (progress.quizResults||{})[sub.id] || {correct:0,total:0};
    const pct = r.total>0 ? Math.round((r.correct/r.total)*100) : 0;
    const st  = pct>=80 ? '🌟 சிறப்பு' : pct>=60 ? '✅ நல்லது' : pct>0 ? '🔄 மீள்பார்வை தேவை' : '📖 தொடர்ந்து படி';
    const sc  = pct>=80 ? 'var(--secondary)' : pct>=60 ? 'var(--primary)' : pct>0 ? 'var(--tertiary)' : 'var(--neutral-light)';
    chart.innerHTML += `
      <div style="background:var(--surface-card);border:1.5px solid var(--neutral-border-light);
                  border-radius:var(--rounded-lg);padding:.85rem;box-shadow:var(--shadow-card);margin-bottom:.5rem">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.4rem">
          <span style="font-weight:700;font-size:.9rem">${sub.icon} ${sub.name}</span>
          <span style="font-size:.7rem;font-weight:600;color:${sc}">${st}</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar-fill" style="width:${pct}%;background:${sub.color}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:.3rem;font-size:.75rem;color:var(--neutral-light)">
          <span>${r.correct}/${r.total} சரி</span>
          <span style="font-weight:700;color:${sub.color}">${pct}%</span>
        </div>
      </div>`;
  });
  renderBadges();
}

function checkBadges() {
  ALL_BADGES.forEach(b=>{
    if (!(progress.badges||[]).includes(b.id) && b.cond(progress)) {
      progress.badges.push(b.id);
      save();
      showModal('🏅','புதிய பதக்கம்!',`${b.icon} "${b.name}" பதக்கம் பெற்றீர்கள்!`,[
        {label:'🎉 மகிழ்ச்சி!', fn:closeModal}
      ]);
    }
  });
}

function renderBadges() {
  const grid = document.getElementById('badgeGrid');
  if (!grid) return;
  grid.innerHTML = '';
  ALL_BADGES.forEach(b=>{
    const earned = (progress.badges||[]).includes(b.id);
    const div = document.createElement('div');
    div.className = `badge-item ${earned?'':'locked'}`;
    div.title = b.name;
    div.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div style="font-size:.6rem;color:${earned?'var(--secondary)':'var(--neutral-light)'}">
        ${earned?'✅ பெற்றீர்கள்':'🔒 பூட்டு'}
      </div>`;
    grid.appendChild(div);
  });
}

/* ─────────────────────────────────────────────────────────────
   PARENT / TEACHER SECTION
───────────────────────────────────────────────────────────── */
function initParent() {
  document.getElementById('pinGate').style.display       = 'block';
  document.getElementById('teacherDashboard').style.display = 'none';
  document.getElementById('pinError').style.display      = 'none';
  document.querySelectorAll('.pin-digit').forEach(d=>d.value='');

  // Auto-advance PIN fields
  document.querySelectorAll('.pin-digit').forEach((inp,idx,all)=>{
    inp.oninput = ()=>{ if(inp.value.length===1 && idx<all.length-1) all[idx+1].focus(); };
    inp.onkeydown = e=>{ if(e.key==='Backspace'&&!inp.value&&idx>0) all[idx-1].focus(); };
  });
}

window.verifyPin = function() {
  const digits  = document.querySelectorAll('.pin-digit');
  const entered = Array.from(digits).map(d=>d.value).join('');
  if (entered === (progress.teacherPin||'1234')) {
    document.getElementById('pinGate').style.display          = 'none';
    document.getElementById('teacherDashboard').style.display = 'block';
    renderTeacherDashboard();
  } else {
    document.getElementById('pinError').style.display = 'block';
    digits.forEach(d=>{ d.value=''; d.style.borderColor='var(--error)'; });
    digits[0].focus();
    setTimeout(()=>digits.forEach(d=>d.style.borderColor=''), 2000);
  }
};

function renderTeacherDashboard() {
  const now = new Date();
  document.getElementById('reportTimestamp').textContent =
    `சமர்ப்பித்த நேரம்: ${now.toLocaleDateString('ta-IN')}, ${now.toLocaleTimeString('ta-IN')}`;
  const tot = progress.totalQuestions||0;
  const cor = progress.correctAnswers||0;
  const acc = tot>0 ? Math.round((cor/tot)*100) : 0;
  document.getElementById('parentAccuracy').textContent  = acc+'%';
  document.getElementById('parentQuestions').textContent = tot;

  const pp = document.getElementById('parentProgress');
  pp.innerHTML = '';
  SUBJECTS.forEach(sub=>{
    const r   = (progress.quizResults||{})[sub.id] || {correct:0,total:0};
    const pct = r.total>0 ? Math.round((r.correct/r.total)*100) : 0;
    pp.innerHTML += `
      <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.5rem">
        <span style="width:120px;font-size:.8rem;font-weight:600">${sub.icon} ${sub.name}</span>
        <div style="flex:1;height:12px;background:#edf1f7;border-radius:999px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${sub.color};border-radius:999px"></div>
        </div>
        <span style="font-size:.85rem;font-weight:700;color:${sub.color}">${pct}%</span>
      </div>`;
  });
}

window.showAddQuestion = function() { nav('addQuestion'); };

window.saveNewQuestion = function() {
  const subjectId = document.getElementById('addQSubject').value;
  const question  = document.getElementById('addQText').value.trim();
  const opts = [0,1,2,3].map(i=>document.getElementById(`addQOpt${i}`).value.trim());
  const correctAnswer = parseInt(document.getElementById('addQCorrect').value);
  const explanation   = document.getElementById('addQExpl').value.trim();
  const hint          = document.getElementById('addQHint').value.trim();
  const difficulty    = parseInt(document.getElementById('addQDiff').value);

  if (!question || opts.some(o=>!o)) {
    alert('அனைத்து தகவல்களையும் நிரப்புங்கள்!'); return;
  }
  const q = {
    id:'custom_'+Date.now(), type:'mcq', subject:subjectId,
    question, options:opts, correctAnswer,
    explanation: explanation || 'சரியான விடை: '+opts[correctAnswer],
    hint: hint || 'கவனமாக யோசியுங்கள்!',
    difficulty, verified:true, custom:true
  };
  progress.customQuestions = progress.customQuestions||[];
  progress.customQuestions.push(q);
  save();
  showModal('✅','வினா சேர்க்கப்பட்டது!',
    `"${question.slice(0,40)}..." வினா வங்கியில் சேர்க்கப்பட்டது.`,
    [{label:'சரி', fn:()=>{closeModal();nav('parent');}}]);
};

window.exportJSON = function() {
  const data = {
    exportDate: new Date().toISOString(),
    customQuestions: progress.customQuestions||[],
    progress:{ points:progress.points, quizResults:progress.quizResults, lessonsCompleted:progress.lessonsCompleted }
  };
  const a = Object.assign(document.createElement('a'),{
    href: URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})),
    download:`arivu_kalam_${new Date().toISOString().slice(0,10)}.json`
  });
  a.click(); URL.revokeObjectURL(a.href);
};

window.importJSON = function(ev) {
  const file = ev.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (!Array.isArray(d.customQuestions)) throw new Error('bad format');
      const valid = d.customQuestions.every(q=>q.id&&q.question&&Array.isArray(q.options)&&typeof q.correctAnswer==='number');
      if (!valid) throw new Error('invalid questions');
      progress.customQuestions = [...(progress.customQuestions||[]), ...d.customQuestions];
      save();
      showModal('✅','பதிவேற்றம் வெற்றி!',`${d.customQuestions.length} வினாக்கள் சேர்க்கப்பட்டன.`,[{label:'சரி',fn:closeModal}]);
    } catch(err) {
      showModal('❌','பிழை','JSON கோப்பு சரியான வடிவத்தில் இல்லை.',[{label:'சரி',fn:closeModal}]);
    }
  };
  reader.readAsText(file);
  ev.target.value='';
};

window.confirmResetProgress = function() {
  showModal('⚠️','முன்னேற்றம் மீட்டமைக்கவா?',
    'அனைத்து புள்ளிகள், பதக்கங்கள், பயிற்சி தரவுகள் அழிக்கப்படும்! இது திரும்ப பெற முடியாது.',
    [{label:'ரத்து செய்',fn:closeModal},{label:'🗑️ மீட்டமை',fn:doReset}]);
};

function doReset() {
  const pin = progress.teacherPin||'1234';
  const cqs = progress.customQuestions||[];
  progress = defaultProgress();
  progress.teacherPin      = pin;
  progress.customQuestions = cqs;
  save(); closeModal(); nav('home');
}
window.resetProgress = doReset;

/* ─────────────────────────────────────────────────────────────
   SETTINGS
───────────────────────────────────────────────────────────── */
window.toggleSetting = function(key) {
  const s = progress.settings = progress.settings||{};
  s[key] = !s[key];
  save();
  const el = document.getElementById('toggle'+cap(key));
  if (el) el.classList.toggle('active', s[key]);
  if (key==='dark') applyDark();
};

window.changeFontSize = function(d) {
  const s = progress.settings = progress.settings||{};
  s.fontSize = Math.max(13, Math.min(20, (s.fontSize||16)+d));
  document.documentElement.style.fontSize = s.fontSize+'px';
  save();
};

function applyDark() {
  document.body.classList.toggle('dark-mode', !!(progress.settings||{}).dark);
}

/* ─────────────────────────────────────────────────────────────
   MODAL  (fn-based — no eval)
───────────────────────────────────────────────────────────── */
const _modalFns = {};

function showModal(icon, title, text, actions=[]) {
  document.getElementById('modalIcon').textContent  = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').textContent  = text;

  const wrap = document.getElementById('modalActions');
  wrap.innerHTML = '';
  actions.forEach((a,i)=>{
    const k = 'mfn_'+i;
    _modalFns[k] = a.fn;
    const btn = document.createElement('button');
    btn.className = (a.label.includes('மீட்')||a.label.includes('🗑️')) ? 'btn-outline' : 'btn-primary';
    btn.style.fontSize = '.9rem';
    btn.textContent = a.label;
    btn.onclick = ()=>{ if(_modalFns[k]) _modalFns[k](); };
    wrap.appendChild(btn);
  });
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}
window.closeModal = closeModal;

/* ─────────────────────────────────────────────────────────────
   REWARD POPUP
───────────────────────────────────────────────────────────── */
let _rewardTimer = null;
function showReward(txt) {
  const pop = document.getElementById('rewardPopup');
  document.getElementById('rewardText').textContent = txt;
  pop.classList.add('show');
  clearTimeout(_rewardTimer);
  _rewardTimer = setTimeout(()=>pop.classList.remove('show'), 1600);
}

/* ─────────────────────────────────────────────────────────────
   TEXT-TO-SPEECH
───────────────────────────────────────────────────────────── */
function speakText(btn, text) {
  if (!(progress.settings||{}).tts) return;
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text||'');
  u.lang  = 'ta-IN';
  u.rate  = 0.85;
  if (btn) {
    btn.textContent = '⏸ நிறுத்து';
    u.onend = ()=>{ if(btn) btn.textContent='🔊 வாசி'; };
  }
  window.speechSynthesis.speak(u);
}
window.speakText = speakText;

/* ─────────────────────────────────────────────────────────────
   SOUND
───────────────────────────────────────────────────────────── */
function playSound(type) {
  if (!(progress.settings||{}).sound) return;
  try {
    const ctx  = new (window.AudioContext||window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    if (type==='correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime+.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime+.2);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime+.1);
    }
    gain.gain.setValueAtTime(.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime+.45);
  } catch(e) {}
}

/* ─────────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i=a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]] = [a[j],a[i]];
  }
  return a;
}

/* ─────────────────────────────────────────────────────────────
   SERVICE WORKER
───────────────────────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(r=>console.log('SW ok:', r.scope))
    .catch(e=>console.log('SW skip:', e.message));
}

/* ─────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', ()=>{
  // Apply saved settings
  const s = progress.settings||{};
  applyDark();
  if (s.fontSize) document.documentElement.style.fontSize = s.fontSize+'px';
  ['Sound','TTS','Dark'].forEach(k=>{
    const el = document.getElementById('toggle'+k);
    if (el) el.classList.toggle('active', !!s[k.toLowerCase()]);
  });

  // Wire tutor input
  document.getElementById('tutorSendBtn')
    ?.addEventListener('click', sendTutorMessage);
  document.getElementById('tutorInput')
    ?.addEventListener('keypress', e=>{ if(e.key==='Enter') sendTutorMessage(); });

  // Daily challenge
  document.getElementById('dailyChallengeBtn')
    ?.addEventListener('click', startDailyChallenge);

  // Start learning
  document.getElementById('startLearningBtn')
    ?.addEventListener('click', ()=>nav('subjects'));

  // Avatar → settings
  document.getElementById('avatarBtn')
    ?.addEventListener('click', ()=>nav('settings'));

  // Modal overlay dismiss
  document.getElementById('modalOverlay')
    ?.addEventListener('click', e=>{
      if (e.target===e.currentTarget) closeModal();
    });

  // Time tracking (minutes)
  setInterval(()=>{
    if (document.visibilityState==='visible' && STATE.screen!=='home') {
      progress.timeSpent = (progress.timeSpent||0)+1;
      if ((progress.timeSpent%5)===0) save();
    }
  }, 60000);

  nav('home');
  console.log('%cஅறிவுக் களம் 6 v1.1 ✅','color:#1B56D3;font-size:1.1rem;font-weight:bold');
});
