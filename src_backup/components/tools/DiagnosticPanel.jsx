import { useState, useEffect } from 'react';

export default function DiagnosticPanel({ 
  ssoCore, 
  moduleManager, 
  authService, 
  onModuleSelect, 
  user,
  availableModules 
}) {
  const [tests, setTests] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);

  // Safe JSON serializer to avoid circular references
  const safeStringify = (obj) => {
    try {
      return JSON.stringify(obj, (key, value) => {
        if (value instanceof HTMLElement) {
          return `[HTMLElement: ${value.tagName}#${value.id || 'no-id'}]`;
        }
        if (value && typeof value === 'object' && value.constructor?.name?.includes('Fiber')) {
          return '[React Fiber Node]';
        }
        if (typeof value === 'function') {
          return `[Function: ${value.name || 'anonymous'}]`;
        }
        if (value && typeof value === 'object' && value.toString === Object.prototype.toString) {
          // Detect potential circular references
          try {
            JSON.stringify(value);
            return value;
          } catch {
            return '[Circular Reference]';
          }
        }
        return value;
      }, 2);
    } catch (error) {
      return `[Serialization Error: ${error.message}]`;
    }
  };

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
    console.log(`[DIAGNOSTIC] ${message}`);
  };

  // Intelligent problem analysis
  const analyzeProblem = (testResults) => {
    const failures = Object.entries(testResults).filter(([_, result]) => result.status === 'fail');
    const successes = Object.entries(testResults).filter(([_, result]) => result.status === 'pass');
    
    if (failures.length === 0) {
      return {
        severity: 'success',
        title: '✅ Semua Sistem Berfungsi Normal',
        summary: 'Tidak ada masalah yang terdeteksi. Semua komponen sistem berjalan dengan baik.',
        recommendations: ['Sistem siap digunakan', 'Monitoring rutin direkomendasikan'],
        technicalDetails: [], // Always an array
        failureCount: 0,
        successCount: successes.length
      };
    }

    let severity = 'warning';
    let title = '⚠️ Masalah Terdeteksi';
    let summary = '';
    let recommendations = [];
    let technicalDetails = []; // Initialize as array

    // Critical system failures
    const criticalFailures = failures.filter(([name]) => 
      name.includes('SSO Core') || name.includes('Module Manager') || name.includes('Auth Service')
    );

    if (criticalFailures.length > 0) {
      severity = 'critical';
      title = '🚨 Kegagalan Sistem Kritis';
      summary = 'Komponen inti sistem tidak tersedia. Aplikasi tidak dapat berfungsi dengan normal.';
      recommendations = [
        'Restart aplikasi segera',
        'Periksa console untuk error JavaScript',
        'Verifikasi import statements untuk SSO Core, Module Manager, dan Auth Service',
        'Hubungi developer jika masalah berlanjut'
      ];
    }

    // Module container issues
    const containerFailures = failures.filter(([name]) => 
      name.includes('Module Container') || name.includes('moduleContainerRef')
    );

    if (containerFailures.length > 0 && severity !== 'critical') {
      severity = 'high';
      title = '❌ Masalah Container Module';
      summary = 'Module container tidak tersedia di DOM. E-Learning dan module lain tidak dapat dimuat.';
      recommendations = [
        'Periksa apakah immersive mode component ter-render dengan benar',
        'Verifikasi moduleContainerRef di App.jsx',
        'Pastikan data-module-container attribute ada di DOM',
        'Coba refresh halaman'
      ];
    }

    // Function/prop issues
    const propFailures = failures.filter(([name]) => 
      name.includes('onModuleSelect') || name.includes('Prop')
    );

    if (propFailures.length > 0 && severity === 'warning') {
      title = '⚠️ Masalah Props/Functions';
      summary = 'Beberapa props atau functions tidak tersedia. Fitur tertentu mungkin tidak berfungsi.';
      recommendations = [
        'Verifikasi props yang diteruskan ke UnesaDashboard',
        'Periksa loadModule function di App.jsx',
        'Pastikan onModuleSelect prop diteruskan dengan benar'
      ];
    }

    // Module registration issues
    const moduleFailures = failures.filter(([name]) => 
      name.includes('E-Learning Module Registration')
    );

    if (moduleFailures.length > 0 && severity === 'warning') {
      title = '📚 Masalah Registrasi Module E-Learning';
      summary = 'Module E-Learning tidak terdaftar dengan benar di Module Manager.';
      recommendations = [
        'Periksa registerBuiltInModules() di ModuleManager.js',
        'Verifikasi path module E-Learning',
        'Pastikan module ID "elearning" terdaftar'
      ];
    }

    // Compile technical details
    technicalDetails = failures.map(([name, result]) => 
      `${name}: ${result.error}`
    );

    return {
      severity,
      title,
      summary,
      recommendations,
      technicalDetails: technicalDetails || [], // Ensure it's always an array
      failureCount: failures.length,
      successCount: successes.length
    };
  };

  const runTest = async (testName, testFn) => {
    try {
      addLog(`🧪 Running test: ${testName}`, 'test');
      const result = await testFn();
      setTests(prev => ({ ...prev, [testName]: { status: 'pass', result } }));
      addLog(`✅ ${testName}: PASSED`, 'success');
      return result;
    } catch (error) {
      setTests(prev => ({ ...prev, [testName]: { status: 'fail', error: error.message } }));
      addLog(`❌ ${testName}: FAILED - ${error.message}`, 'error');
      return null;
    }
  };

  const runAllTests = async () => {
    setLogs([]);
    setDiagnosis(null);
    addLog('🚀 Starting comprehensive diagnostic tests...', 'info');

    // Test 1: Basic Dependencies
    await runTest('SSO Core Available', () => {
      if (!ssoCore) throw new Error('SSO Core is null/undefined');
      return { available: true, type: typeof ssoCore };
    });

    await runTest('Module Manager Available', () => {
      if (!moduleManager) throw new Error('Module Manager is null/undefined');
      return { available: true, type: typeof moduleManager };
    });

    await runTest('Auth Service Available', () => {
      if (!authService) throw new Error('Auth Service is null/undefined');
      return { available: true, type: typeof authService };
    });

    // Test 2: Props Validation
    await runTest('onModuleSelect Prop', () => {
      if (!onModuleSelect) throw new Error('onModuleSelect is null/undefined');
      if (typeof onModuleSelect !== 'function') throw new Error('onModuleSelect is not a function');
      return { available: true, type: typeof onModuleSelect };
    });

    await runTest('User Prop', () => {
      if (!user) throw new Error('User is null/undefined');
      return { available: true, name: user.name, role: user.role };
    });

    // Test 3: Module Registration
    await runTest('E-Learning Module Registration', () => {
      if (!moduleManager.modules) throw new Error('ModuleManager.modules is not available');
      const elearningModule = moduleManager.modules.get('elearning');
      if (!elearningModule) throw new Error('E-Learning module is not registered');
      return { registered: true, module: elearningModule };
    });

    // Test 4: Module Manager Methods
    await runTest('Module Manager Load Method', () => {
      if (!moduleManager.load) throw new Error('ModuleManager.load method not available');
      if (typeof moduleManager.load !== 'function') throw new Error('ModuleManager.load is not a function');
      return { available: true, type: typeof moduleManager.load };
    });

    // Test 5: DOM Elements
    await runTest('Module Container Reference', () => {
      const containers = document.querySelectorAll('[data-module-container]');
      const visibleContainer = document.querySelector('.immersive-module-content');
      
      if (containers.length === 0 && !visibleContainer) {
        throw new Error('No module container found in DOM');
      }
      
      // Clean data - avoid circular references
      const containerInfo = Array.from(containers).map(el => ({
        tagName: el.tagName,
        id: el.id,
        className: el.className,
        dataset: el.dataset,
        visible: !el.classList.contains('hidden')
      }));

      if (visibleContainer) {
        containerInfo.push({
          tagName: visibleContainer.tagName,
          id: visibleContainer.id || 'no-id',
          className: visibleContainer.className,
          dataset: { type: 'immersive-visible' },
          visible: true
        });
      }
      
      return { 
        found: containers.length + (visibleContainer ? 1 : 0), 
        containerInfo,
        hasVisibleContainer: containerInfo.some(c => c.visible)
      };
    });

    // Test 6: E-Learning File Accessibility
    await runTest('E-Learning Files Accessible', async () => {
      try {
        const response = await fetch('/integrations/elearning-iml/index.html');
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        return { accessible: true, status: response.status };
      } catch (error) {
        throw new Error(`E-Learning files not accessible: ${error.message}`);
      }
    });

    // Test 7: Module Loading Test
    await runTest('Module Load Process', async () => {
      try {
        // Check if module has previous error
        const elearningModule = moduleManager.modules.get('elearning');
        if (elearningModule && elearningModule.error) {
          throw new Error(`Module has previous error: ${elearningModule.error}`);
        }
        return { status: 'ready', previousError: elearningModule?.error || 'none' };
      } catch (error) {
        throw new Error(`Module load process check failed: ${error.message}`);
      }
    });

    addLog('🏁 All diagnostic tests completed!', 'info');
    
    // Analyze results and generate diagnosis
    const currentTests = { ...tests };
    // Wait a bit for state to update
    setTimeout(() => {
      const analysis = analyzeProblem(currentTests);
      setDiagnosis(analysis);
      addLog(`📊 Diagnosis complete: ${analysis.title}`, analysis.severity === 'critical' ? 'error' : analysis.severity === 'high' ? 'error' : 'info');
    }, 500);
  };

  // Test onClick functionality
  const testOnClick = () => {
    addLog('🖱️ Testing onClick functionality...', 'test');
    try {
      if (onModuleSelect) {
        addLog('📞 Calling onModuleSelect("elearning")...', 'test');
        onModuleSelect('elearning');
        addLog('✅ onModuleSelect called successfully!', 'success');
      } else {
        addLog('❌ onModuleSelect is not available!', 'error');
      }
    } catch (error) {
      addLog(`❌ onClick test failed: ${error.message}`, 'error');
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700"
      >
        🔧 Diagnostics
      </button>

      {/* Diagnostic Panel */}
      {isVisible && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  🔧 System Diagnostics
                </h2>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Diagnosis Summary */}
              {diagnosis && (
                <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                  diagnosis.severity === 'critical' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
                  diagnosis.severity === 'high' ? 'bg-orange-50 border-orange-500 dark:bg-orange-900/20' :
                  diagnosis.severity === 'warning' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20' :
                  'bg-green-50 border-green-500 dark:bg-green-900/20'
                }`}>
                  <div className="mb-3">
                    <h3 className={`text-lg font-bold ${
                      diagnosis.severity === 'critical' ? 'text-red-800 dark:text-red-200' :
                      diagnosis.severity === 'high' ? 'text-orange-800 dark:text-orange-200' :
                      diagnosis.severity === 'warning' ? 'text-yellow-800 dark:text-yellow-200' :
                      'text-green-800 dark:text-green-200'
                    }`}>
                      {diagnosis.title}
                    </h3>
                    <p className={`text-sm ${
                      diagnosis.severity === 'critical' ? 'text-red-700 dark:text-red-300' :
                      diagnosis.severity === 'high' ? 'text-orange-700 dark:text-orange-300' :
                      diagnosis.severity === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
                      'text-green-700 dark:text-green-300'
                    }`}>
                      {diagnosis.summary}
                    </p>
                  </div>
                  
                  {diagnosis.recommendations && (
                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        🔧 Rekomendasi Penyelesaian:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {diagnosis.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {diagnosis.technicalDetails && Array.isArray(diagnosis.technicalDetails) && diagnosis.technicalDetails.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                        🔍 Detail Teknis ({diagnosis.technicalDetails.length} error{diagnosis.technicalDetails.length !== 1 ? 's' : ''})
                      </summary>
                      <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                        {diagnosis.technicalDetails.map((detail, index) => (
                          <div key={index} className="mb-1 break-words">{detail}</div>
                        ))}
                      </div>
                    </details>
                  )}
                  
                  <div className="mt-3 flex justify-between text-xs text-gray-600 dark:text-gray-400">
                    <span>✅ Passed: {diagnosis.successCount || 0}</span>
                    <span>❌ Failed: {diagnosis.failureCount || 0}</span>
                  </div>
                </div>
              )}

              {/* Control Buttons */}
              <div className="mb-6 flex gap-3 flex-wrap">
                <button
                  onClick={runAllTests}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  🧪 Run All Tests
                </button>
                <button
                  onClick={() => {
                    const currentDiagnosis = analyzeProblem(tests);
                    setDiagnosis(currentDiagnosis);
                    addLog(`📊 Quick diagnosis: ${currentDiagnosis.title}`, 'info');
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  🔍 Quick Diagnosis
                </button>
                <button
                  onClick={testOnClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  🖱️ Test onClick
                </button>
                <button
                  onClick={() => {
                    setLogs([]);
                    setDiagnosis(null);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  🗑️ Clear All
                </button>
              </div>

              {/* Test Results */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Test Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(tests).map(([testName, testResult]) => (
                    <div
                      key={testName}
                      className={`p-3 rounded-lg border ${
                        testResult.status === 'pass'
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={testResult.status === 'pass' ? 'text-green-600' : 'text-red-600'}>
                          {testResult.status === 'pass' ? '✅' : '❌'}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {testName}
                        </span>
                      </div>
                      {testResult.error && (
                        <div className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {testResult.error}
                        </div>
                      )}
                      {testResult.result && (
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <pre className="whitespace-pre-wrap break-words">
                            {typeof testResult.result === 'object' 
                              ? safeStringify(testResult.result)
                              : String(testResult.result)
                            }
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Logs */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Live Logs
                </h3>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">No logs yet. Run tests to see output.</div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="mb-1">
                        <span className="text-gray-500">[{log.timestamp}]</span>{' '}
                        <span className={
                          log.type === 'error' ? 'text-red-400' :
                          log.type === 'success' ? 'text-green-400' :
                          log.type === 'test' ? 'text-yellow-400' :
                          'text-blue-400'
                        }>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}