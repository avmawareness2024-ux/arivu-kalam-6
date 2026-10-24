/**
 * PWA Icon Generator for அறிவுக் களம் 6
 * Creates PNG icons using canvas (no external deps needed)
 * Run: node generate-icons.js
 */

const fs = require('fs');
const path = require('path');

// We'll create minimal valid PNG files using raw bytes
// This generates a simple colored icon without canvas/sharp dependencies

function createSimplePNG(size, bgColor, fgColor, label) {
  const { createCanvas } = (() => {
    try { return require('canvas'); } catch(e) { return null; }
  })() || {};

  if (createCanvas) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#1B56D3');
    grad.addColorStop(1, '#0D9658');
    ctx.fillStyle = grad;
    
    // Rounded rect
    const r = size * 0.2;
    ctx.beginPath();
    ctx.moveTo(r, 0); ctx.lineTo(size-r, 0);
    ctx.arcTo(size, 0, size, r, r);
    ctx.lineTo(size, size-r);
    ctx.arcTo(size, size, size-r, size, r);
    ctx.lineTo(r, size);
    ctx.arcTo(0, size, 0, size-r, r);
    ctx.lineTo(0, r);
    ctx.arcTo(0, 0, r, 0, r);
    ctx.closePath();
    ctx.fill();
    
    // Owl emoji
    ctx.font = `${size*0.45}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🦉', size/2, size*0.42);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = `bold ${size*0.1}px sans-serif`;
    ctx.fillText('அறிவு', size/2, size*0.78);
    ctx.font = `bold ${size*0.08}px sans-serif`;
    ctx.fillText('Arivu Kalam 6', size/2, size*0.9);
    
    return canvas.toBuffer('image/png');
  }
  
  // Fallback: create a minimal valid SVG-based PNG substitute
  // Actually generate a proper SVG and save as .svg with that size info
  return null;
}

// Generate SVG icons (works without canvas package)
function createSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1B56D3"/>
      <stop offset="100%" style="stop-color:#0D9658"/>
    </linearGradient>
    <clipPath id="rounded">
      <rect width="${size}" height="${size}" rx="${size*0.2}" ry="${size*0.2}"/>
    </clipPath>
  </defs>
  <rect width="${size}" height="${size}" rx="${size*0.2}" ry="${size*0.2}" fill="url(#bg)"/>
  <text x="${size/2}" y="${size*0.52}" font-size="${size*0.42}" text-anchor="middle" dominant-baseline="middle">🦉</text>
  <text x="${size/2}" y="${size*0.8}" font-size="${size*0.11}" text-anchor="middle" fill="white" font-weight="bold" font-family="sans-serif">அறிவுக் களம்</text>
  <text x="${size/2}" y="${size*0.92}" font-size="${size*0.08}" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-family="sans-serif">Grade 6</text>
</svg>`;
}

// Create icons directory
const iconsDir = path.join(__dirname, 'assets', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Generate SVG icons for all required sizes
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log(`✅ Created: icon-${size}x${size}.svg`);
});

// Also save the main icon.svg
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), createSVGIcon(512), 'utf8');
console.log('✅ Updated main icon.svg');

console.log('\n🎉 All icons generated in assets/icons/');
console.log('📱 manifest.json will use SVG icons (supported in Chrome/Android)');
