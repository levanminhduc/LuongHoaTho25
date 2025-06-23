#!/usr/bin/env node

/**
 * Dependencies Verification Script
 * Checks if all required dependencies are properly configured
 */

const fs = require('fs');
const path = require('path');

function checkDependencies() {
  console.log('🔍 Checking Dependencies Configuration\n');

  // Check frontend-nextjs/package.json
  const frontendPackageJson = './frontend-nextjs/package.json';
  if (!fs.existsSync(frontendPackageJson)) {
    console.log('❌ frontend-nextjs/package.json not found');
    return false;
  }

  try {
    const packageData = JSON.parse(fs.readFileSync(frontendPackageJson, 'utf8'));
    
    // Required dependencies for the build
    const requiredDeps = [
      'next',
      'tailwindcss',
      'postcss',
      'autoprefixer',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx'
    ];

    console.log('📦 Checking Required Dependencies:');
    let allDepsFound = true;

    for (const dep of requiredDeps) {
      const version = packageData.dependencies?.[dep] || packageData.devDependencies?.[dep];
      if (version) {
        console.log(`✅ ${dep}: ${version}`);
      } else {
        console.log(`❌ ${dep}: NOT FOUND`);
        allDepsFound = false;
      }
    }

    if (!allDepsFound) {
      console.log('\n❌ Missing dependencies detected!');
      return false;
    }

    console.log('\n✅ All required dependencies found');

    // Check if node_modules exists in frontend-nextjs
    const nodeModulesPath = './frontend-nextjs/node_modules';
    if (fs.existsSync(nodeModulesPath)) {
      console.log('✅ node_modules exists in frontend-nextjs/');
    } else {
      console.log('⚠️  node_modules not found in frontend-nextjs/');
      console.log('   This is expected if dependencies are installed at root');
    }

    // Check build configuration files
    const configFiles = [
      './frontend-nextjs/next.config.js',
      './frontend-nextjs/tailwind.config.js',
      './frontend-nextjs/postcss.config.js'
    ];

    console.log('\n📋 Configuration Files:');
    for (const file of configFiles) {
      if (fs.existsSync(file)) {
        console.log(`✅ ${path.basename(file)} exists`);
      } else {
        console.log(`❌ ${path.basename(file)} missing`);
      }
    }

    return true;

  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
    return false;
  }
}

function suggestSolutions() {
  console.log('\n🎯 Recommended Solutions:');
  console.log('');
  console.log('1. **Set Root Directory in Vercel Dashboard:**');
  console.log('   - Go to Project Settings → General');
  console.log('   - Set Root Directory to: frontend-nextjs');
  console.log('   - This will install dependencies in the correct directory');
  console.log('');
  console.log('2. **Alternative: Use vercel.json (current setup):**');
  console.log('   - Install Command: cd frontend-nextjs && npm ci');
  console.log('   - Build Command: cd frontend-nextjs && npm ci && npm run build');
  console.log('   - Output Directory: frontend-nextjs/.next');
  console.log('');
  console.log('3. **Local Test:**');
  console.log('   - Run: cd frontend-nextjs && npm install && npm run build');
  console.log('   - Verify build works locally before deploying');
}

// Run the check
const success = checkDependencies();
suggestSolutions();

if (success) {
  console.log('\n🎉 Dependencies configuration looks good!');
  console.log('💡 If build still fails, use Root Directory setting in Vercel Dashboard');
} else {
  console.log('\n❌ Dependencies configuration issues found.');
  console.log('🔧 Please fix the missing dependencies before deploying.');
  process.exit(1);
}
