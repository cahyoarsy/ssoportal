import React from 'react';
import { motion } from 'framer-motion';
import { PROGRAM_NAME, PROGRAM_TAGLINE_ID, PROGRAM_TAGLINE_EN } from '../branding.js';
import { t } from '../langResources.js';

export default function Hero({ lang='id' }){
  return (
    <section id="home" className="relative pt-20 pb-24 bg-gradient-to-b from-brand-50 to-white overflow-hidden">
      <div className="container-section grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{y:30, opacity:0}} whileInView={{y:0, opacity:1}} viewport={{once:true}} transition={{duration:0.7}} className="flex flex-col gap-6">
          <span className="badge w-fit">{t(lang,'hero.badge')}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">{PROGRAM_NAME}</h1>
          <p className="text-lg text-slate-600 max-w-prose">{lang==='id' ? PROGRAM_TAGLINE_ID : PROGRAM_TAGLINE_EN}</p>
          <p className="text-sm text-slate-500 max-w-prose italic">{lang==='id' ? PROGRAM_TAGLINE_EN : PROGRAM_TAGLINE_ID}</p>
          <div className="flex flex-wrap gap-4">
            <a href="#login" className="btn-primary px-6 py-3 text-base">{t(lang,'hero.loginBtn')}</a>
            <a href="#how" className="btn-outline px-6 py-3 text-base">{t(lang,'hero.howBtn')}</a>
          </div>
        </motion.div>
        <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} viewport={{once:true}} transition={{duration:0.8, delay:0.2}} className="relative">
          <div className="aspect-square max-w-sm mx-auto relative">
            {/* Ilustrasi sederhana */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-brand-200 via-brand-100 to-brand-300 rounded-[3rem] blur-2xl opacity-60" />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="card p-8 shadow-brand w-full h-full flex flex-col items-center justify-center text-center rounded-[3rem]">
                <svg className="w-20 h-20 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h12M3 17h8"/></svg>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{lang==='id' ? 'Platform rekayasa & pembelajaran terpadu mendukung eksperimen, dokumentasi, dan evaluasi.' : 'Integrated engineering & learning platform enabling experiments, documentation, and evaluation.'}</p>
                <p className="mt-1 text-[11px] text-slate-500 italic">{lang==='id' ? 'Focus: kemandirian teknis, kedalaman kompetensi, dan alur belajar terstruktur.' : 'Focus: technical autonomy, depth of competence, and structured learning flow.'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
