#!/usr/bin/env node

/**
 * Vercel Configuration Validator
 * Validates vercel.json files for common issues
 */

const fs = require('fs');
const path = require('path');

function validateVercelConfig(filePath) {
  console.log(`🔍 Validating ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(content);
    
    // Check for invalid properties
    const invalidProps = ['nodeVersion', 'runtime'];
    const foundInvalid = [];
    
    for (const prop of invalidProps) {
      if (config.hasOwnProperty(prop)) {
        foundInvalid.push(prop);
      }
    }
    
    if (foundInvalid.length > 0) {
      console.log(`❌ Invalid properties found: ${foundInvalid.join(', ')}`);
      return false;
    }
    
    console.log(`✅ ${filePath} is valid`);
    console.log(`📋 Properties: ${Object.keys(config).join(', ')}`);
    return true;
    
  } catch (error) {
    console.log(`❌ JSON parsing error in ${filePath}: ${error.message}`);
    return false;
  }
}

// Validate both vercel.json files
console.log('🚀 Vercel Configuration Validator\n');

const rootConfig = validateVercelConfig('./vercel.json');
const frontendConfig = validateVercelConfig('./frontend-nextjs/vercel.json');

if (rootConfig && frontendConfig) {
  console.log('\n🎉 All vercel.json files are valid!');
  console.log('✅ Ready for Vercel deployment');
} else {
  console.log('\n❌ Configuration validation failed');
  process.exit(1);
}
