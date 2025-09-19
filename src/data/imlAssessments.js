// Enhanced Data Assessment untuk IML (Instalasi Motor Listrik)
// Diperluas menjadi 25 soal pre-test dan 25 PG + 5 Essay post-test

export const preTestQuestions = [
  {
    id: 1,
    question: "Apa yang dimaksud dengan motor induksi 3 fasa?",
    options: [
      "Motor yang bekerja dengan arus searah (DC)",
      "Motor yang bekerja dengan tegangan 3 fasa dan prinsip induksi elektromagnetik",
      "Motor yang hanya memiliki 3 terminal",
      "Motor yang berkecepatan tinggi"
    ],
    correctAnswer: 1,
    explanation: "Motor induksi 3 fasa adalah motor yang bekerja dengan tegangan 3 fasa dan menggunakan prinsip induksi elektromagnetik untuk menghasilkan torsi."
  },
  {
    id: 2,
    question: "Fungsi utama kontaktor dalam instalasi motor listrik adalah?",
    options: [
      "Mengubah kecepatan motor",
      "Menghubung dan memutus rangkaian listrik secara otomatis",
      "Melindungi motor dari hubung singkat",
      "Mengatur tegangan input motor"
    ],
    correctAnswer: 1,
    explanation: "Kontaktor berfungsi untuk menghubung dan memutus rangkaian listrik secara otomatis, terutama untuk mengendalikan motor listrik."
  },
  {
    id: 3,
    question: "Thermal overload relay berfungsi untuk?",
    options: [
      "Melindungi motor dari beban lebih (overload)",
      "Mengatur kecepatan motor",
      "Membalik arah putaran motor",
      "Menstabilkan tegangan"
    ],
    correctAnswer: 0,
    explanation: "Thermal overload relay berfungsi untuk melindungi motor dari kondisi beban lebih yang dapat merusak motor."
  },
  {
    id: 4,
    question: "Untuk membalik arah putaran motor 3 fasa, yang perlu dilakukan adalah?",
    options: [
      "Menukar 2 fasa dari 3 fasa yang masuk ke motor",
      "Mengubah tegangan input",
      "Mengganti kontaktor",
      "Menukar semua 3 fasa"
    ],
    correctAnswer: 0,
    explanation: "Untuk membalik arah putaran motor 3 fasa, cukup menukar posisi 2 fasa dari 3 fasa yang masuk ke motor."
  },
  {
    id: 5,
    question: "MCB (Miniature Circuit Breaker) dalam instalasi motor berfungsi sebagai?",
    options: [
      "Pengaman utama dari hubung singkat dan beban lebih",
      "Pengatur kecepatan motor",
      "Pembalik arah putaran",
      "Stabilizer tegangan"
    ],
    correctAnswer: 0,
    explanation: "MCB berfungsi sebagai pengaman utama yang melindungi instalasi dari hubung singkat dan beban lebih."
  },
  {
    id: 6,
    question: "Push button STOP dalam rangkaian kontrol motor biasanya menggunakan kontak?",
    options: [
      "Normally Closed (NC)",
      "Normally Open (NO)",
      "Changeover",
      "Toggle switch"
    ],
    correctAnswer: 0,
    explanation: "Push button STOP menggunakan kontak NC (Normally Closed) agar motor berhenti saat tombol ditekan."
  },
  {
    id: 7,
    question: "Auxiliary contact pada kontaktor biasanya digunakan untuk?",
    options: [
      "Self holding (maintaining) dan interlock",
      "Menghubungkan motor ke sumber",
      "Mengatur kecepatan motor",
      "Melindungi dari overload"
    ],
    correctAnswer: 0,
    explanation: "Auxiliary contact digunakan untuk self holding (mempertahankan kontaktor tetap aktif) dan sistem interlock."
  },
  {
    id: 8,
    question: "Rating arus thermal overload relay harus disetel berdasarkan?",
    options: [
      "Arus nominal motor",
      "Tegangan nominal motor",
      "Daya nominal motor",
      "Kecepatan nominal motor"
    ],
    correctAnswer: 0,
    explanation: "Setting thermal overload relay harus disesuaikan dengan arus nominal motor untuk proteksi yang optimal."
  },
  {
    id: 9,
    question: "Sistem starter DOL (Direct On Line) memiliki karakteristik?",
    options: [
      "Arus starting rendah, torsi starting rendah",
      "Arus starting tinggi, torsi starting tinggi",
      "Arus starting tinggi, torsi starting rendah",
      "Menggunakan resistor starting"
    ],
    correctAnswer: 1,
    explanation: "DOL starter menghasilkan arus starting dan torsi starting yang tinggi karena motor langsung dihubungkan ke tegangan nominal."
  },
  {
    id: 10,
    question: "Keunggulan sistem starter Star-Delta adalah?",
    options: [
      "Arus starting rendah dibanding DOL",
      "Konstruksi sederhana",
      "Biaya murah",
      "Tidak memerlukan timer"
    ],
    correctAnswer: 0,
    explanation: "Star-Delta starter mengurangi arus starting hingga 1/3 dari arus DOL dengan menghubungkan motor dalam konfigurasi star saat starting."
  },
  {
    id: 11,
    question: "Fungsi utama timer dalam rangkaian Star-Delta adalah?",
    options: [
      "Mengatur kecepatan motor",
      "Mengatur waktu transisi dari star ke delta",
      "Melindungi motor dari overload",
      "Mengatur tegangan motor"
    ],
    correctAnswer: 1,
    explanation: "Timer mengatur waktu yang tepat untuk transisi dari konfigurasi star ke delta agar motor dapat mencapai kecepatan optimal."
  },
  {
    id: 12,
    question: "Grounding motor listrik bertujuan untuk?",
    options: [
      "Meningkatkan efisiensi motor",
      "Keamanan dari sengatan listrik",
      "Mengurangi noise motor",
      "Meningkatkan torsi motor"
    ],
    correctAnswer: 1,
    explanation: "Grounding berfungsi untuk keamanan, melindungi dari sengatan listrik jika terjadi kebocoran arus ke body motor."
  },
  {
    id: 13,
    question: "Slip pada motor induksi adalah?",
    options: [
      "Perbedaan antara kecepatan sinkron dengan kecepatan rotor",
      "Kehilangan daya pada motor",
      "Perbedaan tegangan stator dan rotor",
      "Efisiensi motor"
    ],
    correctAnswer: 0,
    explanation: "Slip adalah perbedaan antara kecepatan medan putar stator (sinkron) dengan kecepatan rotor aktual."
  },
  {
    id: 14,
    question: "Motor dengan rating IP55 memiliki arti?",
    options: [
      "Perlindungan terhadap debu dan air",
      "Motor dengan 5 terminal",
      "Motor 5 HP",
      "Motor dengan 5 pole"
    ],
    correctAnswer: 0,
    explanation: "IP55 menunjukkan tingkat proteksi motor terhadap debu (angka pertama 5) dan air (angka kedua 5)."
  },
  {
    id: 15,
    question: "Fuse dalam instalasi motor berfungsi sebagai?",
    options: [
      "Pengaman dari hubung singkat",
      "Pengatur kecepatan",
      "Pembalik putaran",
      "Stabilizer tegangan"
    ],
    correctAnswer: 0,
    explanation: "Fuse adalah pengaman yang akan putus/meleleh jika terjadi hubung singkat untuk melindungi rangkaian."
  },
  {
    id: 16,
    question: "Kabel yang digunakan untuk instalasi motor harus memperhatikan?",
    options: [
      "Kapasitas arus hantar (ampacity)",
      "Warna kabel saja",
      "Panjang kabel saja",
      "Harga kabel"
    ],
    correctAnswer: 0,
    explanation: "Kapasitas arus hantar kabel harus sesuai dengan arus nominal motor untuk mencegah overheating."
  },
  {
    id: 17,
    question: "Interlock dalam sistem kontrol motor berfungsi untuk?",
    options: [
      "Mencegah operasi yang bertentangan",
      "Meningkatkan kecepatan motor",
      "Menghemat energi",
      "Mengurangi noise"
    ],
    correctAnswer: 0,
    explanation: "Interlock mencegah dua operasi yang bertentangan terjadi bersamaan, seperti forward dan reverse."
  },
  {
    id: 18,
    question: "Konsep 'maintaining contact' dalam rangkaian kontrol motor adalah?",
    options: [
      "Kontak yang mempertahankan kontaktor tetap aktif setelah tombol start dilepas",
      "Kontak untuk pemeliharaan motor",
      "Kontak emergency stop",
      "Kontak untuk overload"
    ],
    correctAnswer: 0,
    explanation: "Maintaining contact (self-holding) mempertahankan kontaktor tetap aktif meskipun tombol start sudah dilepas."
  },
  {
    id: 19,
    question: "Power factor motor induksi pada kondisi beban penuh biasanya?",
    options: [
      "Lagging (induktif)",
      "Leading (kapasitif)",
      "Unity (1)",
      "Tidak ada power factor"
    ],
    correctAnswer: 0,
    explanation: "Motor induksi memiliki sifat induktif sehingga power factor lagging, biasanya 0.8-0.9 pada beban penuh."
  },
  {
    id: 20,
    question: "Megger test pada motor digunakan untuk mengukur?",
    options: [
      "Tahanan isolasi",
      "Arus motor",
      "Kecepatan motor",
      "Torsi motor"
    ],
    correctAnswer: 0,
    explanation: "Megger test mengukur tahanan isolasi antara belitan dan ground untuk memastikan isolasi motor masih baik."
  },
  {
    id: 21,
    question: "Motor yang bekerja pada frekuensi 50 Hz dengan 4 pole memiliki kecepatan sinkron?",
    options: [
      "1500 RPM",
      "3000 RPM",
      "1000 RPM",
      "750 RPM"
    ],
    correctAnswer: 0,
    explanation: "Kecepatan sinkron = (120 x f) / p = (120 x 50) / 4 = 1500 RPM."
  },
  {
    id: 22,
    question: "Bearing motor listrik perlu dilumasi untuk?",
    options: [
      "Mengurangi gesekan dan panas",
      "Meningkatkan kecepatan",
      "Mengurangi noise saja",
      "Meningkatkan torsi"
    ],
    correctAnswer: 0,
    explanation: "Pelumasan bearing mengurangi gesekan, panas, dan keausan, memperpanjang umur motor."
  },
  {
    id: 23,
    question: "Terminal box motor 3 fasa umumnya memiliki terminal yang diberi label?",
    options: [
      "U1, V1, W1, U2, V2, W2",
      "R, S, T",
      "A, B, C",
      "1, 2, 3"
    ],
    correctAnswer: 0,
    explanation: "Standar IEC menggunakan label U1, V1, W1 untuk ujung awal dan U2, V2, W2 untuk ujung akhir belitan."
  },
  {
    id: 24,
    question: "Efisiensi motor listrik biasanya paling tinggi pada kondisi?",
    options: [
      "Beban 75-100% dari rating",
      "Tanpa beban",
      "Beban 25%",
      "Overload"
    ],
    correctAnswer: 0,
    explanation: "Motor mencapai efisiensi tertinggi pada beban 75-100% dari rating nominalnya."
  },
  {
    id: 25,
    question: "Harmonik pada motor listrik dapat menyebabkan?",
    options: [
      "Peningkatan rugi-rugi dan panas",
      "Peningkatan efisiensi",
      "Pengurangan noise",
      "Peningkatan power factor"
    ],
    correctAnswer: 0,
    explanation: "Harmonik menyebabkan peningkatan rugi-rugi, panas, getaran, dan dapat mengurangi umur motor."
  },
  {
    id: 9,
    question: "Dalam rangkaian star-delta, urutan operasi yang benar adalah?",
    options: [
      "Start → Star → Delta → Run",
      "Start → Delta → Star → Run",
      "Star → Start → Delta → Run",
      "Delta → Star → Start → Run"
    ],
    correctAnswer: 0,
    explanation: "Urutan yang benar adalah Start (tekan tombol) → Star (koneksi bintang) → Delta (koneksi segitiga) → Run (operasi normal)."
  },
  {
    id: 10,
    question: "Tujuan utama starting star-delta adalah?",
    options: [
      "Mengurangi arus starting motor",
      "Meningkatkan torsi starting",
      "Mengatur kecepatan motor",
      "Membalik arah putaran"
    ],
    correctAnswer: 0,
    explanation: "Starting star-delta bertujuan untuk mengurangi arus starting motor yang besar pada saat pertama kali dihidupkan."
  },
  {
    id: 11,
    question: "Pada motor 3 fasa, terminal U1, V1, W1 biasanya terhubung ke?",
    options: [
      "Supply tegangan 3 fasa",
      "Neutral/ground",
      "Terminal starting",
      "Terminal auxiliary"
    ],
    correctAnswer: 0,
    explanation: "Terminal U1, V1, W1 adalah terminal utama motor yang terhubung ke supply tegangan 3 fasa."
  },
  {
    id: 12,
    question: "Apa yang dimaksud dengan slip pada motor induksi?",
    options: [
      "Perbedaan kecepatan medan putar dengan rotor",
      "Kecepatan maksimum motor",
      "Kecepatan minimum motor",
      "Kecepatan sinkron motor"
    ],
    correctAnswer: 0,
    explanation: "Slip adalah perbedaan antara kecepatan medan putar stator dengan kecepatan rotor pada motor induksi."
  },
  {
    id: 13,
    question: "Frekuensi standard PLN di Indonesia adalah?",
    options: [
      "50 Hz",
      "60 Hz",
      "25 Hz",
      "100 Hz"
    ],
    correctAnswer: 0,
    explanation: "Frekuensi standard PLN di Indonesia adalah 50 Hz."
  },
  {
    id: 14,
    question: "Pada rangkaian forward-reverse, sistem interlock diperlukan untuk?",
    options: [
      "Mencegah kedua kontaktor aktif bersamaan",
      "Mengatur kecepatan motor",
      "Melindungi dari overload",
      "Menstabilkan tegangan"
    ],
    correctAnswer: 0,
    explanation: "Sistem interlock mencegah kontaktor forward dan reverse aktif bersamaan yang dapat menyebabkan hubung singkat."
  },
  {
    id: 15,
    question: "Multimeter dapat digunakan untuk mengukur?",
    options: [
      "Tegangan, arus, dan tahanan",
      "Hanya tegangan",
      "Hanya arus",
      "Hanya tahanan"
    ],
    correctAnswer: 0,
    explanation: "Multimeter adalah alat ukur yang dapat digunakan untuk mengukur tegangan (voltage), arus (current), dan tahanan (resistance)."
  }
];

