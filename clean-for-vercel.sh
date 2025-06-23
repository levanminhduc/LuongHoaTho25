#!/bin/bash

echo "🧹 Cleaning Project for Vercel Next.js Detection"
echo "================================================"

# Remove conflicting vercel.json files
echo "🗑️  Removing conflicting configuration files..."

if [ -f "vercel.json" ]; then
    echo "   Removing root vercel.json"
    rm vercel.json
    echo "   ✅ Removed vercel.json"
else
    echo "   ✅ No root vercel.json found"
fi

if [ -f "frontend-nextjs/vercel.json" ]; then
    echo "   Removing frontend-nextjs/vercel.json"
    rm frontend-nextjs/vercel.json
    echo "   ✅ Removed frontend-nextjs/vercel.json"
else
    echo "   ✅ No frontend-nextjs/vercel.json found"
fi

# Remove .vercel directory if exists
if [ -d ".vercel" ]; then
    echo "   Removing .vercel directory"
    rm -rf .vercel
    echo "   ✅ Removed .vercel directory"
else
    echo "   ✅ No .vercel directory found"
fi

echo ""
echo "📋 Verification:"

# Check if package.json exists and has Next.js
if [ -f "frontend-nextjs/package.json" ]; then
    if grep -q '"next"' frontend-nextjs/package.json; then
        echo "   ✅ Next.js found in frontend-nextjs/package.json"
    else
        echo "   ❌ Next.js not found in frontend-nextjs/package.json"
    fi
else
    echo "   ❌ frontend-nextjs/package.json not found"
fi

# Check if next.config.js exists
if [ -f "frontend-nextjs/next.config.js" ]; then
    echo "   ✅ next.config.js exists"
else
    echo "   ⚠️  next.config.js missing (recommended)"
fi

echo ""
echo "🎯 NEXT STEPS:"
echo "1. Commit and push these changes"
echo "2. Go to Vercel Dashboard → Settings → General"
echo "3. Set Root Directory to: frontend-nextjs"
echo "4. Save and redeploy (without build cache)"
echo ""
echo "✅ Project cleaned and ready for Vercel deployment!"
