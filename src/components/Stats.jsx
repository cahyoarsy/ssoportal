import React from 'react';
import { motion } from 'framer-motion';

const statsData = [
  { label: 'Pengguna Aktif', value: 12840 },
  { label: 'Sistem Terintegrasi', value: 32 },
  { label: 'Aktivitas Hari Ini', value: 5421 },
  { label: 'Permintaan API / mnt', value: 894 }
];

export default function Stats(){
  return (
    <section id="today" className="container-section scroll-mt-24">
      <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-semibold text-slate-800">Statistik Penggunaan</h2>
        <span className="text-xs text-slate-400">Data dummy untuk demonstrasi UI</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((s,i)=>(
          <motion.div key={s.label} initial={{y:20, opacity:0}} whileInView={{y:0, opacity:1}} viewport={{once:true}} transition={{duration:0.4, delay:i*0.05}} className="card p-6 flex flex-col gap-2">
            <span className="text-3xl font-bold tracking-tight text-brand-600">{s.value.toLocaleString()}</span>
            <span className="text-sm font-medium text-slate-600">{s.label}</span>
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
