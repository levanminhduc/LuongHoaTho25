#!/bin/bash

echo "🚀 Testing Next.js build for Vercel deployment..."

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for Vercel deployment."
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
