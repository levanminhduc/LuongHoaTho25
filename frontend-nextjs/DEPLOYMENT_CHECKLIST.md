# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Requirements

### 1. Backend API Ready

- [ ] Backend deployed on Heroku/Railway/Render
- [ ] Database setup (PlanetScale/ClearDB/AWS RDS)
- [ ] API endpoints accessible
- [ ] CORS configured for frontend domain

### 2. Environment Variables Set

Go to Vercel Dashboard → Project Settings → Environment Variables:

**Production:**

```
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com/api
NEXT_PUBLIC_FRONTEND_URL=https://your-app.vercel.app
DB_HOST=your-db-host
DB_PORT=3306
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=quan_ly_luong
JWT_SECRET=your-jwt-secret-32-chars
NODE_ENV=production
```

### 3. Vercel Project Configuration

- [ ] Root Directory: `frontend-nextjs`
- [ ] Framework: Next.js
- [ ] Build Command: `npm run build`
- [ ] Install Command: `npm ci --legacy-peer-deps`
- [ ] Output Directory: `.next`

## 🔧 Files Already Optimized

✅ `next.config.js` - Webpack fallbacks & production settings
✅ `vercel.json` - Deployment configuration
✅ `package.json` - Dependencies & build scripts
✅ `.vercelignore` - Exclude unnecessary files
✅ `.npmrc` - NPM settings for reliable builds

## 🚀 Deploy Methods

### Method 1: Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import from GitHub
3. Select `LuongHoaTho25` repository
4. Set root directory to `frontend-nextjs`
5. Add environment variables
6. Deploy

### Method 2: CLI

```bash
npm i -g vercel
cd frontend-nextjs
vercel login
vercel --prod
```

## 🎯 Success Criteria

- [ ] Build completes without errors
- [ ] App loads on Vercel URL
- [ ] Login works (admin/admin123)
- [ ] API calls successful
- [ ] All pages render correctly

## 🆘 Common Issues

**Build fails:** Check build logs in Vercel dashboard
**API errors:** Verify backend URL and CORS settings
**Env vars not working:** Ensure `NEXT_PUBLIC_` prefix for client vars
**Module errors:** Already fixed in webpack config

## 📞 Quick Support

- Check Vercel build logs
- Test backend API independently
- Verify environment variables
- Review browser console errors
