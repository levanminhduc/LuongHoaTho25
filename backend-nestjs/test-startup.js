// Simple test to check NestJS startup issues
const { spawn } = require('child_process');

console.log('🧪 Testing NestJS startup issues...');

// Test 1: Check TypeScript compilation
console.log('\n1️⃣ Testing TypeScript compilation...');
const tscProcess = spawn('npx', ['tsc', '--noEmit'], {
  stdio: 'inherit',
  shell: true
});

tscProcess.on('exit', (code) => {
  console.log(`TypeScript compilation exit code: ${code}`);
  
  if (code === 0) {
    console.log('✅ TypeScript compilation successful');
    
    // Test 2: Try to start NestJS
    console.log('\n2️⃣ Testing NestJS startup...');
    const nestProcess = spawn('npm', ['run', 'start:dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Kill after 15 seconds
    setTimeout(() => {
      console.log('\n⏰ Killing NestJS process after 15 seconds...');
      nestProcess.kill();
    }, 15000);
    
    nestProcess.on('exit', (nestCode) => {
      console.log(`NestJS startup exit code: ${nestCode}`);
    });
    
  } else {
    console.log('❌ TypeScript compilation failed');
  }
});

tscProcess.on('error', (error) => {
  console.error('❌ TypeScript test error:', error);
});
