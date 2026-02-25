# KryptoLab 🔐

Interaktivní vzdělávací platforma kryptografie — Caesarova šifra a ECC.

## Tech stack
- **React 19** + **React Router v7**
- **Tailwind CSS v4**
- **Vite 7**
- Nasazení: **Cloudflare Pages**

## Spuštění lokálně

```bash
npm install
npm run dev
```

Otevři [http://localhost:5173](http://localhost:5173)

## Build pro produkci

```bash
npm run build
```

## Nasazení na Cloudflare Pages

1. Propoj GitHub repozitář s Cloudflare Pages
2. Nastav:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Hotovo — SPA routing zajišťuje `public/_redirects`

## Struktura projektu

```
src/
├── pages/
│   ├── Landing.jsx       — úvodní stránka (/)
│   ├── Caesar.jsx        — /caesar
│   ├── ECC.jsx           — /ecc
│   ├── caesar/
│   │   ├── CaesarLearn.jsx    — tab Učebna
│   │   ├── CaesarLab.jsx      — tab Lab
│   │   └── CaesarTerminal.jsx — tab Terminál
│   └── ecc/
│       ├── EccLearn.jsx
│       ├── EccLab.jsx
│       └── EccTerminal.jsx
├── components/
│   ├── Navbar.jsx
│   ├── TabBar.jsx
│   ├── InfoPanel.jsx
│   ├── CodeBlock.jsx
│   ├── TerminalEmulator.jsx
│   ├── FrequencyChart.jsx
│   └── EccCurveVis.jsx
├── contexts/
│   └── LanguageContext.jsx
├── utils/
│   ├── caesar.js    — šifrování, dešifrování, brute force
│   └── ecc.js       — ECDH, ECDSA, vizualizace křivky
└── translations/
    └── index.js     — CS/EN překlady
```
