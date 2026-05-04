// ColoriMagiques Frontend Build via Node.js child_process
const { spawn } = require('child_process');
const path = require('path');

const npmPath = path.join(process.env.ProgramFiles || 'C:\\Program Files', 'nodejs', 'npm.cmd');
const frontendDir = __dirname;

console.log('=== BUILD ColoriMagiques Frontend ===');
console.log('Working dir:', frontendDir);

const npm = spawn(npmPath, ['run', 'build'], {
  cwd: frontendDir,
  shell: true,
  stdio: 'inherit'
});

npm.on('close', (code) => {
  console.log('=== EXIT CODE:', code, '===');
  process.exit(code);
});

npm.on('error', (err) => {
  console.error('Spawn error:', err);
  process.exit(1);
});