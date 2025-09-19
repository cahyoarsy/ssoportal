// Monitoring System JavaScript
class MonitoringSystem {
    constructor() {
        this.students = JSON.parse(localStorage.getItem('monitoring_students') || '[]');
        this.testResults = JSON.parse(localStorage.getItem('monitoring_results') || '{}');
        this.currentSection = 'dashboard';
        this.charts = {};
        // Track processed result IDs to avoid duplicate ingestion
        this.processedIds = new Set(JSON.parse(localStorage.getItem('monitoring_processed_ids') || '[]'));
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.generateSampleData();
        this.showSection('dashboard');
        this.startRealtimeUpdates();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link').dataset.section;
                this.showSection(section);
            });
        });

        // Filter events
        document.getElementById('pretest-score-filter')?.addEventListener('change', () => this.applyPretestFilter());
        document.getElementById('pretest-sort')?.addEventListener('change', () => this.applyPretestFilter());
        document.getElementById('posttest-score-filter')?.addEventListener('change', () => this.applyPosttestFilter());
        document.getElementById('posttest-sort')?.addEventListener('change', () => this.applyPosttestFilter());

        // Listen for external data updates
        window.addEventListener('storage', (e) => {
            if (e.key === 'elearning_results' || e.key === 'monitoring_results') {
                this.handleExternalUpdate(e.newValue);
            }
        });

        // API endpoint untuk menerima data dari aplikasi e-learning
        this.setupDataReceiver();
    }

    setupDataReceiver() {
        // Simulate API endpoint - dalam implementasi nyata gunakan Express.js/Node.js
        window.receiveTestResult = (studentData) => {
            this.addTestResult(studentData);
        };

        // Check untuk data dari aplikasi e-learning
        setInterval(() => {
            this.checkForNewResults();
        }, 2000);
    }

    checkForNewResults() {
        // Legacy single object support (backward compatibility)
        const legacy = JSON.parse(localStorage.getItem('elearning_results') || '{}');
        if (Object.keys(legacy).length > 0) {
            const pseudoEmail = legacy.preTest?.userEmail || legacy.postTest?.userEmail || null;
            const baseName = pseudoEmail ? pseudoEmail.split('@')[0] : this.generateStudentName();
            const studentId = 'LEGACY_' + (pseudoEmail || this.generateStudentId());
            const data = {
                id: studentId,
                name: baseName,
                timestamp: new Date().toISOString(),
                preTest: legacy.preTest || null,
                postTest: legacy.postTest || null
            };
            this.addTestResult(data);
            // Don't remove anymore to allow other systems, but clear to keep old behavior minimal
            localStorage.removeItem('elearning_results');
        }

        // New history array ingestion
        const history = JSON.parse(localStorage.getItem('elearning_results_history') || '[]');
        if (Array.isArray(history) && history.length) {
            let newProcessed = false;
            history.forEach(entry => {
                if (!entry || !entry.id || this.processedIds.has(entry.id)) return;
                // Map userEmail to student (stable)
                const email = entry.userEmail || 'anonymous';
                const existingStudent = this.students.find(s => s.id === email);
                const studentRecord = existingStudent || {
                    id: email,
                    name: email.includes('@') ? email.split('@')[0] : email,
                    preTest: null,
                    postTest: null,
                    registeredAt: entry.timestamp
                };
                if (!existingStudent) this.students.push(studentRecord);
                const testPayload = {
                    score: entry.score,
                    total: entry.total,
                    percentage: entry.percentage,
                    criteria: entry.criteria,
                    timestamp: entry.timestamp,
                    answers: entry.answers || null
                };
                if (entry.type === 'preTest') {
                    studentRecord.preTest = testPayload;
                    this.addActivity(`${studentRecord.name} menyelesaikan Pre-Test (${entry.percentage}%)`);
                } else if (entry.type === 'postTest') {
                    studentRecord.postTest = testPayload;
                    this.addActivity(`${studentRecord.name} menyelesaikan Post-Test (${entry.percentage}%)`);
                }
                this.processedIds.add(entry.id);
                newProcessed = true;
            });
            if (newProcessed) {
                localStorage.setItem('monitoring_students', JSON.stringify(this.students));
                localStorage.setItem('monitoring_processed_ids', JSON.stringify(Array.from(this.processedIds)));
                this.refreshCurrentSection();
            }
        }
    }

    generateStudentId() {
        return 'STD_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    generateStudentName() {
        const names = [
            'Ahmad Rizki', 'Siti Nurhaliza', 'Budi Santoso', 'Dewi Lestari', 'Eko Prasetyo',
            'Fitri Rahmawati', 'Gunawan Setiawan', 'Hani Permata', 'Indra Kurniawan', 'Joko Widodo',
            'Kartika Sari', 'Lukman Hakim', 'Maya Sari', 'Nanda Pratama', 'Oki Setiana'
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    addTestResult(studentData) {
        // Check if student already exists
        let existingStudent = this.students.find(s => s.id === studentData.id);
        
        if (!existingStudent) {
            existingStudent = {
                id: studentData.id,
                name: studentData.name,
                preTest: null,
                postTest: null,
                registeredAt: studentData.timestamp
            };
            this.students.push(existingStudent);
        }

        // Update test results
        if (studentData.preTest) {
            existingStudent.preTest = studentData.preTest;
            this.addActivity(`${studentData.name} menyelesaikan Pre-Test dengan skor ${studentData.preTest.score}/80`);
        }

        if (studentData.postTest) {
            existingStudent.postTest = studentData.postTest;
            this.addActivity(`${studentData.name} menyelesaikan Post-Test dengan skor ${studentData.postTest.score}/80`);
        }

        // Save to localStorage
        localStorage.setItem('monitoring_students', JSON.stringify(this.students));
        
        // Refresh current view
        this.refreshCurrentSection();
    }

    addActivity(message) {
        const activities = JSON.parse(localStorage.getItem('monitoring_activities') || '[]');
        activities.unshift({
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 50 activities
        if (activities.length > 50) {
            activities.splice(50);
        }
        
        localStorage.setItem('monitoring_activities', JSON.stringify(activities));
    }

    generateSampleData() {
        // Generate sample data if none exists
        if (this.students.length === 0) {
            const sampleNames = [
                'Ahmad Rizki Pratama', 'Siti Nurhaliza Putri', 'Budi Santoso', 'Dewi Lestari Sari',
                'Eko Prasetyo Wibowo', 'Fitri Rahmawati', 'Gunawan Setiawan', 'Hani Permata Indah'
            ];

            sampleNames.forEach((name, index) => {
                const preScore = Math.floor(Math.random() * 40) + 40; // 40-80
                const postScore = Math.floor(Math.random() * 30) + Math.max(preScore, 50); // Improvement

                this.students.push({
                    id: `STD_${String(index + 1).padStart(3, '0')}`,
                    name: name,
                    preTest: {
                        score: preScore,
                        total: 80,
                        percentage: Math.round((preScore / 80) * 100),
                        criteria: this.getCriteria((preScore / 80) * 100),
                        timestamp: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString() // Last 3 days
                    },
                    postTest: Math.random() > 0.3 ? {
                        score: postScore,
                        total: 80,
                        percentage: Math.round((postScore / 80) * 100),
                        criteria: this.getCriteria((postScore / 80) * 100),
                        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString() // Last day
                    } : null,
                    registeredAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() // Last week
                });
            });

            localStorage.setItem('monitoring_students', JSON.stringify(this.students));
        }
    }

    getCriteria(percentage) {
        if (percentage >= 90) return 'Sangat Baik';
        if (percentage >= 75) return 'Baik';
        if (percentage >= 60) return 'Cukup';
        return 'Perlu Bimbingan';
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });

        // Show selected section
        document.getElementById(`${sectionName}-section`).style.display = 'block';

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Load section content
        switch(sectionName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'students':
                this.loadStudentsTable();
                break;
            case 'pretest':
                this.loadPretestResults();
                break;
            case 'posttest':
                this.loadPosttestResults();
                break;
            case 'comparison':
                this.loadComparison();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
            case 'export':
                this.loadExport();
                break;
        }
    }

    loadDashboard() {
        const stats = this.calculateStats();
        
        document.getElementById('total-students').textContent = stats.totalStudents;
        document.getElementById('pretest-completed').textContent = stats.pretestCompleted;
        document.getElementById('posttest-completed').textContent = stats.posttestCompleted;
        document.getElementById('avg-improvement').textContent = stats.avgImprovement + '%';

        this.loadRecentActivities();
        this.loadTopPerformers();
    }

    calculateStats() {
        const totalStudents = this.students.length;
        const pretestCompleted = this.students.filter(s => s.preTest).length;
        const posttestCompleted = this.students.filter(s => s.postTest).length;
        
        const improvements = this.students
            .filter(s => s.preTest && s.postTest)
            .map(s => s.postTest.percentage - s.preTest.percentage);
        
        const avgImprovement = improvements.length > 0 
            ? Math.round(improvements.reduce((a, b) => a + b, 0) / improvements.length)
            : 0;

        return {
            totalStudents,
            pretestCompleted,
            posttestCompleted,
            avgImprovement
        };
    }

    loadRecentActivities() {
        const activities = JSON.parse(localStorage.getItem('monitoring_activities') || '[]');
        const container = document.getElementById('recent-activities');
        
        if (activities.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Belum ada aktivitas</p>';
            return;
        }

        const html = activities.slice(0, 10).map(activity => `
            <div class="d-flex align-items-center mb-2 p-2 border-bottom">
                <i class="fas fa-circle text-primary me-2" style="font-size: 8px;"></i>
                <div class="flex-grow-1">
                    <small>${activity.message}</small>
                    <div class="timestamp">${this.formatTimestamp(activity.timestamp)}</div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    loadTopPerformers() {
        const topStudents = this.students
            .filter(s => s.postTest || s.preTest)
            .sort((a, b) => {
                const scoreA = a.postTest ? a.postTest.percentage : a.preTest.percentage;
                const scoreB = b.postTest ? b.postTest.percentage : b.preTest.percentage;
                return scoreB - scoreA;
            })
            .slice(0, 5);

        const container = document.getElementById('top-performers');
        
        if (topStudents.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Belum ada data</p>';
            return;
        }

        const html = topStudents.map((student, index) => {
            const score = student.postTest ? student.postTest.percentage : student.preTest.percentage;
            const testType = student.postTest ? 'Post-Test' : 'Pre-Test';
            
            return `
                <div class="d-flex align-items-center mb-2">
                    <div class="student-avatar me-2">
                        ${student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div class="flex-grow-1">
                        <div class="fw-bold">${student.name}</div>
                        <small class="text-muted">${testType}: ${score}%</small>
                    </div>
                    <span class="badge bg-success">#${index + 1}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    loadStudentsTable() {
        const tbody = document.getElementById('students-table-body');
        
        const html = this.students.map((student, index) => {
            const preScore = student.preTest ? student.preTest.percentage : '-';
            const postScore = student.postTest ? student.postTest.percentage : '-';
            const improvement = student.preTest && student.postTest 
                ? student.postTest.percentage - student.preTest.percentage 
                : '-';
            
            const status = this.getStudentStatus(student);
            const statusClass = this.getStatusClass(status);

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="student-avatar me-2">
                                ${student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            ${student.name}
                        </div>
                    </td>
                    <td>
                        ${preScore !== '-' ? `<span class="badge ${this.getScoreBadgeClass(preScore)}">${preScore}%</span>` : '-'}
                    </td>
                    <td>
                        ${postScore !== '-' ? `<span class="badge ${this.getScoreBadgeClass(postScore)}">${postScore}%</span>` : '-'}
                    </td>
                    <td>
                        ${improvement !== '-' ? 
                            `<span class="badge ${improvement >= 0 ? 'bg-success' : 'bg-danger'}">${improvement > 0 ? '+' : ''}${improvement}%</span>` 
                            : '-'}
                    </td>
                    <td><span class="badge ${statusClass}">${status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="monitoring.viewStudentDetail('${student.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = html;

        // Initialize DataTable if not already initialized
        if (!$.fn.DataTable.isDataTable('#students-table')) {
            $('#students-table').DataTable({
                pageLength: 10,
                order: [[0, 'asc']],
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/id.json'
                }
            });
        }
    }

    getStudentStatus(student) {
        if (student.postTest) return 'Selesai';
        if (student.preTest) return 'Pre-Test';
        return 'Belum Mulai';
    }

    getStatusClass(status) {
        switch(status) {
            case 'Selesai': return 'bg-success';
            case 'Pre-Test': return 'bg-warning';
            default: return 'bg-secondary';
        }
    }

    getScoreBadgeClass(score) {
        if (score >= 90) return 'score-excellent';
        if (score >= 75) return 'score-good';
        if (score >= 60) return 'score-fair';
        return 'score-poor';
    }

    loadPretestResults() {
        this.applyPretestFilter();
    }

    applyPretestFilter() {
        const scoreFilter = document.getElementById('pretest-score-filter').value;
        const sortBy = document.getElementById('pretest-sort').value;
        
        let filteredStudents = this.students.filter(s => s.preTest);
        
        // Apply score filter
        if (scoreFilter) {
            const [min, max] = scoreFilter.split('-').map(Number);
            filteredStudents = filteredStudents.filter(s => {
                const score = s.preTest.percentage;
                return score >= min && score <= max;
            });
        }

        // Apply sorting
        filteredStudents.sort((a, b) => {
            switch(sortBy) {
                case 'score-desc':
                    return b.preTest.percentage - a.preTest.percentage;
                case 'score-asc':
                    return a.preTest.percentage - b.preTest.percentage;
                case 'time-desc':
                    return new Date(b.preTest.timestamp) - new Date(a.preTest.timestamp);
                case 'time-asc':
                    return new Date(a.preTest.timestamp) - new Date(b.preTest.timestamp);
                default:
                    return 0;
            }
        });

        this.renderTestResults('pretest-results', filteredStudents, 'preTest');
    }

    loadPosttestResults() {
        this.applyPosttestFilter();
    }

    applyPosttestFilter() {
        const scoreFilter = document.getElementById('posttest-score-filter').value;
        const sortBy = document.getElementById('posttest-sort').value;
        
        let filteredStudents = this.students.filter(s => s.postTest);
        
        // Apply score filter
        if (scoreFilter) {
            const [min, max] = scoreFilter.split('-').map(Number);
            filteredStudents = filteredStudents.filter(s => {
                const score = s.postTest.percentage;
                return score >= min && score <= max;
            });
        }

        // Apply sorting
        filteredStudents.sort((a, b) => {
            switch(sortBy) {
                case 'score-desc':
                    return b.postTest.percentage - a.postTest.percentage;
                case 'score-asc':
                    return a.postTest.percentage - b.postTest.percentage;
                case 'time-desc':
                    return new Date(b.postTest.timestamp) - new Date(a.postTest.timestamp);
                case 'time-asc':
                    return new Date(a.postTest.timestamp) - new Date(b.postTest.timestamp);
                default:
                    return 0;
            }
        });

        this.renderTestResults('posttest-results', filteredStudents, 'postTest');
    }

    renderTestResults(containerId, students, testType) {
        const container = document.getElementById(containerId);
        
        if (students.length === 0) {
            container.innerHTML = '<div class="col-12"><p class="text-muted text-center">Tidak ada data yang sesuai filter</p></div>';
            return;
        }

        const html = students.map(student => {
            const test = student[testType];
            const progress = (test.percentage * 3.6).toFixed(0); // Convert to degrees for circular progress
            
            return `
                <div class="col-md-6 col-lg-4">
                    <div class="test-result-card card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h6 class="card-title mb-1">${student.name}</h6>
                                    <small class="text-muted">${this.formatTimestamp(test.timestamp)}</small>
                                </div>
                                <div class="progress-circle" style="--progress: ${progress}deg">
                                    <div class="progress-text">${test.percentage}%</div>
                                </div>
                            </div>
                            
                            <div class="row text-center">
                                <div class="col-6">
                                    <h4 class="text-primary mb-0">${test.score}</h4>
                                    <small class="text-muted">Skor</small>
                                </div>
                                <div class="col-6">
                                    <h4 class="text-success mb-0">${test.total}</h4>
                                    <small class="text-muted">Total</small>
                                </div>
                            </div>
                            
                            <div class="mt-3">
                                <span class="badge ${this.getScoreBadgeClass(test.percentage)} w-100">
                                    ${test.criteria}
                                </span>
                            </div>
                            
                            ${test.elapsed ? `
                                <div class="mt-2 text-center">
                                    <small class="text-muted">
                                        <i class="fas fa-clock me-1"></i>Waktu: ${test.elapsed} menit
                                    </small>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    loadComparison() {
        this.createComparisonChart();
        this.updateComparisonStats();
    }

    createComparisonChart() {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        
        // Destroy existing chart
        if (this.charts.comparison) {
            this.charts.comparison.destroy();
        }

        const studentsWithBothTests = this.students.filter(s => s.preTest && s.postTest);
        
        const data = {
            labels: studentsWithBothTests.map(s => s.name),
            datasets: [
                {
                    label: 'Pre-Test',
                    data: studentsWithBothTests.map(s => s.preTest.percentage),
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Post-Test',
                    data: studentsWithBothTests.map(s => s.postTest.percentage),
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        };

        this.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Perbandingan Skor Pre-Test vs Post-Test'
                    },
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Persentase'
                        }
                    }
                }
            }
        });
    }

    updateComparisonStats() {
        const pretestScores = this.students.filter(s => s.preTest).map(s => s.preTest.percentage);
        const posttestScores = this.students.filter(s => s.postTest).map(s => s.postTest.percentage);

        // Pre-test stats
        if (pretestScores.length > 0) {
            document.getElementById('pretest-avg').textContent = 
                Math.round(pretestScores.reduce((a, b) => a + b, 0) / pretestScores.length);
            document.getElementById('pretest-highest').textContent = Math.max(...pretestScores);
            document.getElementById('pretest-lowest').textContent = Math.min(...pretestScores);
        }

        // Post-test stats
        if (posttestScores.length > 0) {
            document.getElementById('posttest-avg').textContent = 
                Math.round(posttestScores.reduce((a, b) => a + b, 0) / posttestScores.length);
            document.getElementById('posttest-highest').textContent = Math.max(...posttestScores);
            document.getElementById('posttest-lowest').textContent = Math.min(...posttestScores);
        }
    }

    loadAnalytics() {
        this.createDistributionCharts();
        this.createImprovementChart();
    }

    createDistributionCharts() {
        // Pre-test distribution
        const pretestCtx = document.getElementById('pretestDistribution').getContext('2d');
        const pretestScores = this.students.filter(s => s.preTest).map(s => s.preTest.percentage);
        
        if (this.charts.pretestDist) this.charts.pretestDist.destroy();
        
        this.charts.pretestDist = new Chart(pretestCtx, {
            type: 'doughnut',
            data: {
                labels: ['Sangat Baik (90-100)', 'Baik (75-89)', 'Cukup (60-74)', 'Perlu Bimbingan (<60)'],
                datasets: [{
                    data: [
                        pretestScores.filter(s => s >= 90).length,
                        pretestScores.filter(s => s >= 75 && s < 90).length,
                        pretestScores.filter(s => s >= 60 && s < 75).length,
                        pretestScores.filter(s => s < 60).length
                    ],
                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Post-test distribution
        const posttestCtx = document.getElementById('posttestDistribution').getContext('2d');
        const posttestScores = this.students.filter(s => s.postTest).map(s => s.postTest.percentage);
        
        if (this.charts.posttestDist) this.charts.posttestDist.destroy();
        
        this.charts.posttestDist = new Chart(posttestCtx, {
            type: 'doughnut',
            data: {
                labels: ['Sangat Baik (90-100)', 'Baik (75-89)', 'Cukup (60-74)', 'Perlu Bimbingan (<60)'],
                datasets: [{
                    data: [
                        posttestScores.filter(s => s >= 90).length,
                        posttestScores.filter(s => s >= 75 && s < 90).length,
                        posttestScores.filter(s => s >= 60 && s < 75).length,
                        posttestScores.filter(s => s < 60).length
                    ],
                    backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createImprovementChart() {
        const ctx = document.getElementById('improvementChart').getContext('2d');
        const studentsWithBothTests = this.students.filter(s => s.preTest && s.postTest);
        
        if (this.charts.improvement) this.charts.improvement.destroy();
        
        const improvements = studentsWithBothTests.map(s => ({
            name: s.name,
            improvement: s.postTest.percentage - s.preTest.percentage
        }));

        this.charts.improvement = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: improvements.map(i => i.name),
                datasets: [{
                    label: 'Peningkatan (%)',
                    data: improvements.map(i => i.improvement),
                    backgroundColor: improvements.map(i => i.improvement >= 0 ? '#28a745' : '#dc3545'),
                    borderColor: improvements.map(i => i.improvement >= 0 ? '#1e7e34' : '#bd2130'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Peningkatan Individual (Post-Test - Pre-Test)'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Peningkatan Persentase'
                        }
                    }
                }
            }
        });
    }

    loadExport() {
        // Export section is already loaded in HTML
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    refreshCurrentSection() {
        this.showSection(this.currentSection);
    }

    startRealtimeUpdates() {
        // Refresh data every 30 seconds
        setInterval(() => {
            this.refreshCurrentSection();
        }, 30000);
    }

    // Export functions
    exportToExcel() {
        const data = this.students.map(student => ({
            'Nama Siswa': student.name,
            'Pre-Test Skor': student.preTest ? student.preTest.score : '-',
            'Pre-Test Persentase': student.preTest ? student.preTest.percentage + '%' : '-',
            'Pre-Test Kriteria': student.preTest ? student.preTest.criteria : '-',
            'Pre-Test Waktu': student.preTest ? this.formatTimestamp(student.preTest.timestamp) : '-',
            'Post-Test Skor': student.postTest ? student.postTest.score : '-',
            'Post-Test Persentase': student.postTest ? student.postTest.percentage + '%' : '-',
            'Post-Test Kriteria': student.postTest ? student.postTest.criteria : '-',
            'Post-Test Waktu': student.postTest ? this.formatTimestamp(student.postTest.timestamp) : '-',
            'Peningkatan': (student.preTest && student.postTest) ? 
                (student.postTest.percentage - student.preTest.percentage) + '%' : '-'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Hasil Test');
        
        XLSX.writeFile(wb, `monitoring_hasil_test_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    exportToJSON() {
        const data = {
            students: this.students,
            exported_at: new Date().toISOString(),
            stats: this.calculateStats()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monitoring_data_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    importFromJSON() {
        const fileInput = document.getElementById('import-file');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Pilih file JSON terlebih dahulu');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.students && Array.isArray(data.students)) {
                    this.students = data.students;
                    localStorage.setItem('monitoring_students', JSON.stringify(this.students));
                    this.refreshCurrentSection();
                    alert('Data berhasil diimport');
                } else {
                    alert('Format file tidak valid');
                }
            } catch (error) {
                alert('Error membaca file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    viewStudentDetail(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const modalHtml = `
            <div class="modal fade" id="studentModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detail Siswa: ${student.name}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>Pre-Test</h6>
                                    ${student.preTest ? `
                                        <p><strong>Skor:</strong> ${student.preTest.score}/80</p>
                                        <p><strong>Persentase:</strong> ${student.preTest.percentage}%</p>
                                        <p><strong>Kriteria:</strong> ${student.preTest.criteria}</p>
                                        <p><strong>Waktu:</strong> ${this.formatTimestamp(student.preTest.timestamp)}</p>
                                    ` : '<p class="text-muted">Belum mengerjakan</p>'}
                                </div>
                                <div class="col-md-6">
                                    <h6>Post-Test</h6>
                                    ${student.postTest ? `
                                        <p><strong>Skor:</strong> ${student.postTest.score}/80</p>
                                        <p><strong>Persentase:</strong> ${student.postTest.percentage}%</p>
                                        <p><strong>Kriteria:</strong> ${student.postTest.criteria}</p>
                                        <p><strong>Waktu:</strong> ${this.formatTimestamp(student.postTest.timestamp)}</p>
                                    ` : '<p class="text-muted">Belum mengerjakan</p>'}
                                </div>
                            </div>
                            ${student.preTest && student.postTest ? `
                                <hr>
                                <div class="text-center">
                                    <h6>Peningkatan</h6>
                                    <h3 class="${student.postTest.percentage >= student.preTest.percentage ? 'text-success' : 'text-danger'}">
                                        ${student.postTest.percentage >= student.preTest.percentage ? '+' : ''}${student.postTest.percentage - student.preTest.percentage}%
                                    </h3>
                                </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        const existingModal = document.getElementById('studentModal');
        if (existingModal) existingModal.remove();

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('studentModal'));
        modal.show();
    }
}

// Global functions
function refreshData() {
    monitoring.refreshCurrentSection();
}

function applyPretestFilter() {
    monitoring.applyPretestFilter();
}

function applyPosttestFilter() {
    monitoring.applyPosttestFilter();
}

function exportToExcel() {
    monitoring.exportToExcel();
}

function exportToJSON() {
    monitoring.exportToJSON();
}

function importFromJSON() {
    monitoring.importFromJSON();
}

// Initialize monitoring system when page loads
let monitoring;
document.addEventListener('DOMContentLoaded', function() {
    monitoring = new MonitoringSystem();
});