import React from 'react';
import { motion } from 'framer-motion';

export default function Hero(){
  return (
    <section id="home" className="relative pt-20 pb-24 bg-gradient-to-b from-brand-50 to-white overflow-hidden">
      <div className="container-section grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{y:30, opacity:0}} whileInView={{y:0, opacity:1}} viewport={{once:true}} transition={{duration:0.7}} className="flex flex-col gap-6">
          <span className="badge w-fit">Portal Terpadu</span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">Single Sign On <span className="text-brand-600">Universitas</span></h1>
          <p className="text-lg text-slate-600 max-w-prose">Satu akun untuk mengakses berbagai layanan sistem informasi akademik, administrasi, dan aplikasi internal lembaga. Aman, cepat, dan terintegrasi.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#login" className="btn-primary px-6 py-3 text-base">Masuk Sekarang</a>
            <a href="#how" className="btn-outline px-6 py-3 text-base">Cara Kerja</a>
          </div>
        </motion.div>
        <motion.div initial={{scale:0.9, opacity:0}} whileInView={{scale:1, opacity:1}} viewport={{once:true}} transition={{duration:0.8, delay:0.2}} className="relative">
          <div className="aspect-square max-w-sm mx-auto relative">
            {/* Ilustrasi sederhana */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-brand-200 via-brand-100 to-brand-300 rounded-[3rem] blur-2xl opacity-60" />
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="card p-8 shadow-brand w-full h-full flex flex-col items-center justify-center text-center rounded-[3rem]">
                <svg className="w-20 h-20 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4Zm0 2c-4.42 0-8 2.13-8 4.75V22h16v-3.25C20 16.13 16.42 14 12 14Z"/></svg>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">Autentikasi tunggal menyederhanakan pengalaman pengguna lintas platform layanan kampus.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
