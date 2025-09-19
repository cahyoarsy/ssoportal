import { useState, useEffect } from 'react';

export default function RecentActivity({ user }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Mock recent activities
    const mockActivities = [
      {
        id: 1,
        action: 'Login',
        description: 'Masuk ke sistem',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
        icon: '🔑'
      },
      {
        id: 2,
        action: 'E-Learning',
        description: 'Mengakses modul IML',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        icon: '📚'
      },
      {
        id: 3,
        action: 'Profile',
        description: 'Update profil',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        icon: '👤'
      }
    ];
    
    setActivities(mockActivities);
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    return `${days} hari lalu`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🕐 Aktivitas Terbaru
      </h3>
      
      <div className="space-y-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm">{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {activity.action}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {activity.description}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatTime(activity.time)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Belum ada aktivitas terbaru
          </div>
        )}
      </div>
    </div>
  );
}