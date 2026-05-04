// Build wrapper - uses system node to call npm from correct dir
const { spawn } = require('child_process');

const projectDir = 'C:\\Users\\Alain\\workspace\\colorimagiques\\webapp\\frontend';
const npmPath = 'C:\\Program Files\\nodejs\\npm.cmd';

console.log('=== BUILD ColoriMagiques Frontend ===');
console.log('Project dir:', projectDir);
console.log('npm:', npmPath);

const child = spawn(npmPath, ['run', 'build'], {
  cwd: projectDir,
  shell: true,
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log('=== EXIT:', code, '===');
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Error:', err.message);
  process.exit(1);
});