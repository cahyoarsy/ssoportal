import React from 'react';
import ExperienceTimeline from './ExperienceTimeline.jsx';
import { motion } from 'framer-motion';
import { t } from '../langResources.js';

/*
  Komponen Profil / CV
  - Bilingual (ID + EN)
  - Data bisa diedit mudah
  - Foto: letakkan file di public/profile.jpg (sementara placeholder gradient)
  - Tombol unduh CV: file public/cv.pdf (ganti dengan file asli)
*/

const profileData = {
  name: 'M. Cahyo Sangsongko Arsy',
  tagline: {
    id: 'Mahasiswa Teknik Elektro – Universitas Negeri Surabaya',
    en: 'Electrical Engineering Student – State University of Surabaya'
  },
  summary: {
    id: 'Saya memilih kuliah di Teknik Elektro UNESA karena prospek kerja yang luas, terus berkembang, dan sesuai hobi serta ketertarikan saya pada kelistrikan sejak kecil. Latar belakang saya tumbuh di lingkungan pertukangan & teknisi menjadi motivasi besar—namun di daerah saya belum ada yang benar-benar ahli di bidang kelistrikan. Saya ingin menjadi salah satu yang menguasai rekayasa motor listrik & teknik rewinding.',
    en: 'I chose Electrical Engineering at UNESA for broad future prospects, continuous technological growth, and because it matches my early passion for electrical systems. Growing up around craftsmanship and technicians motivates me—yet in my area deep electrical expertise is still rare. I want to become one of the local pioneers mastering electric motor engineering & rewinding.'
  },
  motivation: {
    id: 'Saya terlahir di lingkungan pekerja teknik — melihat langsung proses perbaikan, bongkar pasang, dan improvisasi perangkat sejak kecil. Walau banyak bidang teknik berkembang, spesialis kelistrikan yang mendalam masih sedikit, terutama di daerah asal saya. Itu menjadi ruang kontribusi yang ingin saya isi.',
    en: 'I grew up surrounded by technical work—repairing, disassembling, improvising devices. While many engineering areas evolve, deep electrical specialization is still scarce locally. That gap is where I want to contribute.'
  },
  goals: {
    id: 'Beberapa tahun ke depan: (1) Menguasai teknik rewinding motor listrik, (2) Membangun workshop edukatif kelistrikan di daerah asal, (3) Menyusun dokumentasi praktis berbahasa Indonesia tentang perawatan & troubleshooting motor.',
    en: 'Next years focus: (1) Master industrial motor rewinding, (2) Build an educational electrical workshop locally, (3) Produce practical Indonesian documentation for motor maintenance & troubleshooting.'
  },
  skills: [
    'Dasar Instalasi Listrik', 'Motor Listrik', 'Pemahaman Rewinding (awal)', 'Perakitan Perangkat', 'Troubleshooting Dasar', 'Keselamatan Kerja (K3)', 'Kemauan Belajar Tinggi'
  ],
  contacts: {
    email: 'mcahyosangsongko@gmail.com',
    github: 'https://github.com/cahyoarsy',
    linkedin: '#'
  }
};

export default function Profile({ lang='id' }){
  return (
    <section id="profile" className="container-section py-24 flex flex-col gap-14">
      <motion.div initial={{opacity:0, y:30}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.6}} className="flex flex-col gap-4">
  <span className="badge w-fit">CV</span>
  <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">{profileData.name}</h2>
  <p className="text-slate-600 dark:text-slate-300 text-lg">{profileData.tagline[lang]}</p>
  <p className="text-slate-500 dark:text-slate-400 text-sm italic">{lang==='id'? profileData.tagline.en : profileData.tagline.id}</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-12 items-start">
        {/* Kolom Foto & Kontak */}
        <motion.div initial={{opacity:0, y:25}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.6, delay:.1}} className="flex flex-col gap-6">
          <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow ring-1 ring-slate-200 dark:ring-slate-700 bg-gradient-to-br from-brand-200 via-brand-100 to-brand-300 flex items-center justify-center text-brand-800 text-sm">
            <span className="opacity-70 text-center px-6 leading-relaxed">Tempat Foto / Upload <code>public/profile.jpg</code></span>
            <img
              src={import.meta.env.BASE_URL + 'profile.jpg'}
              alt="Profile"
              className="absolute inset-0 w-full h-full object-cover"
              onLoad={(e) => {
                // show image and hide the placeholder text when image loads
                const placeholder = e.currentTarget.parentElement.querySelector('span');
                if (placeholder) placeholder.style.display = 'none';
                e.currentTarget.style.display = 'block';
              }}
              onError={(e)=>{
                // hide image element if not found and keep the placeholder visible
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="card p-5 flex flex-col gap-3">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t(lang,'profile.contact')}</h3>
            <ul className="text-sm text-slate-600 dark:text-slate-300 flex flex-col gap-2">
              <li><strong>Email:</strong> <a className="text-brand-600" href={`mailto:${profileData.contacts.email}`}>{profileData.contacts.email}</a></li>
              <li><strong>GitHub:</strong> <a className="text-brand-600" href={profileData.contacts.github} target="_blank" rel="noreferrer">{profileData.contacts.github.replace('https://','')}</a></li>
              <li><strong>LinkedIn:</strong> <a className="text-brand-600" href={profileData.contacts.linkedin} target="_blank" rel="noreferrer">Profil</a></li>
            </ul>
            <a href={import.meta.env.BASE_URL + 'cv.pdf'} className="btn-primary text-center mt-2 py-2" download>{lang==='id'?'Unduh CV (PDF)':'Download CV (PDF)'}</a>
          </div>
          <div className="card p-5 flex flex-col gap-3">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t(lang,'profile.skills')}</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map(s => <span key={s} className="badge !bg-brand-50 !text-brand-700 dark:!bg-slate-700 dark:!text-slate-200">{s}</span>)}
            </div>
          </div>
        </motion.div>

        {/* Kolom Ringkasan ID */}
        <motion.div initial={{opacity:0, y:25}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:.6, delay:.15}} className="flex flex-col gap-8 lg:col-span-2">
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t(lang,'profile.summary')}</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{profileData.summary[lang]}</p>
          </div>
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t(lang,'profile.motivation')}</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{profileData.motivation[lang]}</p>
          </div>
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200">{t(lang,'profile.goals')}</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">{profileData.goals[lang]}</p>
            <button type="button" onClick={()=> window.print()} className="btn-outline px-4 py-2 text-sm w-fit">{t(lang,'profile.export')}</button>
          </div>
          <ExperienceTimeline lang={lang} />
        </motion.div>
      </div>
    </section>
  );
}
