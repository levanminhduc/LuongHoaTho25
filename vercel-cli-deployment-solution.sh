#!/bin/bash

echo "🚀 Vercel CLI Deployment Solution"
echo "=================================="
echo "This script bypasses Vercel Dashboard framework detection issues"
echo ""

# Check if we're in the right directory
if [ ! -f "frontend-nextjs/package.json" ]; then
    echo "❌ Error: frontend-nextjs/package.json not found"
    echo "   Please run this script from the project root directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

# Navigate to frontend-nextjs directory
echo "📁 Navigating to frontend-nextjs directory..."
cd frontend-nextjs

# Check Next.js version
echo "🔍 Verifying Next.js configuration..."
if grep -q '"next"' package.json; then
    NEXT_VERSION=$(grep '"next"' package.json | sed 's/.*"next": "\([^"]*\)".*/\1/')
    echo "✅ Next.js version: $NEXT_VERSION"
else
    echo "❌ Next.js not found in package.json"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Test build locally
echo "🔨 Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
else
    echo "❌ Local build failed. Please fix build errors before deploying."
    exit 1
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "   This will bypass dashboard framework detection"
echo ""

# Deploy with explicit Next.js configuration
vercel --prod --confirm

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo "✅ Vercel CLI properly detected Next.js framework"
    echo "✅ Build completed without framework detection errors"
    echo ""
    echo "📋 What happened:"
    echo "   - Vercel CLI used direct framework detection"
    echo "   - Bypassed dashboard detection timing issues"
    echo "   - Deployed from correct directory (frontend-nextjs)"
    echo ""
    echo "💡 For future deployments:"
    echo "   - Use 'vercel --prod' from frontend-nextjs directory"
    echo "   - Or set up GitHub integration with proper configuration"
else
    echo "❌ Deployment failed. Check the error messages above."
    exit 1
fi
