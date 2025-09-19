import React, { useState } from 'react';
import { t } from '../langResources.js';

export default function ContactForm({ lang='id' }) {
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [message,setMessage] = useState('');
  const [status,setStatus] = useState(null);

  function handleSubmit(e){
    e.preventDefault();
  if(!name || !email || !message){ setStatus({ type:'err', msg: t(lang,'contactForm.required') }); return; }
    // Fallback mailto (bisa diganti endpoint backend nanti)
  const mailto = `mailto:mcahyosangsongko@gmail.com?subject=${encodeURIComponent('[Program] Pesan dari '+name)}&body=${encodeURIComponent(message+'\n\nEmail: '+email)}`;
    window.location.href = mailto;
  setStatus({ type:'ok', msg: lang==='id'?'Membuka aplikasi email...':'Opening email client...' });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col gap-1">
  <label className="text-sm font-medium">{t(lang,'contactForm.name')}</label>
  <input value={name} onChange={e=>setName(e.target.value)} className="border rounded-lg px-3 py-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder={lang==='id'?'Nama lengkap':'Full name'} />
      </div>
      <div className="flex flex-col gap-1">
  <label className="text-sm font-medium">{t(lang,'contactForm.email')}</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="border rounded-lg px-3 py-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-1">
  <label className="text-sm font-medium">{t(lang,'contactForm.message')}</label>
  <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={5} className="border rounded-lg px-3 py-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder={t(lang,'contactForm.placeholderMsg')} />
      </div>
      {status && <div className={`text-xs ${status.type==='err'?'text-red-600':'text-emerald-600'}`}>{status.msg}</div>}
  <button type="submit" className="btn-primary px-5 py-2 text-sm">{t(lang,'contactForm.send')}</button>
      <p className="text-[11px] text-slate-400">{lang==='id'? 'Data tidak disimpan di server — dikirim melalui aplikasi email Anda.':'No server storage — message sent using your email client.'}</p>
    </form>
  );
}
