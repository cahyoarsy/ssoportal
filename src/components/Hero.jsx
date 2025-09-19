import React from 'react';
import { motion } from 'framer-motion';
import { PROGRAM_NAME, PROGRAM_TAGLINE_ID, PROGRAM_TAGLINE_EN } from '../branding.js';
import { t } from '../langResources.js';
import Button from './ui/Button.jsx';
import Icon from './ui/Icon.jsx';
import { handleAnchorClick } from '../utils/anchors.js';

export default function Hero({ lang='id' }){
  return (
    <section id="home" className="relative pt-20 md:pt-24 pb-20 md:pb-32 bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 md:-top-40 -right-20 md:-right-40 w-40 md:w-80 h-40 md:h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-20 md:-bottom-40 -left-20 md:-left-40 w-40 md:w-80 h-40 md:h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="container-section grid lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
        <motion.div 
          initial={{y:40, opacity:0}} 
          whileInView={{y:0, opacity:1}} 
          viewport={{once:true}} 
          transition={{duration:0.8, ease:"easeOut"}} 
          className="flex flex-col gap-6 md:gap-8 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium w-fit mx-auto lg:mx-0 shadow-lg">
            <Icon name="star" size={14} className="text-white md:hidden" strokeWidth={2} />
            <Icon name="star" size={16} className="text-white hidden md:block" strokeWidth={2} />
            {t(lang,'hero.badge')}
          </div>
          
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {PROGRAM_NAME}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-prose leading-relaxed mx-auto lg:mx-0">
              {lang==='id' ? PROGRAM_TAGLINE_ID : PROGRAM_TAGLINE_EN}
            </p>
            <p className="text-sm text-gray-500 max-w-prose italic mx-auto lg:mx-0">
              {lang==='id' ? PROGRAM_TAGLINE_EN : PROGRAM_TAGLINE_ID}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-2 md:pt-4 justify-center lg:justify-start">
            <Button as="a" href="#login" onClick={(e)=>handleAnchorClick(e,'#login')} variant="primary" size="xl" leftIcon="login" className="w-full sm:w-auto">
              {t(lang,'hero.loginBtn')}
            </Button>
            <Button as="a" href="#today" onClick={(e)=>handleAnchorClick(e,'#today')} variant="secondary" size="xl" leftIcon="info" className="w-full sm:w-auto">
              {t(lang,'hero.howBtn')}
            </Button>
          </div>
        </motion.div>
        <motion.div 
          initial={{scale:0.9, opacity:0, y:40}} 
          whileInView={{scale:1, opacity:1, y:0}} 
          viewport={{once:true}} 
          transition={{duration:0.8, delay:0.2, ease:"easeOut"}} 
          className="relative order-first lg:order-last"
        >
          <div className="aspect-square max-w-sm md:max-w-lg mx-auto relative">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 via-purple-100 to-blue-300 rounded-2xl md:rounded-[4rem] blur-2xl md:blur-3xl opacity-60 animate-pulse" />
            <div className="absolute inset-2 md:inset-4 bg-gradient-to-bl from-purple-200 via-blue-100 to-purple-300 rounded-xl md:rounded-[3.5rem] blur-xl md:blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            
            {/* Main card */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-6 md:p-12 shadow-2xl w-full h-full flex flex-col items-center justify-center text-center rounded-2xl md:rounded-[4rem] border border-white/50">
                {/* Icon */}
                <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-xl">
                  <Icon name="brand" size={32} className="text-white md:hidden" strokeWidth={1.6} />
                  <Icon name="brand" size={48} className="text-white hidden md:block" strokeWidth={1.6} />
                </div>
                
                {/* Content */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Portal SSO</h3>
                <p className="text-gray-600 leading-relaxed mb-2 text-sm md:text-base px-2">
                  {lang==='id' ? 
                    'Platform rekayasa & pembelajaran terpadu mendukung eksperimen, dokumentasi, dan evaluasi.' : 
                    'Integrated engineering & learning platform enabling experiments, documentation, and evaluation.'
                  }
                </p>
                <p className="text-xs md:text-sm text-gray-500 italic px-2">
                  {lang==='id' ? 
                    'Focus: kemandirian teknis, kedalaman kompetensi, dan alur belajar terstruktur.' : 
                    'Focus: technical autonomy, depth of competence, and structured learning flow.'
                  }
                </p>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 md:gap-2 mt-4 md:mt-6 justify-center">
                  <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {lang === 'id' ? 'E-Learning' : 'E-Learning'}
                  </span>
                  <span className="px-2 md:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {lang === 'id' ? 'Monitoring' : 'Monitoring'}
                  </span>
                  <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
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
