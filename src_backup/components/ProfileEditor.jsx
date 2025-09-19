import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserProfile } from '../authStorage';

export default function ProfileEditor({ user, onSave, onClose }) {
  const userProfile = getUserProfile() || user;
  
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || '',
    email: userProfile?.email || '',
    bio: userProfile?.bio || '',
    motivation: userProfile?.motivation || '',
    targets: userProfile?.targets || '',
    profileImage: userProfile?.profileImage || ''
  });
  const [previewImage, setPreviewImage] = useState(userProfile?.profileImage || '/profile.jpg');
  const [activeTab, setActiveTab] = useState('profile');

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      console.log('Uploading file:', file.name, file.size);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target.result;
        console.log('Image loaded successfully, size:', imageData.length);
        setPreviewImage(imageData);
        setFormData(prev => ({ ...prev, profileImage: imageData }));
      };
      reader.onerror = (e) => {
        console.error('Error reading file:', e);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleImageError(e) {
    console.log('Profile image failed to load:', e.target.src);
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'flex';
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Sangsongko Engineering Profile</h2>
              <p className="text-blue-100">Edit profil dan informasi personal Anda</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setActiveTab('motivation')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'motivation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Penjelasan
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-3 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Kontak
            </button>
          </nav>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Photo Upload */}
                <div>
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="w-64 h-64 rounded-lg object-cover border-4 border-blue-200 shadow-lg"
                        onError={handleImageError}
                      />
                      <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center border-4 border-blue-200 shadow-lg" style={{display: 'none'}}>
                        <div className="text-center text-white">
                          <span className="text-6xl font-bold mb-2 block">
                            {formData.fullName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                          <span className="text-sm opacity-75">Upload Foto</span>
                        </div>
                      </div>
                      <label className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Klik ikon kamera untuk upload foto atau akan menggunakan public/profile.jpg sebagai default
                    </p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio Singkat
                        </label>
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Saya adalah seorang mahasiswa Teknik Informatika yang tertarik pada pengembangan web dan sistem informasi terintegrasi. Memiliki pengalaman dalam React, Node.js, dan database management."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'motivation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivasi & Latar Belakang</h3>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Saya memiliki ketertarikan besar pada teknologi informasi sejak kecil. Berawal dari rasa penasaran tentang cara kerja komputer dan internet, saya mulai belajar programming secara otodidak. Pengalaman mengembangkan website pertama saya memberikan kepuasan yang luar biasa ketika melihat ide dapat diwujudkan menjadi aplikasi yang berfungsi. Motivasi terbesar saya adalah menciptakan solusi teknologi yang dapat membantu memecahkan masalah nyata di masyarakat."
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Target & Arah</h3>
                  <textarea
                    value={formData.targets}
                    onChange={(e) => setFormData(prev => ({ ...prev, targets: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Target jangka pendek (1-2 tahun): (1) Menyelesaikan studi dengan IPK minimal 3.5, (2) Membangun portfolio project yang kuat termasuk aplikasi web full-stack, (3) Mendapatkan sertifikasi profesional di bidang cloud computing dan database.

Target jangka menengah (3-5 tahun): (1) Bekerja sebagai Software Engineer di perusahaan teknologi terkemuka, (2) Mengembangkan startup teknologi yang fokus pada solusi edukasi digital, (3) Berkontribusi pada proyek open source yang bermanfaat bagi komunitas developer Indonesia.

Target jangka panjang (5+ tahun): (1) Menjadi Technical Lead atau Engineering Manager, (2) Membangun ekosistem teknologi yang dapat memberdayakan UMKM di Indonesia, (3) Menjadi mentor bagi generasi developer muda dan berkontribusi pada pendidikan teknologi di Indonesia."
                  />
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <input
                        type="text"
                        value={user?.role === 'admin' ? 'System Administrator' : 'Software Developer'}
                        readOnly
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub
                      </label>
                      <input
                        type="text"
                        placeholder="github.com/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn
                      </label>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Ekspor PDF (Gratis)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Simpan Profile
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}