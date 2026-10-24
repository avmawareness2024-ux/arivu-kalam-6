# அறிவுக் களம் 6 — Arivu Kalam 6
## தமிழ்நாடு 6ஆம் வகுப்பு | Grade 6 Learning App

> 📱 **இலவச, offline-ready, mobile-friendly educational app for Grade 6 Tamil Nadu students**

---

## 🚀 Running the App (Local Server)

### முதன்மை வழிமுறை (Recommended):
```bash
cd C:\Users\avmaw\.gemini\antigravity\scratch\arivu-kalam-6
node server.js
```
திரையில் தோன்றும் முகவரியை உலாவியில் திறக்கவும்:
- கணினியில்: **http://localhost:8080**
- செல்போனில் (ஒரே Wi-Fi): **http://192.168.1.2:8080** (அல்லது உங்கள் கணினி காட்டும் IP முகவரி)

---

## 📱 செல்போனில் நிறுவி பயன்படுத்துவது எப்படி? (PWA)

1. உங்கள் கணினியும் செல்போனும் **ஒரே Wi-Fi** நெட்வொர்க்கில் இருப்பதை உறுதிசெய்யவும்.
2. செல்போன் Chrome / Browser-ல் `http://192.168.1.2:8080` என்ற முகவரியை உள்ளிடவும்.
3. உலாவி மெனுவில் (3 புள்ளிகள்) **"Add to Home Screen"** அல்லது **"Install App"** (முகப்புத் திரையில் சேர்) என்பதை அழுத்தவும்.
4. இப்போது உங்கள் மொபைலில் செயலி நிறுவப்பட்டு, இணையம் இல்லாமலேயே (Offline) முழுமையாக வேலை செய்யும்!

---

## 📁 File Structure

```
arivu-kalam-6/
├── index.html          ← Main app (all 11 screens)
├── styles.css          ← Complete styling (Stitch design system)
├── app.js              ← Full app logic, quiz engine, AI tutor
├── manifest.json       ← PWA manifest
├── service-worker.js   ← Offline caching
├── README.md           ← This file
├── assets/
│   └── icons/          ← App icons
└── data/
    ├── tamil.json          ← தமிழ் (3 chapters, 16 questions)
    ├── english.json        ← English (3 chapters, 16 questions)
    ├── mathematics.json    ← கணிதம் (3 chapters, 17 questions)
    ├── science.json        ← அறிவியல் (3 chapters, 16 questions)
    └── social-science.json ← சமூக அறிவியல் (3 chapters, 16 questions)
```

---

## ✅ Implemented Features

### Core Learning
- [x] 5 subjects: Tamil, English, Mathematics, Science, Social Science
- [x] 3 chapters per subject (15 total chapters)
- [x] 81 quiz questions (16+ per subject)
- [x] Lesson explanations in Tamil with English terminology
- [x] Key points summary for each lesson

### Quiz Engine
- [x] Multiple choice questions (MCQ)
- [x] True/False questions
- [x] Progress bar (question 1/5)
- [x] Anti-double-click points protection
- [x] Hint system (💡 குறிப்பு button)
- [x] Step-by-step explanation after answer
- [x] Retry quiz option
- [x] Score summary screen

### Gamification
- [x] Points system (+10 correct, +20 lesson complete, +30 quiz complete)
- [x] 6 Badges (unlocks automatically)
- [x] Learning streak tracking
- [x] Progress bars per subject
- [x] Reward popup animations
- [x] Encouraging messages in Tamil

### AI Tutor
- [x] Rule-based offline tutor ("அறிவு நண்பன்")
- [x] Subject selector (5 subjects)
- [x] Keyword-based Tamil responses
- [x] Chat interface

### Parent/Teacher Section
- [x] PIN-protected (default: 1234)
- [x] Add custom questions
- [x] Export progress as JSON
- [x] Import custom question bank
- [x] Reset progress (with confirmation)
- [x] Progress report view

### PWA / Offline
- [x] Service worker (offline caching)
- [x] Web App Manifest
- [x] Installable on Android phone

### Accessibility
- [x] Text-to-Speech (TTS) for questions
- [x] Font size controls
- [x] Dark mode toggle
- [x] ARIA labels
- [x] Touch-friendly (min 48px targets)
- [x] No personal data required

---

## 📝 Adding Verified Curriculum Questions

Edit the JSON files in `data/` folder:

```json
{
  "id": "unique_id",
  "type": "mcq",
  "question": "கேள்வி...",
  "options": ["விடை அ", "விடை ஆ", "விடை இ", "விடை ஈ"],
  "correctAnswer": 0,
  "explanation": "விளக்கம்...",
  "hint": "குறிப்பு...",
  "difficulty": 1,
  "verified": true
}
```

Set `"verified": true` when confirmed from official TN textbook.

---

## ⚠️ Important Notes

- All curriculum content marked `"verified": false` = **sample content**
- Cross-check with official Tamil Nadu State Board Grade 6 textbooks
- Teacher PIN `1234` — change in app settings
- All data stored locally (localStorage) — no internet required after first load

---

## 🔮 Future Features (Optional)

- [ ] Real Gemini AI API integration for tutor
- [ ] Animated characters / mascot
- [ ] Audio pronunciation for English words
- [ ] Match-the-following games
- [ ] Science animation videos
- [ ] Multi-language interface (Tamil/English toggle)
- [ ] Student profiles (offline)

---

**உருவாக்கம்: 2026 | இலவச கல்வி செயலி 🎓**
