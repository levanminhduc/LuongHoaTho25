// Test NestJS startup manually
const { spawn } = require('child_process');
const path = require('path');

console.log('🧪 Testing NestJS startup...');

const nestjsPath = path.join(__dirname, 'backend-nestjs');
console.log('📁 NestJS path:', nestjsPath);

// Try to start NestJS
const nestProcess = spawn('npm', ['run', 'start:dev'], {
  cwd: nestjsPath,
  stdio: 'inherit',
  shell: true
});

nestProcess.on('error', (error) => {
  console.error('❌ NestJS startup error:', error);
});

nestProcess.on('exit', (code) => {
  console.log(`🔚 NestJS process exited with code: ${code}`);
});

// Timeout after 30 seconds
setTimeout(() => {
  console.log('⏰ Timeout - killing NestJS process');
  nestProcess.kill();
}, 30000);
