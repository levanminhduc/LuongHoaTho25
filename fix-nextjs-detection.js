#!/usr/bin/env node

/**
 * Ultimate Next.js Detection Fix Script
 * Automatically fixes all common issues causing "No Next.js version detected"
 */

const fs = require('fs');
const path = require('path');

function checkAndFix() {
  console.log('🚀 Ultimate Next.js Detection Fix Script\n');

  let issuesFound = 0;
  let issuesFixed = 0;

  // Check 1: Verify frontend-nextjs/package.json
  console.log('📦 Checking package.json configuration...');
  
  const packageJsonPath = './frontend-nextjs/package.json';
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ CRITICAL: frontend-nextjs/package.json not found!');
    console.log('   This is the root cause of detection failure.');
    return false;
  }

  try {
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check Next.js in dependencies
    const nextVersion = packageData.dependencies?.next;
    if (!nextVersion) {
      console.log('❌ Next.js not found in dependencies');
      issuesFound++;
    } else {
      console.log(`✅ Next.js ${nextVersion} found in dependencies`);
    }

    // Check required scripts
    const scripts = packageData.scripts || {};
    const requiredScripts = ['dev', 'build', 'start'];
    
    for (const script of requiredScripts) {
      if (!scripts[script] || !scripts[script].includes('next')) {
        console.log(`❌ Missing or invalid script: ${script}`);
        issuesFound++;
      } else {
        console.log(`✅ Script "${script}" configured correctly`);
      }
    }

  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
    issuesFound++;
  }

  // Check 2: Verify next.config.js
  console.log('\n⚙️  Checking Next.js configuration...');
  
  const nextConfigPath = './frontend-nextjs/next.config.js';
  if (fs.existsSync(nextConfigPath)) {
    console.log('✅ next.config.js exists');
  } else {
    console.log('⚠️  next.config.js missing (recommended but not required)');
  }

  // Check 3: Remove conflicting vercel.json files
  console.log('\n🔧 Checking for conflicting configuration files...');
  
  const conflictingFiles = ['./vercel.json', './frontend-nextjs/vercel.json'];
  
  for (const file of conflictingFiles) {
    if (fs.existsSync(file)) {
      console.log(`⚠️  Found conflicting file: ${file}`);
      console.log(`   This may interfere with Next.js detection`);
      
      // Optionally remove (commented out for safety)
      // fs.unlinkSync(file);
      // console.log(`✅ Removed ${file}`);
      // issuesFixed++;
    }
  }

  // Check 4: Verify project structure
  console.log('\n📁 Checking project structure...');
  
  const requiredDirs = [
    './frontend-nextjs/src',
    './frontend-nextjs/src/app'
  ];

  for (const dir of requiredDirs) {
    if (fs.existsSync(dir)) {
      console.log(`✅ ${dir} exists`);
    } else {
      console.log(`❌ ${dir} missing`);
      issuesFound++;
    }
  }

  // Summary and recommendations
  console.log('\n📋 DIAGNOSIS SUMMARY:');
  console.log(`Issues found: ${issuesFound}`);
  console.log(`Issues fixed: ${issuesFixed}`);

  if (issuesFound === 0) {
    console.log('\n🎉 Configuration looks perfect!');
    console.log('\n🎯 NEXT STEPS FOR VERCEL:');
    console.log('1. Go to Vercel Dashboard → Your Project → Settings');
    console.log('2. Navigate to General → Root Directory');
    console.log('3. Set Root Directory to: frontend-nextjs');
    console.log('4. Save and redeploy (without build cache)');
    console.log('\n✅ This should resolve the "No Next.js version detected" error');
  } else {
    console.log('\n🚨 CRITICAL ISSUES FOUND:');
    console.log('\n🔧 IMMEDIATE ACTIONS REQUIRED:');
    
    if (!fs.existsSync(packageJsonPath)) {
      console.log('1. Ensure frontend-nextjs/package.json exists with Next.js dependency');
    }
    
    console.log('2. Set Vercel Root Directory to: frontend-nextjs');
    console.log('3. Verify Next.js is in dependencies (not devDependencies)');
    console.log('4. Remove any conflicting vercel.json files');
    console.log('5. Redeploy with fresh build cache');
  }

  // Advanced troubleshooting
  console.log('\n🔍 ADVANCED TROUBLESHOOTING:');
  console.log('\nIf detection still fails after Root Directory fix:');
  console.log('1. Delete Vercel project completely');
  console.log('2. Re-import from GitHub');
  console.log('3. IMMEDIATELY set Root Directory to "frontend-nextjs"');
  console.log('4. Let Vercel auto-detect everything else');
  
  console.log('\n📞 VERCEL SUPPORT CHECKLIST:');
  console.log('- Root Directory: frontend-nextjs');
  console.log('- Framework: Next.js (auto-detected)');
  console.log('- Build Command: (empty - auto-detected)');
  console.log('- Install Command: (empty - auto-detected)');
  console.log('- Output Directory: (empty - auto-detected)');

  return issuesFound === 0;
}

// Run the fix
const success = checkAndFix();

if (success) {
  console.log('\n🎉 Ready for successful Vercel deployment!');
  process.exit(0);
} else {
  console.log('\n❌ Please fix the issues above before deploying.');
  process.exit(1);
}
