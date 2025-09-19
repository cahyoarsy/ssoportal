import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm.jsx';
import { t } from '../langResources.js';

export default function Contact({ lang='id' }){
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const contactMethods = [
    {
      type: 'WhatsApp',
      icon: '💬',
      description: t(lang,'contact.whatsapp'),
      action: t(lang,'contact.openChat'),
      href: 'https://wa.me/6287871049135',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      external: true
    },
    {
      type: 'Email',
      icon: '📧',
      description: t(lang,'contact.emailDesc'),
      action: t(lang,'contact.sendEmail'),
      href: 'mailto:mcahyosangsongko@gmail.com',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      external: false
    },
    {
      type: t(lang,'contact.office'),
      icon: '🏢',
      description: 'Gedung P7 Himapala Unesa, jalan raya unesa lidah wetan, lakarsantri, Surabaya, Indonesia',
      action: t(lang,'contact.mapSoon'),
      href: 'maps://?q=Gedung+P7+Himapala+Unesa',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      disabled: true
    }
  ];

  return (
    <section id="contact" className="container-section scroll-mt-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative space-y-16"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-brand-600 bg-clip-text text-transparent">
            {t(lang,'contact.heading')}
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {t(lang,'contact.desc')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Methods */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-800">Hubungi Kami</h3>
              <p className="text-slate-600">Pilih metode komunikasi yang paling nyaman untuk Anda</p>
            </div>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.type}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${method.bgGradient} opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-2xl`} />
                  
                  <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-14 h-14 bg-gradient-to-br ${method.gradient} rounded-xl shadow-lg flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300`}>
                      {method.icon}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                          {method.type}
                        </h4>
                        {method.external && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full border border-green-200">
                            External
                          </span>
                        )}
                        {method.disabled && (
                          <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-full border border-amber-200">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                        {method.description}
                      </p>
                      
                      <div className="flex gap-3">
                        <motion.a
                          href={method.href}
                          target={method.external ? "_blank" : undefined}
                          rel={method.external ? "noopener" : undefined}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${
                            method.disabled 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : `bg-gradient-to-r ${method.gradient} text-white shadow-lg hover:shadow-xl`
                          }`}
                          onClick={method.disabled ? (e) => e.preventDefault() : undefined}
                        >
                          {method.action}
                          {method.external && !method.disabled && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </motion.a>
                        
                        {method.type === t(lang,'contact.office') && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 border-2 border-slate-200 hover:border-purple-300 text-slate-600 hover:text-purple-600 rounded-xl font-medium text-sm transition-all duration-300"
                            disabled
                          >
                            {t(lang,'contact.appointment')}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Response Time */}
            <motion.div 
              variants={itemVariants}
              className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm">
                  ⚡
                </div>
                <h4 className="font-bold text-slate-800">Response Time</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-slate-600">WhatsApp</div>
                  <div className="font-semibold text-green-600">&lt; 2 jam</div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-600">Email</div>
                  <div className="font-semibold text-blue-600">&lt; 24 jam</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            variants={itemVariants}
            className="relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-xl"
          >
            {/* Floating decorative elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse" />
            
            <div className="relative space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {t(lang,'contact.form')}
                </h3>
                <p className="text-slate-600">Kirim pesan langsung kepada tim kami</p>
                <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              
              <ContactForm lang={lang} />
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div 
          variants={itemVariants}
          className="text-center bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8 space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-800">Butuh Bantuan Segera?</h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Tim support kami siap membantu Anda 24/7 untuk masalah teknis dan pertanyaan umum
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="https://wa.me/6287871049135"
              target="_blank"
              rel="noopener"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              💬 Chat WhatsApp
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </motion.a>
            
            <motion.a
              href="mailto:mcahyosangsongko@gmail.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-300 hover:border-blue-400 text-blue-600 hover:text-blue-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
            >
              📧 Kirim Email
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
