import React from 'react';
import { motion } from 'framer-motion';

export default function Contact(){
  return (
    <section id="contact" className="container-section scroll-mt-24">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-800">Kontak & Dukungan</h2>
          <p className="text-slate-600 max-w-prose">Tim dukungan kami siap membantu terkait keamanan akun, kendala login, atau integrasi sistem baru ke dalam SSO.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="card p-5 flex flex-col gap-3">
            <span className="badge">WhatsApp</span>
            <p className="text-sm text-slate-600">Layanan cepat untuk reset & verifikasi akun.</p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener" className="btn px-4 py-2 text-sm text-center">Buka Chat</a>
          </motion.div>
          <motion.div initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.1}} className="card p-5 flex flex-col gap-3">
            <span className="badge">Email</span>
            <p className="text-sm text-slate-600">Pertanyaan keamanan atau integrasi sistem.</p>
            <a href="mailto:support@sso-campus.ac.id" className="btn px-4 py-2 text-sm text-center">Kirim Email</a>
          </motion.div>
            <motion.div initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.2}} className="card p-5 flex flex-col gap-3">
            <span className="badge">Kantor</span>
            <p className="text-sm text-slate-600">Gedung Pusat Layanan TI Lt. 2<br/>Jl. Akademika No. 10</p>
            <div className="flex gap-2">
              <button className="btn-outline px-3 py-2 text-xs" type="button" disabled>Peta (coming)</button>
              <button className="btn-outline px-3 py-2 text-xs" type="button" disabled>Janji Temu</button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
