// Auth storage layer using localStorage (can be replaced with real database later)

import { buildMockJWT } from '../utils/authHelpers.js';

const USERS_STORAGE_KEY = 'sso-portal-users';
const SESSION_STORAGE_KEY = 'sso-portal-session';

// User data structure
const createUser = ({ email, password, fullName, role = 'user' }) => ({
  id: generateUserId(),
  email: email.toLowerCase(),
  password: hashPassword(password), // Simple hash for demo
  fullName,
  role,
  createdAt: new Date().toISOString(),
  isVerified: true, // For demo, auto-verify
  lastLogin: null,
});

// Simple user ID generator
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Simple password hashing (for demo only - use bcrypt in production)
function hashPassword(password) {
  // This is NOT secure - just for demo purposes
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return 'demo_hash_' + Math.abs(hash).toString(16);
}

// Verify password
function verifyPassword(plainPassword, hashedPassword) {
  return hashPassword(plainPassword) === hashedPassword;
}

// Get all users from localStorage
function getAllUsers() {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Export getAllUsers for admin dashboard
export { getAllUsers };

// Save users to localStorage
function saveUsers(users) {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    return true;
  } catch (error) {
    console.error('Error saving users:', error);
    return false;
  }
}

// Register new user
export function registerUser({ email, password, fullName, confirmPassword }) {
  // Validation
  if (!email || !password || !fullName || !confirmPassword) {
    throw new Error('Semua field wajib diisi');
  }

  if (password !== confirmPassword) {
    throw new Error('Password dan konfirmasi password tidak cocok');
  }

  if (password.length < 6) {
    throw new Error('Password minimal 6 karakter');
  }

  if (!email.includes('@')) {
    throw new Error('Format email tidak valid');
  }

  const users = getAllUsers();
  
  // Check if user already exists
  if (users.find(user => user.email === email.toLowerCase())) {
    throw new Error('Email sudah terdaftar');
  }

  // Create new user
  const newUser = createUser({ email, password, fullName });
  users.push(newUser);
  
  if (!saveUsers(users)) {
    throw new Error('Gagal menyimpan data user');
  }

  return {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    role: newUser.role,
  };
}

// Login user
// NOTE: loginUser and emailExists defined below with a consistent signature

// Update user profile
export function updateUserProfile(email, profileData) {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.email === email.toLowerCase());
  
  if (userIndex === -1) {
    throw new Error('User tidak ditemukan');
  }

  // Process profile image
  if (profileData.profileImage) {
    console.log('Saving profile image, size:', profileData.profileImage.length);
  }

  // Update user data
  users[userIndex] = {
    ...users[userIndex],
    ...profileData,
    updatedAt: new Date().toISOString()
  };

  saveUsers(users);
  console.log('Profile updated for:', email);
  return users[userIndex];
}

// Get user profile by email or current session
export function getUserProfile(email) {
  // If no email provided, try to get from current session
  if (!email) {
    const session = getCurrentSession();
    if (session && session.user) {
      email = session.user.email;
    } else {
      return null; // No session found
    }
  }
  
  const users = getAllUsers();
  const user = users.find(user => user.email === email.toLowerCase());
  
  if (!user) {
    return null; // Return null instead of throwing error for flexibility
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    profileImage: user.profileImage,
    bio: user.bio,
    motivation: user.motivation,
    targets: user.targets,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  };
}

// Get user by email
export function getUserByEmail(email) {
  const users = getAllUsers();
  const user = users.find(user => user.email === email.toLowerCase());
  
  if (user) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };
  }
  return null;
}

// Get all registered emails (for email validation)
export function getRegisteredEmails() {
  const users = getAllUsers();
  return users.map(user => user.email);
}

// Check if email exists
export function emailExists(email) {
  const users = getAllUsers();
  return users.some(user => user.email === email.toLowerCase());
}

// Login user
export function loginUser(email, password) {
  const users = getAllUsers();
  const user = users.find(user => user.email === email.toLowerCase());
  
  if (!user) {
    throw new Error('User tidak ditemukan');
  }
  
  if (!verifyPassword(password, user.password)) {
    throw new Error('Password salah');
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  saveUsers(users);
  
  return {
    token: buildMockJWT({ sub: user.id, email: user.email, role: user.role }),
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    requiresMFA: false, // For demo, no MFA required
  };
}

// Admin functions
export function makeUserAdmin(email) {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.email === email.toLowerCase());
  
  if (userIndex === -1) {
    throw new Error('User tidak ditemukan');
  }
  
  users[userIndex].role = 'admin';
  return saveUsers(users);
}

// Demo data seeder
export function seedDemoUsers() {
  const users = getAllUsers();
  
  // Only seed if no users exist
  if (users.length === 0) {
    const demoUsers = [
      {
        email: 'admin@demo.com',
        password: 'admin123',
        fullName: 'Administrator',
        role: 'admin',
      },
      {
        email: 'user@demo.com',
        password: 'user123',
        fullName: 'Demo User',
        role: 'user',
      },
    ];

    demoUsers.forEach(userData => {
      const newUser = createUser(userData);
      users.push(newUser);
    });

    saveUsers(users);
    console.log('Demo users seeded:', demoUsers.map(u => ({ email: u.email, password: u.password })));
  }
}

// Get system statistics for admin dashboard
export function getSystemStats() {
  const users = getAllUsers();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(user => user.role === 'admin').length,
    totalRegularUsers: users.filter(user => user.role === 'user').length,
    recentRegistrations: users.filter(user => 
      new Date(user.createdAt) >= sevenDaysAgo
    ).length,
    activeToday: users.filter(user => 
      user.lastLogin && new Date(user.lastLogin) >= startOfToday
    ).length,
    verifiedUsers: users.filter(user => user.isVerified).length,
    pendingUsers: users.filter(user => !user.isVerified).length,
  };

  return stats;
}

// Get detailed user analytics
export function getUserAnalytics() {
  const users = getAllUsers();
  const now = new Date();
  
  // Registration trends (last 30 days)
  const registrationTrend = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const count = users.filter(user => {
      const createdAt = new Date(user.createdAt);
      return createdAt >= dayStart && createdAt < dayEnd;
    }).length;
    
    registrationTrend.push({
      date: dayStart.toISOString().split('T')[0],
      count,
    });
  }

  // Login activity (last 7 days)
  const loginActivity = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
    
    const count = users.filter(user => {
      if (!user.lastLogin) return false;
      const lastLogin = new Date(user.lastLogin);
      return lastLogin >= dayStart && lastLogin < dayEnd;
    }).length;
    
    loginActivity.push({
      date: dayStart.toISOString().split('T')[0],
      count,
    });
  }

  return {
    registrationTrend,
    loginActivity,
    roleDistribution: {
      admin: users.filter(user => user.role === 'admin').length,
      user: users.filter(user => user.role === 'user').length,
    },
    verificationStatus: {
      verified: users.filter(user => user.isVerified).length,
      pending: users.filter(user => !user.isVerified).length,
    },
  };
}

// Initialize demo data on module load
if (import.meta.env.DEV) {
  seedDemoUsers();
}