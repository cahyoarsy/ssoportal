// Comprehensive Quiz System for All IML Learning Modules
// Sistem quiz interaktif untuk setiap modul pembelajaran dengan feedback detail

export const moduleQuizSystem = {
  overview: {
    title: 'Sistem Quiz Modul Pembelajaran IML',
    description: 'Quiz interaktif untuk setiap modul pembelajaran dengan feedback dan tracking progress',
    total_modules: 8,
    questions_per_module: 10,
    passing_score: 70,
    attempts_allowed: 3,
    time_limit_per_quiz: 15 // minutes
  },

  module_quizzes: [
    {
      module_id: 'module-1',
      module_title: 'Dasar-dasar Motor Listrik dan Komponen',
      quiz_id: 'quiz-module-1',
      description: 'Quiz tentang prinsip dasar motor listrik, jenis-jenis motor, dan komponen utama',
      time_limit: 15,
      questions: [
        {
          id: 'q1-1',
          type: 'multiple_choice',
          question: 'Prinsip kerja motor listrik AC didasarkan pada:',
          options: [
            'Gaya Lorentz dan medan magnet putar',
            'Efek Hall dan induktansi',
            'Resonansi elektromagnetik',
            'Efek piezoelektrik'
          ],
          correct_answer: 0,
          explanation: 'Motor listrik AC bekerja berdasarkan gaya Lorentz yang terjadi ketika konduktor bermuatan listrik berada dalam medan magnet putar, menghasilkan torsi yang memutar rotor.',
          difficulty: 'medium',
          learning_objective: 'Memahami prinsip dasar kerja motor listrik'
        },
        {
          id: 'q1-2',
          type: 'multiple_choice',
          question: 'Komponen motor listrik yang berfungsi sebagai bagian berputar adalah:',
          options: ['Stator', 'Rotor', 'Commutator', 'End bell'],
          correct_answer: 1,
          explanation: 'Rotor adalah bagian motor yang berputar dan merupakan tempat terbentuknya torsi utama.',
          difficulty: 'easy',
          learning_objective: 'Mengidentifikasi komponen utama motor listrik'
        },
        {
          id: 'q1-3',
          type: 'multiple_choice',
          question: 'Perbedaan utama antara motor sinkron dan asinkron adalah:',
          options: [
            'Jumlah fasa yang digunakan',
            'Kecepatan rotor terhadap medan magnet putar',
            'Jenis arus yang digunakan',
            'Ukuran fisik motor'
          ],
          correct_answer: 1,
          explanation: 'Motor sinkron berputar dengan kecepatan sama dengan medan magnet putar, sedangkan motor asinkron (induksi) berputar lebih lambat dari medan magnet putar.',
          difficulty: 'medium',
          learning_objective: 'Membedakan jenis-jenis motor listrik'
        },
        {
          id: 'q1-4',
          type: 'multiple_choice',
          question: 'Slip pada motor induksi dihitung dengan rumus:',
          options: [
            'S = (Ns - Nr) / Ns × 100%',
            'S = (Nr - Ns) / Nr × 100%',
            'S = Ns / Nr × 100%',
            'S = Nr × Ns × 100%'
          ],
          correct_answer: 0,
          explanation: 'Slip adalah selisih kecepatan sinkron (Ns) dengan kecepatan rotor (Nr) dibagi kecepatan sinkron, dikalikan 100%.',
          difficulty: 'hard',
          learning_objective: 'Menghitung parameter motor induksi'
        },
        {
          id: 'q1-5',
          type: 'multiple_choice',
          question: 'Nameplate motor menunjukkan informasi berikut, KECUALI:',
          options: [
            'Daya output (kW atau HP)',
            'Tegangan dan arus nominal',
            'Temperatur ambient maksimum',
            'Harga motor'
          ],
          correct_answer: 3,
          explanation: 'Nameplate motor berisi informasi teknis seperti daya, tegangan, arus, kecepatan, faktor daya, tetapi tidak mencantumkan harga.',
          difficulty: 'easy',
          learning_objective: 'Membaca dan memahami nameplate motor'
        },
        {
          id: 'q1-6',
          type: 'multiple_choice',
          question: 'Bearing pada motor listrik berfungsi untuk:',
          options: [
            'Mengatur kecepatan motor',
            'Menopang dan memungkinkan rotasi shaft',
            'Mengontrol arus listrik',
            'Mendinginkan motor'
          ],
          correct_answer: 1,
          explanation: 'Bearing berfungsi menopang shaft motor dan memungkinkan rotasi dengan gesekan minimal.',
          difficulty: 'easy',
          learning_objective: 'Memahami fungsi komponen mekanis motor'
        },
        {
          id: 'q1-7',
          type: 'multiple_choice',
          question: 'Kelas isolasi motor menunjukkan:',
          options: [
            'Tingkat proteksi terhadap debu dan air',
            'Temperatur maksimum yang dapat ditahan isolasi',
            'Efisiensi motor',
            'Level noise motor'
          ],
          correct_answer: 1,
          explanation: 'Kelas isolasi (seperti B, F, H) menunjukkan temperatur maksimum yang dapat ditahan oleh material isolasi belitan motor.',
          difficulty: 'medium',
          learning_objective: 'Memahami spesifikasi thermal motor'
        },
        {
          id: 'q1-8',
          type: 'multiple_choice',
          question: 'Motor dengan konstruksi TEFC adalah:',
          options: [
            'Totally Enclosed Fan Cooled',
            'Thermally Enhanced Fan Controlled',
            'Temperature Efficient Flux Control',
            'Torque Enhanced Frequency Controlled'
          ],
          correct_answer: 0,
          explanation: 'TEFC (Totally Enclosed Fan Cooled) adalah jenis enklosur motor yang tertutup total dengan pendinginan menggunakan kipas eksternal.',
          difficulty: 'medium',
          learning_objective: 'Mengidentifikasi jenis enklosur motor'
        },
        {
          id: 'q1-9',
          type: 'multiple_choice',
          question: 'Torsi starting motor induksi sangkutan cage umumnya:',
          options: [
            'Sangat tinggi (>300% torsi nominal)',
            'Tinggi (150-300% torsi nominal)',
            'Sedang (100-150% torsi nominal)',
            'Rendah (<100% torsi nominal)'
          ],
          correct_answer: 1,
          explanation: 'Motor induksi squirrel cage umumnya memiliki torsi starting sekitar 150-300% dari torsi nominal, tergantung desain rotor.',
          difficulty: 'hard',
          learning_objective: 'Memahami karakteristik torsi motor'
        },
        {
          id: 'q1-10',
          type: 'multiple_choice',
          question: 'Faktor yang paling mempengaruhi pemilihan motor adalah:',
          options: [
            'Harga motor saja',
            'Karakteristik beban dan kondisi operasi',
            'Warna motor',
            'Negara pembuat motor'
          ],
          correct_answer: 1,
          explanation: 'Pemilihan motor harus berdasarkan karakteristik beban (torsi-speed), kondisi lingkungan, duty cycle, dan persyaratan operasi.',
          difficulty: 'medium',
          learning_objective: 'Menerapkan kriteria pemilihan motor'
        }
      ]
    },

    {
      module_id: 'module-2',
      module_title: 'Sistem Proteksi dan Pengamanan Motor',
      quiz_id: 'quiz-module-2',
      description: 'Quiz tentang berbagai sistem proteksi motor dan perangkat pengaman',
      time_limit: 15,
      questions: [
        {
          id: 'q2-1',
          type: 'multiple_choice',
          question: 'Thermal overload relay berfungsi untuk melindungi motor dari:',
          options: [
            'Tegangan lebih',
            'Arus lebih dan overheating',
            'Frekuensi rendah',
            'Gangguan harmonic'
          ],
          correct_answer: 1,
          explanation: 'Thermal overload relay melindungi motor dari arus lebih dan panas berlebih dengan cara memutus rangkaian kontrol ketika arus melebihi setting.',
          difficulty: 'easy',
          learning_objective: 'Memahami fungsi perangkat proteksi motor'
        },
        {
          id: 'q2-2',
          type: 'multiple_choice',
          question: 'Setting thermal overload relay harus disesuaikan dengan:',
          options: [
            'Arus nominal motor (FLC)',
            'Arus starting motor',
            'Tegangan nominal',
            'Kecepatan motor'
          ],
          correct_answer: 0,
          explanation: 'Thermal overload relay harus di-setting sesuai dengan Full Load Current (FLC) motor yang tertera pada nameplate.',
          difficulty: 'medium',
          learning_objective: 'Mengatur setting proteksi motor'
        },
        {
          id: 'q2-3',
          type: 'multiple_choice',
          question: 'MCB (Miniature Circuit Breaker) pada instalasi motor berfungsi sebagai proteksi:',
          options: [
            'Overload saja',
            'Short circuit saja',
            'Overload dan short circuit',
            'Ground fault saja'
          ],
          correct_answer: 2,
          explanation: 'MCB memberikan proteksi ganda yaitu overload (arus lebih dalam waktu lama) dan short circuit (arus hubung singkat).',
          difficulty: 'medium',
          learning_objective: 'Memahami fungsi MCB dalam sistem motor'
        },
        {
          id: 'q2-4',
          type: 'multiple_choice',
          question: 'Koordinasi proteksi motor yang benar adalah:',
          options: [
            'MCB → Kontaktor → Thermal overload → Motor',
            'Thermal overload → MCB → Kontaktor → Motor',
            'Kontaktor → MCB → Motor → Thermal overload',
            'MCB → Thermal overload → Kontaktor → Motor'
          ],
          correct_answer: 0,
          explanation: 'Urutan yang benar: MCB (proteksi utama) → Kontaktor (switching) → Thermal overload (proteksi motor) → Motor.',
          difficulty: 'hard',
          learning_objective: 'Merancang koordinasi sistem proteksi'
        },
        {
          id: 'q2-5',
          type: 'multiple_choice',
          question: 'ELCB (Earth Leakage Circuit Breaker) melindungi dari:',
          options: [
            'Arus bocor ke tanah',
            'Tegangan lebih',
            'Frekuensi tidak stabil',
            'Harmonic distortion'
          ],
          correct_answer: 0,
          explanation: 'ELCB mendeteksi dan memutus rangkaian ketika ada arus bocor ke tanah (earth leakage) yang dapat membahayakan keselamatan.',
          difficulty: 'easy',
          learning_objective: 'Memahami sistem proteksi keselamatan'
        },
        {
          id: 'q2-6',
          type: 'multiple_choice',
          question: 'Phase failure relay diperlukan untuk motor 3 fasa karena:',
          options: [
            'Meningkatkan efisiensi motor',
            'Mencegah kerusakan motor akibat kehilangan satu fasa',
            'Mengatur kecepatan motor',
            'Mengurangi noise motor'
          ],
          correct_answer: 1,
          explanation: 'Phase failure relay mencegah motor beroperasi dengan kehilangan satu fasa yang dapat menyebabkan overheating dan kerusakan motor.',
          difficulty: 'medium',
          learning_objective: 'Memahami proteksi khusus motor 3 fasa'
        },
        {
          id: 'q2-7',
          type: 'multiple_choice',
          question: 'Under voltage relay akan trip ketika:',
          options: [
            'Tegangan naik terlalu tinggi',
            'Tegangan turun di bawah setting',
            'Arus naik terlalu tinggi',
            'Frekuensi berubah'
          ],
          correct_answer: 1,
          explanation: 'Under voltage relay melindungi motor dari operasi pada tegangan rendah yang dapat menyebabkan arus tinggi dan overheating.',
          difficulty: 'easy',
          learning_objective: 'Memahami proteksi tegangan motor'
        },
        {
          id: 'q2-8',
          type: 'multiple_choice',
          question: 'Time delay pada kontaktor umumnya digunakan untuk:',
          options: [
            'Mencegah chattering kontak',
            'Memberikan waktu untuk motor berhenti sebelum reverse',
            'Menghemat energi',
            'Mengurangi noise switching'
          ],
          correct_answer: 1,
          explanation: 'Time delay pada rangkaian forward-reverse memberikan waktu untuk motor berhenti sepenuhnya sebelum mengubah arah putaran.',
          difficulty: 'medium',
          learning_objective: 'Memahami fungsi time delay dalam kontrol motor'
        },
        {
          id: 'q2-9',
          type: 'multiple_choice',
          question: 'Motor protection relay digital memberikan keuntungan:',
          options: [
            'Harga lebih murah',
            'Proteksi multiple function dan monitoring',
            'Instalasi lebih mudah',
            'Tidak perlu maintenance'
          ],
          correct_answer: 1,
          explanation: 'Digital motor protection relay menyediakan multiple function protection, monitoring real-time, data logging, dan komunikasi.',
          difficulty: 'medium',
          learning_objective: 'Memahami teknologi proteksi modern'
        },
        {
          id: 'q2-10',
          type: 'multiple_choice',
          question: 'Ground fault protection penting untuk motor karena:',
          options: [
            'Meningkatkan efisiensi motor',
            'Melindungi dari kebakaran dan sengatan listrik',
            'Mengurangi getaran motor',
            'Memperpanjang umur bearing'
          ],
          correct_answer: 1,
          explanation: 'Ground fault protection melindungi dari risiko kebakaran akibat arcing dan melindungi personel dari sengatan listrik.',
          difficulty: 'easy',
          learning_objective: 'Memahami pentingnya proteksi ground fault'
        }
      ]
    },

    {
      module_id: 'module-3',
      module_title: 'Rangkaian Kontrol Motor Listrik',
      quiz_id: 'quiz-module-3',
      description: 'Quiz tentang berbagai rangkaian kontrol motor dari DOL hingga soft starter',
      time_limit: 15,
      questions: [
        {
          id: 'q3-1',
          type: 'multiple_choice',
          question: 'Rangkaian DOL (Direct On Line) cocok untuk motor dengan daya:',
          options: [
            'Semua daya motor',
            'Motor kecil sampai menengah (<15 kW)',
            'Hanya motor besar (>50 kW)',
            'Motor DC saja'
          ],
          correct_answer: 1,
          explanation: 'DOL cocok untuk motor kecil hingga menengah karena starting current yang tinggi dapat diterima oleh sistem supply.',
          difficulty: 'easy',
          learning_objective: 'Memahami aplikasi rangkaian DOL'
        },
        {
          id: 'q3-2',
          type: 'multiple_choice',
          question: 'Kelemahan rangkaian DOL adalah:',
          options: [
            'Rangkaian terlalu kompleks',
            'Starting current tinggi (5-7 x FLC)',
            'Torsi starting rendah',
            'Tidak bisa digunakan untuk motor 3 fasa'
          ],
          correct_answer: 1,
          explanation: 'DOL menghasilkan starting current yang tinggi (5-7 kali Full Load Current) yang dapat menyebabkan voltage dip pada sistem.',
          difficulty: 'medium',
          learning_objective: 'Menganalisis karakteristik starting DOL'
        },
        {
          id: 'q3-3',
          type: 'multiple_choice',
          question: 'Rangkaian Star-Delta digunakan untuk:',
          options: [
            'Meningkatkan torsi starting',
            'Mengurangi starting current',
            'Mengatur kecepatan motor',
            'Membalik arah putaran motor'
          ],
          correct_answer: 1,
          explanation: 'Star-Delta starter mengurangi starting current menjadi 1/3 dari DOL dengan cara menghubungkan motor dalam konfigurasi star saat starting.',
          difficulty: 'medium',
          learning_objective: 'Memahami prinsip Star-Delta starting'
        },
        {
          id: 'q3-4',
          type: 'multiple_choice',
          question: 'Syarat motor untuk menggunakan Star-Delta starter:',
          options: [
            'Motor harus memiliki 6 terminal',
            'Daya motor minimal 50 kW',
            'Motor harus rotor lilit',
            'Tegangan supply harus variable'
          ],
          correct_answer: 0,
          explanation: 'Motor harus memiliki 6 terminal (U1,U2,V1,V2,W1,W2) agar dapat dihubungkan star atau delta.',
          difficulty: 'medium',
          learning_objective: 'Menentukan persyaratan Star-Delta starting'
        },
        {
          id: 'q3-5',
          type: 'multiple_choice',
          question: 'Auto transformer starter memberikan keuntungan:',
          options: [
            'Torsi starting dapat diatur',
            'Harga lebih murah dari DOL',
            'Tidak memerlukan timer',
            'Cocok untuk semua jenis motor'
          ],
          correct_answer: 0,
          explanation: 'Auto transformer starter memungkinkan pengaturan tegangan starting sehingga torsi dan arus starting dapat disesuaikan dengan kebutuhan.',
          difficulty: 'hard',
          learning_objective: 'Memahami keunggulan auto transformer starting'
        },
        {
          id: 'q3-6',
          type: 'multiple_choice',
          question: 'Soft starter menggunakan teknologi:',
          options: [
            'Relay elektromekanikal',
            'Thyristor/SCR untuk kontrol tegangan',
            'Transformer variable',
            'Resistor starting'
          ],
          correct_answer: 1,
          explanation: 'Soft starter menggunakan thyristor (SCR) untuk mengontrol tegangan motor secara gradual dari 0 hingga tegangan penuh.',
          difficulty: 'medium',
          learning_objective: 'Memahami teknologi soft starting'
        },
        {
          id: 'q3-7',
          type: 'multiple_choice',
          question: 'Interlock pada rangkaian forward-reverse berfungsi:',
          options: [
            'Mengatur kecepatan motor',
            'Mencegah kedua kontaktor aktif bersamaan',
            'Mengurangi arus starting',
            'Meningkatkan torsi motor'
          ],
          correct_answer: 1,
          explanation: 'Interlock mencegah kontaktor forward dan reverse aktif bersamaan yang dapat menyebabkan short circuit antar fasa.',
          difficulty: 'easy',
          learning_objective: 'Memahami sistem safety interlock'
        },
        {
          id: 'q3-8',
          type: 'multiple_choice',
          question: 'Jogging pada motor adalah:',
          options: [
            'Operasi motor dengan kecepatan tinggi',
            'Operasi motor sebentar-sebentar untuk positioning',
            'Operasi motor dengan beban berat',
            'Operasi motor dalam kondisi emergency'
          ],
          correct_answer: 1,
          explanation: 'Jogging adalah operasi motor dalam waktu singkat berulang-ulang untuk keperluan positioning atau adjustment.',
          difficulty: 'easy',
          learning_objective: 'Memahami mode operasi khusus motor'
        },
        {
          id: 'q3-9',
          type: 'multiple_choice',
          question: 'Emergency stop pada rangkaian kontrol motor harus:',
          options: [
            'Normally Open (NO)',
            'Normally Closed (NC)',
            'Bisa NO atau NC',
            'Tidak perlu kontak khusus'
          ],
          correct_answer: 1,
          explanation: 'Emergency stop harus menggunakan kontak NC sehingga ketika ditekan akan memutus rangkaian kontrol dan menghentikan motor.',
          difficulty: 'medium',
          learning_objective: 'Merancang sistem emergency stop'
        },
        {
          id: 'q3-10',
          type: 'multiple_choice',
          question: 'VFD (Variable Frequency Drive) memberikan keuntungan:',
          options: [
            'Hanya mengatur kecepatan motor',
            'Starting lembut dan kontrol kecepatan variable',
            'Mengurangi daya motor',
            'Memperpanjang umur motor secara otomatis'
          ],
          correct_answer: 1,
          explanation: 'VFD memberikan soft starting, kontrol kecepatan variable, energy saving, dan proteksi motor yang lengkap.',
          difficulty: 'medium',
          learning_objective: 'Memahami keuntungan penggunaan VFD'
        }
      ]
    },

    {
      module_id: 'module-4',
      module_title: 'Instalasi dan Wiring Motor',
      quiz_id: 'quiz-module-4',
      description: 'Quiz tentang teknik instalasi motor dan standar wiring yang benar',
      time_limit: 15,
      questions: [
        {
          id: 'q4-1',
          type: 'multiple_choice',
          question: 'Warna kabel grounding menurut standar internasional adalah:',
          options: [
            'Merah',
            'Hijau atau Hijau-Kuning',
            'Biru',
            'Hitam'
          ],
          correct_answer: 1,
          explanation: 'Standar internasional menggunakan warna hijau atau hijau-kuning untuk kabel grounding/earthing.',
          difficulty: 'easy',
          learning_objective: 'Memahami standar warna kabel'
        },
        {
          id: 'q4-2',
          type: 'multiple_choice',
          question: 'Ukuran kabel motor harus dipilih berdasarkan:',
          options: [
            'Daya motor saja',
            'Arus nominal motor dan panjang kabel',
            'Tegangan motor saja',
            'Kecepatan motor'
          ],
          correct_answer: 1,
          explanation: 'Ukuran kabel harus dipilih berdasarkan arus nominal motor dengan mempertimbangkan voltage drop akibat panjang kabel.',
          difficulty: 'medium',
          learning_objective: 'Menentukan spesifikasi kabel motor'
        },
        {
          id: 'q4-3',
          type: 'multiple_choice',
          question: 'Voltage drop maksimum yang diizinkan pada kabel motor adalah:',
          options: [
            '1%',
            '3%',
            '5%',
            '10%'
          ],
          correct_answer: 2,
          explanation: 'Standar umumnya mengizinkan voltage drop maksimum 5% untuk rangkaian motor agar performansi motor tidak terganggu.',
          difficulty: 'medium',
          learning_objective: 'Memahami batasan voltage drop'
        },
        {
          id: 'q4-4',
          type: 'multiple_choice',
          question: 'Grounding motor berfungsi untuk:',
          options: [
            'Meningkatkan efisiensi motor',
            'Keselamatan dan proteksi dari voltage lebih',
            'Mengurangi noise motor',
            'Mengatur kecepatan motor'
          ],
          correct_answer: 1,
          explanation: 'Grounding motor penting untuk keselamatan personel dan melindungi motor dari voltage lebih akibat petir atau gangguan sistem.',
          difficulty: 'easy',
          learning_objective: 'Memahami pentingnya sistem grounding'
        },
        {
          id: 'q4-5',
          type: 'multiple_choice',
          question: 'Terminal box motor harus:',
          options: [
            'Selalu terbuka untuk ventilasi',
            'Tertutup rapat dan terlindung dari air',
            'Dicat dengan warna cerah',
            'Dihubungkan ke ground secara langsung'
          ],
          correct_answer: 1,
          explanation: 'Terminal box harus tertutup rapat dengan IP rating yang sesuai untuk melindungi koneksi dari air, debu, dan kontaminan.',
          difficulty: 'easy',
          learning_objective: 'Memahami proteksi terminal motor'
        },
        {
          id: 'q4-6',
          type: 'multiple_choice',
          question: 'Urutan fasa R-S-T yang benar akan menghasilkan putaran motor:',
          options: [
            'Selalu searah jarum jam',
            'Selalu berlawanan jarum jam',
            'Sesuai dengan konstruksi motor',
            'Tidak mempengaruhi arah putaran'
          ],
          correct_answer: 2,
          explanation: 'Arah putaran motor tergantung konstruksi motor dan urutan fasa. Urutan R-S-T adalah konvensi, arah putaran sebenarnya tergantung desain motor.',
          difficulty: 'hard',
          learning_objective: 'Memahami hubungan fasa dan arah putaran'
        },
        {
          id: 'q4-7',
          type: 'multiple_choice',
          question: 'Cable gland pada motor berfungsi:',
          options: [
            'Mengatur tegangan kabel',
            'Seal dan strain relief untuk kabel',
            'Mengurangi interferensi elektromagnetik',
            'Meningkatkan konduktivitas'
          ],
          correct_answer: 1,
          explanation: 'Cable gland memberikan seal untuk mencegah masuknya air/debu dan strain relief untuk melindungi kabel dari tarikan mekanis.',
          difficulty: 'medium',
          learning_objective: 'Memahami aksesori instalasi motor'
        },
        {
          id: 'q4-8',
          type: 'multiple_choice',
          question: 'Jarak minimum instalasi motor dari dinding adalah:',
          options: [
            'Tidak ada ketentuan khusus',
            'Minimal 10 cm untuk ventilasi',
            'Sesuai dengan cooling requirement motor',
            'Maksimal 5 cm'
          ],
          correct_answer: 2,
          explanation: 'Jarak instalasi harus sesuai dengan kebutuhan cooling motor yang tercantum dalam manual, umumnya minimal 10-15 cm untuk ventilasi.',
          difficulty: 'medium',
          learning_objective: 'Memahami persyaratan instalasi fisik motor'
        },
        {
          id: 'q4-9',
          type: 'multiple_choice',
          question: 'Torsi pengencangan baut terminal motor harus:',
          options: [
            'Sekencang mungkin',
            'Sesuai spesifikasi pabrik',
            'Dengan tangan saja',
            'Tidak perlu dikencangkan'
          ],
          correct_answer: 1,
          explanation: 'Torsi pengencangan harus sesuai spesifikasi pabrik untuk memastikan koneksi yang baik tanpa merusak terminal.',
          difficulty: 'medium',
          learning_objective: 'Memahami prosedur instalasi yang benar'
        },
        {
          id: 'q4-10',
          type: 'multiple_choice',
          question: 'Labeling kabel motor penting untuk:',
          options: [
            'Memperindah instalasi',
            'Memudahkan maintenance dan troubleshooting',
            'Memenuhi regulasi pemerintah',
            'Mengurangi biaya instalasi'
          ],
          correct_answer: 1,
          explanation: 'Labeling yang jelas memudahkan identifikasi kabel saat maintenance, troubleshooting, dan modifikasi sistem.',
          difficulty: 'easy',
          learning_objective: 'Memahami pentingnya dokumentasi instalasi'
        }
      ]
    },

    {
      module_id: 'module-5',
      module_title: 'Testing dan Commissioning Motor',
      quiz_id: 'quiz-module-5',
      description: 'Quiz tentang prosedur testing dan commissioning motor yang komprehensif',
      time_limit: 15,
      questions: [
        {
          id: 'q5-1',
          type: 'multiple_choice',
          question: 'Insulation test motor dilakukan menggunakan:',
          options: [
            'Multimeter biasa',
            'Megger dengan tegangan test 500V-1000V',
            'Oscilloscope',
            'Clamp meter'
          ],
          correct_answer: 1,
          explanation: 'Insulation test memerlukan megger dengan tegangan tinggi (500V-1000V untuk motor LV) untuk mengukur resistansi isolasi.',
          difficulty: 'easy',
          learning_objective: 'Memahami alat test motor'
        },
        {
          id: 'q5-2',
          type: 'multiple_choice',
          question: 'Nilai resistansi isolasi motor yang baik minimal:',
          options: [
            '0.5 MΩ',
            '1 MΩ',
            '10 MΩ',
            '100 MΩ'
          ],
          correct_answer: 1,
          explanation: 'Standar umum mengharuskan resistansi isolasi minimal 1 MΩ, namun untuk motor baru biasanya >10 MΩ.',
          difficulty: 'medium',
          learning_objective: 'Memahami kriteria acceptance test'
        },
        {
          id: 'q5-3',
          type: 'multiple_choice',
          question: 'Continuity test pada motor bertujuan untuk:',
          options: [
            'Mengukur resistansi isolasi',
            'Memeriksa koneksi internal belitan',
            'Mengukur arus starting',
            'Memeriksa kecepatan motor'
          ],
          correct_answer: 1,
          explanation: 'Continuity test memeriksa bahwa belitan motor tidak putus dan terhubung dengan baik dari terminal ke terminal.',
          difficulty: 'easy',
          learning_objective: 'Memahami jenis-jenis test motor'
        },
        {
          id: 'q5-4',
          type: 'multiple_choice',
          question: 'Phase sequence test penting untuk motor 3 fasa karena:',
          options: [
            'Menentukan arus starting motor',
            'Menentukan arah putaran motor',
            'Mengukur efisiensi motor',
            'Memeriksa balance tegangan'
          ],
          correct_answer: 1,
          explanation: 'Phase sequence menentukan arah putaran motor 3 fasa. Sequence yang salah akan menyebabkan motor berputar terbalik.',
          difficulty: 'medium',
          learning_objective: 'Memahami test commissioning motor'
        },
        {
          id: 'q5-5',
          type: 'multiple_choice',
          question: 'No-load test motor dilakukan untuk mengukur:',
          options: [
            'Torsi maksimum motor',
            'Arus, tegangan, dan kecepatan tanpa beban',
            'Resistansi belitan',
            'Temperatur maksimum'
          ],
          correct_answer: 1,
          explanation: 'No-load test mengukur parameter motor saat beroperasi tanpa beban untuk verifikasi performansi dasar.',
          difficulty: 'medium',
          learning_objective: 'Memahami test performansi motor'
        },
        {
          id: 'q5-6',
          type: 'multiple_choice',
          question: 'Vibration test motor menggunakan alat:',
          options: [
            'Tachometer',
            'Vibration meter/analyzer',
            'Thermometer',
            'Megger'
          ],
          correct_answer: 1,
          explanation: 'Vibration meter atau analyzer digunakan untuk mengukur level getaran motor dalam berbagai arah dan frekuensi.',
          difficulty: 'easy',
          learning_objective: 'Mengidentifikasi alat test motor'
        },
        {
          id: 'q5-7',
          type: 'multiple_choice',
          question: 'Temperature rise test motor dilakukan untuk:',
          options: [
            'Mengukur efisiensi motor',
            'Verifikasi kemampuan thermal motor pada rated load',
            'Mengukur kecepatan motor',
            'Test isolasi motor'
          ],
          correct_answer: 1,
          explanation: 'Temperature rise test verifikasi bahwa motor tidak melebihi batas temperatur yang diizinkan saat beroperasi pada beban nominal.',
          difficulty: 'medium',
          learning_objective: 'Memahami test thermal motor'
        },
        {
          id: 'q5-8',
          type: 'multiple_choice',
          question: 'Load test motor dilakukan dengan cara:',
          options: [
            'Menjalankan motor tanpa beban',
            'Memberikan beban bertahap dari 25% hingga 100%',
            'Memberikan beban maksimum langsung',
            'Test dengan tegangan rendah'
          ],
          correct_answer: 1,
          explanation: 'Load test dilakukan secara bertahap (25%, 50%, 75%, 100%) untuk mengukur performansi motor pada berbagai tingkat beban.',
          difficulty: 'medium',
          learning_objective: 'Memahami prosedur load test'
        },
        {
          id: 'q5-9',
          type: 'multiple_choice',
          question: 'Acceptance criteria untuk voltage unbalance pada motor 3 fasa adalah:',
          options: [
            'Maksimal 1%',
            'Maksimal 2%',
            'Maksimal 5%',
            'Maksimal 10%'
          ],
          correct_answer: 1,
          explanation: 'Voltage unbalance harus dijaga maksimal 2% untuk mencegah overheating dan mengurangi umur motor.',
          difficulty: 'hard',
          learning_objective: 'Memahami kriteria kualitas supply'
        },
        {
          id: 'q5-10',
          type: 'multiple_choice',
          question: 'Commissioning report motor harus mencakup:',
          options: [
            'Hanya hasil test saja',
            'Semua test result, setting, dan rekomendasi',
            'Hanya foto instalasi',
            'Hanya nameplate motor'
          ],
          correct_answer: 1,
          explanation: 'Commissioning report harus lengkap mencakup semua hasil test, setting peralatan, foto instalasi, dan rekomendasi maintenance.',
          difficulty: 'easy',
          learning_objective: 'Memahami dokumentasi commissioning'
        }
      ]
    },

    {
      module_id: 'module-6',
      module_title: 'Troubleshooting dan Maintenance Motor',
      quiz_id: 'quiz-module-6',
      description: 'Quiz tentang teknik diagnosis dan pemeliharaan motor listrik',
      time_limit: 15,
      questions: [
        {
          id: 'q6-1',
          type: 'multiple_choice',
          question: 'Motor tidak dapat start, MCB tidak trip. Langkah pertama troubleshooting:',
          options: [
            'Ganti motor baru',
            'Periksa supply voltage dan control circuit',
            'Bongkar motor',
            'Ganti bearing motor'
          ],
          correct_answer: 1,
          explanation: 'Troubleshooting harus sistematis dimulai dari supply voltage, control circuit, kemudian ke komponen motor.',
          difficulty: 'medium',
          learning_objective: 'Menerapkan metode troubleshooting sistematis'
        },
        {
          id: 'q6-2',
          type: 'multiple_choice',
          question: 'Motor berputar tetapi sering trip overload. Kemungkinan penyebab:',
          options: [
            'Supply voltage terlalu tinggi',
            'Beban berlebih atau voltage supply rendah',
            'Motor terlalu dingin',
            'Kecepatan motor terlalu rendah'
          ],
          correct_answer: 1,
          explanation: 'Trip overload biasanya disebabkan beban berlebih, voltage supply rendah, atau unbalance yang menyebabkan arus tinggi.',
          difficulty: 'medium',
          learning_objective: 'Menganalisis gejala gangguan motor'
        },
        {
          id: 'q6-3',
          type: 'multiple_choice',
          question: 'Motor menghasilkan noise abnormal. Kemungkinan penyebab:',
          options: [
            'Bearing aus atau misalignment',
            'Voltage terlalu tinggi',
            'Arus terlalu rendah',
            'Motor terlalu dingin'
          ],
          correct_answer: 0,
          explanation: 'Noise abnormal pada motor biasanya disebabkan masalah mekanis seperti bearing aus, misalignment, atau unbalance rotor.',
          difficulty: 'easy',
          learning_objective: 'Mengidentifikasi gejala gangguan mekanis'
        },
        {
          id: 'q6-4',
          type: 'multiple_choice',
          question: 'Preventive maintenance motor meliputi:',
          options: [
            'Hanya pembersihan motor',
            'Inspeksi, lubrication, cleaning, dan testing',
            'Hanya penggantian bearing',
            'Hanya pengukuran arus'
          ],
          correct_answer: 1,
          explanation: 'Preventive maintenance komprehensif meliputi inspeksi visual, lubrication, cleaning, vibration test, thermal imaging, dan electrical testing.',
          difficulty: 'easy',
          learning_objective: 'Memahami program maintenance motor'
        },
        {
          id: 'q6-5',
          type: 'multiple_choice',
          question: 'Bearing motor harus diganti jika:',
          options: [
            'Motor sudah beroperasi 1 tahun',
            'Ada noise, getaran, atau temperature tinggi',
            'Warna bearing berubah',
            'Motor pernah di-service'
          ],
          correct_answer: 1,
          explanation: 'Bearing perlu diganti jika menunjukkan gejala kerusakan seperti noise, getaran berlebih, atau temperature tinggi.',
          difficulty: 'medium',
          learning_objective: 'Menentukan kondisi bearing motor'
        },
        {
          id: 'q6-6',
          type: 'multiple_choice',
          question: 'Thermal imaging pada motor berguna untuk:',
          options: [
            'Mengukur kecepatan motor',
            'Mendeteksi hot spot dan overheating',
            'Mengukur getaran motor',
            'Mengukur arus motor'
          ],
          correct_answer: 1,
          explanation: 'Thermal imaging mendeteksi hot spot pada bearing, koneksi listrik, dan belitan motor yang menunjukkan potensi masalah.',
          difficulty: 'medium',
          learning_objective: 'Memahami teknologi predictive maintenance'
        },
        {
          id: 'q6-7',
          type: 'multiple_choice',
          question: 'Motor single phasing (kehilangan satu fasa) akan menyebabkan:',
          options: [
            'Motor berhenti total',
            'Motor berputar dengan arus tinggi dan panas berlebih',
            'Motor berputar normal',
            'Motor berputar lebih cepat'
          ],
          correct_answer: 1,
          explanation: 'Single phasing menyebabkan motor tetap berputar tetapi dengan arus sangat tinggi pada fasa yang tersisa, menyebabkan overheating.',
          difficulty: 'hard',
          learning_objective: 'Memahami efek gangguan supply pada motor'
        },
        {
          id: 'q6-8',
          type: 'multiple_choice',
          question: 'Oil analysis pada motor bearing digunakan untuk:',
          options: [
            'Menentukan viskositas yang tepat',
            'Mendeteksi kontaminasi dan wear particles',
            'Mengukur quantity oil',
            'Menentukan warna oil'
          ],
          correct_answer: 1,
          explanation: 'Oil analysis mendeteksi kontaminasi, wear particles, dan degradasi oil yang menunjukkan kondisi bearing dan sistem lubrikasi.',
          difficulty: 'hard',
          learning_objective: 'Memahami teknik advanced maintenance'
        },
        {
          id: 'q6-9',
          type: 'multiple_choice',
          question: 'Motor efficiency akan turun jika:',
          options: [
            'Motor beroperasi pada rated load',
            'Voltage unbalance, bearing aus, atau air gap tidak uniform',
            'Motor beroperasi pada temperatur normal',
            'Motor dibersihkan secara rutin'
          ],
          correct_answer: 1,
          explanation: 'Efficiency motor turun akibat voltage unbalance, bearing aus, air gap tidak uniform, atau kontaminasi pada rotor/stator.',
          difficulty: 'medium',
          learning_objective: 'Memahami faktor yang mempengaruhi efisiensi motor'
        },
        {
          id: 'q6-10',
          type: 'multiple_choice',
          question: 'Root cause analysis dalam troubleshooting motor bertujuan:',
          options: [
            'Mempercepat perbaikan',
            'Mencari penyebab dasar untuk mencegah berulang',
            'Mengurangi biaya perbaikan',
            'Memudahkan dokumentasi'
          ],
          correct_answer: 1,
          explanation: 'Root cause analysis mencari akar permasalahan untuk mencegah kerusakan berulang, bukan hanya memperbaiki gejala.',
          difficulty: 'medium',
          learning_objective: 'Menerapkan analisis sistematis dalam troubleshooting'
        }
      ]
    },

    {
      module_id: 'module-7',
      module_title: 'Keselamatan Kerja dan Standar',
      quiz_id: 'quiz-module-7',
      description: 'Quiz tentang keselamatan kerja dan standar dalam instalasi motor listrik',
      time_limit: 15,
      questions: [
        {
          id: 'q7-1',
          type: 'multiple_choice',
          question: 'APD (Alat Pelindung Diri) yang wajib saat bekerja dengan motor listrik:',
          options: [
            'Hanya helm safety',
            'Safety glasses, helmet, safety shoes, dan insulated gloves',
            'Hanya safety shoes',
            'Tidak perlu APD khusus'
          ],
          correct_answer: 1,
          explanation: 'APD lengkap diperlukan untuk melindungi dari risiko electrical shock, arc flash, mechanical injury, dan falling objects.',
          difficulty: 'easy',
          learning_objective: 'Memahami persyaratan APD untuk electrical work'
        },
        {
          id: 'q7-2',
          type: 'multiple_choice',
          question: 'LOTO (Lock Out Tag Out) procedure dilakukan untuk:',
          options: [
            'Mengunci ruangan kerja',
            'Isolasi energi dan mencegah energizing tidak sengaja',
            'Menandai peralatan yang rusak',
            'Mengunci panel listrik'
          ],
          correct_answer: 1,
          explanation: 'LOTO memastikan semua sumber energi diisolasi dan dikunci untuk mencegah energizing tidak sengaja saat maintenance.',
          difficulty: 'medium',
          learning_objective: 'Memahami prosedur isolasi energi'
        },
        {
          id: 'q7-3',
          type: 'multiple_choice',
          question: 'Arc flash protection diperlukan karena:',
          options: [
            'Mencegah motor terbakar',
            'Melindungi dari ledakan busur api saat short circuit',
            'Menghemat energi listrik',
            'Mengurangi noise motor'
          ],
          correct_answer: 1,
          explanation: 'Arc flash dapat menyebabkan luka bakar parah atau kematian akibat energi panas yang sangat tinggi dari busur api listrik.',
          difficulty: 'medium',
          learning_objective: 'Memahami bahaya arc flash'
        },
        {
          id: 'q7-4',
          type: 'multiple_choice',
          question: 'Electrical clearance minimum untuk motor 380V adalah:',
          options: [
            '1 meter',
            'Sesuai standar IEC/IEEE untuk voltage level',
            '10 cm',
            'Tidak ada ketentuan'
          ],
          correct_answer: 1,
          explanation: 'Electrical clearance harus sesuai standar (IEC 60364, IEEE, atau standar lokal) berdasarkan voltage level untuk mencegah flashover.',
          difficulty: 'hard',
          learning_objective: 'Memahami persyaratan clearance electrical'
        },
        {
          id: 'q7-5',
          type: 'multiple_choice',
          question: 'Grounding system dalam instalasi motor berfungsi:',
          options: [
            'Menghemat kabel',
            'Proteksi keselamatan dan sistem',
            'Meningkatkan efisiensi motor',
            'Mengurangi noise'
          ],
          correct_answer: 1,
          explanation: 'Grounding melindungi personel dari electric shock dan melindungi equipment dari voltage lebih.',
          difficulty: 'easy',
          learning_objective: 'Memahami pentingnya grounding system'
        },
        {
          id: 'q7-6',
          type: 'multiple_choice',
          question: 'Permit to work diperlukan untuk:',
          options: [
            'Semua pekerjaan rutin',
            'Pekerjaan dengan risiko tinggi atau di area berbahaya',
            'Hanya pekerjaan outdoor',
            'Pekerjaan dengan motor besar saja'
          ],
          correct_answer: 1,
          explanation: 'Permit to work diperlukan untuk pekerjaan berisiko tinggi untuk memastikan semua safety precaution telah diambil.',
          difficulty: 'medium',
          learning_objective: 'Memahami sistem permit kerja'
        },
        {
          id: 'q7-7',
          type: 'multiple_choice',
          question: 'IP rating motor menunjukkan:',
          options: [
            'Input power motor',
            'Tingkat proteksi terhadap ingress debu dan air',
            'Internal pressure motor',
            'Impedance protection motor'
          ],
          correct_answer: 1,
          explanation: 'IP (Ingress Protection) rating menunjukkan tingkat proteksi motor terhadap masuknya solid objects (debu) dan liquids (air).',
          difficulty: 'easy',
          learning_objective: 'Memahami sistem rating proteksi'
        },
        {
          id: 'q7-8',
          type: 'multiple_choice',
          question: 'Hazardous area classification penting untuk:',
          options: [
            'Menentukan daya motor',
            'Pemilihan motor explosion-proof yang sesuai',
            'Mengatur kecepatan motor',
            'Menentukan warna motor'
          ],
          correct_answer: 1,
          explanation: 'Area berbahaya memerlukan motor dengan sertifikasi Ex (explosion-proof) sesuai dengan klasifikasi area (Zone atau Division).',
          difficulty: 'hard',
          learning_objective: 'Memahami instalasi di area berbahaya'
        },
        {
          id: 'q7-9',
          type: 'multiple_choice',
          question: 'Emergency procedure saat terjadi electrical accident:',
          options: [
            'Langsung menyentuh korban',
            'Isolasi sumber listrik, beri pertolongan, panggil bantuan',
            'Siram dengan air',
            'Pindahkan motor terlebih dahulu'
          ],
          correct_answer: 1,
          explanation: 'Prioritas: 1) Isolasi sumber bahaya, 2) Beri pertolongan pertama, 3) Panggil bantuan medis, 4) Laporkan incident.',
          difficulty: 'medium',
          learning_objective: 'Memahami prosedur emergency response'
        },
        {
          id: 'q7-10',
          type: 'multiple_choice',
          question: 'Risk assessment sebelum instalasi motor bertujuan:',
          options: [
            'Memenuhi regulasi saja',
            'Mengidentifikasi bahaya dan menentukan control measures',
            'Menentukan harga pekerjaan',
            'Mengukur waktu pekerjaan'
          ],
          correct_answer: 1,
          explanation: 'Risk assessment mengidentifikasi semua potensi bahaya dan menentukan langkah-langkah pengendalian untuk mencegah accident.',
          difficulty: 'medium',
          learning_objective: 'Memahami proses risk assessment'
        }
      ]
    },

    {
      module_id: 'module-8',
      module_title: 'Teknologi Modern dan Inovasi Motor',
      quiz_id: 'quiz-module-8',
      description: 'Quiz tentang teknologi terkini dalam sistem motor dan otomasi industri',
      time_limit: 15,
      questions: [
        {
          id: 'q8-1',
          type: 'multiple_choice',
          question: 'VFD (Variable Frequency Drive) mengontrol kecepatan motor dengan cara:',
          options: [
            'Mengubah tegangan saja',
            'Mengubah frekuensi dan tegangan secara proporsional',
            'Mengubah arus saja',
            'Menggunakan resistor variable'
          ],
          correct_answer: 1,
          explanation: 'VFD mengubah frekuensi dan tegangan secara proporsional untuk menjaga flux constant dan mengontrol kecepatan motor dengan efisien.',
          difficulty: 'medium',
          learning_objective: 'Memahami prinsip kerja VFD'
        },
        {
          id: 'q8-2',
          type: 'multiple_choice',
          question: 'Motor IE4 (Super Premium Efficiency) memiliki efisiensi:',
          options: [
            '85-90%',
            '90-95%',
            '>95%',
            '<85%'
          ],
          correct_answer: 2,
          explanation: 'Motor IE4 memiliki efisiensi >95% sesuai standar IEC 60034-30-1 untuk kategori Super Premium Efficiency.',
          difficulty: 'hard',
          learning_objective: 'Memahami klasifikasi efisiensi motor'
        },
        {
          id: 'q8-3',
          type: 'multiple_choice',
          question: 'IoT (Internet of Things) pada motor memungkinkan:',
          options: [
            'Monitoring dan predictive maintenance remote',
            'Mengurangi daya motor',
            'Mengubah warna motor',
            'Mengurangi noise motor'
          ],
          correct_answer: 0,
          explanation: 'IoT memungkinkan remote monitoring parameter motor, predictive maintenance, dan optimization performance secara real-time.',
          difficulty: 'medium',
          learning_objective: 'Memahami aplikasi IoT dalam motor system'
        },
        {
          id: 'q8-4',
          type: 'multiple_choice',
          question: 'Servo motor berbeda dengan motor induksi dalam hal:',
          options: [
            'Ukuran fisik saja',
            'Presisi positioning dan control loop tertutup',
            'Warna motor',
            'Harga saja'
          ],
          correct_answer: 1,
          explanation: 'Servo motor memiliki encoder untuk feedback positioning dan control loop tertutup untuk presisi positioning yang tinggi.',
          difficulty: 'medium',
          learning_objective: 'Membedakan jenis motor berdasarkan aplikasi'
        },
        {
          id: 'q8-5',
          type: 'multiple_choice',
          question: 'Motor sinkron reluctance memberikan keuntungan:',
          options: [
            'Harga murah saja',
            'Efisiensi tinggi tanpa permanent magnet',
            'Konstruksi sederhana saja',
            'Tidak perlu inverter'
          ],
          correct_answer: 1,
          explanation: 'Motor sinkron reluctance mencapai efisiensi tinggi (IE4-IE5) tanpa menggunakan permanent magnet yang mahal dan langka.',
          difficulty: 'hard',
          learning_objective: 'Memahami teknologi motor modern'
        },
        {
          id: 'q8-6',
          type: 'multiple_choice',
          question: 'Digital twin technology pada motor digunakan untuk:',
          options: [
            'Membuat salinan fisik motor',
            'Simulasi dan optimasi performance virtual',
            'Mengganti motor fisik',
            'Mengubah spesifikasi motor'
          ],
          correct_answer: 1,
          explanation: 'Digital twin membuat model virtual motor untuk simulasi, prediksi performance, optimization, dan virtual commissioning.',
          difficulty: 'hard',
          learning_objective: 'Memahami konsep digital twin'
        },
        {
          id: 'q8-7',
          type: 'multiple_choice',
          question: 'Regenerative braking pada motor dengan VFD:',
          options: [
            'Mengurangi umur motor',
            'Mengembalikan energi ke supply saat deceleration',
            'Membuat motor berhenti lebih lambat',
            'Meningkatkan konsumsi energi'
          ],
          correct_answer: 1,
          explanation: 'Regenerative braking mengkonversi energi kinetik motor saat deceleration menjadi energi listrik yang dikembalikan ke supply.',
          difficulty: 'medium',
          learning_objective: 'Memahami fitur energy saving VFD'
        },
        {
          id: 'q8-8',
          type: 'multiple_choice',
          question: 'Machine Learning dalam motor monitoring digunakan untuk:',
          options: [
            'Mengontrol kecepatan motor',
            'Prediksi kerusakan berdasarkan pattern data',
            'Mengubah warna motor',
            'Mengurangi ukuran motor'
          ],
          correct_answer: 1,
          explanation: 'Machine Learning menganalisis pattern data vibration, thermal, current untuk memprediksi kerusakan sebelum terjadi failure.',
          difficulty: 'hard',
          learning_objective: 'Memahami aplikasi AI dalam maintenance'
        },
        {
          id: 'q8-9',
          type: 'multiple_choice',
          question: 'Motor linear berbeda dengan motor rotary dalam hal:',
          options: [
            'Menghasilkan gerakan linear langsung tanpa konversi mekanis',
            'Menggunakan arus DC saja',
            'Lebih murah dari motor rotary',
            'Tidak memerlukan kontroler'
          ],
          correct_answer: 0,
          explanation: 'Motor linear menghasilkan gerakan linear langsung tanpa perlu konversi rotary-to-linear menggunakan gearbox atau belt.',
          difficulty: 'medium',
          learning_objective: 'Memahami jenis motor berdasarkan output motion'
        },
        {
          id: 'q8-10',
          type: 'multiple_choice',
          question: 'Industry 4.0 impact pada motor system mencakup:',
          options: [
            'Penggunaan motor manual saja',
            'Integration dengan cyber-physical systems dan automation',
            'Pengurangan jumlah motor',
            'Kembali ke teknologi lama'
          ],
          correct_answer: 1,
          explanation: 'Industry 4.0 mengintegrasikan motor dengan cyber-physical systems, IoT, AI, dan advanced automation untuk smart manufacturing.',
          difficulty: 'hard',
          learning_objective: 'Memahami konsep Industry 4.0 untuk motor systems'
        }
      ]
    }
  ],

  quiz_settings: {
    default_time_limit: 15, // minutes
    passing_score: 70, // percentage
    max_attempts: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_correct_answers_after: true,
    allow_review: true,
    auto_submit_on_time_up: true
  },

  scoring_system: {
    correct_answer: 10, // points per correct answer
    partial_credit: false,
    negative_marking: false,
    bonus_for_speed: true, // bonus points for quick correct answers
    max_bonus_points: 2 // maximum bonus per question
  },

  feedback_system: {
    immediate_feedback: true,
    detailed_explanation: true,
    learning_objective_mapping: true,
    remedial_suggestions: true,
    performance_analytics: true
  },

  analytics_tracking: [
    'question_response_time',
    'difficulty_level_performance',
    'learning_objective_mastery',
    'common_misconceptions',
    'improvement_areas',
    'knowledge_gaps'
  ]
};