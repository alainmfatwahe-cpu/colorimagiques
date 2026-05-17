const fs = require('fs');
const path = require('path');

console.log('=== DIAGNOSTIC RAILWAY CONTAINER ===');
console.log('UPLOAD_DIR env:', process.env.UPLOAD_DIR);
console.log('cwd:', process.cwd());
console.log('__dirname-equiv:', __dirname);

const checks = [
  '/app',
  '/app/backend',
  '/app/backend/uploads',
  '/app/backend/uploads/images',
  '/app/backend/uploads/pdfs',
  '/app/uploads',
];

for (const dir of checks) {
  if (fs.existsSync(dir)) {
    try {
      const files = fs.readdirSync(dir);
      console.log(`✓ ${dir} (${files.length} entries):`, files.slice(0, 5));
    } catch (e) {
      console.log(`✗ ${dir} - readdir error:`, e.message);
    }
  } else {
    console.log(`✗ ${dir} - DOES NOT EXIST`);
  }
}

// Find any PNG files anywhere
function find(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    try {
      if (fs.statSync(p).isDirectory()) {
        if (results.length < 10) find(p, results);
      } else if (f.endsWith('.png') || f.endsWith('.pdf')) {
        results.push(p);
      }
    } catch (e) {}
    if (results.length >= 10) break;
  }
  return results;
}

console.log('\nPNG/PDF files found in /app:', find('/app').slice(0, 10));
