#!/usr/bin/env node

/**
 * Next.js Detection Verification Script
 * Checks if Next.js can be properly detected by Vercel
 */

const fs = require('fs');
const path = require('path');

function checkNextJsDetection() {
  console.log('🔍 Verifying Next.js Detection Configuration\n');

  // Check 1: frontend-nextjs/package.json exists and has Next.js
  const frontendPackageJson = './frontend-nextjs/package.json';
  if (!fs.existsSync(frontendPackageJson)) {
    console.log('❌ frontend-nextjs/package.json not found');
    return false;
  }

  try {
    const packageData = JSON.parse(fs.readFileSync(frontendPackageJson, 'utf8'));
    
    // Check for Next.js in dependencies
    const nextVersion = packageData.dependencies?.next || packageData.devDependencies?.next;
    if (!nextVersion) {
      console.log('❌ Next.js not found in dependencies or devDependencies');
      return false;
    }
    
    console.log(`✅ Next.js ${nextVersion} found in dependencies`);
    
    // Check for required scripts
    const scripts = packageData.scripts || {};
    const hasDevScript = scripts.dev && scripts.dev.includes('next');
    const hasBuildScript = scripts.build && scripts.build.includes('next');
    
    if (!hasDevScript || !hasBuildScript) {
      console.log('⚠️  Missing Next.js scripts (dev/build)');
    } else {
      console.log('✅ Next.js scripts configured correctly');
    }
    
  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
    return false;
  }

  // Check 2: No conflicting vercel.json files
  const rootVercelJson = './vercel.json';
  const frontendVercelJson = './frontend-nextjs/vercel.json';
  
  if (fs.existsSync(rootVercelJson)) {
    console.log('⚠️  Root vercel.json exists - may interfere with detection');
    console.log('   Consider removing it and using Root Directory setting instead');
  } else {
    console.log('✅ No root vercel.json (good for auto-detection)');
  }
  
  if (fs.existsSync(frontendVercelJson)) {
    console.log('⚠️  frontend-nextjs/vercel.json exists - may interfere with detection');
    console.log('   Consider removing it for better auto-detection');
  } else {
    console.log('✅ No frontend vercel.json (good for auto-detection)');
  }

  // Check 3: Next.js config files
  const nextConfigJs = './frontend-nextjs/next.config.js';
  const nextConfigTs = './frontend-nextjs/next.config.ts';
  
  if (fs.existsSync(nextConfigJs) || fs.existsSync(nextConfigTs)) {
    console.log('✅ Next.js config file found');
  } else {
    console.log('⚠️  No Next.js config file found (optional but recommended)');
  }

  console.log('\n📋 Vercel Dashboard Configuration Required:');
  console.log('   Root Directory: frontend-nextjs');
  console.log('   Framework: Next.js (auto-detected)');
  console.log('   Build Command: (leave empty)');
  console.log('   Output Directory: (leave empty)');
  console.log('   Install Command: (leave empty)');

  console.log('\n🎯 Expected Vercel Detection:');
  console.log('   ✅ Framework: Next.js');
  console.log('   ✅ Version: 15.3.4');
  console.log('   ✅ Build: npm run build');
  console.log('   ✅ Output: .next');

  return true;
}

// Run the verification
const success = checkNextJsDetection();

if (success) {
  console.log('\n🎉 Configuration looks good for Next.js detection!');
  console.log('💡 Make sure to set Root Directory to "frontend-nextjs" in Vercel dashboard');
} else {
  console.log('\n❌ Configuration issues found. Please fix before deploying.');
  process.exit(1);
}
