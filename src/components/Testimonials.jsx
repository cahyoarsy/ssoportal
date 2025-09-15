import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  { id:1, name:'Andi Pratama', role:'Mahasiswa Teknik', quote:'Portal SSO ini membuat semua layanan kampus terasa seperti satu aplikasi terpadu. Login sekali untuk semua kebutuhan akademik.' },
  { id:2, name:'Dewi Lestari', role:'Dosen Informatika', quote:'Pengelolaan kelas, nilai, dan forum diskusi jadi lebih efisien. Integrasi akun meminimalkan masalah lupa kredensial.' },
  { id:3, name:'Rizky Saputra', role:'Staf Administrasi', quote:'Verifikasi dua langkah dan pelacakan aktivitas memberi kami visibilitas keamanan yang sangat membantu.' },
  { id:4, name:'Sari Wulandari', role:'Mahasiswa Kedokteran', quote:'Aplikasi mobile terhubung SSO mempercepat akses jadwal dan pengumuman penting.' }
];

const rotation = [
  'bg-gradient-to-br from-slate-50 to-white',
  'bg-gradient-to-br from-brand-50/50 to-white',
  'bg-gradient-to-br from-brand-100/40 to-white'
];

export default function Testimonials(){
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex(i => (i + 1) % testimonials.length);
  }, []);
  const prev = () => setIndex(i => (i - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next, paused]);

  return (
    <section id="testimonials" className="container-section scroll-mt-24">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-800">Testimoni Pengguna</h2>
          <p className="text-slate-600 max-w-prose">Beberapa pengalaman dari sivitas akademika yang telah mengadopsi portal Single Sign On terintegrasi.</p>
        </div>
        <div className="relative">
          <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative h-56 sm:h-48">
            <AnimatePresence mode="wait">
              {testimonials.map((t, i) => i === index && (
                <motion.figure key={t.id}
                  initial={{opacity:0, y:20}}
                  animate={{opacity:1, y:0}}
                  exit={{opacity:0, y:-20}}
                  transition={{duration:0.5}}
                  className={`absolute inset-0 card p-6 flex flex-col justify-between ${rotation[index % rotation.length]}`}
                >
                  <blockquote className="text-slate-700 text-sm leading-relaxed">“{t.quote}”</blockquote>
                  <figcaption className="text-sm font-medium text-slate-800 flex flex-col">
                    <span>{t.name}</span>
                    <span className="text-xs font-normal text-slate-500">{t.role}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <button onClick={prev} className="btn-outline h-8 w-8 flex items-center justify-center text-xs" aria-label="Sebelumnya">‹</button>
              <button onClick={next} className="btn-outline h-8 w-8 flex items-center justify-center text-xs" aria-label="Berikutnya">›</button>
            </div>
            <div className="flex gap-1">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`h-2.5 w-2.5 rounded-full transition-colors ${i===index? 'bg-brand-500':'bg-slate-300 hover:bg-slate-400'}`} aria-label={`Slide ${i+1}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
