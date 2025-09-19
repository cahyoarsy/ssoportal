# ElectriCAD Designer (Web)

ElectriCAD Designer adalah aplikasi web internal untuk membuat diagram dan tata letak sederhana instalasi listrik dasar (outlet, saklar, lampu, MCB) dengan fitur interaktif.

## Fitur Utama
- Canvas grid dengan zoom & pan (Ctrl + scroll untuk zoom, Alt + drag untuk pan cepat)
- Komponen: Outlet, Switch, Lamp (Lampu), Breaker / MCB
- Wiring (garis penghubung antar komponen)
- Seleksi & rotasi komponen
- Undo / Redo (Ctrl+Z / Ctrl+Y)
- Snap to grid (aktif/nonaktif)
- Draft wire (preview sebelum koneksi final)
- Mode alat: Select, Component, Wire, Pan, Erase
- Status bar real-time (jumlah elemen, zoom, snap, tool aktif)

## Shortcut Keyboard
| Aksi | Shortcut |
|------|----------|
| Select Tool | 1 |
| Component Tool | 2 |
| Wire Tool | 3 |
| Pan Tool | 4 |
| Erase Tool | 5 |
| Undo | Ctrl + Z |
| Redo | Ctrl + Y |
| Zoom | Ctrl + Scroll |
| Pan cepat | Alt + Drag |
| Delete selection | Delete |

## Struktur Teknis
- `useElectricalCadEngine.js`: Hook utama yang mengelola state canvas (elements, selection, zoom, pan, wiring, history)
- `ElectricalCadDesigner.jsx`: UI container + integrasi hook + panel kontrol + canvas rendering

## Arsitektur Data Elemen
```js
Component: {
  id: number,
  kind: 'component',
  type: 'outlet' | 'switch' | 'lamp' | 'breaker',
  x: number,
  y: number,
  rotation: number,
  meta: Record<string, any>
}
Wire: {
  id: number,
  kind: 'wire',
  start: { x: number, y: number },
  end: { x: number, y: number }
}
```

## Rencana Pengembangan Lanjutan
- Export ke PNG / JSON layout
- Label / annotation text
- Layer management
- Simulasi alur arus sederhana
- Panel / panel schedule builder
- BOM (Bill of Material) generator

## Integrasi Navigasi
Diluncurkan melalui `SoftwarePage` (ID software: `electrical-cad`) dan view route internal `currentView === 'electricalCad'` di `App.jsx`.

---
Dikembangkan sebagai prototipe cepat untuk kebutuhan pembelajaran dan visualisasi dasar instalasi listrik.
