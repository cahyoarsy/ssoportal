# 📁 SSO Portal - Struktur Folder

Proyek SSO Portal telah direorganisasi menggunakan **feature-based architecture** untuk meningkatkan maintainability dan developer experience.

## 🏗️ Struktur Folder Baru

```
src/
├── 📂 app/                     # Konfigurasi aplikasi utama
│   ├── App.jsx                 # Root component dengan routing
│   ├── main.jsx               # Entry point aplikasi
│   └── index.css              # Global styles
├── 📂 features/               # Feature-based modules
│   ├── 📂 auth/               # Authentication features
│   │   ├── LoginFormEnhanced.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── UltimateLoginPortal.jsx
│   │   ├── ProfessionalLoginPortal.jsx
│   │   └── index.js           # Barrel exports
│   ├── 📂 dashboard/          # Dashboard features
│   │   ├── SimpleDashboard.jsx
│   │   ├── ProfessionalDashboard.jsx
│   │   ├── AdminDashboardEnhanced.jsx
│   │   └── index.js
│   ├── 📂 elearning/          # E-Learning features
│   │   ├── ELearningPage.jsx
│   │   └── index.js
│   └── 📂 iml/                # IML features
│       ├── IMLPage.jsx
│       └── index.js
├── 📂 components/             # Reusable UI components
│   ├── 📂 ui/                 # Basic UI components
│   ├── 📂 forms/              # Form components
│   ├── 📂 layout/             # Layout components
│   └── 📂 shared/             # Shared components
├── 📂 hooks/                  # Custom React hooks
│   ├── useAuth.js             # Authentication hook
│   ├── useNavigation.js       # Navigation hook
│   └── index.js               # Barrel exports
├── 📂 services/               # API & external services
│   ├── authStorage.js         # Auth storage service
│   └── FirebaseHybridManager.js
├── 📂 utils/                  # Utility functions
│   ├── dateUtils.js           # Date formatting utilities
│   ├── helpers.js             # General helper functions
│   ├── storage.js             # LocalStorage utilities
│   ├── authHelpers.js         # Auth helper functions
│   └── index.js               # Barrel exports
├── 📂 constants/              # App constants
│   ├── routes.js              # Route definitions
│   ├── config.js              # App configuration
│   ├── branding.js            # Branding constants
│   ├── langResources.js       # Language resources
│   └── index.js               # Barrel exports
├── 📂 assets/                 # Static assets
└── 📂 __tests__/              # Test files
```

## 🎯 Keuntungan Struktur Baru

### 1. **Feature-Based Organization**
- Setiap feature memiliki folder tersendiri
- Mudah menemukan komponen yang terkait
- Scalable untuk pengembangan tim

### 2. **Barrel Exports**
- Import yang lebih clean dan konsisten
- Contoh: `import { LoginForm, RegisterForm } from '../features/auth'`

### 3. **Separation of Concerns**
- **Features**: Komponen spesifik untuk fitur tertentu
- **Components**: UI components yang reusable
- **Hooks**: Custom React hooks
- **Utils**: Helper functions dan utilities
- **Constants**: Konfigurasi dan konstanta

### 4. **Developer Experience**
- Struktur yang predictable
- Mudah untuk onboarding developer baru
- Konsisten dengan modern React practices

## 🔧 Cara Menggunakan

### Import Components
```javascript
// Dari features
import { UltimateLoginPortal } from '../features/auth';
import { SimpleDashboard } from '../features/dashboard';
import { ELearningPage } from '../features/elearning';

// Dari hooks
import { useAuth, useNavigation } from '../hooks';

// Dari utils
import { formatDate, getGreeting } from '../utils';

// Dari constants
import { ROUTES, APP_CONFIG } from '../constants';
```

### Custom Hooks Usage
```javascript
function App() {
  const { isAuthenticated, user, login, logout } = useAuth();
  const { currentView, navigateTo, goBack } = useNavigation();
  
  // ... rest of component
}
```

## 📝 Development Guidelines

### 1. **Menambah Feature Baru**
1. Buat folder di `src/features/[feature-name]/`
2. Tambahkan komponen dalam folder tersebut
3. Buat `index.js` untuk barrel exports
4. Update imports di komponen yang menggunakan

### 2. **Menambah Utility Function**
1. Tambahkan di file yang sesuai di `src/utils/`
2. Export function dari file tersebut
3. Re-export dari `src/utils/index.js`

### 3. **Menambah Konstanta**
1. Tambahkan di file yang sesuai di `src/constants/`
2. Export dari file tersebut
3. Re-export dari `src/constants/index.js`

## 🚀 Performance Benefits

- **Tree Shaking**: Barrel exports memungkinkan bundler untuk menghapus kode yang tidak digunakan
- **Code Splitting**: Feature-based structure memudahkan implementasi lazy loading
- **Maintainability**: Struktur yang jelas mengurangi cognitive load

## 🔄 Migration dari Struktur Lama

File-file telah dipindahkan ke lokasi baru dengan mapping:
- `src/pages/` → `src/features/[feature-name]/`
- `src/components/[auth-components]` → `src/features/auth/`
- `src/components/[dashboard-components]` → `src/features/dashboard/`
- Helper files → `src/utils/` atau `src/constants/`

Import paths telah diupdate untuk mengakomodasi struktur baru.