// Enhanced Post-Test: 25 Pilihan Ganda + 5 Essay (30 menit)
export const postTestQuestions = [
  // Bagian A: Pilihan Ganda (25 soal)
  {
    id: 1,
    type: "multiple-choice",
    question: "Berdasarkan praktik yang telah dilakukan, manakah yang merupakan prosedur K3 yang PALING PENTING saat merangkai instalasi motor listrik?",
    options: [
      "Menggunakan sarung tangan karet saat bekerja",
      "Memastikan MCB dalam posisi OFF sebelum merangkai",
      "Memakai sepatu safety",
      "Menggunakan helm pengaman"
    ],
    correctAnswer: 1,
    explanation: "Memastikan MCB OFF adalah prosedur K3 paling penting untuk mencegah sengatan listrik saat merangkai."
  },
  {
    id: 2,
    type: "multiple-choice",
    question: "Dalam rangkaian forward-reverse, fungsi sistem interlock adalah?",
    options: [
      "Mencegah kontaktor forward dan reverse bekerja bersamaan",
      "Mengatur kecepatan motor",
      "Melindungi motor dari overload",
      "Menstabilkan tegangan"
    ],
    correctAnswer: 0,
    explanation: "Sistem interlock mencegah konflik antara kontaktor forward dan reverse yang dapat menyebabkan hubung singkat."
  },
  {
    id: 3,
    type: "multiple-choice",
    question: "Jika saat testing motor tidak berputar sama sekali, kemungkinan penyebab yang PERTAMA harus diperiksa adalah?",
    options: [
      "Kondisi MCB dan sumber tegangan",
      "Kondisi bearing motor",
      "Setting thermal overload",
      "Kondisi rotor motor"
    ],
    correctAnswer: 0,
    explanation: "Langkah troubleshooting pertama adalah memastikan ada supply tegangan dengan memeriksa MCB dan sumber."
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "Pada praktik forward-reverse, auxiliary contact NO pada kontaktor forward berfungsi untuk?",
    options: [
      "Self holding kontaktor forward",
      "Interlock kontaktor reverse",
      "Proteksi overload",
      "Indikator lampu"
    ],
    correctAnswer: 1,
    explanation: "Auxiliary contact NO pada kontaktor forward digunakan untuk mengunci (interlock) kontaktor reverse."
  },
  {
    id: 5,
    type: "multiple-choice",
    question: "Hasil pengukuran tahanan isolasi motor yang baik minimal adalah?",
    options: [
      "1 MΩ",
      "100 kΩ",
      "10 kΩ",
      "1 kΩ"
    ],
    correctAnswer: 0,
    explanation: "Tahanan isolasi motor yang baik minimal 1 MΩ untuk memastikan tidak ada kebocoran arus ke body motor."
  },
  {
    id: 6,
    type: "multiple-choice",
    question: "Saat melakukan pengukuran arus motor dengan clamp meter, posisi clamp harus?",
    options: [
      "Mengapit satu kabel fasa saja",
      "Mengapit ketiga kabel fasa bersamaan",
      "Mengapit kabel neutral",
      "Mengapit kabel ground"
    ],
    correctAnswer: 0,
    explanation: "Clamp meter harus mengapit satu kabel fasa saja untuk mendapatkan pembacaan arus yang akurat."
  },
  {
    id: 7,
    type: "multiple-choice",
    question: "Jika motor berputar tetapi arah tidak dapat dibalik, kemungkinan penyebab adalah?",
    options: [
      "Auxiliary contact interlock rusak atau salah wiring",
      "Motor rusak",
      "MCB rusak",
      "Overload trip"
    ],
    correctAnswer: 0,
    explanation: "Jika motor berputar normal tapi tidak bisa dibalik, biasanya masalah pada sistem interlock atau wiring auxiliary contact."
  },
  {
    id: 8,
    type: "multiple-choice",
    question: "Setting thermal overload yang terlalu rendah akan menyebabkan?",
    options: [
      "Motor sering trip padahal beban normal",
      "Motor tidak terlindungi dari overload",
      "Motor berputar lambat",
      "Motor berputar cepat"
    ],
    correctAnswer: 0,
    explanation: "Setting overload terlalu rendah menyebabkan motor trip (mati) meskipun beban masih dalam batas normal."
  },
  {
    id: 9,
    type: "multiple-choice",
    question: "Pada rangkaian control, tegangan kerja biasanya menggunakan?",
    options: [
      "220V AC",
      "380V AC",
      "24V DC",
      "110V AC"
    ],
    correctAnswer: 0,
    explanation: "Rangkaian control motor umumnya menggunakan tegangan 220V AC untuk mengoperasikan kontaktor dan komponen control."
  },
  {
    id: 10,
    type: "multiple-choice",
    question: "Urutan phase R-S-T harus benar untuk memastikan?",
    options: [
      "Arah putaran motor sesuai yang diinginkan",
      "Motor berputar lebih cepat",
      "Motor lebih hemat energi",
      "Motor lebih awet"
    ],
    correctAnswer: 0,
    explanation: "Urutan phase yang benar memastikan arah putaran motor sesuai dengan yang diinginkan."
  },
  {
    id: 11,
    type: "multiple-choice",
    question: "Lampu indikator dalam panel control berfungsi untuk?",
    options: [
      "Menunjukkan status operasi motor",
      "Penerangan panel",
      "Hiasan panel",
      "Menghemat listrik"
    ],
    correctAnswer: 0,
    explanation: "Lampu indikator menunjukkan status operasi motor seperti ON/OFF, Forward/Reverse, atau kondisi alarm."
  },
  {
    id: 12,
    type: "multiple-choice",
    question: "Emergency stop button harus menggunakan kontak?",
    options: [
      "NC (Normally Closed)",
      "NO (Normally Open)",
      "Changeover",
      "Momentary"
    ],
    correctAnswer: 0,
    explanation: "Emergency stop menggunakan kontak NC agar motor langsung berhenti saat tombol ditekan dalam kondisi darurat."
  },
  {
    id: 13,
    type: "multiple-choice",
    question: "Pada sistem Star-Delta, waktu delay timer biasanya disetel?",
    options: [
      "3-5 detik",
      "10-15 detik",
      "30 detik",
      "1 menit"
    ],
    correctAnswer: 0,
    explanation: "Timer delay Star-Delta biasanya 3-5 detik untuk memberikan waktu motor mencapai kecepatan hampir nominal sebelum switch ke Delta."
  },
  {
    id: 14,
    type: "multiple-choice",
    question: "Kabel control umumnya menggunakan warna?",
    options: [
      "Sesuai standar wiring diagram",
      "Warna apa saja",
      "Hanya hitam",
      "Hanya merah"
    ],
    correctAnswer: 0,
    explanation: "Kabel control harus mengikuti standar wiring diagram untuk memudahkan troubleshooting dan maintenance."
  },
  {
    id: 15,
    type: "multiple-choice",
    question: "Fungsi fuse dalam rangkaian motor adalah?",
    options: [
      "Proteksi hubung singkat",
      "Mengatur kecepatan",
      "Membalik putaran",
      "Menghemat energi"
    ],
    correctAnswer: 0,
    explanation: "Fuse berfungsi sebagai proteksi cepat terhadap arus hubung singkat yang dapat merusak komponen."
  },
  {
    id: 16,
    type: "multiple-choice",
    question: "Saat motor trip karena overload, tindakan yang harus dilakukan adalah?",
    options: [
      "Cek beban motor dan kondisi overload relay",
      "Langsung reset overload",
      "Ganti motor",
      "Naikkan setting overload"
    ],
    correctAnswer: 0,
    explanation: "Trip overload harus dicek penyebabnya dulu (beban berlebih, setting salah, dll) sebelum reset."
  },
  {
    id: 17,
    type: "multiple-choice",
    question: "Power factor motor dapat diperbaiki dengan menambahkan?",
    options: [
      "Kapasitor bank",
      "Resistor",
      "Induktor",
      "Transformer"
    ],
    correctAnswer: 0,
    explanation: "Kapasitor bank dapat memperbaiki power factor motor induksi yang bersifat induktif (lagging)."
  },
  {
    id: 18,
    type: "multiple-choice",
    question: "Grounding motor listrik bertujuan untuk?",
    options: [
      "Keamanan dari sengatan listrik",
      "Meningkatkan efisiensi",
      "Mengurangi noise",
      "Mempercepat putaran"
    ],
    correctAnswer: 0,
    explanation: "Grounding berfungsi untuk keamanan, mengalirkan arus bocor ke tanah mencegah sengatan listrik."
  },
  {
    id: 19,
    type: "multiple-choice",
    question: "Motor protection yang paling penting untuk motor induksi adalah?",
    options: [
      "Overload dan short circuit protection",
      "Overvoltage protection",
      "Frequency protection",
      "Temperature protection saja"
    ],
    correctAnswer: 0,
    explanation: "Proteksi overload dan hubung singkat adalah yang paling kritis untuk melindungi motor induksi."
  },
  {
    id: 20,
    type: "multiple-choice",
    question: "Efisiensi motor listrik tertinggi biasanya pada beban?",
    options: [
      "75-100% rating",
      "25% rating",
      "0% (no load)",
      "Overload"
    ],
    correctAnswer: 0,
    explanation: "Motor mencapai efisiensi tertinggi pada beban 75-100% dari rating nominalnya."
  },
  {
    id: 21,
    type: "multiple-choice",
    question: "Bearing motor harus dilumasi untuk?",
    options: [
      "Mengurangi gesekan dan panas",
      "Meningkatkan kecepatan",
      "Mengurangi noise saja",
      "Menghemat listrik"
    ],
    correctAnswer: 0,
    explanation: "Pelumasan bearing mengurangi gesekan, panas, dan keausan, memperpanjang umur motor."
  },
  {
    id: 22,
    type: "multiple-choice",
    question: "Motor dengan class isolasi F dapat beroperasi pada suhu maksimal?",
    options: [
      "155°C",
      "130°C",
      "180°C",
      "120°C"
    ],
    correctAnswer: 0,
    explanation: "Class isolasi F memiliki batas suhu maksimal 155°C untuk operasi motor yang aman."
  },
  {
    id: 23,
    type: "multiple-choice",
    question: "Harmonik pada motor dapat menyebabkan?",
    options: [
      "Peningkatan losses dan panas",
      "Peningkatan efisiensi",
      "Motor berputar lebih halus",
      "Pengurangan noise"
    ],
    correctAnswer: 0,
    explanation: "Harmonik menyebabkan additional losses, panas berlebih, dan dapat mengurangi umur motor."
  },
  {
    id: 24,
    type: "multiple-choice",
    question: "Vibration motor yang berlebihan dapat disebabkan oleh?",
    options: [
      "Unbalance rotor atau misalignment",
      "Motor berkualitas baik",
      "Tegangan stable",
      "Beban sesuai rating"
    ],
    correctAnswer: 0,
    explanation: "Vibration berlebihan biasanya akibat unbalance rotor, misalignment, atau masalah mekanis lain."
  },
  {
    id: 25,
    type: "multiple-choice",
    question: "Motor rating IP55 berarti motor memiliki proteksi terhadap?",
    options: [
      "Debu dan water jets",
      "Hanya debu",
      "Hanya air",
      "Tidak ada proteksi"
    ],
    correctAnswer: 0,
    explanation: "IP55 berarti proteksi terhadap debu (angka pertama 5) dan water jets dari segala arah (angka kedua 5)."
  }
];

