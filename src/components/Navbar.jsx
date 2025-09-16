import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROGRAM_SHORT } from '../branding.js';
import { t } from '../langResources.js';

const baseLinks = [
  { href: '#home', key: 'nav.home' },
  { href: '#how', key: 'nav.how' },
  { href: '#login', key: 'nav.login' },
  { href: '#profil', key: 'nav.profile' },
];

export default function Navbar({ dark, setDark, lang, setLang }){
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-100">
      <div className="container-section flex items-center justify-between h-16">
  <a href="#home" className="font-semibold text-lg text-brand-600">{PROGRAM_SHORT}</a>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {baseLinks.map(l => <a key={l.href} href={l.href} className="text-slate-600 hover:text-brand-600 transition-colors">{t(lang, l.key)}</a>)}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <button type="button" onClick={()=> setDark && setDark(d=>!d)} className="text-xs px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50">
            {dark ? 'Light' : 'Dark'}
          </button>
          <button type="button" onClick={()=> setLang && setLang(l=> l==='id' ? 'en' : 'id')} className="text-xs px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50">
            {lang === 'id' ? 'EN' : 'ID'}
          </button>
        </div>
        <button onClick={()=>setOpen(o=>!o)} className="md:hidden inline-flex items-center p-2 rounded-lg border border-slate-200">
          <span className="sr-only">Toggle menu</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="md:hidden overflow-hidden border-b border-slate-100 bg-white">
            <div className="container-section py-4 flex flex-col gap-2">
              {baseLinks.map(l => <a key={l.href} href={l.href} onClick={()=>setOpen(false)} className="py-2 text-slate-600 hover:text-brand-600">{t(lang, l.key)}</a>)}
              <button type="button" onClick={()=> { setDark && setDark(d=>!d); setOpen(false); }} className="mt-2 text-left text-slate-600 hover:text-brand-600 py-2">{dark? 'Mode Terang':'Mode Gelap'}</button>
              <button type="button" onClick={()=> { setLang && setLang(l=> l==='id' ? 'en' : 'id'); setOpen(false); }} className="text-left text-slate-600 hover:text-brand-600 py-2">Bahasa: {lang==='id'? 'ID':'EN'}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
