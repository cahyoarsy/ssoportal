// Centralized bilingual resources
// Usage: import { t } from './langResources'; t(lang,'key')

const resources = {
  nav: {
    home: { id: 'Beranda', en: 'Home' },
    how: { id: 'Penjelasan', en: 'How It Works' },
    login: { id: 'Masuk', en: 'Login' },
    profile: { id: 'Profil', en: 'Profile' }
  },
  hero: {
    badge: { id: 'Program', en: 'Program' },
    loginBtn: { id: 'Masuk', en: 'Login' },
    howBtn: { id: 'Penjelasan', en: 'How it Works' }
  },
  login: {
    heading: { id: 'Masuk Sangsongko Engineering', en: 'Sign in to Sangsongko Engineering' },
    sub: { id: 'Gunakan akun terdaftar untuk mengakses modul dan monitoring.', en: 'Use your registered account to access modules and monitoring.' },
    subNote: { id: 'Pastikan kredensial tidak dibagikan.', en: 'Do not share your credentials.' },
    email: { id: 'Email', en: 'Email' },
    password: { id: 'Kata Sandi', en: 'Password' },
    adminCode: { id: 'Kode Admin', en: 'Admin Code' },
    optional: { id: 'opsional', en: 'optional' },
    processing: { id: 'Memproses...', en: 'Processing...' },
    loginBtn: { id: 'Masuk', en: 'Login' },
    or: { id: 'atau', en: 'or' },
    google: { id: 'Masuk dengan Google', en: 'Sign in with Google' },
    disclaimer: { id: 'Dengan login Anda menyetujui kebijakan penggunaan & keamanan platform.', en: 'By signing in you accept platform usage & security policies.' },
    disclaimerNote: { id: 'Aktivitas dapat direkam untuk evaluasi.', en: 'Activity may be logged for evaluation.' }
  },
  profile: {
    summary: { id: 'Ringkasan', en: 'Summary' },
    motivation: { id: 'Motivasi & Latar Belakang', en: 'Motivation & Background' },
    goals: { id: 'Target & Arah', en: 'Goals & Focus' },
    export: { id: 'Ekspor PDF (Cetak)', en: 'Export PDF (Print)' },
    skills: { id: 'Keahlian / Skills', en: 'Skills' },
    contact: { id: 'Kontak', en: 'Contact' }
  },
  contact: {
    heading: { id: 'Kontak & Dukungan', en: 'Contact & Support' },
    desc: { id: 'Siap membantu terkait keamanan akun, kendala login, atau integrasi sistem baru.', en: 'We can assist with account security, login issues, or new system integration.' },
    whatsapp: { id: 'Layanan cepat untuk reset & verifikasi akun.', en: 'Quick channel for reset & verification.' },
    emailDesc: { id: 'Pertanyaan keamanan atau integrasi sistem.', en: 'Security or integration inquiries.' },
    office: { id: 'Kantor', en: 'Office' },
    openChat: { id: 'Buka Chat', en: 'Open Chat' },
    sendEmail: { id: 'Kirim Email', en: 'Send Email' },
    mapSoon: { id: 'Peta (segera)', en: 'Map (soon)' },
    appointment: { id: 'Janji Temu', en: 'Appointment' },
    form: { id: 'Form Kontak', en: 'Contact Form' }
  },
  contactForm: {
    name: { id: 'Nama', en: 'Name' },
    email: { id: 'Email', en: 'Email' },
    message: { id: 'Pesan', en: 'Message' },
    send: { id: 'Kirim', en: 'Send' },
    placeholderMsg: { id: 'Tulis pesan Anda di sini...', en: 'Write your message here...' },
    required: { id: 'Semua field wajib diisi.', en: 'All fields are required.' }
  }
};

export function t(lang, keyPath){
  const parts = keyPath.split('.');
  let cur = resources;
  for(const p of parts){
    if(cur && Object.prototype.hasOwnProperty.call(cur,p)) cur = cur[p]; else return keyPath;
  }
  if(cur && typeof cur === 'object' && 'id' in cur && 'en' in cur){
    return lang === 'en' ? cur.en : cur.id;
  }
  return keyPath;
}

export default resources;