// Bagian B: Essay (5 soal - 40 poin total)
export const postTestEssay = [
  {
    id: 1,
    question: "Berdasarkan pembelajaran dan praktik IML yang telah Anda ikuti, analisis penyebab-penyebab umum motor tidak dapat berputar saat pertama kali dihidupkan. Jelaskan langkah-langkah troubleshooting sistematis yang harus dilakukan! (8 poin)",
    points: 8,
    rubric: {
      excellent: "Menganalisis penyebab dengan sistematis (power supply, wiring, proteksi, motor condition), menjelaskan langkah troubleshooting logis, memahami tools yang diperlukan",
      good: "Menganalisis penyebab utama dan langkah troubleshooting dengan baik",
      fair: "Menyebutkan beberapa penyebab dan langkah dasar troubleshooting",
      poor: "Penjelasan tidak sistematis atau kurang tepat"
    }
  },
  {
    id: 2,
    question: "Bandingkan kelebihan dan kekurangan sistem starter DOL (Direct On Line) dengan Star-Delta. Dalam kondisi apa masing-masing sistem sebaiknya digunakan? Berikan contoh aplikasi nyata! (8 poin)",
    points: 8,
    rubric: {
      excellent: "Membandingkan kedua sistem dengan detail (arus starting, torsi, kompleksitas, biaya), menjelaskan aplikasi yang tepat dengan contoh nyata",
      good: "Membandingkan kelebihan/kekurangan dengan baik dan memberikan contoh aplikasi",
      fair: "Menjelaskan perbedaan dasar kedua sistem",
      poor: "Perbandingan tidak jelas atau kurang tepat"
    }
  },
  {
    id: 3,
    question: "Jelaskan pentingnya sistem proteksi motor listrik (MCB, thermal overload, fuse). Analisis apa yang terjadi jika salah satu proteksi tidak berfungsi atau salah setting! (8 poin)",
    points: 8,
    rubric: {
      excellent: "Menjelaskan fungsi masing-masing proteksi, menganalisis dampak jika tidak berfungsi, memahami koordinasi proteksi",
      good: "Menjelaskan fungsi proteksi dan dampak jika tidak berfungsi",
      fair: "Menjelaskan fungsi dasar sistem proteksi",
      poor: "Penjelasan proteksi tidak lengkap atau salah"
    }
  },
  {
    id: 4,
    question: "Desain rangkaian control motor 3 fasa dengan requirement: dapat start/stop lokal dan remote, dilengkapi indikator running, proteksi emergency stop. Jelaskan prinsip kerja rangkaian Anda! (8 poin)",
    points: 8,
    rubric: {
      excellent: "Mendesain rangkaian lengkap dengan control lokal/remote, indikator, emergency stop, menjelaskan prinsip kerja dengan detail",
      good: "Mendesain rangkaian dengan fitur yang diminta dan menjelaskan prinsip kerja",
      fair: "Mendesain rangkaian dasar dengan beberapa fitur",
      poor: "Desain rangkaian tidak sesuai requirement atau penjelasan kurang tepat"
    }
  },
  {
    id: 5,
    question: "Evaluasi pembelajaran IML: Menurut Anda, kompetensi apa yang paling penting dikuasai teknisi instalasi motor listrik? Bagaimana cara mengembangkan kompetensi tersebut secara berkelanjutan? (8 poin)",
    points: 8,
    rubric: {
      excellent: "Mengidentifikasi kompetensi kritis (safety, technical skills, troubleshooting, standards), merencanakan pengembangan berkelanjutan yang realistis",
      good: "Mengidentifikasi kompetensi penting dan cara pengembangannya",
      fair: "Menyebutkan beberapa kompetensi yang diperlukan",
      poor: "Identifikasi kompetensi tidak tepat atau tidak lengkap"
    }
  }
];

