import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const statsData = [
  { 
    label: 'Pengguna Aktif', 
    value: 12840, 
    change: '+12.5%',
    positive: true,
    icon: '👥',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50'
  },
  { 
    label: 'Sistem Terintegrasi', 
    value: 32, 
    change: '+3',
    positive: true,
    icon: '🔗',
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50'
  },
  { 
    label: 'Aktivitas Hari Ini', 
    value: 5421, 
    change: '+8.2%',
    positive: true,
    icon: '⚡',
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50'
  },
  { 
    label: 'Permintaan API / mnt', 
    value: 894, 
    change: '-2.1%',
    positive: false,
    icon: '📊',
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50'
  }
];

function AnimatedCounter({ value, duration = 2000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOut)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(eased * value);
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return displayValue.toLocaleString();
}

export default function Stats(){
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: { 
      y: 0, 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section id="today" className="container-section scroll-mt-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-purple-200/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center space-y-4"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
            Statistik Real-time
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Pantau performa sistem SSO dan aktivitas pengguna secara langsung
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-500">Live data</span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-400">Data dummy untuk demonstrasi UI</span>
          </div>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={stat.label}
              variants={cardVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-2xl`} />
              
              {/* Floating icon background */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-white/80 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <div className="relative space-y-4">
                {/* Value */}
                <div className="space-y-2">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    <AnimatedCounter value={stat.value} duration={2000 + index * 200} />
                  </div>
                  
                  {/* Change indicator */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.positive 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {stat.positive ? '↗' : '↘'} {stat.change}
                    </span>
                    <span className="text-xs text-slate-400">vs last week</span>
                  </div>
                </div>

                {/* Label */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 group-hover:text-slate-800 transition-colors">
                    {stat.label}
                  </h3>
                  
                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "75%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
                        className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full`}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Target: 75%</span>
                      <span>Achieved</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover effect border */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom section with additional info */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "Uptime System",
              value: "99.98%",
              desc: "Availability dalam 30 hari terakhir",
              icon: "🟢"
            },
            {
              title: "Avg Response Time",
              value: "127ms",
              desc: "Rata-rata waktu respons API",
              icon: "⚡"
            },
            {
              title: "Security Score",
              value: "A+",
              desc: "Rating keamanan sistem SSO",
              icon: "🛡️"
            }
          ].map((item, index) => (
            <motion.div 
              key={item.title}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6 text-center space-y-3"
            >
              <div className="text-2xl">{item.icon}</div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-slate-800">{item.value}</div>
                <div className="text-sm font-medium text-slate-600">{item.title}</div>
                <div className="text-xs text-slate-500">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
