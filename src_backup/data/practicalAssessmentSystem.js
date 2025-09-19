// Enhanced Practical Assessment System untuk IML
// Sistem penilaian praktik dengan rubrik detail dan scoring otomatis

export const practicalAssessmentSystem = {
  overview: {
    title: 'Sistem Penilaian Praktik IML',
    description: 'Penilaian komprehensif kemampuan praktik instalasi motor listrik',
    total_duration: '3 jam',
    passing_score: 75,
    assessment_type: 'performance_based',
    certification_level: 'competent/not_yet_competent'
  },

  assessment_stations: [
    {
      id: 'station-1',
      title: 'Motor Component Identification & Testing',
      duration: '30 menit',
      max_score: 100,
      weight: 15, // 15% dari total nilai
      description: 'Identifikasi komponen motor dan pengujian dasar',
      
      tasks: [
        {
          id: 'task-1-1',
          title: 'Identifikasi Nameplate Motor',
          points: 25,
          instructions: [
            'Identifikasi dan catat semua informasi pada nameplate motor yang disediakan',
            'Jelaskan arti setiap parameter yang tercantum',
            'Hitung parameter yang tidak tercantum berdasarkan data yang ada'
          ],
          assessment_criteria: {
            'Excellent (23-25)': [
              'Mengidentifikasi semua parameter dengan benar',
              'Menjelaskan arti parameter dengan akurat',
              'Melakukan perhitungan tambahan dengan benar',
              'Menginterpretasikan rating motor untuk aplikasi'
            ],
            'Good (20-22)': [
              'Mengidentifikasi sebagian besar parameter dengan benar',
              'Menjelaskan arti parameter dengan cukup baik',
              'Melakukan sebagian perhitungan dengan benar'
            ],
            'Satisfactory (15-19)': [
              'Mengidentifikasi parameter dasar dengan benar',
              'Menjelaskan arti parameter dasar',
              'Kesulitan dalam perhitungan'
            ],
            'Needs Improvement (0-14)': [
              'Gagal mengidentifikasi parameter dengan benar',
              'Tidak memahami arti parameter',
              'Tidak dapat melakukan perhitungan'
            ]
          },
          tools_required: ['Motor sample', 'Calculator', 'Notepad'],
          time_limit: '8 menit'
        },
        
        {
          id: 'task-1-2', 
          title: 'Pengukuran Resistansi Belitan',
          points: 25,
          instructions: [
            'Ukur resistansi belitan stator motor 3 fasa',
            'Bandingkan nilai resistansi antar fasa',
            'Analisis hasil pengukuran dan berikan kesimpulan'
          ],
          assessment_criteria: {
            'Excellent (23-25)': [
              'Menggunakan multimeter dengan prosedur yang benar',
              'Mengukur semua kombinasi fasa dengan akurat',
              'Menganalisis keseimbangan resistansi dengan tepat',
              'Memberikan kesimpulan yang valid tentang kondisi belitan'
            ],
            'Good (20-22)': [
              'Menggunakan multimeter dengan baik',
              'Mengukur resistansi dengan cukup akurat',
              'Menganalisis hasil dengan cukup baik'
            ],
            'Satisfactory (15-19)': [
              'Dapat menggunakan multimeter dengan bantuan',
              'Mengukur resistansi dengan hasil yang dapat diterima',
              'Analisis dasar'
            ],
            'Needs Improvement (0-14)': [
              'Tidak dapat menggunakan multimeter dengan benar',
              'Hasil pengukuran tidak akurat',
              'Tidak dapat menganalisis hasil'
            ]
          },
          tools_required: ['Multimeter', 'Motor 3 fasa', 'Test leads'],
          safety_notes: ['Pastikan motor tidak terhubung ke sumber listrik'],
          time_limit: '10 menit'
        },

        {
          id: 'task-1-3',
          title: 'Testing Isolasi Motor',
          points: 25,
          instructions: [
            'Lakukan test isolasi motor menggunakan megger',
            'Test isolasi belitan ke ground dan antar belitan',
            'Interpretasikan hasil sesuai standar yang berlaku'
          ],
          assessment_criteria: {
            'Excellent (23-25)': [
              'Menggunakan megger dengan prosedur K3 yang benar',
              'Melakukan test dengan tegangan yang sesuai',
              'Menginterpretasikan hasil sesuai standar IEEE/IEC',
              'Memberikan rekomendasi berdasarkan hasil test'
            ],
            'Good (20-22)': [
              'Menggunakan megger dengan cukup baik',
              'Hasil test dapat diterima',
              'Interpretasi cukup akurat'
            ],
            'Satisfactory (15-19)': [
              'Dapat menggunakan megger dengan bantuan',
              'Test berhasil dilakukan',
              'Interpretasi dasar'
            ],
            'Needs Improvement (0-14)': [
              'Tidak dapat menggunakan megger dengan benar',
              'Tidak memahami prosedur K3',
              'Tidak dapat menginterpretasikan hasil'
            ]
          },
          tools_required: ['Megger 500V/1000V', 'Test leads', 'Discharge stick'],
          safety_notes: [
            'Gunakan APD lengkap',
            'Pastikan area kerja kering',
            'Discharge motor setelah test'
          ],
          time_limit: '12 menit'
        },

        {
          id: 'task-1-4',
          title: 'Inspeksi Visual dan Mekanis',
          points: 25,
          instructions: [
            'Lakukan inspeksi visual kondisi motor secara menyeluruh',
            'Check kondisi bearing dengan memutar shaft manual',
            'Identifikasi tanda-tanda kerusakan atau abnormalitas'
          ],
          assessment_criteria: {
            'Excellent (23-25)': [
              'Inspeksi sistematis dan menyeluruh',
              'Mengidentifikasi semua potensi masalah',
              'Memberikan penilaian kondisi yang akurat',
              'Rekomendasi maintenance yang tepat'
            ]
          },
          time_limit: '5 menit'
        }
      ]
    },

    {
      id: 'station-2',
      title: 'Wiring & Control Circuit Assembly',
      duration: '45 menit',
      max_score: 100,
      weight: 25, // 25% dari total nilai
      description: 'Merangkai rangkaian kontrol motor dengan benar dan aman',
      
      tasks: [
        {
          id: 'task-2-1',
          title: 'Rangkaian DOL (Direct On Line)',
          points: 40,
          instructions: [
            'Rangkai rangkaian DOL lengkap sesuai diagram yang diberikan',
            'Termasuk power circuit dan control circuit',
            'Implementasikan sistem proteksi yang tepat'
          ],
          components_provided: [
            'MCB 3 fasa 16A',
            'Kontaktor 3 fasa 9A',
            'Thermal overload relay 6-9A',
            'Push button START (NO)',
            'Push button STOP (NC)',
            'Motor 3 fasa 2.2 kW',
            'Kabel dan terminal sesuai kebutuhan'
          ],
          wiring_requirements: [
            'Gunakan warna kabel sesuai standar',
            'Semua koneksi harus kencang dan aman',
            'Label semua terminal dengan jelas',
            'Routing kabel rapi dan aman'
          ],
          assessment_criteria: {
            'Excellent (36-40)': [
              'Wiring 100% benar sesuai diagram',
              'Kerapian dan keamanan excellent',
              'Labeling lengkap dan benar',
              'Tidak ada kesalahan sama sekali'
            ],
            'Good (32-35)': [
              'Wiring sebagian besar benar',
              'Kerapian baik',
              'Minor error yang tidak kritis'
            ],
            'Satisfactory (25-31)': [
              'Wiring dasar benar',
              'Beberapa kesalahan minor',
              'Kerapian cukup'
            ],
            'Needs Improvement (0-24)': [
              'Wiring tidak benar atau tidak lengkap',
              'Potensi bahaya keselamatan',
              'Tidak rapi'
            ]
          },
          safety_checkpoints: [
            'Grounding motor terpasang dengan benar',
            'Tidak ada koneksi yang longgar',
            'Tidak ada kemungkinan short circuit',
            'Proteksi overload setting sesuai motor'
          ]
        },

        {
          id: 'task-2-2',
          title: 'Rangkaian Forward-Reverse dengan Interlock',
          points: 60,
          instructions: [
            'Rangkai rangkaian forward-reverse lengkap',
            'Implementasikan sistem interlock yang aman',
            'Test semua fungsi operasi'
          ],
          additional_components: [
            'Kontaktor kedua untuk reverse',
            'Push button FORWARD',
            'Push button REVERSE',
            'Lampu indikator (opsional)'
          ],
          interlock_requirements: [
            'Electrical interlock menggunakan aux contact NC',
            'Mechanical interlock pada kontaktor (jika tersedia)',
            'Tidak boleh ada kemungkinan kedua kontaktor aktif bersamaan'
          ],
          test_scenarios: [
            'Forward operation normal',
            'Reverse operation normal',
            'Interlock function test',
            'Emergency stop function',
            'Overload protection test'
          ]
        }
      ]
    },

    {
      id: 'station-3',
      title: 'Motor Installation & Commissioning',
      duration: '40 menit',
      max_score: 100,
      weight: 20, // 20% dari total nilai
      description: 'Instalasi motor dan commissioning untuk operasi',
      
      tasks: [
        {
          id: 'task-3-1',
          title: 'Motor Mounting dan Alignment',
          points: 30,
          instructions: [
            'Mount motor pada base frame yang disediakan',
            'Lakukan alignment motor dengan beban (coupling)',
            'Pastikan semua baut mounting kencang dengan torsi yang tepat'
          ],
          tools_provided: ['Alignment tools', 'Torque wrench', 'Level'],
          acceptance_criteria: [
            'Motor terpasang stabil tanpa getaran',
            'Alignment dalam toleransi ±0.1mm',
            'Semua baut mounting sesuai torsi specification'
          ]
        },

        {
          id: 'task-3-2',
          title: 'Electrical Connection & Grounding',
          points: 35,
          instructions: [
            'Hubungkan kabel power motor sesuai voltage rating',
            'Pasang grounding dengan benar sesuai standar',
            'Test kontinuitas dan isolasi setelah koneksi'
          ],
          grounding_requirements: [
            'Grounding conductor sesuai ukuran kabel power',
            'Koneksi grounding kencang dan anti korosi',
            'Resistansi grounding < 1 ohm'
          ]
        },

        {
          id: 'task-3-3',
          title: 'Pre-Commissioning Test',
          points: 35,
          instructions: [
            'Lakukan test rangkaian sebelum energizing motor',
            'Test isolasi, kontinuitas, dan phase sequence',
            'Verifikasi setting proteksi sesuai motor rating'
          ],
          test_checklist: [
            '□ Insulation test passed (>1 MΩ)',
            '□ Continuity test OK',
            '□ Phase sequence correct (R-S-T)',
            '□ Grounding resistance <1Ω',
            '□ Overload setting = motor FLC',
            '□ Control circuit test OK'
          ]
        }
      ]
    },

    {
      id: 'station-4',
      title: 'Testing & Performance Verification',
      duration: '30 menit',
      max_score: 100,
      weight: 20, // 20% dari total nilai
      description: 'Testing motor operation dan verifikasi performance',
      
      tasks: [
        {
          id: 'task-4-1',
          title: 'No-Load Test',
          points: 40,
          instructions: [
            'Jalankan motor tanpa beban',
            'Ukur arus, tegangan, dan kecepatan no-load',
            'Verifikasi rotasi direction dan smooth operation'
          ],
          measurements_required: [
            'Voltage (L-L dan L-N)',
            'Current setiap fasa',
            'Speed (RPM)',
            'Vibration level',
            'Temperature rise'
          ],
          acceptance_criteria: [
            'No-load current 25-40% dari FLC',
            'Voltage balanced ±2%',
            'Current balanced ±5%',
            'Speed sesuai nameplate ±2%',
            'Vibration level normal',
            'No abnormal noise'
          ]
        },

        {
          id: 'task-4-2',
          title: 'Load Test & Performance',
          points: 40,
          instructions: [
            'Test motor dengan beban sesuai yang tersedia',
            'Ukur parameter operasi pada berbagai beban',
            'Evaluasi performance motor'
          ],
          load_points: ['25%', '50%', '75%', '100% rated load'],
          performance_parameters: [
            'Efficiency calculation',
            'Power factor measurement',
            'Slip calculation',
            'Temperature monitoring'
          ]
        },

        {
          id: 'task-4-3',
          title: 'Protection System Test',
          points: 20,
          instructions: [
            'Test fungsi thermal overload protection',
            'Verifikasi emergency stop operation',
            'Test interlock system (jika ada)'
          ],
          test_methods: [
            'Gradual overload test sampai trip',
            'Emergency stop response time',
            'Interlock defeat test'
          ]
        }
      ]
    },

    {
      id: 'station-5',
      title: 'Troubleshooting & Problem Solving',
      duration: '35 menit',
      max_score: 100,
      weight: 20, // 20% dari total nilai
      description: 'Diagnosis dan solusi masalah motor yang umum terjadi',
      
      scenario_based_tasks: [
        {
          id: 'scenario-1',
          title: 'Motor Tidak Dapat Start',
          points: 25,
          problem_description: 'Motor tidak berputar saat tombol start ditekan. MCB tidak trip, tapi tidak ada response dari motor.',
          possible_faults: [
            'Supply voltage tidak ada',
            'Control circuit putus',
            'Kontaktor coil rusak',
            'Overload trip',
            'Motor bearing seized'
          ],
          assessment_approach: [
            'Systematic troubleshooting methodology',
            'Proper use of measuring instruments',
            'Safety procedures during troubleshooting',
            'Correct fault identification',
            'Appropriate corrective action'
          ],
          tools_available: ['Multimeter', 'Clamp meter', 'Screwdriver set', 'Insulation tester'],
          time_limit: '8 menit'
        },

        {
          id: 'scenario-2',
          title: 'Motor Berputar Tetapi Trip Overload',
          points: 25,
          problem_description: 'Motor dapat start dan berputar normal, tetapi trip overload setelah beberapa menit operasi.',
          systematic_approach_required: [
            'Check motor current vs nameplate',
            'Verify overload setting',
            'Check motor load condition',
            'Verify supply voltage',
            'Check motor condition'
          ]
        },

        {
          id: 'scenario-3',
          title: 'Motor Berputar Arah Salah',
          points: 25,
          problem_description: 'Motor berputar dengan arah yang berlawanan dari yang diinginkan.',
          solution_evaluation: [
            'Identify root cause correctly',
            'Implement correct solution',
            'Verify fix effectiveness',
            'Prevent recurrence'
          ]
        },

        {
          id: 'scenario-4',
          title: 'Motor Noise dan Vibration Abnormal',
          points: 25,
          problem_description: 'Motor beroperasi normal tetapi mengeluarkan noise dan vibration yang tidak normal.',
          diagnostic_skills: [
            'Identify type of noise/vibration',
            'Use appropriate diagnostic methods',
            'Determine severity level',
            'Recommend corrective action'
          ]
        }
      ]
    }
  ],

  overall_assessment: {
    competency_areas: [
      {
        area: 'Technical Knowledge',
        weight: 25,
        components: [
          'Understanding of motor principles',
          'Knowledge of control systems',
          'Familiarity with standards',
          'Component identification'
        ]
      },
      {
        area: 'Practical Skills',
        weight: 35,
        components: [
          'Wiring and assembly skills',
          'Use of measuring instruments',
          'Installation techniques',
          'Testing procedures'
        ]
      },
      {
        area: 'Safety Awareness',
        weight: 20,
        components: [
          'Personal protective equipment use',
          'Safe work procedures',
          'Hazard identification',
          'Emergency response'
        ]
      },
      {
        area: 'Problem Solving',
        weight: 20,
        components: [
          'Systematic troubleshooting',
          'Root cause analysis',
          'Solution implementation',
          'Verification methods'
        ]
      }
    ],
    
    certification_levels: {
      'Competent (75-100)': {
        description: 'Demonstrates competency in all assessed areas',
        criteria: [
          'Technical knowledge meets industry standards',
          'Practical skills executed safely and correctly',
          'Demonstrates problem-solving abilities',
          'Follows safety procedures consistently'
        ],
        recommendations: [
          'Ready for independent work with minimal supervision',
          'Can progress to advanced motor control topics',
          'Eligible for industry certification exams'
        ]
      },
      'Developing (60-74)': {
        description: 'Shows understanding but needs additional practice',
        criteria: [
          'Basic technical knowledge present',
          'Practical skills need refinement',
          'Problem-solving approach needs improvement',
          'Safety awareness adequate but needs reinforcement'
        ],
        recommendations: [
          'Additional practical training required',
          'Mentored work experience needed',
          'Review specific weak areas identified'
        ]
      },
      'Not Yet Competent (<60)': {
        description: 'Significant gaps in knowledge and skills',
        criteria: [
          'Fundamental knowledge gaps exist',
          'Practical skills inadequate for safe work',
          'Problem-solving approach unclear',
          'Safety procedures not consistently followed'
        ],
        recommendations: [
          'Repeat training program',
          'Focus on fundamental concepts',
          'Extensive supervised practice required',
          'Re-assessment after additional training'
        ]
      }
    }
  },

  assessment_tools: {
    scoring_rubric: {
      criteria_weighting: {
        'Technical Accuracy': 40,
        'Safety Compliance': 25,
        'Efficiency/Speed': 15,
        'Quality of Work': 20
      },
      performance_indicators: {
        'Exceeds Expectations (4)': 'Consistently demonstrates mastery',
        'Meets Expectations (3)': 'Demonstrates competency',
        'Approaching Expectations (2)': 'Shows developing competency',
        'Below Expectations (1)': 'Does not demonstrate competency'
      }
    },
    
    observation_checklist: [
      'Uses appropriate PPE consistently',
      'Follows safe work procedures',
      'Demonstrates systematic approach',
      'Uses tools and instruments correctly',
      'Applies theoretical knowledge practically',
      'Communicates effectively',
      'Manages time appropriately',
      'Maintains organized workspace'
    ],
    
    digital_assessment_features: [
      'Real-time scoring and feedback',
      'Photo/video documentation capability',
      'Automated report generation',
      'Progress tracking across sessions',
      'Integration with learning management system'
    ]
  },

  quality_assurance: {
    assessor_requirements: [
      'Minimum 5 years motor industry experience',
      'Technical qualification in electrical engineering',
      'Assessment and training certification',
      'Regular calibration and standardization training'
    ],
    
    assessment_standardization: [
      'All assessors use identical rubrics',
      'Regular inter-assessor reliability checks',
      'Standardized equipment and conditions',
      'Documented assessment procedures'
    ],
    
    continuous_improvement: [
      'Regular review of assessment validity',
      'Industry feedback integration',
      'Technology updates incorporation',
      'Statistical analysis of assessment outcomes'
    ]
  }
};

// Assessment Form Template
export const assessmentFormTemplate = {
  student_info: {
    name: '',
    id: '',
    program: 'IML (Instalasi Motor Listrik)',
    assessment_date: '',
    assessor_name: '',
    assessor_signature: ''
  },
  
  station_scores: {
    station_1: { score: 0, max: 100, weight: 15 },
    station_2: { score: 0, max: 100, weight: 25 },
    station_3: { score: 0, max: 100, weight: 20 },
    station_4: { score: 0, max: 100, weight: 20 },
    station_5: { score: 0, max: 100, weight: 20 }
  },
  
  competency_evaluation: {
    technical_knowledge: { rating: 0, max: 4 },
    practical_skills: { rating: 0, max: 4 },
    safety_awareness: { rating: 0, max: 4 },
    problem_solving: { rating: 0, max: 4 }
  },
  
  overall_result: {
    weighted_score: 0,
    certification_level: '',
    pass_fail: '',
    recommendations: [],
    areas_for_improvement: [],
    next_steps: []
  },
  
  assessor_comments: {
    strengths: '',
    development_areas: '',
    specific_feedback: '',
    industry_readiness: ''
  }
};