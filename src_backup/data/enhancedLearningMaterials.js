// Enhanced Learning Materials untuk IML
// Perpanjang konten menjadi materi lengkap dengan multimedia dan interaktif

export const enhancedLearningMaterials = [
  {
    id: 'material-1',
    title: 'Dasar-Dasar Motor Listrik',
    description: 'Pengenalan komprehensif motor listrik 3 fasa, komponen, dan prinsip kerja',
    type: 'comprehensive',
    duration: '8 jam',
    level: 'beginner',
    topics: [
      'Pengenalan Motor Listrik',
      'Jenis dan Klasifikasi Motor',
      'Komponen Motor 3 Fasa',
      'Prinsip Kerja Motor Induksi',
      'Spesifikasi dan Rating Motor',
      'Karakteristik Motor'
    ],
    content: {
      modules: [
        {
          id: 'module-1-1',
          title: 'Pengenalan Motor Listrik',
          type: 'interactive-presentation',
          content: {
            introduction: {
              overview: 'Motor listrik adalah mesin yang mengkonversi energi listrik menjadi energi mekanik dalam bentuk putaran. Motor 3 fasa merupakan jenis motor yang paling banyak digunakan dalam industri karena efisiensi tinggi dan konstruksi yang sederhana.',
              objectives: [
                'Memahami definisi dan fungsi motor listrik',
                'Mengenal jenis-jenis motor listrik',
                'Memahami keunggulan motor 3 fasa',
                'Mengenal aplikasi motor dalam industri'
              ],
              prerequisites: [
                'Pengetahuan dasar listrik AC/DC',
                'Pemahaman tentang elektromagnetisme',
                'Konsep daya listrik'
              ]
            },
            sections: [
              {
                title: 'Definisi Motor Listrik',
                content: 'Motor listrik adalah mesin rotasi yang mengkonversi energi listrik menjadi energi mekanik. Proses konversi ini terjadi melalui interaksi medan magnet dan arus listrik sesuai dengan hukum Lorentz.',
                multimedia: {
                  images: [
                    {
                      src: '/images/motor-concept.jpg',
                      caption: 'Konsep dasar konversi energi pada motor listrik',
                      description: 'Diagram menunjukkan alur konversi energi listrik menjadi energi mekanik'
                    }
                  ],
                  videos: [
                    {
                      src: '/videos/motor-basics.mp4',
                      title: 'Prinsip Dasar Motor Listrik',
                      duration: '5:30',
                      description: 'Video animasi menjelaskan bagaimana motor listrik bekerja'
                    }
                  ],
                  animations: [
                    {
                      type: 'interactive-3d',
                      title: 'Model 3D Motor Listrik',
                      description: 'Model interaktif yang dapat diputar untuk melihat komponen motor'
                    }
                  ]
                },
                keyPoints: [
                  'Konversi energi listrik → energi mekanik',
                  'Prinsip elektromagnetisme',
                  'Efisiensi tinggi (85-95%)',
                  'Dapat dikontrol dengan presisi'
                ],
                examples: [
                  {
                    title: 'Perhitungan Daya Motor',
                    problem: 'Motor dengan arus 10A, tegangan 380V, cos φ = 0.85, berapa daya yang dikonsumsi?',
                    solution: {
                      formula: 'P = √3 × V × I × cos φ',
                      calculation: 'P = 1.732 × 380 × 10 × 0.85 = 5,597W ≈ 5.6 kW',
                      explanation: 'Daya 3 fasa dihitung dengan mempertimbangkan faktor √3 dan power factor'
                    }
                  }
                ]
              },
              {
                title: 'Klasifikasi Motor Listrik',
                content: 'Motor listrik diklasifikasikan berdasarkan beberapa kriteria: sumber listrik (AC/DC), konstruksi, kecepatan, dan aplikasi.',
                classification: {
                  'Berdasarkan Sumber Listrik': {
                    'Motor DC': {
                      types: ['DC Brush (dengan sikat)', 'DC Brushless (tanpa sikat)'],
                      characteristics: ['Kontrol kecepatan mudah', 'Torsi starting tinggi', 'Memerlukan maintenance brush'],
                      applications: ['Kendaraan listrik', 'Robotik', 'Conveyor presisi']
                    },
                    'Motor AC': {
                      types: ['Motor Induksi', 'Motor Sinkron', 'Motor Universal'],
                      characteristics: ['Konstruksi sederhana', 'Maintenance minimal', 'Biaya operasi rendah'],
                      applications: ['Pompa', 'Fan', 'Kompresor', 'Conveyor']
                    }
                  },
                  'Berdasarkan Fasa': {
                    'Motor 1 Fasa': {
                      power_range: '0.1 - 3 kW',
                      applications: ['Peralatan rumah tangga', 'Workshop kecil'],
                      advantages: ['Sumber listrik mudah didapat', 'Biaya instalasi rendah'],
                      disadvantages: ['Efisiensi lebih rendah', 'Torsi starting rendah']
                    },
                    'Motor 3 Fasa': {
                      power_range: '0.5 kW - beberapa MW',
                      applications: ['Industri berat', 'HVAC', 'Sistem transportasi'],
                      advantages: ['Efisiensi tinggi', 'Torsi konstan', 'Getaran minimal'],
                      disadvantages: ['Memerlukan sumber 3 fasa', 'Biaya instalasi lebih tinggi']
                    }
                  }
                },
                comparison_table: {
                  headers: ['Aspek', 'Motor DC', 'Motor AC 1 Fasa', 'Motor AC 3 Fasa'],
                  rows: [
                    ['Efisiensi', '85-90%', '75-85%', '85-95%'],
                    ['Biaya Awal', 'Tinggi', 'Rendah', 'Sedang'],
                    ['Maintenance', 'Tinggi', 'Rendah', 'Rendah'],
                    ['Kontrol Kecepatan', 'Mudah', 'Kompleks', 'Sedang'],
                    ['Torsi Starting', 'Tinggi', 'Rendah', 'Sedang-Tinggi'],
                    ['Aplikasi Utama', 'Presisi, Mobile', 'Rumah tangga', 'Industri']
                  ]
                }
              },
              {
                title: 'Komponen Motor 3 Fasa',
                content: 'Motor induksi 3 fasa terdiri dari komponen utama dan pendukung yang bekerja sama menghasilkan putaran.',
                components: {
                  'Stator (Bagian Diam)': {
                    parts: {
                      'Frame/Casing': {
                        material: 'Cast iron, Aluminum, Steel',
                        function: 'Melindungi komponen internal, mounting motor',
                        features: ['Ribs untuk cooling', 'Mounting feet', 'Terminal box']
                      },
                      'Stator Core': {
                        material: 'Laminated silicon steel',
                        function: 'Jalur untuk fluks magnet',
                        features: ['Slots untuk belitan', 'Minimize eddy current losses']
                      },
                      'Stator Winding': {
                        material: 'Copper atau Aluminum',
                        function: 'Menghasilkan medan magnet putar',
                        configuration: ['Star (Y)', 'Delta (Δ)'],
                        insulation_class: ['Class A (105°C)', 'Class B (130°C)', 'Class F (155°C)', 'Class H (180°C)']
                      }
                    },
                    technical_details: {
                      slots: 'Jumlah slot = 2 × kutub × fasa (umum)',
                      winding_pitch: 'Full pitch atau short pitch',
                      insulation: 'Grade H paling umum digunakan'
                    }
                  },
                  'Rotor (Bagian Berputar)': {
                    types: {
                      'Squirrel Cage Rotor': {
                        construction: 'Batang konduktor dihubungkan dengan end rings',
                        material: 'Aluminum atau Copper',
                        advantages: ['Konstruksi sederhana', 'Biaya rendah', 'Maintenance minimal'],
                        disadvantages: ['Arus starting tinggi', 'Kontrol kecepatan terbatas'],
                        applications: ['Aplikasi standar industri', 'Beban konstan']
                      },
                      'Wound Rotor': {
                        construction: 'Belitan 3 fasa dihubungkan ke slip rings',
                        advantages: ['Arus starting rendah', 'Torsi starting tinggi', 'Kontrol kecepatan variabel'],
                        disadvantages: ['Konstruksi kompleks', 'Maintenance slip rings', 'Biaya tinggi'],
                        applications: ['Starting beban berat', 'Aplikasi variabel speed']
                      }
                    }
                  },
                  'Bearing System': {
                    types: {
                      'Ball Bearing': {
                        applications: 'Motor kecil-menengah (< 50 kW)',
                        characteristics: ['Low friction', 'High speed capability', 'Moderate load capacity']
                      },
                      'Roller Bearing': {
                        applications: 'Motor besar (> 50 kW)',
                        characteristics: ['High load capacity', 'Lower speed', 'Higher friction']
                      },
                      'Sleeve Bearing': {
                        applications: 'Motor besar, low speed',
                        characteristics: ['Very high load capacity', 'Require oil lubrication', 'Low noise']
                      }
                    },
                    lubrication: {
                      grease: 'Untuk bearing kecil-menengah',
                      oil: 'Untuk bearing besar dan high speed',
                      maintenance_interval: '2000-8000 jam operasi'
                    }
                  }
                },
                interactive_elements: {
                  '3d_exploded_view': {
                    description: 'Model 3D motor yang dapat dibongkar-pasang virtual',
                    features: ['Zoom in/out', 'Rotate 360°', 'Hide/show components', 'Component information']
                  },
                  'assembly_simulation': {
                    description: 'Simulasi proses assembly motor step-by-step',
                    steps: ['Frame preparation', 'Stator installation', 'Rotor insertion', 'End cover assembly', 'Terminal box wiring']
                  }
                }
              }
            ]
          }
        },
        {
          id: 'module-1-2', 
          title: 'Prinsip Kerja Motor Induksi',
          type: 'simulation-based',
          content: {
            theory: {
              electromagnetic_induction: {
                faraday_law: 'EMF yang diinduksi sebanding dengan laju perubahan fluks magnet',
                lenz_law: 'Arah EMF induksi berlawanan dengan perubahan yang menyebabkannya',
                application_in_motor: 'Medan magnet putar stator menginduksi EMF pada rotor'
              },
              rotating_magnetic_field: {
                concept: 'Tiga belitan stator dengan arus 3 fasa menghasilkan medan magnet yang berputar',
                mathematics: {
                  field_equation: 'B = Bm cos(ωt - θ)',
                  synchronous_speed: 'ns = 120f/p RPM',
                  variables: {
                    'ω': 'Kecepatan angular (rad/s)',
                    'f': 'Frekuensi (Hz)', 
                    'p': 'Jumlah kutub'
                  }
                }
              },
              slip_concept: {
                definition: 'Perbedaan relatif antara kecepatan medan putar dengan kecepatan rotor',
                formula: 's = (ns - nr)/ns × 100%',
                typical_values: {
                  'no_load': '0.5 - 1%',
                  'full_load': '2 - 5%',
                  'starting': '100%'
                },
                significance: 'Slip diperlukan untuk induksi EMF dan menghasilkan torsi'
              }
            },
            step_by_step_operation: [
              {
                step: 1,
                title: 'Pembangkitan Medan Magnet Putar',
                description: 'Arus 3 fasa pada belitan stator menghasilkan medan magnet yang berputar dengan kecepatan sinkron',
                visual_aids: ['Vector diagram arus 3 fasa', 'Animasi medan magnet putar'],
                formula: 'ns = 120f/p',
                example: 'Motor 4 kutub, 50 Hz: ns = 120×50/4 = 1500 RPM'
              },
              {
                step: 2, 
                title: 'Induksi EMF pada Rotor',
                description: 'Medan magnet putar memotong konduktor rotor dan menginduksi EMF sesuai hukum Faraday',
                factors_affecting: ['Kecepatan relatif (slip)', 'Kekuatan medan magnet', 'Jumlah konduktor rotor'],
                formula: 'E = Blv (untuk konduktor lurus)',
                note: 'EMF maksimum saat starting (slip = 100%)'
              },
              {
                step: 3,
                title: 'Aliran Arus Rotor', 
                description: 'EMF yang diinduksi menyebabkan arus mengalir pada konduktor rotor',
                rotor_equivalent_circuit: {
                  resistance: 'R2 (resistance konduktor rotor)',
                  reactance: 'X2 = 2πfL2 (reactance rotor)',
                  frequency: 'Frekuensi rotor = slip × frekuensi stator'
                },
                current_formula: 'I2 = E2/√(R2² + (sX2)²)'
              },
              {
                step: 4,
                title: 'Pembangkitan Torsi',
                description: 'Interaksi arus rotor dengan medan magnet stator menghasilkan gaya dan torsi',
                torque_equation: 'T = K × Φ × I2 × cos(φ2)',
                variables: {
                  'K': 'Konstanta konstruksi motor',
                  'Φ': 'Fluks magnet per kutub', 
                  'I2': 'Arus rotor',
                  'cos(φ2)': 'Power factor rotor'
                },
                torque_characteristics: {
                  'starting_torque': '150-250% torsi nominal',
                  'pull_up_torque': 'Torsi minimum selama akselerasi',
                  'breakdown_torque': '200-300% torsi nominal (maksimum)',
                  'full_load_torque': '100% (torsi nominal)'
                }
              }
            ],
            interactive_simulations: [
              {
                title: 'Simulasi Medan Magnet Putar',
                description: 'Visualisasi interaktif bagaimana 3 fasa menghasilkan medan putar',
                controls: ['Frekuensi', 'Amplitudo', 'Fase sequence'],
                learning_outcomes: ['Memahami konsep medan putar', 'Efek perubahan frekuensi', 'Pentingnya urutan fasa']
              },
              {
                title: 'Karakteristik Torsi-Kecepatan',
                description: 'Grafik interaktif menunjukkan hubungan torsi vs kecepatan',
                parameters: ['Tegangan', 'Frekuensi', 'Resistansi rotor'],
                scenarios: ['Starting', 'Akselerasi', 'Operasi normal', 'Overload']
              },
              {
                title: 'Analisis Slip',
                description: 'Simulasi pengaruh slip terhadap kinerja motor',
                variables: ['Beban motor', 'Tegangan supply', 'Kondisi rotor'],
                measurements: ['Kecepatan rotor', 'Arus stator', 'Efisiensi', 'Power factor']
              }
            ]
          }
        }
      ],
      assessments: [
        {
          type: 'knowledge_check',
          questions: [
            {
              type: 'multiple_choice',
              question: 'Apa yang terjadi jika urutan fasa motor 3 fasa dibalik?',
              options: [
                'Motor tidak akan berputar',
                'Motor berputar dengan arah berlawanan', 
                'Motor berputar lebih cepat',
                'Motor akan terbakar'
              ],
              correct: 1,
              explanation: 'Membalik urutan fasa akan membalik arah medan magnet putar, sehingga motor berputar berlawanan arah.'
            },
            {
              type: 'calculation',
              question: 'Motor 6 kutub bekerja pada frekuensi 60 Hz. Jika kecepatan rotor 1150 RPM, berapa slip motor?',
              solution: {
                steps: [
                  'ns = 120f/p = 120×60/6 = 1200 RPM',
                  's = (ns-nr)/ns × 100%',
                  's = (1200-1150)/1200 × 100% = 4.17%'
                ],
                answer: '4.17%'
              }
            }
          ]
        }
      ],
      practical_exercises: [
        {
          title: 'Identifikasi Komponen Motor',
          objective: 'Mengenal komponen motor secara fisik',
          equipment: ['Motor 3 fasa', 'Tools', 'Multimeter'],
          procedures: [
            'Identifikasi nameplate motor',
            'Buka terminal box dan identifikasi terminal',
            'Ukur resistansi belitan stator',
            'Identifikasi jenis bearing yang digunakan'
          ],
          report_requirements: [
            'Foto nameplate dengan spesifikasi',
            'Skema terminal dan pengukuran resistansi',
            'Analisis kondisi motor'
          ]
        }
      ]
    },
    resources: {
      references: [
        {
          title: 'Electric Motor Handbook',
          author: 'Richard H. Engelmann',
          type: 'book',
          pages: '120-180'
        },
        {
          title: 'IEEE Standard 112 - Motor Testing',
          type: 'standard',
          relevance: 'Testing procedures for motors'
        }
      ],
      external_links: [
        {
          title: 'Motor Animation - How it Works',
          url: 'https://example.com/motor-animation',
          description: 'Animasi 3D prinsip kerja motor induksi'
        }
      ],
      downloadable_materials: [
        {
          title: 'Motor Selection Guide',
          filename: 'motor_selection_guide.pdf',
          size: '2.5 MB',
          description: 'Panduan pemilihan motor untuk berbagai aplikasi'
        },
        {
          title: 'Motor Calculation Spreadsheet',
          filename: 'motor_calculations.xlsx',
          size: '150 KB',
          description: 'Template perhitungan parameter motor'
        }
      ]
    },
    prerequisites_check: {
      required_knowledge: [
        'Hukum Ohm dan Kirchhoff',
        'Arus AC dan gelombang sinusoidal',
        'Konsep daya dan energi listrik',
        'Prinsip elektromagnetisme dasar'
      ],
      assessment_questions: [
        'Jelaskan perbedaan arus AC dan DC',
        'Hitung daya pada rangkaian 3 fasa seimbang',
        'Jelaskan hukum induksi Faraday'
      ]
    }
  },

  {
    id: 'material-2',
    title: 'Rangkaian Kontrol Motor Listrik', 
    description: 'Sistem kontrol motor dengan kontaktor, relay, dan komponen pengaman',
    type: 'comprehensive',
    duration: '12 jam',
    level: 'intermediate',
    topics: [
      'Komponen Kontrol Motor',
      'Rangkaian DOL (Direct On Line)',
      'Sistem Start-Stop dengan Interlocking', 
      'Forward-Reverse Control',
      'Star-Delta Starting',
      'Sistem Proteksi Motor'
    ],
    features: [
      'Simulasi rangkaian virtual',
      'Wiring diagram interaktif',
      'Troubleshooting simulator',
      'Virtual laboratory'
    ]
  },

  {
    id: 'material-3',
    title: 'Instalasi dan Commissioning Motor',
    description: 'Teknik instalasi, pengkabelan, testing, dan commissioning motor listrik',
    type: 'comprehensive', 
    duration: '10 jam',
    level: 'intermediate',
    topics: [
      'Perencanaan Instalasi Motor',
      'Teknik Pengkabelan dan Wiring',
      'Grounding dan Proteksi',
      'Testing dan Commissioning',
      'Standar Keselamatan (K3)',
      'Dokumentasi Instalasi'
    ],
    features: [
      'Virtual installation simulator',
      'Safety procedure checklist',
      'Testing equipment simulator',
      'Installation planning tools'
    ]
  },

  {
    id: 'material-4',
    title: 'Troubleshooting dan Maintenance Motor',
    description: 'Diagnosis masalah, pemeliharaan preventif, dan perbaikan motor listrik',
    type: 'comprehensive',
    duration: '10 jam', 
    level: 'advanced',
    topics: [
      'Diagnosis Kerusakan Motor',
      'Teknik Pengukuran dan Testing',
      'Preventive Maintenance Program',
      'Predictive Maintenance',
      'Motor Repair dan Rewinding',
      'Root Cause Analysis'
    ],
    features: [
      'Fault diagnosis simulator',
      'Maintenance scheduling tools',
      'Vibration analysis simulator',
      'Case study database'
    ]
  }
];

