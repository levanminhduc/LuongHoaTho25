// Start NestJS with detailed logs
const { spawn } = require('child_process');

console.log('🚀 Starting NestJS with detailed logs...');

const nestProcess = spawn('npm', ['run', 'start:dev'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

nestProcess.stdout.on('data', (data) => {
  console.log('STDOUT:', data.toString());
});

nestProcess.stderr.on('data', (data) => {
  console.error('STDERR:', data.toString());
});

nestProcess.on('error', (error) => {
  console.error('❌ Process error:', error);
});

nestProcess.on('exit', (code, signal) => {
  console.log(`🔚 Process exited with code ${code} and signal ${signal}`);
});

// Kill after 20 seconds
setTimeout(() => {
  console.log('⏰ Killing process after 20 seconds...');
  nestProcess.kill();
}, 20000);
