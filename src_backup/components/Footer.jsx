import React from 'react';
import { motion } from 'framer-motion';
import { PROGRAM_NAME, PROGRAM_SHORT } from '../branding.js';
import Icon from './ui/Icon.jsx';
import { handleAnchorClick } from '../utils/anchors.js';

export default function Footer(){
  const year = new Date().getFullYear();
  
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={footerVariants}
      className="relative mt-24 overflow-hidden"
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30" />
      <div className="absolute inset-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60" />
      
      {/* Floating background elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      
      <div className="relative border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {/* Brand Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-brand-600 bg-clip-text text-transparent">
                  {PROGRAM_NAME}
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-md">
                  Platform terpadu pembelajaran, monitoring, dan autentikasi ringan untuk eksperimen arsitektur identitas modern.
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full border border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    v0.1.0 Demo
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">Frontend Prototype</span>
                </div>
              </div>
              
              {/* Social/Contact Links */}
              <div className="flex items-center gap-4">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl transition-all duration-300"
                  disabled
                >
                  <Icon name="mail" className="text-white" size={18} strokeWidth={2} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-xl transition-all duration-300"
                  disabled
                >
                  <Icon name="device" className="text-white" size={18} strokeWidth={2} />
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 flex items-center justify-center hover:shadow-xl transition-all duration-300"
                  disabled
                >
                  <Icon name="shield" className="text-white" size={18} strokeWidth={2} />
                </motion.button>
              </div>
            </motion.div>

            {/* Portal Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                Portal
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Login', href: '#login', icon: 'login' },
                  { name: 'Profil', href: '#profile', icon: 'user' },
                  { name: 'Statistik', href: '#today', icon: 'stats' },
                  { name: 'Kontak', href: '#contact', icon: 'mail' }
                ].map((link) => (
                  <motion.a 
                    key={link.name}
                    href={link.href}
                    onClick={(e)=>handleAnchorClick(e, link.href)}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-slate-600 hover:text-brand-600 transition-colors group"
                  >
                    <Icon name={link.icon} size={16} className="text-slate-500 group-hover:text-brand-600 transition-colors" />
                    <span className="group-hover:font-medium transition-all">{link.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Features Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Fitur
              </h4>
              <div className="space-y-3">
                {[
                  { name: 'Single Sign-On', status: 'active', icon: '🔑' },
                  { name: 'Multi-Factor Auth', status: 'soon', icon: '🛡️' },
                  { name: 'Device Trust', status: 'soon', icon: '📱' },
                  { name: 'Audit Trail', status: 'soon', icon: '📋' }
                ].map((feature, index) => (
                  <motion.div 
                    key={feature.name}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 group"
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform">{feature.icon}</span>
                    <span className={`transition-all ${feature.status === 'active' ? 'text-slate-700 group-hover:text-brand-600 group-hover:font-medium' : 'text-slate-400'}`}>
                      {feature.name}
                    </span>
                    {feature.status === 'soon' && (
                      <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full border border-amber-200">
                        Soon
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-slate-200/60 bg-slate-50/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>© {year} {PROGRAM_SHORT}</span>
                <span className="hidden sm:block">•</span>
                <span className="text-xs">All rights reserved</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="text-slate-500 hover:text-brand-600 transition-colors"
                  disabled
                >
                  Privacy Policy
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="text-slate-500 hover:text-brand-600 transition-colors"
                  disabled
                >
                  Terms of Service
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="text-slate-500 hover:text-brand-600 transition-colors"
                  disabled
                >
                  Status
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
