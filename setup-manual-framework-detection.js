#!/usr/bin/env node

/**
 * Manual Framework Detection Setup
 * Forces Vercel to recognize Next.js framework
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up Manual Framework Detection for Next.js');
console.log('====================================================');

// Check if we're in the right directory
const frontendPackageJson = './frontend-nextjs/package.json';
if (!fs.existsSync(frontendPackageJson)) {
  console.log('❌ Error: frontend-nextjs/package.json not found');
  console.log('   Please run this script from the project root directory');
  process.exit(1);
}

// Read and verify Next.js configuration
try {
  const packageData = JSON.parse(fs.readFileSync(frontendPackageJson, 'utf8'));
  
  console.log('📦 Verifying Next.js configuration...');
  
  // Check Next.js version
  const nextVersion = packageData.dependencies?.next;
  if (!nextVersion) {
    console.log('❌ Next.js not found in dependencies');
    process.exit(1);
  }
  
  console.log(`✅ Next.js version: ${nextVersion}`);
  
  // Verify required scripts
  const scripts = packageData.scripts || {};
  const requiredScripts = ['dev', 'build', 'start'];
  
  for (const script of requiredScripts) {
    if (scripts[script] && scripts[script].includes('next')) {
      console.log(`✅ Script "${script}": ${scripts[script]}`);
    } else {
      console.log(`❌ Missing or invalid script: ${script}`);
      process.exit(1);
    }
  }
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  process.exit(1);
}

// Create vercel.json with explicit framework configuration
console.log('\n🔧 Creating explicit framework configuration...');

const vercelConfig = {
  framework: "nextjs",
  buildCommand: "npm run build",
  installCommand: "npm install", 
  outputDirectory: ".next",
  devCommand: "npm run dev"
};

const vercelConfigPath = './frontend-nextjs/vercel.json';
fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
console.log(`✅ Created ${vercelConfigPath}`);

// Create deployment instructions
console.log('\n📋 Manual Framework Detection Setup Complete!');
console.log('\n🎯 NEXT STEPS:');
console.log('');
console.log('Option 1: Vercel Dashboard Configuration');
console.log('1. Go to Vercel Dashboard → Your Project → Settings');
console.log('2. Navigate to General → Framework Preset');
console.log('3. Change from "Other" to "Next.js"');
console.log('4. Set Build Command: npm run build');
console.log('5. Set Install Command: npm install');
console.log('6. Set Output Directory: .next');
console.log('7. Save and redeploy');
console.log('');
console.log('Option 2: CLI Deployment (RECOMMENDED)');
console.log('1. cd frontend-nextjs');
console.log('2. npm install -g vercel');
console.log('3. vercel login');
console.log('4. vercel --prod');
console.log('');
console.log('Option 3: GitHub Integration');
console.log('1. Commit the vercel.json file');
console.log('2. Push to trigger automatic deployment');
console.log('3. Vercel will use explicit framework configuration');
console.log('');
console.log('✅ Framework detection should now work correctly!');
console.log('');
console.log('🔍 Verification:');
console.log('- Build logs should show "Detected Next.js version: 15.3.4"');
console.log('- Framework should appear as "Next.js" in dashboard');
console.log('- No "Cannot find module" errors');
console.log('- Successful deployment');

// Create a quick verification script
const verifyScript = `#!/usr/bin/env node
const fs = require('fs');

console.log('🔍 Verifying Framework Detection Setup');
console.log('=====================================');

// Check vercel.json
if (fs.existsSync('./vercel.json')) {
  const config = JSON.parse(fs.readFileSync('./vercel.json', 'utf8'));
  if (config.framework === 'nextjs') {
    console.log('✅ vercel.json configured for Next.js');
  } else {
    console.log('⚠️  vercel.json framework not set to nextjs');
  }
} else {
  console.log('⚠️  vercel.json not found');
}

// Check package.json
if (fs.existsSync('./package.json')) {
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  if (pkg.dependencies?.next) {
    console.log(\`✅ Next.js \${pkg.dependencies.next} in dependencies\`);
  } else {
    console.log('❌ Next.js not found in dependencies');
  }
} else {
  console.log('❌ package.json not found');
}

console.log('\\n🎯 Ready for deployment!');
`;

fs.writeFileSync('./frontend-nextjs/verify-setup.js', verifyScript);
console.log('📝 Created verification script: frontend-nextjs/verify-setup.js');
console.log('   Run with: cd frontend-nextjs && node verify-setup.js');

console.log('\n🎉 Setup complete! Choose one of the deployment options above.');
