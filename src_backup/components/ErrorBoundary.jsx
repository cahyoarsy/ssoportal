import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error){
    return { hasError: true, error };
  }

  componentDidCatch(error, info){
    this.setState({ info });
    if (this.props.onError) {
      try { this.props.onError(error, info); } catch(_){}
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null });
    if (this.props.onReset) {
      try { this.props.onReset(); } catch(_){}
    }
  };

  render(){
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6">
          <div className="max-w-lg w-full bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-8 text-white shadow-xl">
            <h1 className="text-2xl font-semibold mb-4">Terjadi Kesalahan</h1>
            <p className="text-sm text-slate-200 mb-4">Maaf, terjadi error saat merender antarmuka aplikasi.</p>
            {this.state.error && (
              <pre className="text-xs bg-black/40 p-3 rounded-md overflow-auto max-h-40 mb-4 whitespace-pre-wrap">{String(this.state.error?.message || this.state.error)}</pre>
            )}
            <div className="flex gap-3">
              <button onClick={this.handleReset} className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium">Coba Muat Ulang Komponen</button>
              <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-700 text-white text-sm">Reload Halaman</button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