export const postTestEssayQuestions = [
  {
    id: 6,
    type: "multiple-choice",
    question: "Saat melakukan pengukuran arus motor dengan clamp meter, posisi clamp harus?",
    options: [
      "Mengapit satu kabel fasa saja",
      "Mengapit ketiga kabel fasa bersamaan",
      "Mengapit kabel neutral",
      "Mengapit kabel ground"
    ],
    correctAnswer: 0,
    explanation: "Clamp meter harus mengapit satu kabel fasa saja untuk mendapatkan pembacaan arus yang akurat."
  },
  {
    id: 7,
    type: "multiple-choice",
    question: "Jika motor berputar tetapi arah tidak dapat dibalik, kemungkinan penyebab adalah?",
    options: [
      "Auxiliary contact interlock rusak atau salah wiring",
      "Motor rusak",
      "MCB rusak",
      "Overload trip"
    ],
    correctAnswer: 0,
    explanation: "Jika motor berputar normal tapi tidak bisa dibalik, biasanya masalah pada sistem interlock atau wiring auxiliary contact."
  },
  {
    id: 8,
    type: "multiple-choice",
    question: "Setting thermal overload yang terlalu rendah akan menyebabkan?",
    options: [
      "Motor sering trip padahal beban normal",
      "Motor tidak terlindungi dari overload",
      "Motor berputar lambat",
      "Motor berputar cepat"
    ],
    correctAnswer: 0,
    explanation: "Setting overload terlalu rendah menyebabkan motor trip (mati) meskipun beban masih dalam batas normal."
  },
  {
    id: 9,
    type: "multiple-choice",
    question: "Pada rangkaian control, tegangan kerja biasanya menggunakan?",
    options: [
      "220V AC",
      "380V AC",
      "24V DC",
      "110V AC"
    ],
    correctAnswer: 0,
    explanation: "Rangkaian control motor umumnya menggunakan tegangan 220V AC untuk mengoperasikan kontaktor dan komponen control."
  },
  {
    id: 10,
    type: "multiple-choice",
    question: "Urutan phase R-S-T harus benar untuk memastikan?",
    options: [
      "Arah putaran motor sesuai yang diinginkan",
      "Motor berputar lebih cepat",
      "Motor lebih hemat energi",
      "Motor lebih awet"
    ],
    correctAnswer: 0,
    explanation: "Urutan phase yang benar memastikan arah putaran motor sesuai dengan yang diinginkan."
  },
  {
    id: 11,
    type: "multiple-choice",
    question: "Lampu indikator dalam panel control berfungsi untuk?",
    options: [
      "Menunjukkan status operasi motor",
      "Penerangan panel",
      "Hiasan panel",
      "Menghemat listrik"
    ],
    correctAnswer: 0,
    explanation: "Lampu indikator menunjukkan status operasi motor seperti ON/OFF, Forward/Reverse, atau kondisi alarm."
  },
  {
    id: 12,
    type: "multiple-choice",
    question: "Emergency stop button harus menggunakan kontak?",
    options: [
      "NC (Normally Closed)",
      "NO (Normally Open)",
      "Changeover",
      "Momentary"
    ],
    correctAnswer: 0,
    explanation: "Emergency stop menggunakan kontak NC agar motor langsung berhenti saat tombol ditekan dalam kondisi darurat."
  },
  {
    id: 13,
    type: "multiple-choice",
    question: "Dalam troubleshooting, jika hanya satu fasa motor yang mendapat tegangan, kemungkinan penyebab adalah?",
    options: [
      "Salah satu fasa putus atau kontaktor rusak",
      "Motor overload",
      "Bearing motor rusak",
      "Rotor motor rusak"
    ],
    correctAnswer: 0,
    explanation: "Jika hanya satu fasa yang mendapat tegangan, kemungkinan ada fasa yang putus atau salah satu kontak kontaktor rusak."
  },
  {
    id: 14,
    type: "multiple-choice",
    question: "Ground fault protection diperlukan untuk?",
    options: [
      "Melindungi manusia dari sengatan listrik",
      "Melindungi motor dari overload",
      "Mengatur kecepatan motor",
      "Menghemat energi"
    ],
    correctAnswer: 0,
    explanation: "Ground fault protection melindungi manusia dari sengatan listrik akibat kebocoran arus ke ground."
  },
  {
    id: 15,
    type: "multiple-choice",
    question: "Dokumentasi hasil praktik penting untuk?",
    options: [
      "Evaluasi pembelajaran dan referensi troubleshooting",
      "Memenuhi syarat administrasi",
      "Hiasan laporan",
      "Mengisi waktu"
    ],
    correctAnswer: 0,
    explanation: "Dokumentasi praktik penting untuk evaluasi pembelajaran dan sebagai referensi untuk troubleshooting di masa mendatang."
  }
];

