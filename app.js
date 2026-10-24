/* ============================================================
   அறிவுக் களம் 6 — Arivu Kalam 6
   Main Application Script v2.0 (Tuition Dashboard & Multi-Student)
   ============================================================ */
'use strict';

/* ─────────────────────────────────────────────────────────────
   CONSTANTS & CONFIG
───────────────────────────────────────────────────────────── */
const TUITION_KEY = 'arivu_kalam_tuition_v2';

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
      'இலட்சம்':'1 இலட்சம் = 1,00,00,000. 1 கோடி = 1,00,00,000 = 100 இலட்சம்.',
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
   DEFAULT TUITION DATABASE
───────────────────────────────────────────────────────────── */
function defaultStudentProgress() {
  return {
    points: 0, streak: 0, lastDate: null,
    lessonsCompleted: [], quizResults: {}, badges: [],
    totalQuestions: 0, correctAnswers: 0, timeSpent: 0
  };
}

function initialTuitionDB() {
  return {
    teacher: {
      pin: '1234',
      name: 'செல்வி ஆசிரியர்',
      phone: '9876543210'
    },
    activeUserId: 'stu_1',
    isTeacherLoggedIn: false,
    settings: { sound: true, tts: true, dark: false, fontSize: 16 },
    homework: {
      id: 'hw_1',
      title: 'கணிதம்: பின்னங்கள் அலகு 1 பயிற்சி செய்',
      subject: 'mathematics',
      chapterId: 'math-ch1',
      dueDate: 'இன்று மாலை 6:00 மணி',
      notes: 'அனைத்து 5 வினாக்களுக்கும் விடையளித்து 50 புள்ளிகள் பெறுங்கள்.',
      completedBy: ['stu_1']
    },
    students: [
      { id: 'stu_1', name: 'இனியன்', pin: '1111', avatar: '👦', grade: '6A', phone: '9876543210', joined: '2026-06-01' },
      { id: 'stu_2', name: 'கவியரசி', pin: '2222', avatar: '👧', grade: '6B', phone: '9876543211', joined: '2026-06-01' },
      { id: 'stu_3', name: 'மதிவாணன்', pin: '3333', avatar: '🧑', grade: '6A', phone: '9876543212', joined: '2026-06-15' },
      { id: 'stu_4', name: 'யாழினி', pin: '4444', avatar: '👩', grade: '6B', phone: '9876543213', joined: '2026-07-01' }
    ],
    studentProgress: {
      stu_1: {
        points: 120, streak: 3, lastDate: new Date().toDateString(),
        lessonsCompleted: ['tamil-ch1', 'mathematics-ch1'],
        quizResults: {
          mathematics: { correct: 8, total: 10, best: 80, attempts: 2 },
          science: { correct: 6, total: 8, best: 75, attempts: 2 },
          tamil: { correct: 9, total: 10, best: 90, attempts: 2 }
        },
        badges: ['first_quiz', 'ten_correct', 'hundred_points'],
        totalQuestions: 28, correctAnswers: 23, timeSpent: 45
      },
      stu_2: {
        points: 80, streak: 2, lastDate: new Date().toDateString(),
        lessonsCompleted: ['science-ch1'],
        quizResults: {
          science: { correct: 7, total: 10, best: 70, attempts: 2 },
          english: { correct: 5, total: 8, best: 62, attempts: 1 }
        },
        badges: ['first_quiz'],
        totalQuestions: 18, correctAnswers: 12, timeSpent: 30
      },
      stu_3: {
        points: 150, streak: 4, lastDate: new Date().toDateString(),
        lessonsCompleted: ['mathematics-ch1', 'science-ch1', 'tamil-ch1'],
        quizResults: {
          mathematics: { correct: 10, total: 10, best: 100, attempts: 2 },
          social_science: { correct: 8, total: 10, best: 80, attempts: 1 }
        },
        badges: ['first_quiz', 'ten_correct', 'hundred_points', 'streak_3'],
        totalQuestions: 20, correctAnswers: 18, timeSpent: 55
      },
      stu_4: {
        points: 40, streak: 1, lastDate: new Date().toDateString(),
        lessonsCompleted: ['english-ch1'],
        quizResults: {
          english: { correct: 4, total: 8, best: 50, attempts: 1 }
        },
        badges: ['first_quiz'],
        totalQuestions: 8, correctAnswers: 4, timeSpent: 15
      }
    },
    discussions: [
      {
        id: 'disc_1',
        authorId: 'stu_1',
        authorName: 'இனியன்',
        authorRole: 'student',
        avatar: '👦',
        subject: 'கணிதம்',
        time: '2 மணி நேரம் முன்',
        content: 'தகா பின்னத்தை (Improper Fraction) கலப்பு பின்னமாக (Mixed Fraction) மாற்றுவது எப்படி? ஒரு உதாரணம் சொல்லுங்கள்!',
        likes: 4,
        likedBy: ['stu_2', 'stu_3'],
        replies: [
          {
            authorName: 'செல்வி ஆசிரியர்',
            authorRole: 'teacher',
            avatar: '👩‍🏫',
            time: '1 மணி நேரம் முன்',
            content: '7/4 என்பதை 4 ஆல் வகுத்தால்: ஈவு 1, மீதி 3. எனவே 1¾ ஆகும் இனியன்! மிக நன்று. 🍕'
          },
          {
            authorName: 'மதிவாணன்',
            authorRole: 'student',
            avatar: '🧑',
            time: '30 நிமிடம் முன்',
            content: 'நன்றி ஆசிரியர்! எனக்கும் இது இப்போதுதான் தெளிவாகப் புரிந்தது.'
          }
        ]
      },
      {
        id: 'disc_2',
        authorId: 'stu_2',
        authorName: 'கவியரசி',
        authorRole: 'student',
        avatar: '👧',
        subject: 'அறிவியல்',
        time: 'நேற்று',
        content: 'தாவரங்கள் இரவில் சுவாசிக்கின்றனவா? பகலில் ஒளிச்சேர்க்கை செய்கின்றனவா?',
        likes: 5,
        likedBy: ['stu_1', 'stu_3', 'stu_4'],
        replies: [
          {
            authorName: 'செல்வி ஆசிரியர்',
            authorRole: 'teacher',
            avatar: '👩‍🏫',
            time: 'நேற்று',
            content: 'ஆம் கவியரசி! தாவரங்கள் இரவும் பகலும் தொடர்ந்து சுவாசிக்கின்றன. ஆனால் பகலில் மட்டுமே சூரிய ஒளியைப் பயன்படுத்தி ஒளிச்சேர்க்கை செய்கின்றன. 🌿'
          }
        ]
      }
    ],
    customCurriculum: {}
  };
}

/* ─────────────────────────────────────────────────────────────
   DATABASE STATE & STORAGE
───────────────────────────────────────────────────────────── */
let tuitionDB = (() => {
  try {
    const raw = localStorage.getItem(TUITION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Object.assign(initialTuitionDB(), parsed);
    }
  } catch(e) {
    console.warn('tuitionDB parse err:', e);
  }
  return initialTuitionDB();
})();

function saveTuitionDB() {
  try {
    localStorage.setItem(TUITION_KEY, JSON.stringify(tuitionDB));
  } catch(e) {
    console.error('saveTuitionDB failed:', e);
  }
}

// Current active student progress getter
function getProgress() {
  const sid = tuitionDB.activeUserId || 'stu_1';
  if (!tuitionDB.studentProgress[sid]) {
    tuitionDB.studentProgress[sid] = defaultStudentProgress();
  }
  return tuitionDB.studentProgress[sid];
}

function getActiveStudent() {
  const sid = tuitionDB.activeUserId || 'stu_1';
  return tuitionDB.students.find(s => s.id === sid) || tuitionDB.students[0];
}

/* ─────────────────────────────────────────────────────────────
   RUNTIME STATE
───────────────────────────────────────────────────────────── */
const STATE = {
  screen: 'home',
  subject: null,
  chapter: null,
  quiz: {
    questions: [], current: 0, score: 0,
    answered: false, answeredIds: new Set(),
    subjectId: '', chapterId: '', mode: 'chapter'
  },
  tutor: { subject: 'science', history: [] },
  pendingLoginStudentId: null,
  currentDiscussionFilter: 'all'
};

