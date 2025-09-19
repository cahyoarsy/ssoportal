import React from 'react';
import { motion } from 'framer-motion';

export default function MobileApp(){
  return (
    <section id="about" className="container-section scroll-mt-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{x:-40, opacity:0}} whileInView={{x:0, opacity:1}} viewport={{once:true}} transition={{duration:0.6}} className="flex flex-col gap-6">
          <h2 className="text-3xl font-semibold text-slate-800">Aplikasi Mobile Institusi</h2>
            <p className="text-slate-600 leading-relaxed max-w-prose">Akses cepat ke jadwal, nilai, kehadiran, pengumuman, dan notifikasi keamanan akun langsung dari perangkat Anda. SSO memastikan pengalaman tanpa perlu login berulang.</p>
          <div className="flex gap-4 flex-wrap">
            <button className="btn-outline px-5 py-2 text-sm" type="button" disabled>{/* Placeholder store link */}Google Play (coming)</button>
            <button className="btn-outline px-5 py-2 text-sm" type="button" disabled>App Store (coming)</button>
          </div>
          <ul className="grid gap-2 text-sm text-slate-600">
            <li>• Notifikasi push aktivitas akun</li>
            <li>• Pemulihan kata sandi terintegrasi</li>
            <li>• Mode akses cepat (biometrik*)</li>
          </ul>
          <p className="text-xs text-slate-400">* Integrasi biometrik memerlukan implementasi native tambahan.</p>
        </motion.div>
        <motion.div initial={{x:40, opacity:0}} whileInView={{x:0, opacity:1}} viewport={{once:true}} transition={{duration:0.6, delay:0.2}} className="relative">
          <div className="grid sm:grid-cols-2 gap-6">
            {[1,2].map(i => (
              <div key={i} className="card p-6 flex flex-col gap-3 justify-between">
                <div className="flex flex-col gap-3">
                  <span className="badge">Fitur {i}</span>
                  <p className="text-sm text-slate-600">Deskripsi singkat fitur aplikasi mobile ke-{i} yang menambah produktivitas pengguna.</p>
                </div>
                <div className="h-1 w-full rounded bg-gradient-to-r from-brand-200 to-brand-500" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