export const postTestEssays = [
  {
    id: 1,
    question: "Jelaskan langkah-langkah troubleshooting yang harus dilakukan jika motor berputar tetapi arahnya tidak dapat dibalik (hanya bisa forward saja). Sertakan kemungkinan penyebab dan solusinya!",
    points: 8,
    rubric: {
      excellent: "Menjelaskan langkah troubleshooting sistematis, mengidentifikasi kemungkinan penyebab (auxiliary contact, wiring interlock, kontaktor), dan memberikan solusi yang tepat",
      good: "Menjelaskan langkah troubleshooting dan kemungkinan penyebab dengan cukup baik",
      fair: "Menjelaskan beberapa langkah troubleshooting atau penyebab",
      poor: "Penjelasan tidak sistematis atau kurang tepat"
    }
  },
  {
    id: 2,
    question: "Berdasarkan praktik yang telah Anda lakukan, jelaskan perbedaan fungsi antara kontaktor utama dan auxiliary contact. Berikan contoh penggunaannya dalam rangkaian forward-reverse!",
    points: 8,
    rubric: {
      excellent: "Menjelaskan perbedaan fungsi dengan jelas, memberikan contoh aplikasi dalam rangkaian forward-reverse, memahami konsep self-holding dan interlock",
      good: "Menjelaskan perbedaan fungsi dengan baik dan memberikan contoh",
      fair: "Menjelaskan perbedaan fungsi dasar",
      poor: "Penjelasan tidak jelas atau salah konsep"
    }
  },
  {
    id: 3,
    question: "Analisis: Mengapa setting thermal overload relay harus disesuaikan dengan arus nominal motor? Apa yang terjadi jika setting terlalu tinggi atau terlalu rendah?",
    points: 8,
    rubric: {
      excellent: "Menjelaskan prinsip kerja thermal overload, hubungannya dengan arus nominal motor, dan analisis dampak setting yang salah",
      good: "Menjelaskan alasan setting dan dampak setting yang salah",
      fair: "Menjelaskan alasan setting thermal overload",
      poor: "Penjelasan tidak tepat atau tidak lengkap"
    }
  },
  {
    id: 4,
    question: "Berdasarkan hasil praktik, jelaskan prosedur K3 (Keselamatan Kerja) yang harus diterapkan saat instalasi motor listrik. Mengapa prosedur ini penting?",
    points: 8,
    rubric: {
      excellent: "Menjelaskan prosedur K3 lengkap (sebelum, saat, dan setelah praktik), memahami risiko bahaya listrik, dan pentingnya implementasi K3",
      good: "Menjelaskan prosedur K3 dengan baik dan alasannya",
      fair: "Menjelaskan beberapa prosedur K3",
      poor: "Penjelasan prosedur K3 tidak lengkap atau kurang tepat"
    }
  },
  {
    id: 5,
    question: "Rancang modifikasi rangkaian forward-reverse dengan penambahan timer delay untuk mencegah switching terlalu cepat. Jelaskan fungsi dan cara kerjanya!",
    points: 8,
    rubric: {
      excellent: "Merancang rangkaian dengan timer delay, menjelaskan fungsi pencegahan switching cepat, memahami prinsip kerja timer dalam rangkaian",
      good: "Merancang rangkaian dengan timer dan menjelaskan fungsinya",
      fair: "Menjelaskan konsep timer delay dasar",
      poor: "Rancangan atau penjelasan tidak tepat"
    }
  }
];