/* ─────────────────────────────────────────────────────────────
   DATA LOADING WITH CUSTOM CURRICULUM MERGE
───────────────────────────────────────────────────────────── */
const _cache = {};
async function loadData(id) {
  let baseData = _cache[id];
  if (!baseData) {
    try {
      const r = await fetch(`data/${id}.json`);
      if (!r.ok) throw new Error(r.status);
      baseData = await r.json();
      _cache[id] = baseData;
    } catch(e) {
      console.error('loadData failed:', id, e);
      return null;
    }
  }

  // Deep clone
  const data = JSON.parse(JSON.stringify(baseData));

  // Merge custom curriculum added by tuition teacher
  const custom = tuitionDB.customCurriculum?.[id];
  if (custom) {
    if (custom.chapters?.length) {
      data.chapters = [...data.chapters, ...custom.chapters];
    }
    if (custom.questions?.length) {
      custom.questions.forEach(q => {
        const targetCh = data.chapters.find(c => c.id === q.chapterId) || data.chapters[0];
        if (targetCh) {
          if (!targetCh.questions) targetCh.questions = [];
          targetCh.questions.push(q);
        }
      });
    }
  }

  return data;
}

/* ─────────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────────── */
function cap(s) {
  return s.charAt(0).toUpperCase() +
         s.slice(1).replace(/-([a-z])/g, (_,c)=>c.toUpperCase());
}

function nav(screen) {
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const el = document.getElementById('screen' + cap(screen));
  if (el) el.classList.add('active');
  STATE.screen = screen;

  // Bottom navigation active class
  const MAP = { home:0, subjects:1, discussion:2, tutor:3, parent:4 };
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (MAP[screen] !== undefined) {
    document.querySelectorAll('.nav-item')[MAP[screen]]?.classList.add('active');
  }

  window.scrollTo(0, 0);

  // Screen Inits
  if (screen === 'home')       renderHome();
  if (screen === 'subjects')   renderSubjectsFull();
  if (screen === 'progress')   renderProgress();
  if (screen === 'tutor')      initTutor();
  if (screen === 'parent')     initParent();
  if (screen === 'discussion') renderDiscussions();
}
window.navigateTo = nav;

/* ─────────────────────────────────────────────────────────────
   TOP BAR & STREAK
───────────────────────────────────────────────────────────── */
function updateStreak() {
  const p = getProgress();
  const today = new Date().toDateString();
  if (p.lastDate === today) return;
  const yest = new Date(Date.now() - 86400000).toDateString();
  if (p.lastDate === yest) p.streak = (p.streak||0) + 1;
  else if (p.lastDate && p.lastDate !== today) p.streak = 0;
  p.lastDate = today;
  saveTuitionDB();
}

function refreshTopBar() {
  const p = getProgress();
  const s = getActiveStudent();
  document.getElementById('topStreak').textContent = p.streak || 0;
  document.getElementById('topPoints').textContent = p.points || 0;
  if (s) {
    document.getElementById('currentAvatar').textContent = s.avatar;
    document.getElementById('currentUserName').textContent = s.name;
    document.getElementById('currentUserGrade').textContent = s.grade;
  }
}

/* ─────────────────────────────────────────────────────────────
   HOME SCREEN
───────────────────────────────────────────────────────────── */
function renderHome() {
  updateStreak();
  refreshTopBar();
  const p = getProgress();
  const s = getActiveStudent();

  document.getElementById('homeWelcomeName').textContent = `வணக்கம் ${s.name}! 👋`;
  document.getElementById('homeStreak').textContent  = p.streak || 0;
  document.getElementById('homePoints').textContent  = p.points || 0;
  document.getElementById('homeLessons').textContent = (p.lessonsCompleted||[]).length;
  document.getElementById('homeBadges').textContent  = (p.badges||[]).length;

  // Homework card update
  const hw = tuitionDB.homework;
  const isHwDone = (hw.completedBy||[]).includes(s.id);
  const hwCard = document.getElementById('homeHomeworkCard');
  if (hwCard) {
    document.getElementById('hwTitle').textContent = hw.title;
    document.getElementById('hwDesc').textContent = hw.notes;
    document.getElementById('hwDueDate').textContent = hw.dueDate;
    if (isHwDone) {
      hwCard.style.borderColor = 'var(--secondary)';
      hwCard.querySelector('.homework-badge').textContent = '✅ வீட்டுப்பாடம் முடிந்தது!';
      hwCard.querySelector('.homework-badge').style.background = 'var(--secondary)';
    } else {
      hwCard.style.borderColor = '#fdba74';
      hwCard.querySelector('.homework-badge').textContent = '📌 ஆசிரியர் வீட்டுப்பாடம் (Homework)';
      hwCard.querySelector('.homework-badge').style.background = 'var(--tertiary)';
    }
  }

  // Revision topic
  const weak = weakSubject();
  if (weak) {
    document.getElementById('revisionTopic').textContent = `${weak.name}: மீண்டும் பயிற்சி செய்`;
  }

  buildSubjectCards('subjectCards');
}

