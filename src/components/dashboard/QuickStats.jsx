import { motion } from 'framer-motion';

export default function QuickStats({ user, availableModules }) {
  const stats = [
    {
      label: "Modul Tersedia",
      value: availableModules?.length || 0,
      icon: "📚",
      color: "from-blue-500 to-blue-600"
    },
    {
      label: "Status",
      value: user?.role === 'admin' ? 'Admin' : 'User',
      icon: user?.role === 'admin' ? "👑" : "👤",
      color: "from-green-500 to-green-600"
    },
    {
      label: "Akses Terakhir",
      value: "Hari ini",
      icon: "🕐",
      color: "from-purple-500 to-purple-600"
    },
    {
      label: "Progress",
      value: "85%",
      icon: "📈",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}