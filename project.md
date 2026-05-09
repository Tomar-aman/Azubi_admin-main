# Azubi Admin Panel — Project Reference

> **Purpose**: Concise AI context document. Read this before making any changes to the codebase.

---

## 1. Project Overview

**Name**: Azubi Admin Panel (`fuchzubi`)  
**Type**: Next.js 14 Admin Dashboard (App Router)  
**Language**: TypeScript  
**Package Manager**: Yarn 1.22  
**Dev Command**: `yarn dev` → runs on `http://localhost:3000`  
**Build Command**: `yarn build` (`--no-lint` flag active)

This is a **backend admin panel** for the Azubi regional job platform. Admins manage employers, jobs, cities, regions, industries, content pages, banners, and application settings.

---

## 2. Tech Stack

| Layer | Library / Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI Components | MUI v5 (`@mui/material`, `@mui/x-data-grid`, `@mui/lab`) |
| State Management | Redux Toolkit (`@reduxjs/toolkit`, `react-redux`) |
| Forms | Formik + Yup |
| HTTP Client | Axios + `urlcat` |
| Rich Text Editors | CKEditor 5, React Quill, React Draft WYSIWYG |
| Date Handling | Day.js, `@mui/x-date-pickers-pro` |
| Image Cropping | `antd-img-crop`, `antd` |
| Notifications | `react-toastify`, `react-toast-notifications` |
| Icons | `@mui/icons-material`, `lucide-react` |
| SVG | `@svgr/webpack` (SVGs imported as React components) |
| Color Pickers | `mui-color`, `mui-color-input`, `react-colorful` |
| Phone Input | `react-phone-input-2` |
| Phone Loader | `react-loader-spinner` |
| Misc | `uuid`, `use-debounce`, `@uidotdev/usehooks` |
| Theme | Custom MUI theme in `/themes` (Poppins font) |

---

## 3. Environment Variables

File: `.env` (root of project)

```env
NEXT_PUBLIC_API_BASE_URL=https://api.backend.com       # REST API base (appended with /api/v1)
NEXT_PUBLIC_BACKEND_IMAGE_URL=https://api.backend.com/ # Used to prefix image file paths
```

> **Note**: The actual live API is `https://api.azubiregional.de`. The `.env` file may use a placeholder — always verify in context.

---

## 4. Authentication

- **Token Storage**: `localStorage` key `"x-access"` (Bearer token)
- **Token Read**: `tokenStore.getRequestHeaderToken()` in `app/api/api.ts` — auto-injected into every Axios request
- **Auth State**: Redux slice `auth` → `{ isLogin: boolean, loading: boolean }`
- **Guard (logged-in routes)**: `app/(user)/authChecker.tsx` — redirects to `/` if no valid session
- **Guard (public routes)**: `app/(login)/unauthChecker.tsx` — redirects logged-in users away from login page
- **Login flow**: `POST /auth/login-user` → stores `x-access` token → dispatches `setIsLogin(true)`
- **Forgot password**: `GET /user/reset-link/:email` → `PUT /user/reset-password/` with `{ password, token }`
- **Remember Me**: Credentials cached in `localStorage` and restored on login page mount

---

## 5. Directory Structure

