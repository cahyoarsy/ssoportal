import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROGRAM_SHORT } from '../branding.js';
import { t } from '../langResources.js';
import Icon from './ui/Icon.jsx';
import Button from './ui/Button.jsx';
import { handleAnchorClick } from '../utils/anchors.js';

const baseLinks = [
  { href: '#home', key: 'nav.home' },
  { href: '#today', key: 'nav.how' },
  { href: '#login', key: 'nav.login' },
  { href: '#profile', key: 'nav.profile' },
];

export default function Navbar({ dark, setDark, lang, setLang, isAdmin }){
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="container-section flex items-center justify-between h-20">
        <a href="#home" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
            <Icon name="brand" size={22} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {PROGRAM_SHORT}
          </span>
        </a>
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          {baseLinks.map(l => (
            <a 
              key={l.href} 
              href={l.href}
              onClick={(e)=>handleAnchorClick(e, l.href)} 
              className="text-gray-600 hover:text-blue-600 transition-all duration-200 py-2 px-1 relative group"
            >
              {t(lang, l.key)}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="md"
              onClick={()=> setDark && setDark(d=>!d)}
              aria-label={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <Icon name={dark ? 'sun' : 'moon'} size={18} className={dark ? 'text-yellow-500' : 'text-gray-600'} />
            </Button>

            <Button
              variant="secondary"
              size="md"
              onClick={()=> setLang && setLang(l=> l==='id' ? 'en' : 'id')}
            >
              {lang === 'id' ? '🇬🇧 EN' : '🇮🇩 ID'}
            </Button>
          </div>
        </div>
        <Button variant="secondary" size="md" className="md:hidden" onClick={()=>setOpen(o=>!o)} aria-label="Toggle menu">
          <Icon name="menu" />
        </Button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="md:hidden overflow-hidden border-b border-slate-100 bg-white">
            <div className="container-section py-4 flex flex-col gap-2">
              {baseLinks.map(l => <a key={l.href} href={l.href} onClick={(e)=>{ handleAnchorClick(e, l.href); setOpen(false); }} className="py-2 text-slate-600 hover:text-brand-600">{t(lang, l.key)}</a>)}
              <button type="button" onClick={()=> { setDark && setDark(d=>!d); setOpen(false); }} className="mt-2 text-left text-slate-600 hover:text-brand-600 py-2">{dark? 'Mode Terang':'Mode Gelap'}</button>
              <button type="button" onClick={()=> { setLang && setLang(l=> l==='id' ? 'en' : 'id'); setOpen(false); }} className="text-left text-slate-600 hover:text-brand-600 py-2">Bahasa: {lang==='id'? 'ID':'EN'}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
