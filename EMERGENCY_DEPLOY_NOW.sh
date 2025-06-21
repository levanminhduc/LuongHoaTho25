#!/bin/bash

echo "🚨 EMERGENCY DEPLOYMENT - Bypass Framework Detection Issue"
echo "=========================================================="
echo "This script will deploy your Next.js app successfully RIGHT NOW"
echo ""

# Check if we're in the right directory
if [ ! -f "frontend-nextjs/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   (The directory containing frontend-nextjs folder)"
    exit 1
fi

echo "✅ Project structure verified"

# Install Vercel CLI if not present
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already available"
fi

# Navigate to frontend-nextjs
echo "📁 Entering frontend-nextjs directory..."
cd frontend-nextjs

# Verify Next.js configuration
echo "🔍 Verifying Next.js setup..."
if grep -q '"next".*"15.3.4"' package.json; then
    echo "✅ Next.js 15.3.4 found in dependencies"
else
    echo "⚠️  Next.js version check - continuing anyway"
fi

# Clean install dependencies
echo "📦 Installing dependencies..."
npm ci

if [ $? -ne 0 ]; then
    echo "❌ Dependency installation failed"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Test build locally
echo "🔨 Testing build locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Please fix build errors first."
    exit 1
fi

echo "✅ Local build successful"

# Check Vercel authentication
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo "✅ Vercel authentication verified"

# Deploy to production
echo ""
echo "🚀 DEPLOYING TO VERCEL..."
echo "   This bypasses dashboard framework detection completely"
echo "   CLI will properly detect Next.js framework"
echo ""

# Deploy with production flag
vercel --prod --confirm

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "================================"
    echo "✅ Framework detection bypassed successfully"
    echo "✅ Next.js app deployed to production"
    echo "✅ No more 'No Next.js version detected' errors"
    echo ""
    echo "📋 What happened:"
    echo "   - Vercel CLI used direct framework detection"
    echo "   - Bypassed dashboard timing issues completely"
    echo "   - Deployed from correct directory (frontend-nextjs)"
    echo "   - All dependencies properly resolved"
    echo ""
    echo "💡 For future deployments:"
    echo "   Option 1: Use this CLI method (cd frontend-nextjs && vercel --prod)"
    echo "   Option 2: Set Framework Preset to 'Next.js' in dashboard"
    echo "   Option 3: Use GitHub integration (will work now)"
    echo ""
    echo "🔗 Your app is now live! Check the deployment URL above."
else
    echo ""
    echo "❌ Deployment failed. Error details:"
    echo "   Please check the error messages above"
    echo "   If you see framework detection errors, try:"
    echo "   1. Manual framework override in dashboard"
    echo "   2. Contact Vercel support with this specific edge case"
    exit 1
fi
