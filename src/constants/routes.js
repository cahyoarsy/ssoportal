// App Routes Configuration
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ELEARNING: '/elearning',
  IML: '/iml',
  PROFILE: '/profile',
  ADMIN: '/admin'
};

// Navigation Menu Items
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', route: ROUTES.DASHBOARD },
  { id: 'elearning', label: 'E-Learning', icon: '📚', route: ROUTES.ELEARNING },
  { id: 'iml', label: 'IML', icon: '⚡', route: ROUTES.IML },
  { id: 'profile', label: 'Profile', icon: '👤', route: ROUTES.PROFILE }
];