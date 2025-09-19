import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserProfile({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const getProfileImage = () => {
    if (user?.profileImage && typeof user.profileImage === 'string') {
      if (user.profileImage.startsWith('http')) {
        return user.profileImage;
      }
      return (import.meta?.env?.BASE_URL || '/') + user.profileImage;
    }
    return (import.meta?.env?.BASE_URL || '/') + 'profile.jpg';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <img
          src={getProfileImage()}
          alt={user?.name || 'User'}
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
        />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.name || 'User'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role === 'admin' ? 'Administrator' : 'Pengguna'}
          </div>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="font-medium text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || 'user@example.com'}
              </div>
            </div>
            
            <div className="p-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Add profile management logic
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                👤 Kelola Profil
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Add settings logic
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                ⚙️ Pengaturan
              </button>
              <hr className="my-1 border-gray-200 dark:border-gray-700" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                🚪 Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}