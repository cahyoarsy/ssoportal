import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  {
    year: '2024 - 2025',
    id: 'Mulai fokus mempelajari dasar instalasi kelistrikan rumah tangga & pengenalan motor listrik kecil.',
    en: 'Began focusing on household electrical installation basics & small electric motor fundamentals.'
  },
  {
    year: '2025',
    id: 'Eksplorasi awal teknik rewinding melalui studi mandiri dan observasi bengkel lokal.',
    en: 'Early exploration of motor rewinding through self-study and local workshop observation.'
  },
  {
    year: 'Target 2026',
    id: 'Membangun mini-workshop belajar kelistrikan praktis untuk lingkungan sekitar.',
    en: 'Establish a small practical electrical learning workshop for the local community.'
  },
  {
    year: 'Target 2027+',
    id: 'Produksi dokumentasi teknis berbahasa Indonesia tentang perawatan & troubleshooting motor listrik.',
    en: 'Produce Indonesian technical documentation on motor maintenance & troubleshooting.'
  }
];

export default function ExperienceTimeline({ lang='id' }){
  return (
    <div className="card p-6 flex flex-col gap-6">
      <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-lg">{lang==='id'? 'Timeline Pengembangan':'Development Timeline'}</h3>
      <div className="relative border-l border-slate-200 dark:border-slate-700 pl-4 flex flex-col gap-6">
        {timelineData.map((item, idx) => (
          <motion.div key={idx} initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} viewport={{once:true}} transition={{duration:.4, delay: idx*0.05}} className="relative">
            <span className="absolute -left-5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white dark:ring-slate-900" />
            <div className="text-xs uppercase tracking-wide text-brand-600 dark:text-brand-400 font-semibold mb-1">{item.year}</div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item[lang]}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}