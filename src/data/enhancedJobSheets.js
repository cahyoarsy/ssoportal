// Enhanced Job Sheets per Pertemuan untuk IML
// Struktur pembelajaran sistematis dengan checklist dan panduan step-by-step

export const enhancedJobSheets = [
  {
    id: 'pertemuan-1',
    session: 1,
    title: 'Pengenalan Motor Listrik dan Komponen',
    duration: '4 jam (2x pertemuan)',
    objectives: [
      'Memahami prinsip dasar motor listrik',
      'Mengidentifikasi komponen motor 3 fasa',
      'Membaca nameplate motor dengan benar',
      'Menggunakan alat ukur dasar untuk motor'
    ],
    theory_duration: '2 jam',
    practical_duration: '2 jam',
    
    pre_session: {
      preparation: [
        'Siapkan motor 3 fasa berbagai ukuran',
        'Multimeter digital',
        'Megger (insulation tester)',
        'Tang ampere (clamp meter)',
        'Toolset standar',
        'APD lengkap'
      ],
      safety_briefing: [
        'Penggunaan APD yang benar',
        'Prosedur LOTO (Lock Out Tag Out)',
        'Penanganan motor listrik yang aman',
        'Emergency procedures'
      ],
      knowledge_check: [
        'Apa itu motor induksi?',
        'Sebutkan komponen utama motor 3 fasa',
        'Jelaskan fungsi bearing pada motor'
      ]
    },

    theory_session: {
      topics: [
        {
          topic: 'Konsep Dasar Motor Listrik',
          duration: '30 menit',
          content: [
            'Definisi dan fungsi motor listrik',
            'Jenis-jenis motor listrik',
            'Aplikasi motor dalam industri',
            'Keunggulan motor 3 fasa'
          ],
          activities: [
            'Presentasi dengan video animasi',
            'Diskusi aplikasi motor di sekitar kita',
            'Quiz interaktif'
          ]
        },
        {
          topic: 'Konstruksi Motor 3 Fasa',
          duration: '45 menit',
          content: [
            'Stator: frame, core, winding',
            'Rotor: squirrel cage vs wound rotor',
            'Bearing system dan pelumasan',
            'Terminal box dan wiring'
          ],
          activities: [
            'Demonstrasi motor terbuka',
            'Video assembly motor',
            'Identifikasi komponen fisik'
          ]
        },
        {
          topic: 'Spesifikasi dan Rating Motor',
          duration: '30 menit',
          content: [
            'Membaca nameplate motor',
            'Parameter penting: daya, tegangan, arus',
            'Duty cycle dan class isolasi',
            'IP rating dan mounting'
          ],
          activities: [
            'Latihan membaca nameplate',
            'Perhitungan parameter motor',
            'Interpretasi kode motor'
          ]
        },
        {
          topic: 'Alat Ukur untuk Motor',
          duration: '15 menit',
          content: [
            'Multimeter: fungsi dan penggunaan',
            'Megger: testing isolasi',
            'Clamp meter: pengukuran arus',
            'Tachometer: pengukuran kecepatan'
          ]
        }
      ]
    },

    practical_session: {
      experiments: [
        {
          id: 'exp-1-1',
          title: 'Identifikasi Komponen Motor',
          duration: '45 menit',
          objective: 'Mengenal komponen motor secara fisik dan fungsinya',
          equipment: [
            'Motor 3 fasa (minimal 2 unit berbeda ukuran)',
            'Toolset untuk bongkar motor',
            'Camera untuk dokumentasi'
          ],
          safety_notes: [
            'Pastikan motor tidak terhubung dengan listrik',
            'Gunakan tools yang sesuai',
            'Hati-hati dengan bearing dan shaft'
          ],
          procedures: [
            {
              step: 1,
              action: 'Identifikasi Nameplate',
              description: 'Foto dan catat semua informasi pada nameplate motor',
              checklist: [
                '✓ Model/Type motor',
                '✓ Power rating (kW/HP)',
                '✓ Voltage rating',
                '✓ Current rating',
                '✓ Speed (RPM)',
                '✓ Frequency (Hz)',
                '✓ Power factor',
                '✓ Efficiency',
                '✓ Insulation class',
                '✓ IP rating',
                '✓ Duty cycle'
              ],
              expected_result: 'Data lengkap spesifikasi motor',
              troubleshooting: [
                'Jika nameplate tidak terbaca → bersihkan atau cari dokumentasi motor',
                'Jika ada kode yang tidak dimengerti → konsultasi dengan instruktur'
              ]
            },
            {
              step: 2,
              action: 'Inspeksi Terminal Box',
              description: 'Buka terminal box dan identifikasi terminal motor',
              checklist: [
                '✓ Buka terminal box dengan hati-hati',
                '✓ Identifikasi terminal U1, V1, W1',
                '✓ Identifikasi terminal U2, V2, W2 (jika ada)',
                '✓ Periksa kondisi terminal dan kabel',
                '✓ Identifikasi terminal grounding',
                '✓ Foto konfigurasi terminal'
              ],
              expected_result: 'Diagram terminal motor dan kondisi koneksi',
              safety_warning: 'Pastikan tidak ada tegangan pada terminal sebelum menyentuh'
            },
            {
              step: 3,
              action: 'Pengukuran Resistansi Belitan',
              description: 'Ukur resistansi belitan stator dengan multimeter',
              checklist: [
                '✓ Set multimeter pada mode resistansi (Ω)',
                '✓ Ukur R(U1-V1), catat nilai',
                '✓ Ukur R(V1-W1), catat nilai', 
                '✓ Ukur R(W1-U1), catat nilai',
                '✓ Bandingkan ketiga nilai resistansi',
                '✓ Ukur resistansi isolasi ke ground'
              ],
              expected_result: 'Resistansi antar fasa seimbang (selisih < 5%)',
              analysis: [
                'Resistansi seimbang → belitan normal',
                'Resistansi tidak seimbang → kemungkinan belitan rusak',
                'Resistansi sangat tinggi → kemungkinan putus',
                'Resistansi sangat rendah → kemungkinan hubung singkat'
              ]
            },
            {
              step: 4,
              action: 'Inspeksi Fisik Motor',
              description: 'Periksa kondisi fisik motor secara keseluruhan',
              checklist: [
                '✓ Kondisi casing dan cat',
                '✓ Kondisi fan dan cooling fins',
                '✓ Kondisi mounting feet',
                '✓ Kondisi shaft dan coupling',
                '✓ Periksa bearing (putar shaft manual)',
                '✓ Cek kebersihan motor',
                '✓ Identifikasi tanda-tanda overheating'
              ],
              assessment_criteria: [
                'Normal: tidak ada retak, korosi minimal, bearing halus',
                'Perlu perhatian: cat mulai pudar, sedikit korosi',
                'Perlu perbaikan: ada retak, korosi parah, bearing kasar'
              ]
            }
          ],
          data_recording: {
            motor_data_sheet: {
              fields: [
                'Motor ID/Serial Number',
                'Manufacturer & Model',
                'Power Rating (kW)',
                'Voltage Rating (V)',
                'Current Rating (A)',
                'Speed (RPM)',
                'Resistance U1-V1 (Ω)',
                'Resistance V1-W1 (Ω)',
                'Resistance W1-U1 (Ω)',
                'Insulation Resistance (MΩ)',
                'Physical Condition Rating (1-5)',
                'Notes/Observations'
              ]
            }
          },
          report_requirements: [
            'Tabel data motor lengkap',
            'Foto nameplate dan terminal box',
            'Analisis kondisi motor',
            'Rekomendasi tindak lanjut'
          ]
        },
        
        {
          id: 'exp-1-2',
          title: 'Testing Isolasi Motor dengan Megger',
          duration: '30 menit',
          objective: 'Melakukan test isolasi motor untuk memastikan keamanan operasi',
          equipment: [
            'Megger/Insulation tester 500V atau 1000V',
            'Motor yang akan ditest',
            'Kabel test megger',
            'Form recording data'
          ],
          theory_background: [
            'Insulasi motor menurun seiring waktu dan pemakaian',
            'Test isolasi mengukur tahanan antara belitan dengan ground',
            'Standar minimum isolasi: 1 MΩ + 1 MΩ per kV rating',
            'Test dilakukan dengan tegangan DC tinggi (500V-1000V)'
          ],
          procedures: [
            {
              step: 1,
              action: 'Persiapan Testing',
              description: 'Siapkan motor dan megger untuk testing isolasi',
              checklist: [
                '✓ Pastikan motor tidak terhubung ke sumber listrik',
                '✓ Tunggu minimal 5 menit setelah disconnect',
                '✓ Short semua terminal motor (U1-V1-W1)',
                '✓ Siapkan megger dan kabel test',
                '✓ Set tegangan test sesuai rating motor'
              ],
              safety_notes: [
                'Jangan sentuh terminal saat testing',
                'Pastikan area kerja kering',
                'Discharge motor setelah testing'
              ]
            },
            {
              step: 2,
              action: 'Pelaksanaan Test',
              description: 'Lakukan test isolasi dengan prosedur yang benar',
              checklist: [
                '✓ Hubungkan probe positif megger ke terminal motor',
                '✓ Hubungkan probe negatif ke body/ground motor',
                '✓ Tekan dan tahan tombol test pada megger',
                '✓ Tunggu hingga reading stabil (60 detik)',
                '✓ Catat nilai resistansi isolasi',
                '✓ Release tombol test',
                '✓ Discharge motor dengan probe ground'
              ],
              measurement_points: [
                'Belitan ke ground',
                'Terminal ke terminal (jika diperlukan)',
                'Belitan ke bearing (untuk motor besar)'
              ]
            }
          ],
          acceptance_criteria: [
            'Motor baru: > 100 MΩ',
            'Motor bekas kondisi baik: > 10 MΩ',
            'Motor minimum layak pakai: > 1 MΩ',
            'Motor perlu rewinding: < 1 MΩ'
          ],
          data_analysis: [
            'Nilai tinggi (>100 MΩ): Isolasi excellent',
            'Nilai sedang (10-100 MΩ): Isolasi good',
            'Nilai rendah (1-10 MΩ): Isolasi fair, perlu monitoring',
            'Nilai sangat rendah (<1 MΩ): Isolasi poor, tidak boleh dioperasikan'
          ]
        },

        {
          id: 'exp-1-3',
          title: 'Perhitungan Parameter Motor',
          duration: '45 menit',
          objective: 'Menghitung parameter penting motor berdasarkan nameplate dan pengukuran',
          procedures: [
            {
              step: 1,
              action: 'Perhitungan Daya dan Arus',
              exercises: [
                {
                  problem: 'Motor 3 fasa, 5.5 kW, 380V, cos φ = 0.85. Hitung arus nominal motor!',
                  solution_steps: [
                    'P = √3 × V × I × cos φ',
                    'I = P / (√3 × V × cos φ)',
                    'I = 5500 / (1.732 × 380 × 0.85)',
                    'I = 5500 / 559.1 = 9.84 A'
                  ],
                  verification: 'Bandingkan dengan arus nameplate motor'
                },
                {
                  problem: 'Motor dengan arus 15A, tegangan 380V, cos φ = 0.8. Hitung daya aktif motor!',
                  solution_steps: [
                    'P = √3 × V × I × cos φ',
                    'P = 1.732 × 380 × 15 × 0.8',
                    'P = 7,897 W ≈ 7.9 kW'
                  ]
                }
              ]
            },
            {
              step: 2,
              action: 'Perhitungan Kecepatan dan Slip',
              exercises: [
                {
                  problem: 'Motor 4 kutub, 50 Hz, kecepatan nameplate 1450 RPM. Hitung slip motor!',
                  solution_steps: [
                    'ns = 120f/p = 120×50/4 = 1500 RPM',
                    's = (ns-nr)/ns × 100%',
                    's = (1500-1450)/1500 × 100% = 3.33%'
                  ]
                },
                {
                  problem: 'Motor dengan slip 4% pada beban penuh, frekuensi 60 Hz, 6 kutub. Hitung kecepatan rotor!',
                  solution_steps: [
                    'ns = 120f/p = 120×60/6 = 1200 RPM',
                    'nr = ns × (1-s) = 1200 × (1-0.04) = 1152 RPM'
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    post_session: {
      assessment: {
        practical_skills: [
          'Kemampuan identifikasi komponen motor',
          'Teknik penggunaan alat ukur',
          'Interpretasi hasil pengukuran',
          'Penerapan prosedur K3'
        ],
        theory_quiz: [
          'Fungsi komponen motor 3 fasa',
          'Interpretasi nameplate motor',
          'Perhitungan parameter dasar motor',
          'Standar isolasi motor'
        ],
        grading_rubric: {
          'Excellent (90-100)': 'Menguasai semua aspek, bekerja mandiri, hasil akurat',
          'Good (80-89)': 'Menguasai sebagian besar aspek, sedikit bimbingan, hasil baik',
          'Satisfactory (70-79)': 'Menguasai aspek dasar, perlu bimbingan, hasil cukup',
          'Needs Improvement (<70)': 'Belum menguasai aspek dasar, perlu pengulangan'
        }
      },
      reflection: [
        'Apa yang sudah dipahami dengan baik?',
        'Aspek mana yang masih sulit?',
        'Bagaimana pengalaman menggunakan alat ukur?',
        'Apa yang ingin dipelajari lebih lanjut?'
      ],
      homework: [
        'Buat resume tentang jenis-jenis motor listrik',
        'Cari informasi motor listrik di lingkungan sekitar',
        'Pelajari standar IEC untuk motor listrik'
      ],
      preparation_next_session: [
        'Baca materi tentang kontaktor dan relay',
        'Siapkan pertanyaan tentang rangkaian kontrol',
        'Review symbol-symbol listrik standar'
      ]
    },

    instructor_notes: {
      key_points_to_emphasize: [
        'Pentingnya K3 dalam menangani motor listrik',
        'Interpretasi nameplate untuk aplikasi praktis',
        'Hubungan antara teori dan kondisi real motor',
        'Penggunaan alat ukur yang benar dan aman'
      ],
      common_student_difficulties: [
        'Membedakan terminal U1, V1, W1 dengan U2, V2, W2',
        'Interpretasi hasil pengukuran resistansi',
        'Perhitungan dengan formula 3 fasa',
        'Penggunaan megger yang benar'
      ],
      troubleshooting_guide: [
        'Motor tidak bisa diputar manual → bearing rusak atau shaft bend',
        'Resistansi tidak seimbang → kemungkinan belitan rusak',
        'Isolasi rendah → motor perlu dibersihkan atau rewinding',
        'Terminal tidak standar → konsultasi dokumentasi motor'
      ],
      safety_reminders: [
        'Selalu pastikan motor de-energized sebelum pengukuran',
        'Gunakan APD lengkap terutama saat menggunakan megger',
        'Jangan biarkan siswa bekerja sendiri dengan peralatan berbahaya',
        'Pastikan area kerja bersih dan aman'
      ]
    }
  },

  {
    id: 'pertemuan-2',
    session: 2,
    title: 'Rangkaian Kontrol Motor - Komponen dan Dasar',
    duration: '4 jam',
    objectives: [
      'Memahami fungsi komponen kontrol motor',
      'Membuat rangkaian DOL (Direct On Line)',
      'Memahami sistem interlock dan safety',
      'Menggunakan kontaktor dan relay dengan benar'
    ],
    
    theory_session: {
      topics: [
        {
          topic: 'Komponen Kontrol Motor',
          duration: '60 menit',
          content: [
            'Kontaktor: konstruksi dan prinsip kerja',
            'Thermal overload relay: fungsi dan setting',
            'Push button dan selector switch',
            'MCB dan fuse sebagai proteksi',
            'Auxiliary contact dan interlock'
          ]
        },
        {
          topic: 'Sistem DOL (Direct On Line)',
          duration: '45 menit', 
          content: [
            'Prinsip starting DOL',
            'Kelebihan dan kekurangan DOL',
            'Aplikasi yang sesuai untuk DOL',
            'Perhitungan arus starting'
          ]
        }
      ]
    },

    practical_session: {
      experiments: [
        {
          id: 'exp-2-1',
          title: 'Identifikasi dan Testing Komponen Kontrol',
          duration: '90 menit',
          equipment: [
            'Kontaktor 3 fasa berbagai ukuran',
            'Thermal overload relay',
            'Push button NO dan NC',
            'MCB 3 fasa',
            'Multimeter',
            'Megger'
          ],
          procedures: [
            {
              step: 1,
              action: 'Testing Kontaktor',
              checklist: [
                '✓ Identifikasi terminal main contact (L1,L2,L3 - T1,T2,T3)',
                '✓ Identifikasi terminal coil (A1, A2)',
                '✓ Identifikasi auxiliary contact (NO dan NC)',
                '✓ Test kontinuitas main contact (saat tidak energized)',
                '✓ Test kontinuitas auxiliary contact',
                '✓ Test isolasi coil dengan multimeter',
                '✓ Test operasi manual (jika ada)'
              ]
            }
          ]
        },
        {
          id: 'exp-2-2',
          title: 'Merakit Rangkaian DOL',
          duration: '120 menit',
          objective: 'Membuat rangkaian DOL lengkap dengan proteksi dan kontrol',
          wiring_diagram: 'Diagram lengkap power dan control circuit',
          procedures: [
            {
              step: 1,
              action: 'Wiring Power Circuit',
              description: 'Merakit rangkaian daya untuk motor',
              checklist: [
                '✓ Pasang MCB 3 fasa sebagai main switch',
                '✓ Hubungkan MCB ke kontaktor (L1,L2,L3)',
                '✓ Hubungkan kontaktor ke thermal overload',
                '✓ Hubungkan overload ke motor terminal',
                '✓ Pasang grounding wire ke motor',
                '✓ Check ketat semua koneksi'
              ]
            },
            {
              step: 2,
              action: 'Wiring Control Circuit', 
              description: 'Merakit rangkaian kontrol start-stop',
              checklist: [
                '✓ Ambil supply kontrol dari phase L1 dan N',
                '✓ Pasang MCB kontrol sebagai proteksi',
                '✓ Hubungkan push button STOP (NC) secara seri',
                '✓ Hubungkan push button START (NO) parallel dengan aux contact',
                '✓ Hubungkan overload contact (NC) secara seri',
                '✓ Hubungkan ke coil kontaktor (A1, A2)'
              ]
            }
          ]
        }
      ]
    }
  },

  {
    id: 'pertemuan-3',
    session: 3,
    title: 'Rangkaian Forward-Reverse dan Star-Delta',
    duration: '4 jam',
    objectives: [
      'Merancang rangkaian forward-reverse dengan interlock',
      'Memahami sistem Star-Delta starting',
      'Implementasi timer dalam rangkaian kontrol',
      'Troubleshooting rangkaian kontrol motor'
    ]
  },

  {
    id: 'pertemuan-4',
    session: 4,
    title: 'Instalasi Motor dan K3',
    duration: '4 jam',
    objectives: [
      'Merencanakan instalasi motor yang benar',
      'Melakukan grounding dan proteksi yang tepat',
      'Menerapkan prosedur K3 dalam instalasi',
      'Dokumentasi instalasi sesuai standar'
    ]
  },

  {
    id: 'pertemuan-5',
    session: 5,
    title: 'Testing dan Commissioning Motor',
    duration: '4 jam',
    objectives: [
      'Melakukan testing lengkap motor dan rangkaian',
      'Commissioning motor untuk operasi normal',
      'Mengukur parameter operasi motor',
      'Membuat laporan commissioning'
    ]
  },

  {
    id: 'pertemuan-6',
    session: 6,
    title: 'Troubleshooting dan Maintenance Motor',
    duration: '4 jam',
    objectives: [
      'Mendiagnosis masalah motor yang umum terjadi',
      'Melakukan maintenance preventif motor',
      'Menggunakan tools diagnostik motor',
      'Merencanakan program maintenance'
    ]
  },

  {
    id: 'pertemuan-7',
    session: 7,
    title: 'Project Instalasi Motor Komprehensif',
    duration: '4 jam',
    objectives: [
      'Merancang instalasi motor sesuai spesifikasi',
      'Mengimplementasikan rangkaian kontrol kompleks',
      'Melakukan testing dan commissioning lengkap',
      'Presentasi hasil project'
    ]
  },

  {
    id: 'pertemuan-8',
    session: 8,
    title: 'Evaluasi Akhir dan Assessment Praktik',
    duration: '4 jam',
    objectives: [
      'Demonstrasi kompetensi instalasi motor',
      'Assessment praktik dengan rubrik standar',
      'Evaluasi pembelajaran dan feedback',
      'Sertifikasi kompetensi'
    ]
  }
];

// Checklist Template untuk setiap pertemuan
export const sessionChecklistTemplate = {
  preparation: {
    instructor: [
      '□ Materi presentasi siap',
      '□ Equipment dan tools tersedia',
      '□ Safety equipment cukup',
      '□ Workspace aman dan bersih',
      '□ Assessment rubric siap'
    ],
    student: [
      '□ Membaca materi pre-session',
      '□ Membawa APD lengkap',
      '□ Membawa alat tulis dan kalkulator',
      '□ Siap dengan pertanyaan',
      '□ Form laporan siap'
    ]
  },
  during_session: {
    theory: [
      '□ Opening dan review session sebelumnya',
      '□ Presentasi materi dengan interaktif',
      '□ Q&A session',
      '□ Knowledge check quiz',
      '□ Persiapan praktik'
    ],
    practical: [
      '□ Safety briefing',
      '□ Demonstrasi prosedur',
      '□ Student practice dengan supervision',
      '□ Data recording dan analysis', 
      '□ Cleanup dan storage equipment'
    ]
  },
  post_session: [
    '□ Assessment dan grading',
    '□ Individual feedback',
    '□ Reflection dan discussion',
    '□ Assignment untuk session berikutnya',
    '□ Equipment check dan maintenance'
  ]
};