export const quizModule1 = [
  {
    id: 1,
    question: "Komponen utama motor induksi 3 fasa terdiri dari?",
    options: [
      "Stator dan rotor",
      "Stator, rotor, dan komutator",
      "Rotor dan komutator",
      "Stator dan brush"
    ],
    correctAnswer: 0,
    explanation: "Motor induksi 3 fasa terdiri dari stator (bagian diam) dan rotor (bagian berputar)."
  },
  {
    id: 2,
    question: "Kecepatan sinkron motor 4 kutub pada frekuensi 50 Hz adalah?",
    options: [
      "1500 RPM",
      "3000 RPM",
      "1000 RPM",
      "750 RPM"
    ],
    correctAnswer: 0,
    explanation: "ns = (120 × f) / p = (120 × 50) / 4 = 1500 RPM"
  },
  {
    id: 3,
    question: "Rating tegangan motor 380V menunjukkan?",
    options: [
      "Tegangan line to line (antar fasa)",
      "Tegangan line to neutral",
      "Tegangan maksimum",
      "Tegangan minimum"
    ],
    correctAnswer: 0,
    explanation: "Rating 380V pada motor 3 fasa menunjukkan tegangan line to line (antar fasa)."
  },
  // ... tambahan soal quiz modul 1
];

export const quizModule2 = [
  {
    id: 1,
    question: "Rangkaian DOL (Direct On Line) cocok digunakan untuk motor dengan daya?",
    options: [
      "Kecil hingga menengah (≤ 5.5 kW)",
      "Besar (> 10 kW)",
      "Semua ukuran daya",
      "Hanya motor DC"
    ],
    correctAnswer: 0,
    explanation: "DOL cocok untuk motor daya kecil-menengah karena arus startingnya tidak terlalu besar."
  },
  {
    id: 2,
    question: "Pada rangkaian star-delta, tegangan pada lilitan motor saat start adalah?",
    options: [
      "1/√3 dari tegangan normal",
      "√3 dari tegangan normal",
      "1/2 dari tegangan normal",
      "2 kali tegangan normal"
    ],
    correctAnswer: 0,
    explanation: "Pada koneksi star, tegangan pada lilitan motor adalah 1/√3 dari tegangan line."
  },
  // ... tambahan soal quiz modul 2
];

export const practicalAssessment = {
  title: "Praktik Instalasi Motor Listrik Forward-Reverse",
  duration: "2 jam",
  maxScore: 100,
  passingScore: 80,
  rubric: [
    {
      aspect: "Persiapan dan K3",
      maxPoints: 15,
      criteria: [
        "Menyiapkan alat dan bahan dengan lengkap (5 poin)",
        "Menggunakan APD dengan benar (5 poin)",
        "Memeriksa kondisi keamanan area kerja (5 poin)"
      ]
    },
    {
      aspect: "Identifikasi Komponen",
      maxPoints: 15,
      criteria: [
        "Mengidentifikasi terminal motor dengan benar (5 poin)",
        "Memahami fungsi setiap komponen (5 poin)",
        "Memeriksa kondisi komponen sebelum digunakan (5 poin)"
      ]
    },
    {
      aspect: "Pemasangan Rangkaian Power",
      maxPoints: 25,
      criteria: [
        "Memasang MCB dan kontaktor dengan benar (10 poin)",
        "Koneksi motor sesuai diagram (10 poin)",
        "Pemasangan thermal overload yang tepat (5 poin)"
      ]
    },
    {
      aspect: "Pemasangan Rangkaian Control",
      maxPoints: 25,
      criteria: [
        "Rangkaian push button benar (8 poin)",
        "Sistem self-holding berfungsi (8 poin)",
        "Sistem interlock bekerja dengan baik (9 poin)"
      ]
    },
    {
      aspect: "Testing dan Troubleshooting",
      maxPoints: 15,
      criteria: [
        "Melakukan testing sistematis (5 poin)",
        "Motor berputar sesuai arah yang diinginkan (5 poin)",
        "Mampu melakukan troubleshooting sederhana (5 poin)"
      ]
    },
    {
      aspect: "Laporan dan Dokumentasi",
      maxPoints: 5,
      criteria: [
        "Dokumentasi hasil praktik (3 poin)",
        "Kebersihan area kerja (2 poin)"
      ]
    }
  ]
};

// Data materi pembelajaran dan job sheet
export const learningMaterials = [
  {
    id: 'teori-motor',
    title: 'Teori Dasar Motor Listrik 3 Fasa',
    type: 'PDF',
    size: '2.8 MB',
    description: 'Materi komprehensif tentang prinsip kerja, konstruksi, dan karakteristik motor induksi 3 fasa',
    topics: [
      'Prinsip induksi elektromagnetik',
      'Konstruksi motor induksi',
      'Karakteristik torsi-kecepatan',
      'Efisiensi dan faktor daya motor'
    ]
  },
  {
    id: 'rangkaian-kontrol',
    title: 'Sistem Kontrol Motor Listrik',
    type: 'PDF',
    size: '3.2 MB',
    description: 'Panduan lengkap sistem kontrol motor dari rangkaian sederhana hingga kompleks',
    topics: [
      'Rangkaian DOL (Direct On Line)',
      'Sistem Star-Delta',
      'Forward-Reverse Control',
      'Soft Starter dan VFD'
    ]
  },
  {
    id: 'video-tutorial',
    title: 'Video Tutorial Instalasi Praktis',
    type: 'Video',
    duration: '45 menit',
    description: 'Tutorial video step-by-step instalasi motor listrik 3 fasa',
    chapters: [
      'Persiapan dan K3',
      'Identifikasi komponen',
      'Pemasangan rangkaian power',
      'Pemasangan rangkaian control',
      'Testing dan commissioning'
    ]
  },
  {
    id: 'simulator',
    title: 'Simulator Motor 3 Fasa Interaktif',
    type: 'Interactive',
    description: 'Simulasi interaktif untuk memahami prinsip kerja motor 3 fasa',
    features: [
      'Visualisasi medan putar',
      'Simulasi berbagai beban',
      'Analisis karakteristik motor',
      'Virtual troubleshooting'
    ]
  }
];

