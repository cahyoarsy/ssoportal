import React, { useState, useEffect, useCallback, useRef } from 'react';

// Component yang menampilkan iframe aplikasi terintegrasi.
// Versi ini sudah migrasi: token tidak lagi dikirim via hash URL, tetapi melalui
// postMessage handshake (EMBED_READY -> SSO_TOKEN + THEME_SYNC).
export default function AppEmbed({ token, fullPage=false, immersive=false, onExit, onMinimize, app='proyek1', apps=[], onSelectApp, dark, setDark, isAdmin=false, onAdminRefresh, wide=true, setWide }){
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSrc, setActiveSrc] = useState('');
  const [attempt, setAttempt] = useState(0);
  const iframeRef = useRef(null);
  const [expiresAt, setExpiresAt] = useState(null); // ms timestamp
  const [remaining, setRemaining] = useState(null); // ms sisa

  // Metadata app
  const meta = apps.find(a => a.id === app) || { path:'proyek1/index.html', hashBase:'#home' };

  // Generate kandidat URL tanpa token di hash.
  const candidates = useCallback(()=>{
    const origin = window.location.origin;
    const list = [ `${origin}/${meta.path}${meta.hashBase}` ];
    if (/5173/.test(window.location.port)){
      list.push(`http://localhost:5500/${meta.path}${meta.hashBase}`);
    }
    return list;
  },[meta.path, meta.hashBase]);

  // Pilih kandidat awal atau saat retry
  useEffect(()=>{
    const list = candidates();
    setActiveSrc(list[0]);
    setFailed(false);
    setLoading(true);
  },[candidates, attempt]);

  // Fallback pindah kandidat atau tandai gagal
  useEffect(()=>{
    if (!activeSrc) return;
    const timer = setTimeout(()=>{
      if (loading){
        const list = candidates();
        const idx = list.indexOf(activeSrc);
        if (idx > -1 && idx < list.length - 1){
          setActiveSrc(list[idx+1]);
          return;
        }
        setFailed(true);
        setLoading(false);
      }
    }, 5000);
    return ()=> clearTimeout(timer);
  },[activeSrc, loading, candidates]);

  function handleLoad(){ setLoading(false); setFailed(false); }
  function retry(){ setAttempt(a=>a+1); }

  // Decode exp dari JWT
  useEffect(()=>{
    try {
      const parts = token.split('.');
      if(parts.length===3){
        const payload = JSON.parse(atob(parts[1].replace(/-/g,'+').replace(/_/g,'/')));
        if(payload.exp) { setExpiresAt(payload.exp * 1000); } else setExpiresAt(null);
      }
    } catch { setExpiresAt(null); }
  },[token]);

  // Hitung countdown
  useEffect(()=>{
    if(!expiresAt){ setRemaining(null); return; }
    const tick = ()=>{ setRemaining(expiresAt - Date.now()); };
    tick();
    const id = setInterval(tick, 1000);
    return ()=> clearInterval(id);
  },[expiresAt]);

  // Helper kirim pesan ke iframe
  const postToIframe = useCallback((msg)=>{
    if(iframeRef.current && iframeRef.current.contentWindow){
      try { iframeRef.current.contentWindow.postMessage(msg, '*'); } catch {}
    }
  },[]);

  // Sinkronisasi tema saat berubah
  useEffect(()=>{ postToIframe({ type:'THEME_SYNC', dark }); },[dark, postToIframe]);

  // Handshake: iframe kirim EMBED_READY -> kirim token & tema
  useEffect(()=>{
    function onMessage(e){
      if(!e || !e.data) return;
      const allowed = [window.location.origin, 'http://localhost:5500'];
      if(!allowed.includes(e.origin)) return;
      if(e.data.type === 'EMBED_READY'){
        postToIframe({ type:'SSO_TOKEN', token });
        postToIframe({ type:'THEME_SYNC', dark });
        postToIframe({ type:'LAYOUT_MODE', wide });
        // Inject origin config for stricter validation
        postToIframe({ type:'SSO_CONFIG', allowedOrigins: allowed });
      } else if(e.data.type === 'SSO_TEST_RESULT'){
        // Handle test results for audit logging
        console.log('Test result received:', e.data);
        // TODO: Add to audit log if needed
        if(window.SSO_handleTestResult) {
          window.SSO_handleTestResult(e.data);
        }
      }
    }
    window.addEventListener('message', onMessage);
    return ()=> window.removeEventListener('message', onMessage);
  },[token, dark, wide, postToIframe]);

  // Lock scroll saat immersive
  useEffect(()=>{
    if (immersive){
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return ()=> { document.body.style.overflow = prev; };
    }
  },[immersive]);

  const containerClass = immersive ? 'fixed inset-0 z-50 flex flex-col bg-slate-900/95 dark:bg-black' : (fullPage ? 'flex-1 flex flex-col' : 'container-section scroll-mt-24');

  return (
    <section className={containerClass}>
      <style>{`/* force embedded app content to use full width when immersive */
        .embedded-full-width body, .embedded-full-width main { max-width:100% !important; }
      `}</style>
      {!immersive && (
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-slate-800">Aplikasi Terintegrasi</h2>
            {(fullPage || immersive) && apps.length > 1 && (
              <select
                value={app}
                onChange={e=> onSelectApp && onSelectApp(e.target.value)}
                className="border border-slate-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {apps.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            )}
          </div>
          {fullPage && (
            <div className="flex gap-2">
              <button type="button" onClick={()=> onExit && onExit()} className="btn-outline px-4 py-1.5 text-sm">Keluar</button>
            </div>
          )}
        </div>
      )}
      <div className={`relative w-full ${immersive? 'flex-1 flex':' '}${fullPage && !immersive? 'flex-1':'h-[700px] max-h-[80vh]'} `}>
        {(fullPage || immersive) && (
          <div className={`absolute top-2 left-2 right-2 z-20 flex items-center gap-2 border rounded-lg px-3 py-1.5 shadow-sm ${immersive? 'bg-slate-900/70 border-slate-700 backdrop-blur':'bg-white/85 backdrop-blur border-slate-200'}`}>
            {apps.length > 1 && (
              <select
                value={app}
                onChange={e=> onSelectApp && onSelectApp(e.target.value)}
                className="border border-slate-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-700"
              >
                {apps.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            )}
            <span className="text-[11px] text-slate-200 hidden sm:inline">SSO Active</span>
            {isAdmin && (
              <span
                className={`text-[10px] tracking-wide font-semibold px-2 py-0.5 rounded uppercase border ${immersive ? 'bg-amber-900/40 text-amber-300 border-amber-500/40' : 'bg-amber-100 text-amber-700 border-amber-300'}`}
                title="Anda masuk sebagai admin"
              >ADMIN</span>
            )}
            <div className="flex-1" />
            {remaining !== null && (
              <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800/50 text-slate-200" title="Sisa waktu token">
                {remaining > 0 ? Math.max(0, Math.floor(remaining/1000))+'s' : 'exp'}
              </span>
            )}
            {isAdmin && (
              <button type="button" onClick={()=> onAdminRefresh && onAdminRefresh()} className={`text-[11px] px-2 py-1 rounded-md border ${immersive? 'border-amber-400 text-amber-300 bg-amber-900/30 hover:bg-amber-900/45':'border-amber-500 text-amber-600 bg-white hover:bg-amber-50'}`}>Refresh</button>
            )}
            {immersive && (
              <>
                <button type="button" onClick={()=> setWide && setWide(w=>{ const nw=!w; postToIframe({ type:'LAYOUT_MODE', wide:nw }); return nw; })} className={`text-[11px] px-2 py-1 rounded-md border ${immersive? 'border-indigo-500 text-indigo-300 bg-indigo-900/30 hover:bg-indigo-900/45':'border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50'}`}>{wide? 'Standard':'Wide'}</button>
                <button type="button" onClick={()=> onMinimize && onMinimize()} className={`text-[11px] px-2 py-1 rounded-md border ${immersive? 'border-slate-600 text-slate-300 bg-slate-800/60 hover:bg-slate-700/60':'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>Minimize</button>
              </>
            )}
            <button type="button" onClick={()=> setDark && setDark(d=>!d)} className={`text-[11px] px-2 py-1 rounded-md border ${immersive? 'border-slate-600 text-slate-300 bg-slate-800/60 hover:bg-slate-700/60':'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>{dark? 'Light':'Dark'}</button>
            <button type="button" onClick={()=> onExit && onExit()} className={`text-[11px] px-2 py-1 rounded-md border ${immersive? 'border-red-400 text-red-300 bg-red-900/40 hover:bg-red-900/55':'border-red-500 text-red-600 bg-white hover:bg-red-50'}`}>Logout</button>
          </div>
        )}
        {activeSrc && (
          <iframe
            key={activeSrc}
            src={activeSrc}
            title={meta.name || 'Embedded App'}
            className={`w-full h-full ${immersive? 'rounded-none border-0':'rounded-lg border shadow-soft bg-white'} transition-opacity duration-500 ${loading? 'opacity-0':'opacity-100'}`}
            style={immersive? { minHeight: '100vh' } : { minHeight: 700 }}
            ref={iframeRef}
            onLoad={handleLoad}
          />
        )}
        {(loading && !failed) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 text-slate-600 gap-3">
            <div className="h-10 w-10 border-4 border-slate-300 border-t-brand-500 rounded-full animate-spin" />
            <p className="text-sm">Memuat aplikasi terhubung...</p>
            <p className="text-xs">Sumber: {activeSrc}</p>
          </div>
        )}
        {failed && (
          <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 gap-3 ${immersive? 'bg-slate-900/90 text-slate-200':'bg-white/85 backdrop-blur text-slate-700'}`}>
            <h3 className="text-lg font-semibold text-red-500">Gagal memuat Aplikasi</h3>
            <p className="text-sm">Tidak ada kandidat URL yang responsif. Jalankan server root:</p>
            <pre className="bg-slate-800 text-slate-100 rounded p-2 text-xs text-left">npm install -g serve
serve -p 5500 d:\\Website</pre>
            <p className="text-xs">Lalu akses kembali portal di: <code>http://localhost:5500/sso-portal/</code></p>
            <button onClick={retry} className="text-[11px] px-3 py-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50">Coba Lagi</button>
          </div>
        )}
      </div>
    </section>
  );
}