// Video Resources
export const videoResources = [
  {
    id: 'video-1',
    title: 'Prinsip Kerja Motor 3 Fasa',
    duration: '8:30',
    description: 'Animasi 3D menjelaskan bagaimana motor induksi 3 fasa bekerja',
    topics: ['Medan magnet putar', 'Induksi EMF', 'Pembangkitan torsi'],
    interactive_features: ['Pause and explain', 'Speed control', 'Component highlight']
  },
  {
    id: 'video-2', 
    title: 'Instalasi Motor Step by Step',
    duration: '15:45',
    description: 'Video praktis instalasi motor dari A sampai Z',
    chapters: [
      'Persiapan dan K3',
      'Mounting motor', 
      'Wiring dan terminal',
      'Testing dan commissioning'
    ]
  }
];

// Simulation Tools
export const simulationTools = [
  {
    id: 'sim-1',
    title: 'Motor Control Circuit Simulator',
    description: 'Simulasi rangkaian kontrol motor dengan drag-and-drop components',
    features: [
      'Library komponen lengkap',
      'Real-time simulation',
      'Fault injection',
      'Measurement tools'
    ],
    learning_objectives: [
      'Merancang rangkaian kontrol',
      'Memahami prinsip kerja kontaktor',
      'Troubleshooting rangkaian'
    ]
  },
  {
    id: 'sim-2',
    title: 'Motor Performance Analyzer', 
    description: 'Analisis performa motor dengan berbagai kondisi operasi',
    parameters: ['Tegangan', 'Frekuensi', 'Beban', 'Suhu'],
    outputs: ['Efisiensi', 'Power factor', 'Arus', 'Torsi', 'Kecepatan'],
    scenarios: ['Starting', 'Normal operation', 'Overload', 'Undervoltage']
  }
];

// Interactive Tools
export const interactiveTools = [
  {
    id: 'tool-1',
    title: 'Motor Selection Wizard',
    description: 'Tool interaktif untuk memilih motor sesuai aplikasi',
    steps: [
      'Input application requirements',
      'Environmental conditions', 
      'Performance specifications',
      'Budget considerations',
      'Motor recommendations'
    ]
  },
  {
    id: 'tool-2',
    title: 'Wiring Diagram Builder',
    description: 'Tool untuk membuat wiring diagram motor control',
    features: [
      'Drag and drop components',
      'Auto-connect wires',
      'Symbol library',
      'Export to PDF'
    ]
  }
];