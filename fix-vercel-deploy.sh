#!/bin/bash

# 🚀 Script tự động khắc phục lỗi Vercel deployment
# Chạy script này để fix "No Next.js version detected" error

echo "🔧 STARTING VERCEL DEPLOYMENT FIX..."
echo "=================================="

# Step 1: Verify Next.js project structure
echo "📋 Step 1: Verifying project structure..."
if [ ! -d "frontend-nextjs" ]; then
    echo "❌ Error: frontend-nextjs directory not found!"
    exit 1
fi

if [ ! -f "frontend-nextjs/package.json" ]; then
    echo "❌ Error: frontend-nextjs/package.json not found!"
    exit 1
fi

echo "✅ Project structure verified"

# Step 2: Check Next.js dependency
echo "📋 Step 2: Checking Next.js dependency..."
if grep -q '"next"' frontend-nextjs/package.json; then
    echo "✅ Next.js dependency found"
else
    echo "❌ Error: Next.js not found in dependencies!"
    exit 1
fi

# Step 3: Clean and reinstall dependencies
echo "📋 Step 3: Cleaning and reinstalling frontend dependencies..."
cd frontend-nextjs
rm -rf node_modules
rm -f package-lock.json
npm cache clean --force
npm install

echo "✅ Dependencies reinstalled"

# Step 4: Test build locally
echo "📋 Step 4: Testing build locally..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Local build successful"
else
    echo "❌ Error: Local build failed!"
    exit 1
fi

cd ..

# Step 5: Verify Vercel config
echo "📋 Step 5: Verifying Vercel configuration..."
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json found"
    
    # Check if framework is set to nextjs
    if grep -q '"framework": "nextjs"' vercel.json; then
        echo "✅ Framework correctly set to Next.js"
    else
        echo "⚠️  Warning: Framework not set to Next.js in vercel.json"
    fi
else
    echo "❌ Error: vercel.json not found!"
    exit 1
fi

# Step 6: Create deployment summary
echo "📋 Step 6: Creating deployment summary..."
cat > DEPLOYMENT_STATUS.md << EOF
# Vercel Deployment Status

## ✅ Pre-deployment Checks Completed

- [x] Project structure verified
- [x] Next.js dependency confirmed
- [x] Dependencies reinstalled
- [x] Local build successful
- [x] Vercel config verified

## 🚀 Ready to Deploy

### Next Steps:
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Monitor build logs on Vercel dashboard

### Vercel Dashboard Settings:
- **Framework**: Next.js (auto-detected)
- **Root Directory**: . (root)
- **Build Command**: cd frontend-nextjs && npm ci && npm run build
- **Output Directory**: frontend-nextjs/.next

### If Auto-deploy Fails:
\`\`\`bash
vercel --prod
\`\`\`

Generated: $(date)
EOF

echo "✅ Deployment summary created: DEPLOYMENT_STATUS.md"

# Final message
echo ""
echo "🎉 VERCEL DEPLOYMENT FIX COMPLETED!"
echo "=================================="
echo ""
echo "📌 NEXT STEPS:"
echo "1. Commit and push these changes to GitHub"
echo "2. Vercel will automatically deploy with new config"
echo "3. Monitor deployment at: https://vercel.com/dashboard"
echo ""
echo "🔧 If issues persist, check DEPLOYMENT_STATUS.md for detailed info"
echo ""
echo "✨ Happy deploying!" 