```
/
├── app/
│   ├── layout.tsx                  # Root layout: Redux Provider + MUI Theme + LocalStorageEvent
│   ├── globals.css                 # Global styles
│   ├── localStorageEvent.tsx       # Listens for localStorage changes (cross-tab auth sync)
│   │
│   ├── (login)/                    # Public route group (unauthenticated)
│   │   ├── page.tsx                # Login page (Formik + Yup, Remember Me)
│   │   ├── forgot-password.tsx     # Forgot password form
│   │   ├── reset-password/         # Reset password via token link
│   │   ├── layout.tsx              # Login layout (no sidebar/header)
│   │   └── unauthChecker.tsx       # Redirects authenticated users away
│   │
│   ├── (user)/                     # Protected route group (authenticated)
│   │   ├── layout.tsx              # Admin layout: AppBar + Sidebar + content area
│   │   ├── authChecker.tsx         # Redirects unauthenticated users to login
│   │   ├── dashboard/              # Dashboard with stat cards
│   │   ├── manage-employers/       # Employer CRUD (list + add/edit form)
│   │   ├── manage-jobs/            # Job CRUD (list + add/edit form)
│   │   ├── manage-cities/          # City CRUD (list + add/edit form)
│   │   ├── manage-regions/         # Region CRUD (list + add/edit form)
│   │   ├── manage-industries/      # Industry CRUD (list + add/edit form)
│   │   ├── manage-type-of-job/     # Job Types CRUD
│   │   ├── manage-content/         # 31 sub-pages for CMS content editing
│   │   ├── add-banner/             # Banner management
│   │   ├── admin-setting/          # Admin settings (large ~26KB page)
│   │   ├── contact/                # Contact submissions view
│   │   └── applicationTip/         # Application tip management
│   │
│   ├── api/                        # All API service files (no Next.js route handlers)
│   │   ├── api.ts                  # Axios instance factory + request() wrapper + tokenStore
│   │   ├── runtimeType.ts          # SuccessResult / ErrorResult discriminated union types
│   │   ├── models/                 # Shared DTO models (AccessTokensResponse, etc.)
│   │   ├── auth/                   # Auth API: login, refresh, reset-password, dashboard count
│   │   ├── city/                   # City CRUD API
│   │   ├── employer/               # Employer CRUD API (with multipart image upload)
│   │   ├── jobs/                   # Job CRUD API
│   │   ├── regions/                # Region CRUD API
│   │   ├── industries/             # Industry CRUD API
│   │   ├── user/                   # Current user API
│   │   ├── addBanner/              # Banner API
│   │   ├── adminSetting/           # Admin settings API
│   │   ├── applicationTip/         # Application tip API
│   │   ├── beginning/              # "Beginning" content API
│   │   ├── contact/                # Contact API
│   │   ├── federal/                # Federal State content API
│   │   ├── iamge-gallery/          # Image gallery API (note: typo in dir name)
│   │   ├── jobTypes/               # Job Types API
│   │   ├── manageContent/          # CMS content API
│   │   └── training/               # Training content API
│   │
│   ├── components/                 # Shared UI components
│   │   ├── Sidebar/
│   │   │   ├── page.tsx            # Sidebar component (renders MENU_DATA)
│   │   │   └── helper.ts           # MENU_DATA array (all nav items + Log Out)
│   │   ├── table.tsx               # Reusable MUI DataGrid wrapper
│   │   ├── pagination.tsx          # Reusable pagination component
│   │   ├── filter.tsx              # Search/filter bar component
│   │   ├── modal.components.tsx    # Generic modal wrapper
│   │   ├── delete.modal.components.tsx  # Delete confirmation modal
│   │   ├── title.components.tsx    # Page title component
│   │   ├── form.styled.tsx         # Styled form wrappers
│   │   ├── SpinLoader.tsx          # Loading spinner
│   │   ├── image-gallery/          # Image gallery picker component
│   │   └── icon/                   # SVG icons (imported via @svgr/webpack)
│   │
│   ├── redux/                      # Redux Toolkit store
│   │   ├── store.ts                # Configures store with 3 slices
│   │   ├── auth/authSlice.ts       # { isLogin, loading }
│   │   ├── user/userSlice.ts       # { data: CurrentUser, elementId, mediaUrls[] }
│   │   └── protectRoute/           # { currentRoute } for previous route tracking
│   │
│   └── ulits/                      # Utilities (note: intentional typo in dir name)
│       ├── constatnt.ts            # DOM helpers + image URL helpers
│       ├── cropper.tsx             # Image cropper component
│       ├── customInput/            # Custom input components
│       └── imageGallery/           # Image gallery utility components
│
├── themes/
│   ├── index.tsx                   # MUI ThemeCustomization provider
│   ├── typography.tsx              # Typography config (Poppins font)
│   └── overrides/                  # MUI component style overrides
│
├── public/
│   └── logo.png                    # Company logo (used in AppBar)
│
├── next.config.js                  # reactStrictMode, SVG via @svgr, image remote patterns
├── tsconfig.json                   # TypeScript config (path alias: @/ → root)
├── .env                            # Environment variables (NEXT_PUBLIC_*)
└── package.json                    # Dependencies and scripts
```

---

## 6. Redux Store

```
store
├── auth    → authSlice    { isLogin: boolean, loading: boolean }
├── user    → userSlice    { data: CurrentUserResponseDto|null, elementId, mediaUrls[] }
└── currentRoute → protectRoute/previousRouteSlice
```

**Import pattern**:
```ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/app/redux/store';
```

---

## 7. API Layer Pattern

All API calls go through `app/api/api.ts → request()`:

```ts
// Pattern used everywhere
const response = await request({ url: '/endpoint', method: 'GET/POST/PUT/DELETE', data: {...} });
if (response.remote === 'success') { /* response.data */ }
if (response.remote === 'failure') { /* response.error.errors.message */ }
```

- **Base URL**: `NEXT_PUBLIC_API_BASE_URL` + `/api/v1`
- **Auth**: Bearer token auto-injected from `localStorage["x-access"]`
- **Return type**: `SuccessResult<T> | ErrorResult` (discriminated union from `runtimeType.ts`)

### API File Convention (per entity)
```
app/api/<entity>/
  <entity>.ts        # CRUD functions
  <entity>.types.ts  # TypeScript interfaces/types
  helper.ts          # Data transform helpers (API response → component format)
```

---

## 8. Navigation / Sidebar Menu

All sidebar items defined in `app/components/Sidebar/helper.ts` → `MENU_DATA`:

| # | Label | URL |
|---|---|---|
| 1 | Dashboard | `/dashboard` |
| 2 | Manage Employers | `/manage-employers` |
| 3 | Manage Jobs | `/manage-jobs` |
| 4 | Manage Industries | `/manage-industries` |
| 5 | Job Types | `/manage-type-of-job` |
| 6 | Manage Regions | `/manage-regions` |
| 7 | Manage Cities | `/manage-cities` |
| 8 | Manage Content | *(dropdown with 29 sub-items)* |
| 9 | Manage Banners | `/add-banner` |
| 10 | Admin Settings | `/admin-setting` |
| 11 | Contact | `/contact` |
| 12 | ApplicationTip | `/applicationTip` |
| 13 | Log Out | *(action, no URL)* |

