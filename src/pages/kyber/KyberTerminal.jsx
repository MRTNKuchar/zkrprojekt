import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import TerminalEmulator from '../../components/TerminalEmulator'

export default function KyberTerminal() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const tt = t.kyber.terminal

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const commandHandlers = {
    help: () => [
      { text: '═══════════════════════════════════════════', type: 'dim' },
      { text: 'DOSTUPNÉ PŘÍKAZY:', type: 'highlight' },
      { text: '  show shor     — Shorův algoritmus a hrozba pro RSA/ECC', type: 'output' },
      { text: '  show lwe      — demonstrace problému LWE', type: 'output' },
      { text: '  compare       — srovnání klasické vs post-kvantové kryptografie', type: 'output' },
      { text: '  timeline      — časová osa NIST standardizace', type: 'output' },
      { text: '  reset         — vymazat terminál', type: 'output' },
      { text: '═══════════════════════════════════════════', type: 'dim' },
    ],

    'show shor': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   SHORŮV ALGORITMUS — HROZBA PRO RSA & ECC   ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(300)

      await addLine('RSA a ECC spoléhají na tyto těžké problémy:', 'output')
      await addLine('  RSA:  faktorizace velkých čísel (n = p × q)', 'warning')
      await addLine('  ECC:  problém diskrétního logaritmu (Q = k·G)', 'warning')
      await addLine('', 'output')
      await sleep(400)

      await addLine('Na klasickém počítači:', 'output')
      await addLine('  RSA-2048: ~10¹⁵ let', 'success')
      await addLine('  ECC-256:  ~10²² let', 'success')
      await addLine('', 'output')
      await sleep(300)

      await addLine('Shorův algoritmus (1994) na kvantovém počítači:', 'system')
      await sleep(200)

      await addLine('  Krok 1: Kvantová Fourierova transformace...', 'dim')
      await sleep(300)
      await addLine('  Krok 2: Hledání periody funkce f(x) = aˣ mod n...', 'dim')
      await sleep(300)
      await addLine('  Krok 3: Eukleidův algoritmus na periodu...', 'dim')
      await sleep(300)
      await addLine('  Výsledek: p a q nalezeny!', 'error')
      await addLine('', 'output')
      await sleep(200)

      await addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim')
      await addLine('VÝSLEDKY:', 'highlight')
      await addLine('  RSA-2048 na kvantovém počítači: ~Hodiny', 'error')
      await addLine('  ECC-256 na kvantovém počítači:  ~Hodiny', 'error')
      await addLine('', 'output')
      await addLine('  Počet qubitů potřebný pro RSA-2048: ~4 000', 'warning')
      await addLine('  Nejlepší kvantový počítač dnes:     ~1 000 (IBM, 2023)', 'output')
      await addLine('  Google Willow (2024):               ~105 qubitů', 'output')
      await addLine('', 'output')
      await addLine('ZÁVĚR: Hrozba je reálná, ale zatím nikoliv bezprostřední.', 'warning')
      await addLine('Doporučení: MIGROVAT NA POST-KVANTOVÉ ALGORITMY.', 'success')
    },

    'show lwe': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   LEARNING WITH ERRORS (LWE)                 ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(300)

      await addLine('PROBLÉM: Mám matici A a vektor b = A·s + e', 'output')
      await addLine('         Najdi tajný vektor s!', 'warning')
      await addLine('', 'output')
      await sleep(300)

      await addLine('PŘÍKLAD (malé parametry: n=4, q=17):', 'system')
      await sleep(200)
      await addLine('', 'output')
      await addLine('  Tajný klíč s  = [ 1, -1,  0,  1]', 'dim')
      await addLine('', 'output')
      await addLine('  Veřejná matice A (mod 17):', 'output')
      await addLine('    [  3,  14,   8,   2 ]', 'output')
      await addLine('    [  7,   1,  15,   9 ]', 'output')
      await addLine('    [ 12,   5,   3,  11 ]', 'output')
      await addLine('    [ 16,   8,   6,   4 ]', 'output')
      await addLine('', 'output')
      await sleep(300)
      await addLine('  A·s = [15, 12,  8,  7]  (bez šumu — snadné!)', 'success')
      await sleep(200)
      await addLine('  e   = [ 0,  1, -1,  1]  (malý šum, TAJNÝ)', 'dim')
      await sleep(200)
      await addLine('  b   = [15, 13,  7,  8]  (veřejné)', 'warning')
      await addLine('', 'output')
      await sleep(300)

      await addLine('ÚTOK: Útočník vidí A a b, hledá s...', 'system')
      await sleep(400)
      await addLine('  Zkouší s = [ 1,  0,  0,  0] → A·s = [3,7,12,16] ≠ b', 'dim')
      await sleep(150)
      await addLine('  Zkouší s = [ 0,  1,  0,  0] → A·s = [14,1,5,8]  ≠ b', 'dim')
      await sleep(150)
      await addLine('  Zkouší s = [-1,  1,  1, -1] → A·s = [3,9,14,2]  ≠ b', 'dim')
      await sleep(200)
      await addLine('  Pro n=256, q=3329 (Kyber512): prohledávání = 3329²⁵⁶ možností', 'error')
      await addLine('', 'output')
      await addLine('ZÁVĚR: Ani kvantový počítač neumí LWE řešit efektivně.', 'success')
      await addLine('       Groverův algoritmus zkrátí bezpečnost napůl — stačí zdvojnásobit n.', 'success')
    },

    compare: async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   SROVNÁNÍ KRYPTOGRAFICKÝCH SYSTÉMŮ          ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(200)

      await addLine('┌──────────────────┬─────────────┬────────────┬──────────────┐', 'dim')
      await addLine('│ Algoritmus       │ Klíč        │ Klasický   │ Kvantový     │', 'highlight')
      await addLine('├──────────────────┼─────────────┼────────────┼──────────────┤', 'dim')
      await sleep(100)
      await addLine('│ Caesar           │ 25 hodnot   │ < 1ms      │ < 1ms        │', 'error')
      await sleep(100)
      await addLine('│ RSA-2048         │ 2048 bitů   │ 10¹⁵ let   │ Hodiny (!)   │', 'warning')
      await sleep(100)
      await addLine('│ ECC-256          │ 256 bitů    │ 10²² let   │ Hodiny (!)   │', 'warning')
      await sleep(100)
      await addLine('│ AES-256          │ 256 bitů    │ 10³² let   │ 10¹⁶ let     │', 'output')
      await sleep(100)
      await addLine('│ ML-KEM-512       │ ~800 B      │ 10⁴⁰+ let  │ 10²⁵+ let    │', 'success')
      await sleep(100)
      await addLine('│ ML-KEM-1024      │ ~1568 B     │ 10⁶⁰+ let  │ 10⁴⁰+ let    │', 'success')
      await addLine('└──────────────────┴─────────────┴────────────┴──────────────┘', 'dim')
      await addLine('', 'output')
      await sleep(200)
      await addLine('ZÁVĚRY:', 'highlight')
      await addLine('  ✗ RSA, ECC: OHROŽENY Shorovým algoritmem', 'error')
      await addLine('  ✓ AES-256: bezpečný i kvantově (jen polovina bitů)', 'output')
      await addLine('  ✓ ML-KEM:  kvantově bezpečný, NIST standard 2024', 'success')
    },

    timeline: async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   TIMELINE — NIST POST-QUANTUM STANDARDIZACE ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(200)

      const events = [
        ['1994', 'Shor publikuje kvantový algoritmus pro faktorizaci', 'warning'],
        ['2001', 'Groverův algorit. — kvadratické urychlení prohledávání', 'warning'],
        ['2009', 'Regev: LWE je bezpečné (redukce na nejhorší případ)', 'output'],
        ['2016', 'NIST vyhlásí soutěž o post-kvantové algoritmy', 'highlight'],
        ['2017', 'CRYSTALS-Kyber podán do soutěže (Bos, Ducas, ...)', 'output'],
        ['2019', 'Kyber postupuje do 2. kola (top 26 → 9 finalistů)', 'output'],
        ['2022', 'NIST vybírá Kyber jako primární KEM algoritmus', 'success'],
        ['2023', 'Signal nasazuje PQXDH (Kyber + X25519)', 'success'],
        ['2023', 'Chrome 116: TLS s X25519Kyber768', 'success'],
        ['2024', 'NIST FIPS 203: ML-KEM (Kyber) — finální standard', 'success'],
        ['2024', 'Apple: iMessage PQ3 (ML-KEM + Curve25519)', 'success'],
      ]

      for (const [year, desc, type] of events) {
        await addLine(`  [${year}] ${desc}`, type)
        await sleep(120)
      }
      await addLine('', 'output')
      await addLine('Migrace na ML-KEM je doporučena pro veškerou novou infrastrukturu.', 'success')
    },
  }

  return (
    <div className="tab-content">
      <h2 className="text-2xl mb-4" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.8rem', textShadow: '0 0 8px #00ff4166' }}>
        {tt.title}
      </h2>

      <div className="border p-3 mb-4 text-xs" style={{ borderColor: '#1a3a1a', color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
        <div style={{ color: '#ffaa44' }}>SCÉNÁŘ:</div>
        <div>Analýza hrozby kvantových počítačů pro moderní kryptografii a demonstrace post-kvantových řešení.</div>
      </div>

      <TerminalEmulator
        welcomeLines={tt.welcomeMsg}
        commandHandlers={commandHandlers}
        prompt="researcher@kryptolab:~$"
        accentColor="#00ff41"
      />

      <div className="mt-4 border p-3 text-xs" style={{ borderColor: '#1a3a1a', color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
        {tt.hint} &nbsp;
        <span style={{ color: '#00cc35' }}>show shor</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>show lwe</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>compare</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>timeline</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>reset</span>
      </div>
    </div>
  )
}