function weakSubject() {
  const p = getProgress();
  let worst = null, worstPct = 101;
  for (const s of SUBJECTS) {
    const r = (p.quizResults||{})[s.id];
    if (r && r.total > 0) {
      const pct = (r.correct / r.total) * 100;
      if (pct < worstPct) { worstPct = pct; worst = s; }
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
  const p = getProgress();

  SUBJECTS.forEach(sub => {
    const r = (p.quizResults||{})[sub.id] || { correct:0, total:0 };
    const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    const done = (p.lessonsCompleted||[]).filter(l => l.startsWith(sub.id + '-')).length;
    const badge = r.total === 0 ? '▶ தொடர்வோம்' :
                  pct >= 80    ? '⭐ வெற்றி'      :
                  pct >= 60    ? '✅ முடிந்தது'   : '🔄 மீண்டும் பயிற்சி';

    const card = document.createElement('div');
    card.className = 'subject-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', sub.name + ' திறக்க');
    card.onclick = () => openSubject(sub.id);
    card.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') openSubject(sub.id); };

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
   CHAPTERS & LESSONS
───────────────────────────────────────────────────────────── */
async function openSubject(id) {
  STATE.subject = id;
  nav('chapters');
  const sub = SUBJECTS.find(s => s.id === id);
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
  const p = getProgress();

  data.chapters.forEach((ch, idx) => {
    const done = (p.lessonsCompleted||[]).includes(ch.id);
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
      <div class="chapter-title-en">${ch.nameEn||''}</div>
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

async function openLesson(subjectId, chapterId) {
  STATE.subject = subjectId;
  STATE.chapter = chapterId;
  nav('lesson');

  const sub = SUBJECTS.find(s => s.id === subjectId);
  document.getElementById('lessonScreenTitle').textContent = sub ? `${sub.icon} ${sub.name}` : 'பாடம்';

  const wrap = document.getElementById('lessonBody');
  wrap.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--neutral-light)">⏳ ஏற்றுகிறது...</div>';

  const data = await loadData(subjectId);
  if (!data) { wrap.innerHTML = '<div style="color:var(--error)">❌ தரவு ஏற்றல் பிழை</div>'; return; }

  const ch = data.chapters.find(c => c.id === chapterId);
  if (!ch) { wrap.innerHTML = '<div>அலகு கிடைக்கவில்லை</div>'; return; }

  wrap.innerHTML = '';

  (ch.lessons || [{ title: ch.name, explanation: 'பாட விளக்கம் விரைவில்...', keyPoints:[] }]).forEach((lesson, idx) => {
    const safeText = (lesson.explanation||'').replace(/"/g,'&quot;').replace(/\n/g,' ').slice(0,300);
    const ttsEn = (tuitionDB.settings||{}).tts !== false;

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
            <ul>${lesson.keyPoints.map(pt=>`<li>${pt}</li>`).join('')}</ul>
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

  // Mark lesson complete
  const p = getProgress();
  if (!(p.lessonsCompleted||[]).includes(chapterId)) {
    p.lessonsCompleted.push(chapterId);
    p.points = (p.points||0) + 20;
    saveTuitionDB(); refreshTopBar();
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
  const ch = data.chapters.find(c => c.id === chapterId);
  if (!ch || !ch.questions?.length) {
    showModal('⚠️','வினாக்கள் இல்லை','இந்த அலகில் இன்னும் வினாக்கள் சேர்க்கப்படவில்லை.',[{label:'சரி',fn:closeModal}]);
    return;
  }
  const qs = shuffle(ch.questions).slice(0, 5);
  STATE.quiz = {
    questions: qs, current: 0, score: 0, answered: false,
    answeredIds: new Set(), subjectId, chapterId, mode: 'chapter'
  };
  STATE.subject = subjectId;
  STATE.chapter = chapterId;
  nav('quiz');
  renderQuestion();
}

async function startDailyChallenge() {
  let all = [];
  for (const sub of SUBJECTS) {
    const d = await loadData(sub.id);
    if (d) d.chapters.forEach(ch => ch.questions.forEach(q => all.push({ ...q, subjectId: sub.id })));
  }
  const qs = shuffle(all).slice(0, 5);
  STATE.quiz = {
    questions: qs, current: 0, score: 0, answered: false,
    answeredIds: new Set(), subjectId: 'mixed', chapterId: '', mode: 'daily'
  };
  nav('quiz');
  renderQuestion();
}
window.startDailyChallenge = startDailyChallenge;

function startHomeworkQuiz() {
  const hw = tuitionDB.homework;
  if (hw.subject) {
    startChapterQuiz(hw.subject, hw.chapterId || `${hw.subject}-ch1`);
    STATE.quiz.mode = 'homework';
  } else {
    startDailyChallenge();
  }
}
window.startHomeworkQuiz = startHomeworkQuiz;

function startRevision() {
  const w = weakSubject();
  if (w) openSubject(w.id); else nav('subjects');
}
window.startRevision = startRevision;

function renderQuestion() {
  const q = STATE.quiz.questions[STATE.quiz.current];
  if (!q) { showQuizResult(); return; }

  STATE.quiz.answered = false;
  const tot = STATE.quiz.questions.length;
  const cur = STATE.quiz.current + 1;
  const sub = SUBJECTS.find(s => s.id === (q.subjectId || STATE.quiz.subjectId)) || SUBJECTS[0];
  const labels = ['அ', 'ஆ', 'இ', 'ஈ'];
  const alreadyDone = STATE.quiz.answeredIds.has(q.id);

  const optHTML = (q.options || []).map((opt, i) => `
    <button class="option-btn" id="opt_${i}"
            onclick="pickAnswer(${i}, ${q.correctAnswer})"
            aria-label="${labels[i]}: ${opt.replace(/"/g,'&quot;')}">
      <span class="option-index">${labels[i]}</span>
      <span style="flex:1">${opt}</span>
      <span class="option-check"></span>
    </button>`).join('');

  const safeQ = (q.question || '').replace(/'/g, "\\'");

  document.getElementById('quizBody').innerHTML = `
    <div class="quiz-header">
      <div class="quiz-progress-info">
        <span class="quiz-step" style="background:${sub.color}22;color:${sub.color}">
          பயிற்சி ${cur}/${tot}
        </span>
        <span class="quiz-q-label">கேள்வி ${cur} / ${tot}</span>
      </div>
      <div class="quiz-points-badge">🪙 +${alreadyDone ? '0' : '10'}</div>
    </div>
    <div class="quiz-progress-bar">
      <div class="quiz-progress-fill" style="width:${(cur/tot)*100}%;background:${sub.color}"></div>
    </div>

    <div class="question-card" style="border-left-color:${sub.color}">
      <span class="question-subject-badge" style="background:${sub.color}22;color:${sub.color}">
        ${sub.icon} ${sub.name} •
        ${q.difficulty === 1 ? 'எளிது' : q.difficulty === 2 ? 'நடுத்தரம்' : 'சவால்'}
      </span>
      <div class="question-text">${q.question || ''}</div>
      ${(tuitionDB.settings||{}).tts !== false
        ? `<button class="tts-btn" onclick="speakText(this,'${safeQ}')">🔊 வாசி</button>`
        : ''}
    </div>

    <div class="options-list">${optHTML}</div>

    <div class="hint-card" id="hintCard">
      <div class="hint-title">💡 அறிவு நண்பனின் உதவிக்குறிப்பு:</div>
      <div>${q.hint || 'கவனமாக யோசியுங்கள்!'}</div>
    </div>

    <div class="explanation-card" id="explanationCard">
      <div class="explanation-title" id="explanationTitle"></div>
      <div class="explanation-text"  id="explanationText"></div>
    </div>

    <div style="display:flex;gap:.75rem;margin-top:.75rem;flex-wrap:wrap">
      <button class="btn-outline" onclick="toggleHint()">💡 குறிப்பு</button>
      <button class="btn-primary" id="nextBtn" style="flex:1;display:none" onclick="nextQuestion()">
        ${cur < tot ? 'அடுத்த கேள்வி ➜' : '📊 முடிவு பார்'}
      </button>
    </div>`;
}
window.pickAnswer = pickAnswer;

function pickAnswer(sel, correct) {
  if (STATE.quiz.answered) return;
  const q = STATE.quiz.questions[STATE.quiz.current];
  const ok = sel === correct;
  const fresh = !STATE.quiz.answeredIds.has(q.id);
  const p = getProgress();

  STATE.quiz.answered = true;

  // Style options
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.add('disabled');
    if (i === correct)  { btn.classList.add('correct');   btn.querySelector('.option-check').textContent = '✅'; }
    if (i === sel && !ok) { btn.classList.add('incorrect'); btn.querySelector('.option-check').textContent = '❌'; }
  });

  // Points
  if (ok && fresh) {
    STATE.quiz.score += 10;
    p.points = (p.points||0) + 10;
    p.correctAnswers = (p.correctAnswers||0) + 1;
    STATE.quiz.answeredIds.add(q.id);
    showReward('+10 ⭐');
    playSound('correct');
  } else if (!ok) {
    playSound('wrong');
  }
  p.totalQuestions = (p.totalQuestions||0) + 1;

  // Stats per subject
  const sid = q.subjectId || STATE.quiz.subjectId || 'unknown';
  if (!p.quizResults[sid]) p.quizResults[sid] = { correct:0, total:0, best:0, attempts:0 };
  p.quizResults[sid].total++;
  if (ok) p.quizResults[sid].correct++;

  saveTuitionDB(); refreshTopBar();

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
  text.textContent = q.explanation || '';

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
  const pct   = tot > 0 ? Math.round((score / max) * 100) : 0;
  const p     = getProgress();
  const s     = getActiveStudent();

  // Check if this was homework quiz
  if (STATE.quiz.mode === 'homework') {
    if (!tuitionDB.homework.completedBy.includes(s.id)) {
      tuitionDB.homework.completedBy.push(s.id);
    }
  }

  const [emoji, msg] =
    pct >= 80 ? ['🏆','மிகச் சிறப்பு! நீங்கள் வல்லவர்!'] :
    pct >= 60 ? ['⭐','நல்ல முயற்சி! இன்னும் கொஞ்சம் பயிற்சி செய்!'] :
    pct >= 40 ? ['📖','மேலும் படிப்போம்! நீங்கள் முன்னேறுவீர்கள்!'] :
                ['💪','பயிற்சி தொடர்வோம்! அறிவு நண்பன் உதவி செய்வான்!'];

  const sid = STATE.quiz.subjectId;
  if (sid && p.quizResults[sid]) {
    if (pct > (p.quizResults[sid].best||0)) p.quizResults[sid].best = pct;
    p.quizResults[sid].attempts = (p.quizResults[sid].attempts||0) + 1;
  }
  if (pct >= 60) { p.points = (p.points||0) + 30; refreshTopBar(); }
  saveTuitionDB();

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
      {label:'வெளியேறு', fn:()=>{ closeModal(); nav('home'); }}
    ]);
  } else nav('home');
};

/* ─────────────────────────────────────────────────────────────
   AI TUTOR
───────────────────────────────────────────────────────────── */
function initTutor() {
  if (STATE.tutor.history.length === 0) {
    const kb = TUTOR_KB[STATE.tutor.subject] || TUTOR_KB.science;
    STATE.tutor.history.push({ type: 'bot', text: kb.greet });
  }
  renderChat();
}

window.tutorSelectSubject = function(id) {
  STATE.tutor.subject = id;
  STATE.tutor.history = [];
  document.querySelectorAll('#tutorSubjectPills .quick-prompt-btn').forEach(b => {
    b.style.background = ''; b.style.color = ''; b.style.borderColor = '';
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
  STATE.tutor.history.forEach(m => {
    const d = document.createElement('div');
    d.className = `tutor-message ${m.type}`;
    if (m.type === 'bot') d.innerHTML = `<strong>🦉 அறிவு நண்பன்:</strong><br>${m.text}`;
    else d.textContent = m.text;
    box.appendChild(d);
  });
  box.scrollTop = box.scrollHeight;
}

function sendTutorMessage() {
  const inp  = document.getElementById('tutorInput');
  const text = (inp?.value || '').trim();
  if (!text) return;
  STATE.tutor.history.push({ type: 'user', text });
  inp.value = '';
  renderChat();
  const reply = tutorReply(text, STATE.tutor.subject);
  setTimeout(() => { STATE.tutor.history.push({ type: 'bot', text: reply }); renderChat(); }, 450);
}

function tutorReply(txt, sid) {
  const low = txt.toLowerCase();
  const kb  = TUTOR_KB[sid] || TUTOR_KB.science;
  for (const [kw, ans] of Object.entries(kb.kw || {})) {
    if (low.includes(kw.toLowerCase())) return ans;
  }
  if (/நன்றி|சரி|thank/i.test(low))
    return 'மிக்க மகிழ்ச்சி! 😊 மேலும் கேள்விகள் இருந்தால் கேளுங்கள். ⭐';
  if (/புரியவில்லை|கஷ்டம்/i.test(low))
    return 'பரவாயில்லை! 💪 கொஞ்சம் வேறு வழியில் கேளுங்கள். நான் விளக்குகிறேன்.';
  return `"${txt}" — கொஞ்சம் குறிப்பிட்டு கேளுங்கள். உதாரணம்: "ஒளிச்சேர்க்கை என்றால் என்ன?" என்று கேளுங்கள். 📖`;
}

/* ─────────────────────────────────────────────────────────────
   PROGRESS SCREEN & BADGES
───────────────────────────────────────────────────────────── */
function renderProgress() {
  const p = getProgress();
  const tot = p.totalQuestions || 0;
  const cor = p.correctAnswers || 0;
  const acc = tot > 0 ? Math.round((cor / tot) * 100) : 0;
  document.getElementById('progTime').textContent     = p.timeSpent || 0;
  document.getElementById('progAccuracy').textContent = acc + '%';

  const chart = document.getElementById('progressChart');
  chart.innerHTML = '';
  SUBJECTS.forEach(sub => {
    const r   = (p.quizResults||{})[sub.id] || { correct:0, total:0 };
    const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    const st  = pct >= 80 ? '🌟 சிறப்பு' : pct >= 60 ? '✅ நல்லது' : pct > 0 ? '🔄 மீள்பார்வை தேவை' : '📖 தொடர்ந்து படி';
    const sc  = pct >= 80 ? 'var(--secondary)' : pct >= 60 ? 'var(--primary)' : pct > 0 ? 'var(--tertiary)' : 'var(--neutral-light)';
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
  const p = getProgress();
  ALL_BADGES.forEach(b => {
    if (!(p.badges||[]).includes(b.id) && b.cond(p)) {
      p.badges.push(b.id);
      saveTuitionDB();
      showModal('🏅','புதிய பதக்கம்!',`${b.icon} "${b.name}" பதக்கம் பெற்றீர்கள்!`,[
        { label: '🎉 மகிழ்ச்சி!', fn: closeModal }
      ]);
    }
  });
}

function renderBadges() {
  const grid = document.getElementById('badgeGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const p = getProgress();
  ALL_BADGES.forEach(b => {
    const earned = (p.badges||[]).includes(b.id);
    const div = document.createElement('div');
    div.className = `badge-item ${earned ? '' : 'locked'}`;
    div.title = b.name;
    div.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-name">${b.name}</div>
      <div style="font-size:.6rem;color:${earned ? 'var(--secondary)' : 'var(--neutral-light)'}">
        ${earned ? '✅ பெற்றீர்கள்' : '🔒 பூட்டு'}
      </div>`;
    grid.appendChild(div);
  });
}

/* ─────────────────────────────────────────────────────────────
   CLASSROOM DOUBTS & DISCUSSION FORUM
───────────────────────────────────────────────────────────── */
function renderDiscussions(filter) {
  if (filter) STATE.currentDiscussionFilter = filter;
  const currentF = STATE.currentDiscussionFilter || 'all';

  const container = document.getElementById('discussionFeedList');
  if (!container) return;

  const currentStu = getActiveStudent();
  const isTeacher = tuitionDB.isTeacherLoggedIn;

  const posts = tuitionDB.discussions.filter(p => {
    if (currentF === 'all') return true;
    return p.subject === currentF;
  });

  if (posts.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--neutral-light)">
        💬 இந்த பகுதியில் இன்னும் வினாக்கள் இல்லை.<br>
        முதல் கேள்வியை நீங்கள் கேளுங்கள்!
      </div>`;
    return;
  }

  container.innerHTML = '';
  posts.forEach(post => {
    const isLiked = (post.likedBy||[]).includes(currentStu.id);
    const card = document.createElement('div');
    card.className = 'discussion-card';

    const repliesHTML = (post.replies || []).map(r => `
      <div class="reply-bubble ${r.authorRole === 'teacher' ? 'teacher-reply' : ''}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.2rem">
          <span style="font-weight:700;font-size:0.75rem">${r.avatar} ${r.authorName}</span>
          <span class="${r.authorRole === 'teacher' ? 'author-badge-teacher' : 'author-badge-student'}">${r.authorRole === 'teacher' ? '👩‍🏫 ஆசிரியர்' : 'மாணவர்'}</span>
        </div>
        <div style="font-size:0.8rem">${r.content}</div>
      </div>`).join('');

    card.innerHTML = `
      <div class="discussion-header">
        <div class="discussion-author-box">
          <span style="font-size:1.3rem">${post.avatar}</span>
          <div>
            <div style="font-weight:700;font-size:0.85rem">${post.authorName}</div>
            <div style="font-size:0.68rem;color:var(--neutral-light)">${post.time}</div>
          </div>
          <span class="${post.authorRole === 'teacher' ? 'author-badge-teacher' : 'author-badge-student'}">
            ${post.authorRole === 'teacher' ? 'ஆசிரியர்' : 'மாணவர்'}
          </span>
        </div>
        <span class="discussion-tag">${post.subject}</span>
      </div>

      <div class="discussion-content-text">${post.content}</div>

      <div style="display:flex;justify-content:space-between;align-items:center;padding-top:0.4rem;border-top:1px solid var(--neutral-border-light)">
        <button class="btn-small" style="background:${isLiked ? 'var(--gold-bg)' : 'transparent'};color:${isLiked ? '#b45309' : 'var(--neutral)'};border:1px solid var(--neutral-border-light)" onclick="toggleLikePost('${post.id}')">
          ⭐ ${post.likes || 0} பாராட்டு
        </button>
        <span style="font-size:0.75rem;color:var(--neutral-light)">💬 ${(post.replies||[]).length} பதில்கள்</span>
      </div>

      <!-- Replies Section -->
      ${(post.replies||[]).length ? `<div class="discussion-replies-list">${repliesHTML}</div>` : ''}

      <!-- Add Reply Row -->
      <div class="reply-input-row">
        <input type="text" id="reply_inp_${post.id}" placeholder="பதில் எழுதுங்கள்..." style="flex:1;padding:0.4rem 0.6rem;border:1.5px solid var(--neutral-border-light);border-radius:var(--rounded-full);font-family:var(--font-tamil);font-size:0.8rem">
        <button class="btn-small" style="background:var(--primary);color:white" onclick="submitPostReply('${post.id}')">அனுப்பு</button>
      </div>`;

    container.appendChild(card);
  });
}
window.renderDiscussions = renderDiscussions;

window.filterDiscussions = function(subj, btn) {
  document.querySelectorAll('#discussionFilters button').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderDiscussions(subj);
};

window.openNewPostModal = function() {
  document.getElementById('newPostModal').classList.add('show');
};

window.closeNewPostModal = function() {
  document.getElementById('newPostModal').classList.remove('show');
};

window.submitNewPost = function() {
  const subj = document.getElementById('postSubjectTag').value;
  const content = document.getElementById('postContentText').value.trim();
  if (!content) {
    alert('கேள்வி அல்லது கருத்து எழுதவும்!'); return;
  }

  const s = getActiveStudent();
  const newPost = {
    id: 'disc_' + Date.now(),
    authorId: s.id,
    authorName: s.name,
    authorRole: 'student',
    avatar: s.avatar,
    subject: subj,
    time: 'சற்று முன்',
    content,
    likes: 0,
    likedBy: [],
    replies: []
  };

  tuitionDB.discussions.unshift(newPost);
  saveTuitionDB();
  closeNewPostModal();
  document.getElementById('postContentText').value = '';
  renderDiscussions();
  showReward('🎉 அரங்கம் பதிவேற்றப்பட்டது!');
};

window.toggleLikePost = function(postId) {
  const s = getActiveStudent();
  const post = tuitionDB.discussions.find(p => p.id === postId);
  if (!post) return;
  if (!post.likedBy) post.likedBy = [];

  const idx = post.likedBy.indexOf(s.id);
  if (idx === -1) {
    post.likedBy.push(s.id);
    post.likes = (post.likes || 0) + 1;
    showReward('+1 ⭐ பாராட்டு!');
  } else {
    post.likedBy.splice(idx, 1);
    post.likes = Math.max(0, (post.likes || 1) - 1);
  }
  saveTuitionDB();
  renderDiscussions();
};

window.submitPostReply = function(postId) {
  const inp = document.getElementById(`reply_inp_${postId}`);
  const text = (inp?.value || '').trim();
  if (!text) return;

  const post = tuitionDB.discussions.find(p => p.id === postId);
  if (!post) return;
  if (!post.replies) post.replies = [];

  const isTeacher = tuitionDB.isTeacherLoggedIn;
  const s = getActiveStudent();

  post.replies.push({
    authorName: isTeacher ? tuitionDB.teacher.name : s.name,
    authorRole: isTeacher ? 'teacher' : 'student',
    avatar: isTeacher ? '👩‍🏫' : s.avatar,
    time: 'சற்று முன்',
    content: text
  });

  saveTuitionDB();
  inp.value = '';
  renderDiscussions();
};

/* ─────────────────────────────────────────────────────────────
   TUITION TEACHER DASHBOARD
───────────────────────────────────────────────────────────── */
function initParent() {
  if (tuitionDB.isTeacherLoggedIn) {
    document.getElementById('pinGate').style.display = 'none';
    document.getElementById('teacherDashboard').style.display = 'block';
    renderTeacherDashboard();
  } else {
    document.getElementById('pinGate').style.display = 'block';
    document.getElementById('teacherDashboard').style.display = 'none';
    document.getElementById('pinError').style.display = 'none';
    document.querySelectorAll('.pin-digit').forEach(d => d.value = '');
    // Auto-advance PIN inputs
    document.querySelectorAll('.pin-digit').forEach((inp, idx, all) => {
      inp.oninput = () => { if (inp.value.length === 1 && idx < all.length - 1) all[idx+1].focus(); };
      inp.onkeydown = e => { if (e.key === 'Backspace' && !inp.value && idx > 0) all[idx-1].focus(); };
    });
  }
}

window.verifyPin = function() {
  const digits  = document.querySelectorAll('.pin-digit');
  const entered = Array.from(digits).map(d => d.value).join('');
  if (entered === (tuitionDB.teacher.pin || '1234')) {
    tuitionDB.isTeacherLoggedIn = true;
    saveTuitionDB();
    document.getElementById('pinGate').style.display = 'none';
    document.getElementById('teacherDashboard').style.display = 'block';
    renderTeacherDashboard();
  } else {
    document.getElementById('pinError').style.display = 'block';
    digits.forEach(d => { d.value = ''; d.style.borderColor = 'var(--error)'; });
    digits[0].focus();
    setTimeout(() => digits.forEach(d => d.style.borderColor = ''), 2000);
  }
};

window.logoutTeacher = function() {
  tuitionDB.isTeacherLoggedIn = false;
  saveTuitionDB();
  initParent();
};

function renderTeacherDashboard() {
  const students = tuitionDB.students;
  document.getElementById('teacherNameDisplay').textContent = tuitionDB.teacher.name || 'செல்வி ஆசிரியர்';
  document.getElementById('tStatStudents').textContent = students.length;

  // Compute class metrics
  let totalQ = 0, totalCorrect = 0, maxPoints = -1, topStudent = '-';
  students.forEach(st => {
    const prog = tuitionDB.studentProgress[st.id] || defaultStudentProgress();
    totalQ += (prog.totalQuestions || 0);
    totalCorrect += (prog.correctAnswers || 0);
    if ((prog.points || 0) > maxPoints) {
      maxPoints = prog.points;
      topStudent = st.name;
    }
  });

  const avgAcc = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0;
  document.getElementById('tStatAccuracy').textContent = avgAcc + '%';
  document.getElementById('tStatTop').textContent = topStudent;

  const hw = tuitionDB.homework;
  document.getElementById('tStatHomework').textContent = `${(hw.completedBy||[]).length}/${students.length}`;

  renderTeacherStudentsList();
}

window.switchTeacherTab = function(tabName) {
  ['Students', 'Curriculum', 'Homework', 'Backup'].forEach(t => {
    const btn = document.getElementById('tabBtn' + t);
    const pane = document.getElementById('tPane' + t);
    if (btn) btn.classList.remove('active');
    if (pane) pane.style.display = 'none';
  });

  const activeBtn = document.getElementById('tabBtn' + cap(tabName));
  const activePane = document.getElementById('tPane' + cap(tabName));
  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.style.display = 'block';

  if (tabName === 'students')   renderTeacherStudentsList();
  if (tabName === 'curriculum') loadCurriculumQuestions(document.getElementById('curriculumSubjectSelect').value);
  if (tabName === 'homework')   renderHomeworkPane();
};

function renderTeacherStudentsList() {
  const container = document.getElementById('tuitionStudentsList');
  if (!container) return;
  container.innerHTML = '';

  tuitionDB.students.forEach(st => {
    const prog = tuitionDB.studentProgress[st.id] || defaultStudentProgress();
    const acc = prog.totalQuestions > 0 ? Math.round((prog.correctAnswers / prog.totalQuestions) * 100) : 0;
    const isHwDone = (tuitionDB.homework.completedBy||[]).includes(st.id);

    const card = document.createElement('div');
    card.className = 'student-manage-card';
    card.innerHTML = `
      <div class="student-card-top">
        <div class="student-avatar">${st.avatar}</div>
        <div class="student-info">
          <div class="student-name-text">${st.name}</div>
          <div class="student-grade-sub">${st.grade} • PIN: ${st.pin} • 📞 ${st.phone||'இல்லை'}</div>
        </div>
        <span style="font-size:0.75rem;padding:0.2rem 0.5rem;border-radius:var(--rounded-full);font-weight:700;background:${isHwDone ? '#dcfce7' : '#fee2e2'};color:${isHwDone ? '#15803d' : '#b91c1c'}">
          ${isHwDone ? 'வீட்டுப்பாடம் முடிந்தது' : 'நிலுவை'}
        </span>
      </div>

      <div class="student-metrics">
        <div>
          <div style="font-size:0.95rem;font-weight:800;color:var(--gold)">⭐ ${prog.points || 0}</div>
          <div style="font-size:0.68rem;color:var(--neutral-light)">புள்ளிகள்</div>
        </div>
        <div>
          <div style="font-size:0.95rem;font-weight:800;color:var(--tertiary)">🔥 ${prog.streak || 0}</div>
          <div style="font-size:0.68rem;color:var(--neutral-light)">நாள் தொடர்ச்சி</div>
        </div>
        <div>
          <div style="font-size:0.95rem;font-weight:800;color:var(--secondary)">${acc}%</div>
          <div style="font-size:0.68rem;color:var(--neutral-light)">தேர்ச்சி</div>
        </div>
      </div>

      <div class="student-actions-row">
        <button class="btn-small" style="background:var(--primary);color:white" onclick="viewStudentDetail('${st.id}')">📊 முழு விவரம்</button>
        <button class="btn-small" style="background:#059669;color:white" onclick="sendParentWhatsApp('${st.id}')">📲 பெற்றோருக்கு WhatsApp அறிக்கை</button>
        <button class="btn-small" style="background:#fee2e2;color:#b91c1c" onclick="deleteStudent('${st.id}')">🗑️ நீக்கு</button>
      </div>`;
    container.appendChild(card);
  });
}

window.viewStudentDetail = function(studentId) {
  const st = tuitionDB.students.find(s => s.id === studentId);
  if (!st) return;
  const prog = tuitionDB.studentProgress[studentId] || defaultStudentProgress();
  const acc = prog.totalQuestions > 0 ? Math.round((prog.correctAnswers / prog.totalQuestions) * 100) : 0;

  document.getElementById('modalStuName').textContent = `${st.avatar} ${st.name} — கற்றல் பலன்`;

  let subjBars = '';
  SUBJECTS.forEach(sub => {
    const r = (prog.quizResults||{})[sub.id] || { correct: 0, total: 0 };
    const pct = r.total > 0 ? Math.round((r.correct / r.total) * 100) : 0;
    subjBars += `
      <div style="margin-bottom:0.6rem">
        <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:0.2rem">
          <span>${sub.icon} ${sub.name}</span>
          <span style="font-weight:700;color:${sub.color}">${r.correct}/${r.total} (${pct}%)</span>
        </div>
        <div style="height:8px;background:#e2e8f0;border-radius:999px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${sub.color}"></div>
        </div>
      </div>`;
  });

  document.getElementById('studentDetailBody').innerHTML = `
    <div style="background:var(--surface);padding:0.75rem;border-radius:var(--rounded-md);margin-bottom:0.75rem">
      <div style="display:flex;justify-content:space-between">
        <div>
          <strong>வகுப்பு:</strong> ${st.grade}<br>
          <strong>மாணவர் PIN:</strong> ${st.pin}
        </div>
        <div style="text-align:right">
          <strong>மொத்த புள்ளிகள்:</strong> ⭐ ${prog.points || 0}<br>
          <strong>சராசரி தேர்ச்சி:</strong> ${acc}%
        </div>
      </div>
    </div>

    <h4 style="font-size:0.9rem;margin-bottom:0.5rem">பாடவாரி பலன் (Subject Breakdown):</h4>
    ${subjBars}

    <button class="btn-primary" style="width:100%;margin-top:1rem" onclick="sendParentWhatsApp('${st.id}')">
      📲 வாட்ஸ்அப்பில் பெற்றோருக்கு அறிக்கை அனுப்பு
    </button>`;

  document.getElementById('studentDetailModal').classList.add('show');
};
window.closeStudentDetailModal = function() {
  document.getElementById('studentDetailModal').classList.remove('show');
};

window.sendParentWhatsApp = function(studentId) {
  const st = tuitionDB.students.find(s => s.id === studentId);
  if (!st) return;
  const prog = tuitionDB.studentProgress[studentId] || defaultStudentProgress();
  const acc = prog.totalQuestions > 0 ? Math.round((prog.correctAnswers / prog.totalQuestions) * 100) : 0;

  const msg = `🎓 *அறிவுக் களம் 6 — டியூஷன் மாணவர் முன்னேற்ற அறிக்கை* 🦉\n\n` +
    `வணக்கம் பெற்றோர்! உங்கள் குழந்தை *${st.name}* (${st.grade}) பற்றிய இன்றைய கல்வி நிலை:\n\n` +
    `⭐ *மொத்த புள்ளிகள்:* ${prog.points || 0}\n` +
    `🔥 *தொடர் கற்றல்:* ${prog.streak || 0} நாட்கள்\n` +
    `🎯 *சரியான விடை சதவீதம்:* ${acc}%\n` +
    `📚 *முடித்த பாட அலகுகள்:* ${(prog.lessonsCompleted||[]).length} அலகுகள்\n` +
    `🏆 *பெற்ற பதக்கங்கள்:* ${(prog.badges||[]).length} சாதனைகள்\n\n` +
    `ஆசிரியர் குறிப்பு: தொடர்ந்து வீட்டில் பயில ஊக்கப்படுத்துங்கள்! 👍\n` +
    `— செல்வி ஆசிரியர் (டியூஷன் மையம்)`;

  const url = `https://wa.me/${st.phone ? '91'+st.phone : ''}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

window.sendProgressToTeacherWhatsApp = function() {
  const s = getActiveStudent();
  const p = getProgress();
  const acc = p.totalQuestions > 0 ? Math.round((p.correctAnswers / p.totalQuestions) * 100) : 0;

  const msg = `வணக்கம் ஆசிரியர்! நான் *${s.name}* (${s.grade}).\n` +
    `எனது இன்றைய 'அறிவுக் களம்' கற்றல் நிலை:\n` +
    `⭐ புள்ளிகள்: ${p.points || 0}\n` +
    `🔥 தொடர் படிப்பு: ${p.streak || 0} நாள்\n` +
    `🎯 தேர்ச்சி: ${acc}%\n` +
    `வீட்டுப்பாடம் மற்றும் பயிற்சிகளை முடித்துவிட்டேன்! நன்றி.`;

  const phone = tuitionDB.teacher.phone || '';
  const url = `https://wa.me/${phone ? '91'+phone : ''}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
};

/* ── Add / Delete Student ── */
window.openAddStudentModal = function() {
  document.getElementById('addStudentModal').classList.add('show');
};
window.closeAddStudentModal = function() {
  document.getElementById('addStudentModal').classList.remove('show');
};

window.saveNewStudent = function() {
  const name = document.getElementById('newStuName').value.trim();
  const grade = document.getElementById('newStuGrade').value.trim() || '6A';
  const phone = document.getElementById('newStuPhone').value.trim();
  const pin = document.getElementById('newStuPin').value.trim() || '1234';
  const avatar = document.getElementById('newStuAvatar').value;

  if (!name) { alert('மாணவர் பெயர் உள்ளிடவும்!'); return; }

  const newStu = {
    id: 'stu_' + Date.now(),
    name, grade, phone, pin, avatar,
    joined: new Date().toISOString().slice(0, 10)
  };

  tuitionDB.students.push(newStu);
  tuitionDB.studentProgress[newStu.id] = defaultStudentProgress();
  saveTuitionDB();

  closeAddStudentModal();
  renderTeacherStudentsList();
  showReward('✅ புதிய மாணவர் சேர்க்கப்பட்டார்!');
};

window.deleteStudent = function(studentId) {
  if (tuitionDB.students.length <= 1) {
    alert('குறைந்தது ஒரு மாணவர் இருக்க வேண்டும்!'); return;
  }
  const st = tuitionDB.students.find(s => s.id === studentId);
  if (!confirm(`"${st.name}" மாணவரை நீக்க உறுதி செய்கிறீர்களா?`)) return;

  tuitionDB.students = tuitionDB.students.filter(s => s.id !== studentId);
  delete tuitionDB.studentProgress[studentId];
  if (tuitionDB.activeUserId === studentId) {
    tuitionDB.activeUserId = tuitionDB.students[0].id;
  }
  saveTuitionDB();
  renderTeacherStudentsList();
  showReward('மாணவர் நீக்கப்பட்டார்');
};

/* ─────────────────────────────────────────────────────────────
   CURRICULUM CRUD (CHAPTERS & QUESTIONS)
───────────────────────────────────────────────────────────── */
async function loadCurriculumQuestions(subjectId) {
  const container = document.getElementById('curriculumQuestionsList');
  if (!container) return;
  container.innerHTML = '<div style="padding:1rem;color:var(--neutral-light)">⏳ ஏற்றுகிறது...</div>';

  const data = await loadData(subjectId);
  if (!data) { container.innerHTML = '<div>ஏற்றல் பிழை</div>'; return; }

  container.innerHTML = '';
  data.chapters.forEach((ch, cIdx) => {
    const chBox = document.createElement('div');
    chBox.className = 'lesson-content';
    chBox.style.marginBottom = '0.75rem';

    let qsHTML = '';
    (ch.questions || []).forEach((q, qIdx) => {
      qsHTML += `
        <div style="border-top:1px solid var(--neutral-border-light);padding:0.5rem 0;display:flex;justify-content:space-between;align-items:flex-start">
          <div style="flex:1">
            <span style="font-weight:700;font-size:0.8rem">வி ${qIdx+1}:</span>
            <span style="font-size:0.82rem">${q.question}</span>
            <div style="font-size:0.72rem;color:var(--secondary);margin-top:0.2rem">சரி: ${q.options?.[q.correctAnswer] || ''}</div>
          </div>
          <button class="btn-small" style="background:#fee2e2;color:#b91c1c;padding:0.2rem 0.5rem;font-size:0.7rem" onclick="deleteQuestion('${subjectId}','${q.id}')">நீக்கு</button>
        </div>`;
    });

    chBox.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">
        <strong>அலகு ${cIdx+1}: ${ch.name}</strong>
        <span style="font-size:0.75rem;color:var(--neutral-light)">${(ch.questions||[]).length} வினாக்கள்</span>
      </div>
      <div>${qsHTML}</div>`;
    container.appendChild(chBox);
  });
}
window.loadCurriculumQuestions = loadCurriculumQuestions;

window.openAddChapterModal = function() {
  document.getElementById('addChapterModal').classList.add('show');
};
window.closeAddChapterModal = function() {
  document.getElementById('addChapterModal').classList.remove('show');
};

window.saveNewChapter = function() {
  const subj = document.getElementById('newChSubject').value;
  const name = document.getElementById('newChName').value.trim();
  const nameEn = document.getElementById('newChNameEn').value.trim();
  const term = document.getElementById('newChTerm').value.trim() || 'பருவம் 1';

  if (!name) { alert('அலகு பெயர் உள்ளிடவும்!'); return; }

  const newCh = {
    id: `${subj}-custom-${Date.now()}`,
    name, nameEn, term,
    lessons: [{ title: name, titleEn: nameEn, explanation: 'பாட விளக்கம் ஆசிரியரால் விரைவில் சேர்க்கப்படும்.', keyPoints:[], verified: true }],
    questions: []
  };

  if (!tuitionDB.customCurriculum[subj]) tuitionDB.customCurriculum[subj] = { chapters: [], questions: [] };
  if (!tuitionDB.customCurriculum[subj].chapters) tuitionDB.customCurriculum[subj].chapters = [];
  tuitionDB.customCurriculum[subj].chapters.push(newCh);
  saveTuitionDB();

  closeAddChapterModal();
  loadCurriculumQuestions(subj);
  showReward('✅ புதிய அலகு சேர்க்கப்பட்டது!');
};

window.showAddQuestion = function() { nav('addQuestion'); };

window.saveNewQuestion = function() {
  const subjectId = document.getElementById('addQSubject').value;
  const question  = document.getElementById('addQText').value.trim();
  const opts = [0,1,2,3].map(i => document.getElementById(`addQOpt${i}`).value.trim());
  const correctAnswer = parseInt(document.getElementById('addQCorrect').value);
  const explanation   = document.getElementById('addQExpl').value.trim();
  const hint          = document.getElementById('addQHint').value.trim();
  const difficulty    = parseInt(document.getElementById('addQDiff').value);

  if (!question || opts.some(o => !o)) {
    alert('அனைத்து தகவல்களையும் நிரப்புங்கள்!'); return;
  }

  const q = {
    id: 'custom_' + Date.now(),
    type: 'mcq', subject: subjectId,
    question, options: opts, correctAnswer,
    explanation: explanation || 'சரியான விடை: ' + opts[correctAnswer],
    hint: hint || 'கவனமாக யோசியுங்கள்!',
    difficulty, verified: true, custom: true
  };

  if (!tuitionDB.customCurriculum[subjectId]) tuitionDB.customCurriculum[subjectId] = { chapters: [], questions: [] };
  if (!tuitionDB.customCurriculum[subjectId].questions) tuitionDB.customCurriculum[subjectId].questions = [];
  tuitionDB.customCurriculum[subjectId].questions.push(q);
  saveTuitionDB();

  showModal('✅','வினா சேர்க்கப்பட்டது!',
    `"${question.slice(0,40)}..." வினா வங்கியில் சேர்க்கப்பட்டது.`,
    [{ label:'சரி', fn: () => { closeModal(); nav('parent'); switchTeacherTab('curriculum'); } }]);
};

window.deleteQuestion = function(subjectId, questionId) {
  if (!confirm('இந்த வினாவை நீக்க உறுதி செய்கிறீர்களா?')) return;
  const custom = tuitionDB.customCurriculum?.[subjectId];
  if (custom && custom.questions) {
    custom.questions = custom.questions.filter(q => q.id !== questionId);
  }
  saveTuitionDB();
  loadCurriculumQuestions(subjectId);
  showReward('வினா நீக்கப்பட்டது');
};

/* ─────────────────────────────────────────────────────────────
   HOMEWORK PANE
───────────────────────────────────────────────────────────── */
function renderHomeworkPane() {
  const hw = tuitionDB.homework;
  document.getElementById('hwInputTitle').value = hw.title;
  document.getElementById('hwInputSubject').value = hw.subject;
  document.getElementById('hwInputDueDate').value = hw.dueDate;
  document.getElementById('hwInputNotes').value = hw.notes;

  const list = document.getElementById('homeworkCompletionList');
  list.innerHTML = '';
  tuitionDB.students.forEach(st => {
    const isDone = (hw.completedBy || []).includes(st.id);
    list.innerHTML += `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;border-bottom:1px solid var(--neutral-border-light)">
        <span>${st.avatar} ${st.name} (${st.grade})</span>
        <span style="font-size:0.75rem;padding:0.2rem 0.5rem;border-radius:var(--rounded-full);font-weight:700;background:${isDone ? '#dcfce7' : '#fee2e2'};color:${isDone ? '#15803d' : '#b91c1c'}">
          ${isDone ? '✅ முடிந்தது' : '⏳ நிலுவை'}
        </span>
      </div>`;
  });
}

window.saveHomework = function() {
  const title = document.getElementById('hwInputTitle').value.trim();
  const subject = document.getElementById('hwInputSubject').value;
  const dueDate = document.getElementById('hwInputDueDate').value.trim();
  const notes = document.getElementById('hwInputNotes').value.trim();

  if (!title) { alert('தலைப்பு உள்ளிடவும்!'); return; }

  tuitionDB.homework = {
    id: 'hw_' + Date.now(),
    title, subject, dueDate, notes,
    chapterId: `${subject}-ch1`,
    completedBy: []
  };
  saveTuitionDB();
  renderHomeworkPane();
  showReward('💾 வீட்டுப்பாடம் அறிவிக்கப்பட்டது!');
};

/* ─────────────────────────────────────────────────────────────
   LOGIN / PROFILE SWITCHER MODAL
───────────────────────────────────────────────────────────── */
window.openLoginModal = function() {
  renderLoginStudentsGrid();
  document.getElementById('studentPinBox').style.display = 'none';
  document.getElementById('studentPinErr').style.display = 'none';
  document.getElementById('loginModal').classList.add('show');
};

window.closeLoginModal = function() {
  document.getElementById('loginModal').classList.remove('show');
};

function renderLoginStudentsGrid() {
  const grid = document.getElementById('loginStudentsGrid');
  grid.innerHTML = '';
  tuitionDB.students.forEach(st => {
    const isCur = st.id === tuitionDB.activeUserId;
    const div = document.createElement('div');
    div.className = `user-select-item ${isCur ? 'selected' : ''}`;
    div.onclick = () => selectStudentForLogin(st.id);
    div.innerHTML = `
      <div style="font-size:2rem">${st.avatar}</div>
      <div style="font-weight:700;font-size:0.9rem">${st.name}</div>
      <div style="font-size:0.7rem;color:var(--neutral-light)">${st.grade}</div>
      ${isCur ? '<span style="font-size:0.65rem;color:var(--primary);font-weight:800;margin-top:0.2rem">தற்போது செயலில்</span>' : ''}`;
    grid.appendChild(div);
  });
}

window.selectStudentForLogin = function(studentId) {
  STATE.pendingLoginStudentId = studentId;
  const st = tuitionDB.students.find(s => s.id === studentId);
  document.getElementById('pinPromptName').textContent = `${st.avatar} ${st.name} — 4-இலக்க PIN:`;
  document.getElementById('inputStudentPin').value = '';
  document.getElementById('studentPinErr').style.display = 'none';
  document.getElementById('studentPinBox').style.display = 'block';
  document.getElementById('inputStudentPin').focus();
};

window.submitStudentLogin = function() {
  const st = tuitionDB.students.find(s => s.id === STATE.pendingLoginStudentId);
  if (!st) return;
  const pin = document.getElementById('inputStudentPin').value.trim();
  if (pin === st.pin || pin === tuitionDB.teacher.pin) {
    tuitionDB.activeUserId = st.id;
    saveTuitionDB();
    closeLoginModal();
    refreshTopBar();
    renderHome();
    showReward(`வணக்கம் ${st.name}! 👋`);
  } else {
    document.getElementById('studentPinErr').style.display = 'block';
  }
};

/* ─────────────────────────────────────────────────────────────
   BACKUP, RESTORE & SETTINGS
───────────────────────────────────────────────────────────── */
window.exportJSON = function() {
  const blob = new Blob([JSON.stringify(tuitionDB, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `arivu_kalam_tuition_${new Date().toISOString().slice(0, 10)}.json`
  });
  a.click(); URL.revokeObjectURL(a.href);
};

window.importJSON = function(ev) {
  const file = ev.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const d = JSON.parse(e.target.result);
      if (!Array.isArray(d.students)) throw new Error('bad format');
      tuitionDB = d;
      saveTuitionDB();
      showModal('✅','பதிவேற்றம் வெற்றி!','டியூஷன் தரவு வெற்றிகரமாக மீட்டமைக்கப்பட்டது.',[{ label: 'சரி', fn: closeModal }]);
      renderTeacherDashboard();
      renderHome();
    } catch(err) {
      showModal('❌','பிழை','JSON கோப்பு சரியான வடிவத்தில் இல்லை.',[{ label: 'சரி', fn: closeModal }]);
    }
  };
  reader.readAsText(file);
  ev.target.value = '';
};

window.openChangePinModal = function() {
  const cur = prompt('புதிய 4-இலக்க ஆசிரியர் PIN உள்ளிடவும்:', tuitionDB.teacher.pin || '1234');
  if (cur && cur.length >= 4) {
    tuitionDB.teacher.pin = cur;
    saveTuitionDB();
    alert('ஆசிரியர் PIN மாற்றப்பட்டது!');
  }
};

window.confirmResetProgress = function() {
  showModal('⚠️','முன்னேற்றம் மீட்டமைக்கவா?',
    'அனைத்து மாணவர்கள், வினாக்கள், பயிற்சி தரவுகள் ஆரம்ப நிலைக்கு மீட்டமைக்கப்படும்! இது திரும்ப பெற முடியாது.',
    [{ label: 'ரத்து செய்', fn: closeModal }, { label: '🗑️ மீட்டமை', fn: doReset }]);
};

function doReset() {
  tuitionDB = initialTuitionDB();
  saveTuitionDB();
  closeModal();
  nav('home');
}
window.resetProgress = doReset;

/* ── Settings ── */
window.toggleSetting = function(key) {
  const s = tuitionDB.settings = tuitionDB.settings || {};
  s[key] = !s[key];
  saveTuitionDB();
  const el = document.getElementById('toggle' + cap(key));
  if (el) el.classList.toggle('active', s[key]);
  if (key === 'dark') applyDark();
};

window.changeFontSize = function(d) {
  const s = tuitionDB.settings = tuitionDB.settings || {};
  s.fontSize = Math.max(13, Math.min(20, (s.fontSize || 16) + d));
  document.documentElement.style.fontSize = s.fontSize + 'px';
  saveTuitionDB();
};

function applyDark() {
  document.body.classList.toggle('dark-mode', !!(tuitionDB.settings||{}).dark);
}

/* ─────────────────────────────────────────────────────────────
   MODAL ACTIONS
───────────────────────────────────────────────────────────── */
const _modalFns = {};
function showModal(icon, title, text, actions = []) {
  document.getElementById('modalIcon').textContent  = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').textContent  = text;

  const wrap = document.getElementById('modalActions');
  wrap.innerHTML = '';
  actions.forEach((a, i) => {
    const k = 'mfn_' + i;
    _modalFns[k] = a.fn;
    const btn = document.createElement('button');
    btn.className = (a.label.includes('மீட்') || a.label.includes('🗑️')) ? 'btn-outline' : 'btn-primary';
    btn.style.fontSize = '.9rem';
    btn.textContent = a.label;
    btn.onclick = () => { if (_modalFns[k]) _modalFns[k](); };
    wrap.appendChild(btn);
  });
  document.getElementById('modalOverlay').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}
window.closeModal = closeModal;

/* ─────────────────────────────────────────────────────────────
   REWARD POPUP & SOUND & TTS
───────────────────────────────────────────────────────────── */
let _rewardTimer = null;
function showReward(txt) {
  const pop = document.getElementById('rewardPopup');
  if (!pop) return;
  document.getElementById('rewardText').textContent = txt;
  pop.classList.add('show');
  clearTimeout(_rewardTimer);
  _rewardTimer = setTimeout(() => pop.classList.remove('show'), 1600);
}

function speakText(btn, text) {
  if (!(tuitionDB.settings||{}).tts) return;
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text || '');
  u.lang = 'ta-IN';
  u.rate = 0.85;
  if (btn) {
    btn.textContent = '⏸ நிறுத்து';
    u.onend = () => { if (btn) btn.textContent = '🔊 வாசி'; };
  }
  window.speechSynthesis.speak(u);
}
window.speakText = speakText;

function playSound(type) {
  if (!(tuitionDB.settings||{}).sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
    } else {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.1);
    }
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
  } catch(e) {}
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ─────────────────────────────────────────────────────────────
   SERVICE WORKER
───────────────────────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(r => console.log('SW scope:', r.scope))
    .catch(e => console.log('SW skip:', e.message));
}

/* ─────────────────────────────────────────────────────────────
   BOOT
───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const s = tuitionDB.settings || {};
  applyDark();
  if (s.fontSize) document.documentElement.style.fontSize = s.fontSize + 'px';
  ['Sound', 'TTS', 'Dark'].forEach(k => {
    const el = document.getElementById('toggle' + k);
    if (el) el.classList.toggle('active', !!s[k.toLowerCase()]);
  });

  // Wire AI tutor input
  document.getElementById('tutorSendBtn')?.addEventListener('click', sendTutorMessage);
  document.getElementById('tutorInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') sendTutorMessage(); });

  // Daily challenge & start learning buttons
  document.getElementById('dailyChallengeBtn')?.addEventListener('click', startDailyChallenge);
  document.getElementById('startLearningBtn')?.addEventListener('click', () => nav('subjects'));

  // Close modals on backdrop click
  ['modalOverlay', 'loginModal', 'addStudentModal', 'addChapterModal', 'newPostModal', 'studentDetailModal'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', e => {
      if (e.target === e.currentTarget) e.currentTarget.classList.remove('show');
    });
  });

  // Time tracking per student
  setInterval(() => {
    if (document.visibilityState === 'visible' && STATE.screen !== 'home') {
      const p = getProgress();
      p.timeSpent = (p.timeSpent || 0) + 1;
      if ((p.timeSpent % 5) === 0) saveTuitionDB();
    }
  }, 60000);

  nav('home');
  console.log('%cஅறிவுக் களம் 6 v2.0 (Tuition Edition) ✅','color:#1B56D3;font-size:1.1rem;font-weight:bold');
});
