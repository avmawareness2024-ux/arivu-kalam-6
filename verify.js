const fs = require('fs');
const path = require('path');
const http = require('http');

const baseDir = path.resolve(__dirname);

console.log('=== 1. CHECKING JSON DATA FILES ===');
const subjects = ['tamil', 'english', 'mathematics', 'science', 'social-science'];
let totalQ = 0;
let totalChapters = 0;

subjects.forEach(s => {
  const p = path.join(baseDir, 'data', s + '.json');
  if (!fs.existsSync(p)) {
    console.error(`MISSING: ${p}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const qCount = data.chapters.reduce((acc, c) => acc + (c.questions ? c.questions.length : 0), 0);
  totalChapters += data.chapters.length;
  totalQ += qCount;
  console.log(`✓ ${s.padEnd(15)}: ${data.chapters.length} chapters, ${qCount} questions`);
});
console.log(`Total: ${totalChapters} chapters, ${totalQ} questions across 5 subjects.`);

console.log('\n=== 2. CHECKING DOM IDS (app.js vs index.html) ===');
const html = fs.readFileSync(path.join(baseDir, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(baseDir, 'app.js'), 'utf8');

const idRegex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const usedIds = new Set();
while ((match = idRegex.exec(js)) !== null) {
  usedIds.add(match[1]);
}

const missingIds = [];
usedIds.forEach(id => {
  // Check if ID is in HTML or dynamically generated in templates
  if (!html.includes(`id="${id}"`) && !html.includes(`id='${id}'`)) {
    // Check if it's rendered dynamically in app.js
    if (!js.includes(`id="${id}"`) && !js.includes(`id='${id}'`)) {
      missingIds.push(id);
    }
  }
});

console.log(`Total getElementById queries checked: ${usedIds.size}`);
if (missingIds.length > 0) {
  console.warn('⚠️ Potentially missing DOM IDs:', missingIds);
} else {
  console.log('✓ All DOM element references resolved correctly!');
}

console.log('\n=== 3. CHECKING NAVIGATION IDS ===');
const navMatches = [...js.matchAll(/nav\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
const uniqueNavs = [...new Set(navMatches)];
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-([a-z])/g, (_,c)=>c.toUpperCase());
}
uniqueNavs.forEach(scr => {
  const targetId = 'screen' + cap(scr);
  const exists = html.includes(`id="${targetId}"`) || js.includes(`id="${targetId}"`);
  console.log(`Screen "${scr}" -> #${targetId}: ${exists ? '✓ Exists' : '❌ MISSING!'}`);
});

console.log('\n=== Verification script done ===');
