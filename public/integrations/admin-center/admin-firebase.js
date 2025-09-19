// Firebase Admin Center Integration
// This script handles Firebase integration for the admin center

// Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:demo"
};

// Initialize Firebase (only if not already initialized)
if (!window.firebase) {
  const script = document.createElement('script');
  script.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js';
  document.head.appendChild(script);

  script.onload = () => {
    window.firebase.initializeApp(firebaseConfig);

    // Load Firestore
    const firestoreScript = document.createElement('script');
    firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js';
    document.head.appendChild(firestoreScript);

    firestoreScript.onload = () => {
      window.db = window.firebase.firestore();
      console.log('Firebase initialized for admin center');
    };
  };
}

// Admin Center Firebase Service
class AdminFirebaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.init();
  }

  async init() {
    if (window.db) {
      this.db = window.db;
      this.isInitialized = true;
    } else {
      // Wait for Firebase to initialize
      await new Promise(resolve => {
        const checkFirebase = setInterval(() => {
          if (window.db) {
            this.db = window.db;
            this.isInitialized = true;
            clearInterval(checkFirebase);
            resolve();
          }
        }, 100);
      });
    }
  }

  // Get all user profiles from Firebase
  async getAllUserProfiles() {
    if (!this.isInitialized) await this.init();

    try {
      const usersRef = this.db.collection('users');
      const snapshot = await usersRef.get();

      const users = [];
      snapshot.forEach(doc => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          ...userData,
          // Ensure all required fields exist
          name: userData.name || userData.displayName || userData.email || 'Unknown',
          email: userData.email || '',
          role: userData.role || 'user',
          status: userData.status || 'offline',
          lastLogin: userData.lastLogin || userData.createdAt || new Date().toISOString(),
          avatar: userData.avatar || userData.photoURL || userData.picture || '/profile.jpg',
          totalLogins: userData.totalLogins || 0,
          sessionTime: userData.sessionTime || '0h 0m',
          joinDate: userData.createdAt || userData.joinDate || new Date().toISOString(),
          progress: userData.progress || 0,
          completedModules: userData.completedModules || 0
        });
      });

      return users;
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      return [];
    }
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    if (!this.isInitialized) await this.init();

    try {
      const userRef = this.db.collection('users').doc(userId);
      const doc = await userRef.get();

      if (doc.exists) {
        const userData = doc.data();
        return {
          id: doc.id,
          ...userData,
          name: userData.name || userData.displayName || userData.email || 'Unknown',
          email: userData.email || '',
          role: userData.role || 'user',
          status: userData.status || 'offline',
          lastLogin: userData.lastLogin || userData.createdAt || new Date().toISOString(),
          avatar: userData.avatar || userData.photoURL || userData.picture || '/profile.jpg',
          totalLogins: userData.totalLogins || 0,
          sessionTime: userData.sessionTime || '0h 0m',
          joinDate: userData.createdAt || userData.joinDate || new Date().toISOString(),
          progress: userData.progress || 0,
          completedModules: userData.completedModules || 0
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    if (!this.isInitialized) await this.init();

    try {
      const userRef = this.db.collection('users').doc(userId);
      await userRef.update({
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  // Get user statistics
  async getUserStatistics() {
    if (!this.isInitialized) await this.init();

    try {
      const users = await this.getAllUserProfiles();

      const stats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'online').length,
        totalLogins: users.reduce((sum, u) => sum + (u.totalLogins || 0), 0),
        averageSessionTime: this.calculateAverageSessionTime(users),
        usersByRole: this.groupUsersByRole(users),
        recentLogins: users
          .filter(u => u.lastLogin)
          .sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin))
          .slice(0, 10)
      };

      return stats;
    } catch (error) {
      console.error('Error calculating user statistics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalLogins: 0,
        averageSessionTime: '0h 0m',
        usersByRole: {},
        recentLogins: []
      };
    }
  }

  // Helper: Calculate average session time
  calculateAverageSessionTime(users) {
    if (users.length === 0) return '0h 0m';

    const totalMinutes = users.reduce((sum, user) => {
      const time = user.sessionTime || '0h 0m';
      const hours = parseInt(time.split('h')[0]) || 0;
      const minutes = parseInt(time.split('h')[1]?.split('m')[0]) || 0;
      return sum + (hours * 60 + minutes);
    }, 0);

    const avgMinutes = Math.round(totalMinutes / users.length);
    const hours = Math.floor(avgMinutes / 60);
    const minutes = avgMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  // Helper: Group users by role
  groupUsersByRole(users) {
    const groups = {};
    users.forEach(user => {
      const role = user.role || 'user';
      groups[role] = (groups[role] || 0) + 1;
    });
    return groups;
  }

  // Create or update user profile (for admin operations)
  async saveUserProfile(userData) {
    if (!this.isInitialized) await this.init();

    try {
      const userRef = this.db.collection('users').doc(userData.id || userData.email);
      await userRef.set({
        ...userData,
        updatedAt: new Date().toISOString(),
        createdAt: userData.createdAt || new Date().toISOString()
      }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  }

  // Delete user profile
  async deleteUserProfile(userId) {
    if (!this.isInitialized) await this.init();

    try {
      await this.db.collection('users').doc(userId).delete();
      return true;
    } catch (error) {
      console.error('Error deleting user profile:', error);
      return false;
    }
  }
}

// Global instance
window.adminFirebaseService = new AdminFirebaseService();