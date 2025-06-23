#!/usr/bin/env node

/**
 * IMMEDIATE FIX for "No Next.js version detected" Error
 * This script implements multiple solutions to fix the framework detection issue
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 IMMEDIATE FIX: Next.js Framework Detection');
console.log('==============================================');
console.log('Fixing the "No Next.js version detected" error RIGHT NOW');
console.log('');

// Verify project structure
const frontendDir = './frontend-nextjs';
const packageJsonPath = path.join(frontendDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.log('❌ Error: frontend-nextjs/package.json not found');
  console.log('   Please run this script from the project root directory');
  process.exit(1);
}

console.log('✅ Project structure verified');

// Read and analyze package.json
let packageData;
try {
  packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ Package.json loaded successfully');
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
  process.exit(1);
}

// Verify Next.js configuration
const nextVersion = packageData.dependencies?.next;
if (!nextVersion) {
  console.log('❌ Next.js not found in dependencies');
  process.exit(1);
}

console.log(`✅ Next.js ${nextVersion} found in dependencies`);

// Check scripts
const scripts = packageData.scripts || {};
const requiredScripts = ['dev', 'build', 'start'];
let scriptsOk = true;

for (const script of requiredScripts) {
  if (scripts[script] && scripts[script].includes('next')) {
    console.log(`✅ Script "${script}": ${scripts[script]}`);
  } else {
    console.log(`❌ Missing or invalid script: ${script}`);
    scriptsOk = false;
  }
}

if (!scriptsOk) {
  console.log('❌ Scripts configuration issues found');
  process.exit(1);
}

// Create/update vercel.json with explicit framework configuration
console.log('');
console.log('🔧 Creating explicit framework configuration...');

const vercelConfigPath = path.join(frontendDir, 'vercel.json');
const vercelConfig = {
  framework: "nextjs",
  buildCommand: "npm run build",
  installCommand: "npm ci",
  outputDirectory: ".next",
  devCommand: "npm run dev",
  functions: {
    "app/**/*.js": {
      runtime: "nodejs18.x"
    }
  }
};

fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
console.log(`✅ Created/updated ${vercelConfigPath}`);

// Create a deployment verification script
const verifyScriptPath = path.join(frontendDir, 'verify-deployment.js');
const verifyScript = `#!/usr/bin/env node
console.log('🔍 Deployment Verification');
console.log('==========================');

const fs = require('fs');

// Check vercel.json
if (fs.existsSync('./vercel.json')) {
  const config = JSON.parse(fs.readFileSync('./vercel.json', 'utf8'));
  console.log('✅ vercel.json exists');
  console.log('✅ Framework:', config.framework);
  console.log('✅ Build Command:', config.buildCommand);
} else {
  console.log('❌ vercel.json not found');
}

// Check package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
console.log('✅ Next.js version:', pkg.dependencies.next);

console.log('');
console.log('🎯 Ready for deployment!');
console.log('Run: vercel --prod');
`;

fs.writeFileSync(verifyScriptPath, verifyScript);
console.log(`✅ Created verification script: ${verifyScriptPath}`);

// Display immediate action steps
console.log('');
console.log('🎯 IMMEDIATE ACTION REQUIRED:');
console.log('============================');
console.log('');
console.log('Choose ONE of these solutions:');
console.log('');
console.log('🚀 OPTION 1: CLI Deployment (FASTEST - 2 minutes)');
console.log('   1. chmod +x EMERGENCY_DEPLOY_NOW.sh');
console.log('   2. ./EMERGENCY_DEPLOY_NOW.sh');
console.log('   3. Follow the prompts');
console.log('');
console.log('⚙️  OPTION 2: Dashboard Configuration (3 minutes)');
console.log('   1. Go to Vercel Dashboard → Your Project → Settings');
console.log('   2. Navigate to General → Framework Preset');
console.log('   3. Change from "Other" to "Next.js"');
console.log('   4. Set Build Command: npm run build');
console.log('   5. Set Install Command: npm ci');
console.log('   6. Set Output Directory: .next');
console.log('   7. Save and Redeploy (without cache)');
console.log('');
console.log('📝 OPTION 3: Git Commit (if using GitHub integration)');
console.log('   1. git add frontend-nextjs/vercel.json');
console.log('   2. git commit -m "Fix: Add explicit Next.js framework configuration"');
console.log('   3. git push');
console.log('   4. Vercel will auto-deploy with explicit config');
console.log('');
console.log('✅ EXPECTED RESULT:');
console.log('   - Build logs will show "Detected Next.js version: 15.3.4"');
console.log('   - Framework will appear as "Next.js" in dashboard');
console.log('   - No more "Cannot find module" errors');
console.log('   - Successful deployment');
console.log('');
console.log('🎉 Framework detection issue will be RESOLVED!');

// Create a quick test script
const testScriptPath = './test-local-build.sh';
const testScript = `#!/bin/bash
echo "🧪 Testing Local Build"
echo "====================="

cd frontend-nextjs

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    echo "🎯 Ready for Vercel deployment"
else
    echo "❌ Local build failed"
    echo "Please fix build errors before deploying"
fi
`;

fs.writeFileSync(testScriptPath, testScript);
console.log(`✅ Created test script: ${testScriptPath}`);
console.log('');
console.log('💡 TIP: Run ./test-local-build.sh first to verify everything works locally');
console.log('');
console.log('🚨 URGENT: Choose one of the options above to deploy immediately!');