export const jobSheets = [
  {
    id: 'js-001',
    title: 'Identifikasi Komponen Motor Listrik',
    code: 'JS.001',
    objective: 'Mengidentifikasi dan memahami fungsi komponen-komponen motor listrik 3 fasa',
    duration: '2 jam',
    difficulty: 'Dasar',
    tools: ['Multimeter', 'Motor 3 fasa', 'Toolset dasar'],
    materials: ['Motor induksi 3 fasa', 'Manual motor', 'Nameplate'],
    safetyRequirements: [
      'Pastikan motor tidak terhubung ke sumber listrik',
      'Gunakan APD lengkap',
      'Periksa kondisi alat ukur sebelum digunakan'
    ],
    procedures: [
      {
        step: 1,
        title: 'Identifikasi Nameplate Motor',
        description: 'Catat semua data pada nameplate motor',
        details: [
          'Tegangan nominal (V)',
          'Arus nominal (A)',
          'Daya nominal (kW/HP)',
          'Kecepatan nominal (RPM)',
          'Frekuensi nominal (Hz)',
          'Faktor daya (cos φ)'
        ]
      },
      {
        step: 2,
        title: 'Identifikasi Terminal Motor',
        description: 'Identifikasi dan tandai terminal motor',
        details: [
          'Terminal U1, V1, W1 (ujung awal lilitan)',
          'Terminal U2, V2, W2 (ujung akhir lilitan)',
          'Terminal PE (protective earth)'
        ]
      },
      {
        step: 3,
        title: 'Pengukuran Tahanan Lilitan',
        description: 'Ukur tahanan isolasi dan kontinuitas lilitan',
        details: [
          'Ukur tahanan antar lilitan (U1-V1, V1-W1, W1-U1)',
          'Ukur tahanan isolasi (lilitan ke body)',
          'Periksa kontinuitas setiap lilitan'
        ]
      },
      {
        step: 4,
        title: 'Inspeksi Visual',
        description: 'Lakukan inspeksi visual kondisi motor',
        details: [
          'Periksa kondisi terminal box',
          'Periksa kondisi bearing (dengarkan suara)',
          'Periksa kebersihan motor dari debu/kotoran',
          'Periksa kondisi kabel internal'
        ]
      }
    ],
    assessment: {
      type: 'practical',
      criteria: [
        'Ketepatan identifikasi nameplate (25%)',
        'Ketepatan identifikasi terminal (25%)',
        'Keakuratan pengukuran (25%)',
        'Kualitas inspeksi visual (25%)'
      ]
    }
  },
  {
    id: 'js-002',
    title: 'Rangkaian DOL Motor 3 Fasa',
    code: 'JS.002',
    objective: 'Membuat rangkaian Direct On Line untuk motor 3 fasa dengan sistem kontrol yang lengkap',
    duration: '3 jam',
    difficulty: 'Menengah',
    tools: ['Obeng set', 'Tang kombinasi', 'Multimeter', 'Test pen', 'Kabel stripper'],
    materials: [
      'Motor 3 fasa 220V/380V',
      'Kontaktor 3 fasa',
      'MCB 3 fasa',
      'Thermal overload relay',
      'Push button START (NO)',
      'Push button STOP (NC)',
      'Lampu indikator',
      'Kabel NYAF 1.5mm²'
    ],
    safetyRequirements: [
      'Pastikan MCB dalam posisi OFF saat merangkai',
      'Gunakan APD lengkap (safety shoes, safety glasses)',
      'Periksa kondisi semua komponen sebelum digunakan',
      'Pastikan grounding motor terpasang dengan baik'
    ],
    procedures: [
      {
        step: 1,
        title: 'Persiapan Komponen',
        description: 'Siapkan dan periksa semua komponen yang diperlukan',
        details: [
          'Layout komponen pada panel/papan praktik',
          'Periksa rating tegangan dan arus semua komponen',
          'Pastikan semua terminal dalam kondisi baik',
          'Siapkan diagram rangkaian sebagai referensi'
        ]
      },
      {
        step: 2,
        title: 'Pemasangan Rangkaian Power',
        description: 'Pasang rangkaian power (daya) motor',
        details: [
          'Pasang MCB 3 fasa sebagai sumber utama',
          'Hubungkan output MCB ke input kontaktor (L1, L2, L3)',
          'Hubungkan output kontaktor ke thermal overload relay',
          'Hubungkan output thermal overload ke terminal motor (U1, V1, W1)',
          'Pasang grounding motor ke terminal PE'
        ]
      },
      {
        step: 3,
        title: 'Pemasangan Rangkaian Control',
        description: 'Pasang rangkaian kontrol motor',
        details: [
          'Ambil tegangan kontrol dari L1 dan N',
          'Pasang push button STOP (NC) secara seri dengan coil kontaktor',
          'Pasang push button START (NO) paralel dengan auxiliary contact kontaktor',
          'Hubungkan auxiliary contact untuk self-holding',
          'Pasang lampu indikator paralel dengan coil kontaktor'
        ]
      },
      {
        step: 4,
        title: 'Setting Thermal Overload',
        description: 'Setel thermal overload relay sesuai arus nominal motor',
        details: [
          'Baca arus nominal motor dari nameplate',
          'Setel thermal overload pada nilai arus nominal motor',
          'Hubungkan kontak NC thermal overload secara seri dengan rangkaian kontrol',
          'Test manual thermal overload dengan menekan tombol test'
        ]
      },
      {
        step: 5,
        title: 'Testing dan Commissioning',
        description: 'Lakukan testing lengkap rangkaian',
        details: [
          'Periksa kontinuitas rangkaian dengan multimeter',
          'Periksa isolasi rangkaian terhadap ground',
          'Test fungsi push button dan auxiliary contact',
          'Energize rangkaian dan test operasi motor',
          'Ukur arus motor saat beroperasi',
          'Test fungsi thermal overload'
        ]
      }
    ],
    assessment: {
      type: 'practical',
      criteria: [
        'Ketepatan rangkaian power (30%)',
        'Ketepatan rangkaian control (30%)',
        'Setting thermal overload (15%)',
        'Hasil testing (20%)',
        'Keselamatan kerja (5%)'
      ]
    }
  },
  {
    id: 'js-003',
    title: 'Instalasi Motor Forward-Reverse',
    code: 'JS.003',
    objective: 'Memasang sistem kontrol motor 3 fasa dengan kemampuan forward-reverse dan sistem interlock',
    duration: '4 jam',
    difficulty: 'Lanjutan',
    tools: ['Obeng set', 'Tang kombinasi', 'Multimeter', 'Clamp meter', 'Test pen'],
    materials: [
      'Motor 3 fasa',
      'Kontaktor forward',
      'Kontaktor reverse',
      'MCB 3 fasa',
      'Thermal overload relay',
      'Push button START',
      'Push button STOP',
      'Push button FORWARD',
      'Push button REVERSE',
      'Lampu indikator FWD dan REV',
      'Emergency stop button'
    ],
    safetyRequirements: [
      'Pastikan sistem grounding terpasang dengan baik',
      'Gunakan emergency stop yang mudah diakses',
      'Test sistem interlock sebelum operasi penuh',
      'Pastikan tidak ada tools tertinggal di dalam panel'
    ],
    procedures: [
      {
        step: 1,
        title: 'Analisis Rangkaian',
        description: 'Pelajari diagram rangkaian forward-reverse',
        details: [
          'Pahami prinsip kerja rangkaian forward-reverse',
          'Identifikasi sistem interlock yang diperlukan',
          'Tentukan sequence operasi yang aman',
          'Siapkan layout komponen yang optimal'
        ]
      },
      {
        step: 2,
        title: 'Pemasangan Rangkaian Power',
        description: 'Pasang rangkaian power dengan 2 kontaktor',
        details: [
          'Pasang MCB sebagai sumber utama',
          'Hubungkan kedua kontaktor dengan supply yang sama',
          'Atur crossing fasa pada kontaktor reverse (tukar 2 fasa)',
          'Pasang thermal overload setelah kontaktor',
          'Hubungkan ke terminal motor'
        ]
      },
      {
        step: 3,
        title: 'Pemasangan Sistem Interlock',
        description: 'Pasang sistem interlock untuk mencegah konflik',
        details: [
          'Gunakan auxiliary contact NC dari kontaktor forward untuk mengunci reverse',
          'Gunakan auxiliary contact NC dari kontaktor reverse untuk mengunci forward',
          'Pastikan kedua kontaktor tidak dapat aktif bersamaan',
          'Test sistem interlock secara manual'
        ]
      },
      {
        step: 4,
        title: 'Pemasangan Rangkaian Control',
        description: 'Lengkapi rangkaian kontrol dengan selector dan indikator',
        details: [
          'Pasang push button STOP sebagai master stop',
          'Pasang push button FORWARD dan REVERSE',
          'Tambahkan emergency stop',
          'Pasang lampu indikator untuk setiap arah',
          'Hubungkan thermal overload ke rangkaian kontrol'
        ]
      },
      {
        step: 5,
        title: 'Testing Komprehensif',
        description: 'Test semua fungsi rangkaian secara menyeluruh',
        details: [
          'Test emergency stop dari berbagai kondisi operasi',
          'Test switching dari forward ke reverse dan sebaliknya',
          'Ukur arus pada setiap fasa saat operasi',
          'Test fungsi thermal overload',
          'Verifikasi arah putaran motor sesuai tombol yang ditekan',
          'Test sistem interlock dalam berbagai skenario'
        ]
      }
    ],
    assessment: {
      type: 'practical',
      criteria: [
        'Sistem interlock bekerja dengan baik (25%)',
        'Ketepatan arah putaran motor (20%)',
        'Kelengkapan sistem safety (20%)',
        'Kualitas wiring dan finishing (15%)',
        'Hasil testing dan troubleshooting (20%)'
      ]
    }
  },
  {
    id: 'js-004',
    title: 'Testing dan Commissioning Motor',
    code: 'JS.004',
    objective: 'Melakukan testing lengkap dan commissioning instalasi motor listrik sesuai standard industri',
    duration: '3 jam',
    difficulty: 'Lanjutan',
    tools: [
      'Multimeter digital',
      'Clamp meter',
      'Megger (insulation tester)',
      'Oscilloscope (jika tersedia)',
      'Thermometer infrared',
      'Tachometer'
    ],
    materials: [
      'Instalasi motor yang sudah terpasang',
      'Form checklist testing',
      'Log book commissioning'
    ],
    safetyRequirements: [
      'Pastikan semua peralatan testing dikalibrasi',
      'Gunakan PPE lengkap saat testing',
      'Pastikan area testing aman dari personel lain',
      'Siapkan emergency procedure'
    ],
    procedures: [
      {
        step: 1,
        title: 'Pre-Commissioning Check',
        description: 'Pemeriksaan awal sebelum energizing',
        details: [
          'Visual inspection semua koneksi',
          'Pemeriksaan torsi baut terminal',
          'Test kontinuitas rangkaian',
          'Pemeriksaan grounding system',
          'Verifikasi setting protection devices'
        ]
      },
      {
        step: 2,
        title: 'Insulation Testing',
        description: 'Test isolasi menggunakan megger',
        details: [
          'Test isolasi motor (phase to phase)',
          'Test isolasi motor (phase to ground)',
          'Test isolasi cable',
          'Dokumentasi hasil pengukuran',
          'Evaluasi hasil terhadap standard'
        ]
      },
      {
        step: 3,
        title: 'Functional Testing',
        description: 'Test fungsi operasional sistem',
        details: [
          'Test push button dan selector switch',
          'Test emergency stop dari berbagai kondisi',
          'Test lampu indikator dan alarm',
          'Test sistem interlock',
          'Test protection devices (overload, short circuit)'
        ]
      },
      {
        step: 4,
        title: 'Performance Testing',
        description: 'Test performance motor saat beroperasi',
        details: [
          'Pengukuran arus pada semua fasa',
          'Pengukuran tegangan pada terminal motor',
          'Pengukuran kecepatan motor (RPM)',
          'Pengukuran temperature motor saat operasi',
          'Analisis vibration (jika alat tersedia)'
        ]
      },
      {
        step: 5,
        title: 'Load Testing dan Documentation',
        description: 'Test dengan beban dan dokumentasi hasil',
        details: [
          'Test motor dengan berbagai level beban',
          'Monitor current vs load characteristic',
          'Test thermal overload trip',
          'Dokumentasi semua hasil test',
          'Membuat laporan commissioning',
          'Serah terima sistem ke operator'
        ]
      }
    ],
    assessment: {
      type: 'practical',
      criteria: [
        'Kelengkapan pre-commissioning check (20%)',
        'Keakuratan insulation testing (20%)',
        'Sistematika functional testing (20%)',
        'Ketelitian performance measurement (20%)',
        'Kualitas dokumentasi (20%)'
      ]
    }
  }
];

