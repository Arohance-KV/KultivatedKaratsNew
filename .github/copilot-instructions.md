# KKFrontend - AI Coding Agent Guide

## Project Overview
**KultivatedKarats** - A luxury jewelry e-commerce platform with product customization, shopping cart, authentication, and admin dashboard. Built with React 18, TypeScript, Redux Toolkit, and Vite.

## Architecture

### Technology Stack
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit (redux1 folder)
- **Routing**: React Router v6
- **UI**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Forms**: React Hook Form + Zod validation
- **API**: Fetch (custom calls + Redux async thunks)
- **Auth**: JWT tokens stored in localStorage
- **Payments**: Razorpay integration

### Redux Structure (`src/redux1/`)
Modern Redux Toolkit with async thunks for all API calls:

**Core Slices:**
- `authSlice.ts` - Authentication (signup, login, logout)
  - Thunks: `signup(SignupPayload)`, `login(LoginPayload)`
  - Actions: `logout`, `setCredentials`, `updateUser`, `clearError`
  - State: `user`, `accessToken`, `isAuthenticated`, `loading`, `error`

- `categorySlice.ts` - Categories & products by category
  - Thunks: `fetchAllCategories()`, `fetchCategoryById(id)`, `fetchProductsByCategory(categoryId)`
  - State: `categories`, `selectedCategory`, `categoryProducts`, `loading`, `error`

- `productSlice.ts` - All products
  - Thunks: `fetchAllProducts()`, `fetchProductById(id)`, `fetchProductByProductId(productId)`
  - State: `products`, `selectedProduct`, `loading`, `error`

- `collectionSlice.ts` - Collections & products in collections
  - Thunks: `fetchAllCollections()`, `fetchCollectionById(id)`, `fetchCollectionProducts(id)`
  - State: `collections`, `selectedCollection`, `collectionProducts`, `loading`, `error`

**Additional Slices:** `cartSlice`, `orderSlice`, `paymentSlice`, `discountSlice`, `bannerSlice`, `blogSlice`, `wishlistSlice`, `mobileBannerSlice`

**Store Location:** `src/redux1/store.ts` (backward-compatible aliases for `website` state)

### Component Structure
```
src/components/
├── site/
│   ├── home-page/          # Main product pages
│   │   ├── Products.tsx    # Product listing with filters
│   │   ├── Collections.tsx # Collection browsing
│   │   ├── HomePage.tsx    # Landing page
│   │   ├── Categories.tsx  # Category browsing
│   │   └── [other pages]
│   ├── product-page/
│   │   └── ProductPage.tsx # Product detail & customization
│   ├── Auth.tsx            # Login/Signup with Redux auth
│   └── [other pages]
├── adminPanel/             # Admin dashboard
│   ├── DashboardMain.tsx
│   ├── DashboardProductsPage.tsx
│   └── [other admin pages]
└── ui/                     # shadcn/ui primitives
```

## API Integration Patterns

### Using Redux Async Thunks (Preferred)

**Dispatch in components:**
```typescript
const dispatch = useDispatch();

// Fetch data on mount
useEffect(() => {
  dispatch(fetchAllProducts());
  dispatch(fetchAllCategories());
  dispatch(fetchAllCollections());
}, [dispatch]);
```

**Select from Redux state:**
```typescript
const { products, loading, error } = useSelector((state: any) => state.product);
const { categories } = useSelector((state: any) => state.category);
const { collections } = useSelector((state: any) => state.collection);
```

### Authentication Flow (Updated in Auth.tsx)
```typescript
// Signup
dispatch(signup({
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "password123",
  phone: "9876543210"
}));

// Login
dispatch(login({
  email: "john@example.com",
  password: "password123"
}));

// Token is automatically stored in localStorage
// Access token in state: state.auth.accessToken
```

## Critical Patterns & Conventions

### Selector Patterns (Use redux1)
```typescript
// ✓ CORRECT - New Redux paths
const categories = useSelector((state: any) => state.category.categories);
const collections = useSelector((state: any) => state.collection.collections);
const products = useSelector((state: any) => state.product.products);
const auth = useSelector((state: any) => state.auth);

// ⚠️ Legacy (still works via backward compatibility, avoid for new code)
const categories = useSelector((state: any) => state.website.categories);
```

