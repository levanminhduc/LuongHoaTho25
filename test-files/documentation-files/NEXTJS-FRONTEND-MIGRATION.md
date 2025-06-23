# Next.js Frontend Migration Guide

## Tổng quan

Dự án này đã được mở rộng với Next.js frontend để cung cấp kiến trúc modern và hiệu suất cao hơn so với React+Vite hiện tại.

## Kiến trúc hệ thống

### Frontend Architecture Comparison

| Tính năng            | React+Vite (Cũ) | Next.js (Mới)            |
| -------------------- | --------------- | ------------------------ |
| **Framework**        | React 18 + Vite | Next.js 15 + React 19    |
| **Routing**          | React Router    | App Router (Built-in)    |
| **State Management** | Zustand         | Zustand (Improved)       |
| **Styling**          | Tailwind CSS    | Tailwind CSS + Shadcn UI |
| **Type Safety**      | TypeScript      | TypeScript (Enhanced)    |
| **SSR/SSG**          | ❌              | ✅ (Built-in)            |
| **Code Splitting**   | Manual          | Automatic                |
| **Performance**      | Good            | Excellent                |
| **SEO**              | Limited         | Full Support             |
| **Port**             | 5173            | 3000                     |

## Cấu trúc thư mục Next.js

```
frontend-nextjs/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page (redirects to login)
│   │   ├── login/              # Login page
│   │   ├── dashboard/          # Dashboard page
│   │   └── import/             # Import Excel page
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── auth/               # Auth components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── forms/              # Form components
│   │   └── import/             # Import components
│   └── lib/                    # Utilities and stores
│       ├── utils.ts            # Utility functions
│       └── auth-store.ts       # Zustand auth store
├── components.json             # Shadcn UI config
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## Key Features

### 1. Modern UI Components (Shadcn UI)

- **Button Component**: Fully customizable với variants
- **Card Component**: Layout container với header/content/footer
- **Input Component**: Form inputs với validation
- **Loading States**: Skeleton và spinner components

### 2. Enhanced Authentication

- **Zustand Store**: Improved với persist middleware
- **Auth Provider**: Handles hydration và route protection
- **Middleware**: Next.js middleware cho route protection
- **Dual Backend Support**: Tự động fallback từ NestJS sang Express.js

### 3. Performance Optimizations

- **App Router**: Next.js 13+ routing với automatic code splitting
- **Server Components**: Tối ưu performance với RSC
- **Image Optimization**: Built-in Next.js image optimization
- **Bundle Analysis**: Automatic bundle optimization

### 4. Developer Experience

- **TypeScript**: Enhanced type safety
- **ESLint**: Code quality enforcement
- **Hot Reload**: Fast refresh development
- **Error Boundaries**: Graceful error handling

## API Integration

### Authentication Flow

```typescript
// Try NestJS first, fallback to Express.js
async function login(credentials) {
  try {
    // NestJS endpoint (Port 4002)
    let response = await fetch("http://localhost:4002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      // Fallback to Express.js (Port 4001)
      response = await fetch("http://localhost:4001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
```

### Import Excel Flow

```typescript
// Dual backend support for file upload
async function uploadExcel(file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);

  // Try NestJS first
  let response = await fetch("http://localhost:4002/api/import/salary", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  // Fallback to Express.js
  if (!response.ok) {
    response = await fetch("http://localhost:4001/api/import/excel", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  }

  return response.json();
}
```

## State Management

### Enhanced Zustand Store

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
```

## Deployment & Development

### Development Commands

```bash
# Install dependencies
cd frontend-nextjs
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### Production Deployment

1. **Build Application**:

   ```bash
   npm run build
   ```

2. **Environment Variables**:

   ```env
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   NEXT_PUBLIC_NESTJS_API_URL=https://your-nestjs-api.com
   ```

3. **Deploy to Vercel/Netlify**:
   - Connect GitHub repository
   - Set environment variables
   - Deploy automatically

## Migration Benefits

### 1. Performance Improvements

- **Faster Initial Load**: Server-side rendering
- **Better SEO**: Full server-side rendering support
- **Automatic Code Splitting**: Smaller bundle sizes
- **Image Optimization**: WebP conversion và lazy loading

### 2. Developer Experience

- **File-based Routing**: Automatic route generation
- **TypeScript Integration**: Better type checking
- **Hot Reload**: Faster development cycles
- **Built-in Optimization**: Automatic performance optimizations

### 3. Scalability

- **Server Components**: Reduced client-side JavaScript
- **Edge Runtime**: Deploy to edge locations
- **API Routes**: Built-in API endpoints
- **Middleware**: Request/response processing

### 4. Modern Features

- **React 19**: Latest React features
- **Concurrent Features**: Suspense, transitions
- **App Router**: Latest Next.js routing
- **Server Actions**: Full-stack React

## Testing Strategy

### 1. Component Testing

```typescript
// Example component test
import { render, screen } from '@testing-library/react'
import LoginForm from '@/components/forms/login-form'

test('renders login form', () => {
  render(<LoginForm />)
  expect(screen.getByRole('button', { name: /đăng nhập/i })).toBeInTheDocument()
})
```

### 2. Integration Testing

- API integration tests
- Authentication flow tests
- File upload tests

### 3. E2E Testing

- Playwright tests for full user workflows
- Cross-browser testing
- Mobile responsiveness testing

## Migration Timeline

### Phase 1: Core Features (Completed)

- ✅ Authentication system
- ✅ Dashboard layout
- ✅ Import Excel functionality
- ✅ Dual backend support

### Phase 2: Advanced Features (Next)

- [ ] Employee management
- [ ] Payroll listing
- [ ] Profile management
- [ ] Real-time notifications

### Phase 3: Optimization (Future)

- [ ] Server-side rendering cho all pages
- [ ] API routes migration
- [ ] Performance monitoring
- [ ] Error tracking

## Conclusion

Next.js frontend mang lại hiệu suất và trải nghiệm phát triển tốt hơn đáng kể so với React+Vite. Với khả năng tương thích ngược với backend hiện tại và support cho cả NestJS và Express.js, hệ thống có thể được migrate từ từ mà không gián đoạn dịch vụ.

### URLs hệ thống:

- **Next.js Frontend**: http://localhost:3000
- **React+Vite Frontend**: http://localhost:5173
- **NestJS Backend**: http://localhost:4002
- **Express.js Backend**: http://localhost:4001

### Khuyến nghị:

1. Sử dụng Next.js cho development mới
2. Migrate từ từ các tính năng từ React+Vite
3. Test kỹ lưỡng trước khi production
4. Monitor performance metrics