// Export gabungan untuk kemudahan penggunaan
export const imlAssessments = {
  preTest: {
    type: 'Pre-Test',
    title: 'Pre-Test IML',
    description: 'Tes awal untuk mengukur pemahaman dasar sebelum pembelajaran',
    duration: '30 menit',
    questions: preTestQuestions
  },
  postTest: {
    type: 'Post-Test', 
    title: 'Post-Test IML',
    description: 'Tes akhir untuk mengukur pencapaian pembelajaran',
    duration: '60 menit',
    multipleChoice: {
      questions: postTestQuestions
    },
    essay: {
      questions: postTestEssays
    }
  },
  quiz: {
    type: 'Quiz',
    title: 'Quiz Interaktif',
    description: 'Kuis singkat untuk mengukur pemahaman per modul',
    modules: [
      {
        title: 'Quiz Modul 1 - Dasar Motor Listrik',
        type: 'Multiple Choice',
        questions: quizModule1
      },
      {
        title: 'Quiz Modul 2 - Instalasi & Wiring',
        type: 'Mixed',
        questions: quizModule2
      }
    ]
  },
  practicalAssessment: {
    type: 'Practical Assessment',
    title: 'Penilaian Praktik',
    description: 'Penilaian keterampilan praktis instalasi motor listrik',
    ...practicalAssessment
  },
  learningMaterials,
  jobSheets
};