### Product Customization Features
Each product supports:
- **Multiple Variants**: Different karats with varying prices
- **Color Options**: Gold colors (White, Yellow, Rose Gold)
- **Gemstones**: Solitaire, multi-diamonds, colored stones
- **Chain Options**: Add pendant chain with separate karat selection
- **Ring Sizes**: Sizes 6-30 for ring products
- **Weight Tracking**: Gold weight, diamond weight, net weight, etc.

See `ProductPage.tsx` lines 60-150 for implementation.

### Form Implementation (React Hook Form + Zod)
All forms use React Hook Form with Zod validation:
```typescript
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema),
  defaultValues: {}
});

form.handleSubmit(async (values) => {
  const result = await dispatch(someAsyncThunk(values));
  // Handle result
});
```

### API Base URL
All redux1 slices use hardcoded base URL:
```typescript
const BASE_URL = 'https://kk-server-lqp8.onrender.com';
```
No environmental config needed (future enhancement opportunity).

## Developer Workflows

### Build & Run
```bash
npm run dev          # Vite dev server (port 5173 or next available)
npm run build        # TypeScript + Vite build
npm run lint         # ESLint check
npm run preview      # Preview production build
```

### Key File Locations
- Store: `src/redux1/store.ts`
- Auth slice: `src/redux1/authSlice.ts`
- Auth component: `src/components/site/Auth.tsx`
- Products page: `src/components/site/home-page/Products.tsx`
- Product detail: `src/components/site/product-page/ProductPage.tsx`
- Type definitions: `src/utils/interfaces.ts`

### Adding a New Page with Redux Data
1. Create component in `src/components/site/home-page/`
2. Import and dispatch Redux thunks: `dispatch(fetchAllProducts())`
3. Select data with `useSelector((state: any) => state.sliceName.data)`
4. Render data and handle loading/error states

### Authentication Integration Points
- **Login/Signup**: Happens in `Auth.tsx` via Redux dispatch
- **Token Storage**: Automatically stored in localStorage by authSlice
- **Protected Routes**: Check `state.auth.isAuthenticated`
- **API Requests**: Add `Authorization: Bearer ${token}` header for authenticated endpoints

## Common Pitfalls

1. **Old Redux Path**: Don't use `redux/store` - only use `redux1/store`
2. **Missing Dispatch**: Remember to `import { useDispatch }` and call thunks
3. **State Structure**: Categories at `state.category.categories`, not `state.website.categories`
4. **Token Access**: Stored in `state.auth.accessToken` and localStorage
5. **Component State vs Redux**: Keep only UI state (modals, dropdowns) in component state; keep data in Redux
6. **Async Thunk Error Handling**: Always check `action.payload` for errors after dispatch

## Recent Changes (Latest Integration)

### ✅ Completed
- Redux1 store configured with backward compatibility aliases
- main.tsx updated to import from redux1/store
- Auth.tsx enhanced with email/password signup and login forms
- Form validation with React Hook Form + Zod
- AuthSlice thunks (signup, login) properly integrated
- All Redux slices properly configured with async thunks

### 📋 Next Steps for Complete Integration
- Update Products.tsx to dispatch Redux thunks instead of direct API calls
- Update Collections.tsx to use Redux selectors
- Update ProductPage.tsx to use fetchProductById thunk
- Integrate Redux slices into admin dashboard pages
- Add token-based authentication headers to API calls
- Implement protected routes based on auth state

## Testing & Debugging

### Redux DevTools
Install Redux DevTools browser extension to inspect store state, actions, and state changes.

### Console Logging
Use Redux middleware to log actions (enable in development):
```typescript
// In store configuration
const logger = (store: any) => (next: any) => (action: any) => {
  console.log('dispatching', action);
  return next(action);
};
```

### Common Issues
- **Port 5173 occupied**: Vite auto-switches to 5174
- **Token missing**: Check localStorage for 'accessToken'
- **Redux actions not firing**: Verify dispatch is called and thunk is imported correctly
- **Component not updating**: Ensure useSelector is reading correct state path

## File Organization Philosophy

**Redux-specific code**: In `src/redux1/` slices with clear separation of concerns
**Component-specific state**: In component `useState` for local UI state only
**Shared utilities**: In `src/utils/` with clear, focused responsibility
**Types**: Inline in Redux slices for new code, or in `interfaces.ts` for legacy compatibility
**Styles**: Tailwind classes in JSX, or `src/styles/` for global overrides
