import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from './ContactForm.jsx';
import { t } from '../langResources.js';

export default function Contact({ lang='id' }){
  return (
    <section id="contact" className="container-section scroll-mt-24">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-slate-800">{t(lang,'contact.heading')}</h2>
          <p className="text-slate-600 max-w-prose">{t(lang,'contact.desc')}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <motion.div initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5}} className="flex flex-col gap-6">
            <div className="card p-5 flex flex-col gap-3">
              <span className="badge">WhatsApp</span>
              <p className="text-sm text-slate-600">{t(lang,'contact.whatsapp')}</p>
              <a href="https://wa.me/6287871049135" target="_blank" rel="noopener" className="btn px-4 py-2 text-sm text-center">{t(lang,'contact.openChat')}</a>
            </div>
            <div className="card p-5 flex flex-col gap-3">
              <span className="badge">Email</span>
              <p className="text-sm text-slate-600">{t(lang,'contact.emailDesc')}</p>
              <a href="mailto:mcahyo@gmail.com" className="btn px-4 py-2 text-sm text-center">{t(lang,'contact.sendEmail')}</a>
            </div>
            <div className="card p-5 flex flex-col gap-3">
              <span className="badge">{t(lang,'contact.office')}</span>
              <p className="text-sm text-slate-600">Gedung Pusat Layanan TI Lt. 2<br/>Jl. Akademika No. 10</p>
              <div className="flex gap-2">
                <button className="btn-outline px-3 py-2 text-xs" type="button" disabled>{t(lang,'contact.mapSoon')}</button>
                <button className="btn-outline px-3 py-2 text-xs" type="button" disabled>{t(lang,'contact.appointment')}</button>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{opacity:0, y:24}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.5, delay:0.1}} className="card p-6">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">{t(lang,'contact.form')}</h3>
            <ContactForm lang={lang} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