---

## 9. Key Data Models (TypeScript Interfaces)

### Employer
```ts
{ _id, industryName, contactPerson, jobTitle, companyName, email, website,
  phoneNo, address, zipCode, companyLogo, companyDescription, city, status,
  isDeleted, createdBy, createdAt, updatedAt }
```

### Job
```ts
{ _id, city, company, jobTitle, count, startDate, email, additionalEmail,
  address, zipCode, jobDescription, status, createdAt, industryName }
```

### City
```ts
{ _id, name, region, startTime, endTime, address, zipCode, directionLink,
  status, popular }
```

### Region
```ts
{ _id, name, createdAt, updatedAt, isDeleted }
```

---

## 10. Module Page Pattern

Every CRUD module (employers, jobs, cities, regions, industries) follows this pattern:

```
manage-<entity>/
├── page.tsx              # List page: fetches data, renders table, handles delete
├── add/page.tsx          # Add/Edit form page (Formik + Yup validation)
├── <entity>Data.tsx      # DataGrid column definitions
└── helper.tsx (optional) # Entity-specific helpers
```

**Page pattern**:
1. `useEffect` → API call → transform data → `setState`
2. MUI `DataGrid` (via shared `table.tsx` wrapper) for listing
3. Shared `<filter.tsx>` for search/pagination controls
4. Shared `<delete.modal.components.tsx>` for confirmations
5. Formik for add/edit, Yup schema for validation
6. `react-toastify` for success/error notifications
7. `router.back()` for Back button navigation

---

## 11. Layout Architecture

```
RootLayout (app/layout.tsx)
└── Redux Provider
    └── MUI ThemeCustomization (themes/index.tsx)
        └── body
            ├── LocalStorageEvent (cross-tab auth sync)
            └── [route group layouts]
                ├── (login)/layout.tsx  → plain layout (no header/sidebar)
                └── (user)/layout.tsx   → AppBar (logo + hamburger) + Sidebar + content
```

**AppBar color**: `#e5f3f3` (light teal)  
**Sidebar width**: `259px` (collapsible, toggle via hamburger)  
**Content background**: `#ffffff`  
**Page background**: `#e5f3f3`

---

## 12. Image Handling

- **Allowed remote image domains** (next.config.js): `cloudflare-ipfs.com`, `localhost`, `digimonk.live`, `api.azubiregional.de`, `digimonk.net`
- **Image URL construction**: `NEXT_PUBLIC_BACKEND_IMAGE_URL + filepath`
- **Helper**: `handleFindImage(mediaUrls, id)` in `app/ulits/constatnt.ts`
- **SVGs**: Imported as React components via `@svgr/webpack` — all in `app/components/icon/`

---

## 13. Known Quirks & Conventions

| Issue | Detail |
|---|---|
| Typo in utils dir | Directory is `app/ulits/` (not `utils/`) — **do not rename** |
| Typo in constants file | File is `constatnt.ts` (not `constants.ts`) — **do not rename** |
| Typo in gallery API dir | `app/api/iamge-gallery/` (not `image-gallery`) — **do not rename** |
| `"use client"` | All interactive pages use this directive (no server components in pages) |
| Formik + Yup | Standard form pattern — always use `getFieldProps()` + `touched` + `errors` |
| `router.back()` | Use for all Back buttons — never hardcode routes |
| Employee vs Employer | Codebase uses "employer" for companies — "employee" features were added later as a separate module |
| Admin Settings | Single massive `page.tsx` (~26KB) — contains all settings in one file |
| Content pages | `manage-content/` has 31 sub-pages for CMS editing |
| Commented code | Several commented-out blocks exist in layout files — do not delete |
| Logo flicker fix | Logo logic uses domain-based show/hide in `(user)/layout.tsx` |

---

## 14. Common Import Aliases

```ts
@/app/...           // maps to project root (via tsconfig paths)
@/themes            // MUI theme customization
```

---

## 15. Quick Task Reference

| Task | File(s) to edit |
|---|---|
| Add sidebar nav item | `app/components/Sidebar/helper.ts` → `MENU_DATA` |
| Add new API endpoint | `app/api/<entity>/<entity>.ts` |
| Add new page/route | Create `app/(user)/<route>/page.tsx` |
| Modify table columns | `app/(user)/<module>/<entity>Data.tsx` |
| Change theme colors | `themes/index.tsx` or `themes/overrides/` |
| Add env variable | `.env` (prefix with `NEXT_PUBLIC_` for client-side) |
| Modify login page | `app/(login)/page.tsx` |
| Change AppBar/Sidebar | `app/(user)/layout.tsx` |
| Change global styles | `app/globals.css` |
| Add new image domain | `next.config.js` → `images.remotePatterns` |
