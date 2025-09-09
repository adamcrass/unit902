# 🏢 Unit 902

> A fast, modern, Firebase-backed marketplace built with Vite, React, Chakra UI, and Emotion.

Unit 902 allows users to browse, buy, and sell items with real-time data sync, secure authentication, Stripe payments, and Cloudinary-powered images. Built with speed and simplicity in mind, this project uses modern tooling optimized for team development.

---

## ⚙️ Tech Stack

- **Frontend**: React + Vite
- **Styling**: Chakra UI (uses Emotion under the hood)
- **Icons**: Lucide
- **Form Handling**: Chakra Forms + Yup validation
- **Authentication & DB**: Firebase Auth + Realtime Database
- **Shop**: Firebase Realtime Database ([RTDB](https://console.firebase.google.com/u/3/project/unit-902/overview))
- **Payments**: Stripe API
- **Image Uploads**: Cloudinary
- **Email Notifications**: SendGrid (via Netlify Functions)
- **Routing**: React Router
- **State Management**: React Context API
- **Testing**: React Testing Library + Jest + Babel
- **Tooling**: Yarn 4 (node_modules), ESLint, Prettier, Nodemon
- **Monitoring**: Sentry

---

## 📁 File Structure

```bash
src/
├── App.jsx
├── main.jsx
├── auth/               # Firebase auth logic
├── components/         # Shared UI components
├── context/            # React Contexts
├── hooks/              # Custom hooks (useFormatPrice, etc.)
├── pages/              # Route-based views (Home, Item, Cart, Profile)
├── utils/              # Helpers (e.g. price formatter, validators)
├── __test__/           # Test files
├── api/                # Cloudinary, Stripe, SendGrid, etc.
├── public/             # Static assets (favicon, index.html)
```

> 📦 **Flat structure**: everything under `src/` with concise directories. No deep nesting.

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/transpiled/unit-902.git
cd unit-902
```

### 2. Enable Corepack (one-time setup)

```bash
corepack enable
```

> This ensures you're using the correct Yarn version specified in package.json

### 3. Install dependencies

```bash
yarn install
```

### 4. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env` with your Firebase, Cloudinary, Stripe, and Sentry credentials.

### 5. Run the app locally

```bash
yarn dev
```

> Starts at `http://localhost:1027`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DB_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_CLOUDINARY_UPLOAD_URL=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_STRIPE_PUBLIC_KEY=...
VITE_SENTRY_DSN=...
```

---

## 🧪 Testing

```bash
# Run tests once
yarn test

# Run tests in watch mode
yarn test:watch
```

---

## 📦 Build

```bash
yarn build
```

---

## 🔧 Development Scripts

```bash
# Start development server on port 1027
yarn dev

# Run tests once
yarn test

# Run tests in watch mode (auto-rerun on file changes)
yarn test:watch

# Lint code once
yarn lint

# Lint code in watch mode (auto-rerun on file changes)
yarn lint:watch

# Format code with Prettier
yarn format

# Build for production
yarn build

# Preview production build
yarn preview
```

---

## 🔄 Features

- [x] Email/Password + Google login (Firebase)
- [x] Browse and search listings
- [x] Add new item with photo upload (Cloudinary)
- [x] Real-time data sync (Firebase RTDB)
- [x] Form validation with Yup
- [x] Responsive Chakra UI design
- [x] Stripe checkout integration
- [x] User profiles and dashboard
- [x] Transactional emails (SendGrid)
- [x] Mobile-first layout
- [x] Deployment on Netlify with serverless functions
- [x] Error monitoring with Sentry

---

## 🛠 Dev Notes

- Chakra + Emotion is fully themed and supports dark/light mode
- Icons via `lucide-react`
- All components are built with accessibility in mind
- Mobile first and responsive design
- Firebase Storage is optional if you want to host images instead of Cloudinary
- Sentry is initialized on app startup for error tracking and monitoring

---

## 🌐 Deployment (Netlify)

This project is deploy-ready on Netlify with serverless functions for:

- Payment processing (Stripe)
- Email (SendGrid)
- Admin APIs (e.g. user verification, reporting)

Run locally with:

```bash
yarn dev
```

---

## ✅ Code Standards

- Uses ESLint + Prettier for consistent formatting
- Built with accessibility (ARIA + keyboard nav)
- Tests written with RTL + Jest + Babel for ES6 support
- Mobile-first + responsive design
- Custom hooks for reusable logic (e.g., `useFormatPrice`)
- Watch mode scripts for continuous development feedback

---

## 📄 License

**Proprietary** — All rights reserved by Transpiled LLC.

---

## 🤝 Credits

Built with ❤️ by [Adam Crass](https://github.com/adamcrass) and the Transpiled team.
