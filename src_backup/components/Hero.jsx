import React from 'react';
import { motion } from 'framer-motion';
import { PROGRAM_NAME, PROGRAM_TAGLINE_ID, PROGRAM_TAGLINE_EN } from '../branding.js';
import { t } from '../langResources.js';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import { handleAnchorClick } from '../utils/anchors.js';

export default function Hero({ lang='id' }){
  return (
    <section id="home" className="relative pt-24 pb-32 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container-section grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div 
          initial={{y:40, opacity:0}} 
          whileInView={{y:0, opacity:1}} 
          viewport={{once:true}} 
          transition={{duration:0.8, ease:"easeOut"}} 
          className="flex flex-col gap-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium w-fit shadow-lg">
            <Icon name="star" size={16} className="text-white" strokeWidth={2} />
            {t(lang,'hero.badge')}
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {PROGRAM_NAME}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-prose leading-relaxed">
              {lang==='id' ? PROGRAM_TAGLINE_ID : PROGRAM_TAGLINE_EN}
            </p>
            <p className="text-sm text-gray-500 max-w-prose italic">
              {lang==='id' ? PROGRAM_TAGLINE_EN : PROGRAM_TAGLINE_ID}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button as="a" href="#login" onClick={(e)=>handleAnchorClick(e,'#login')} variant="primary" size="xl" leftIcon="login">
              {t(lang,'hero.loginBtn')}
            </Button>
            <Button as="a" href="#today" onClick={(e)=>handleAnchorClick(e,'#today')} variant="secondary" size="xl" leftIcon="info">
              {t(lang,'hero.howBtn')}
            </Button>
          </div>
        </motion.div>
        <motion.div 
          initial={{scale:0.9, opacity:0, y:40}} 
          whileInView={{scale:1, opacity:1, y:0}} 
          viewport={{once:true}} 
          transition={{duration:0.8, delay:0.2, ease:"easeOut"}} 
          className="relative"
        >
          <div className="aspect-square max-w-lg mx-auto relative">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 via-purple-100 to-blue-300 rounded-[4rem] blur-3xl opacity-60 animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-bl from-purple-200 via-blue-100 to-purple-300 rounded-[3.5rem] blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Main card */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-12 shadow-2xl w-full h-full flex flex-col items-center justify-center text-center rounded-[4rem] border border-white/50">
                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <Icon name="brand" size={48} className="text-white" strokeWidth={1.6} />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Portal SSO</h3>
                <p className="text-gray-600 leading-relaxed mb-2 text-base">
                  {lang==='id' ? 
                    'Platform rekayasa & pembelajaran terpadu mendukung eksperimen, dokumentasi, dan evaluasi.' : 
                    'Integrated engineering & learning platform enabling experiments, documentation, and evaluation.'
                  }
                </p>
                <p className="text-sm text-gray-500 italic">
                  {lang==='id' ? 
                    'Focus: kemandirian teknis, kedalaman kompetensi, dan alur belajar terstruktur.' : 
                    'Focus: technical autonomy, depth of competence, and structured learning flow.'
                  }
                </p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {lang === 'id' ? 'E-Learning' : 'E-Learning'}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {lang === 'id' ? 'Monitoring' : 'Monitoring'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {lang === 'id' ? 'Analytics' : 'Analytics'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
