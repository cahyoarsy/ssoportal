import React from 'react';
import { motion } from 'framer-motion';

class IntegrationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    console.error('Integration Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Integration Error</h1>
              <p className="text-slate-600">
                Terjadi kesalahan saat memuat integrasi. Silakan coba lagi atau hubungi administrator.
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Error Details:</h3>
              <pre className="text-xs text-slate-600 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </pre>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Muat Ulang
              </button>
              
              <button
                onClick={() => window.history.back()}
                className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                Kembali
              </button>
            </div>

            {import.meta.env.DEV && (
              <details className="mt-6">
                <summary className="text-sm text-slate-500 cursor-pointer hover:text-slate-700">
                  Debug Information (Development Mode)
                </summary>
                <pre className="mt-2 text-xs text-slate-600 bg-slate-50 p-4 rounded overflow-auto max-h-40">
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default IntegrationErrorBoundary;