import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import TerminalEmulator from '../../components/TerminalEmulator'

export default function EccTerminal() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const tt = t.ecc.terminal

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const commandHandlers = {
    help: () => [
      { text: '═══════════════════════════════════════════', type: 'dim' },
      { text: 'DOSTUPNÉ PŘÍKAZY:', type: 'highlight' },
      { text: '  run attack  — simulovat útok hrubou silou na ECC-256', type: 'output' },
      { text: '  compare     — srovnání bezpečnosti RSA / ECC / kvantum', type: 'output' },
      { text: '  show math   — matematika problému diskrétního logaritmu', type: 'output' },
      { text: '  reset       — vymazat terminál', type: 'output' },
      { text: '═══════════════════════════════════════════', type: 'dim' },
    ],

    'run attack': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   SIMULACE ÚTOKU HRUBOU SILOU — ECC-256      ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await addLine('Cíl: ECC-256 veřejný klíč (256-bitové pole)', 'warning')
      await addLine('Metoda: Baby-step Giant-step (nejlepší klasický algoritmus)', 'output')
      await addLine('', 'output')
      await sleep(400)

      await addLine('Počítám velikost prostoru prohledávání...', 'system')
      await sleep(300)
      await addLine('', 'output')
      await addLine('Řád grupy křivky secp256k1:', 'output')
      await addLine('  n = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFE', 'dim')
      await addLine('      BAAEDCE6AF48A03BBFD25E8CD0364141', 'dim')
      await addLine('', 'output')
      await addLine('  n ≈ 1.158 × 10^77', 'highlight')
      await addLine('', 'output')
      await sleep(300)

      await addLine('Baby-step Giant-step potřebuje √n operací:', 'output')
      await addLine('  √n ≈ 3.4 × 10^38 bodových násobení', 'warning')
      await addLine('', 'output')
      await sleep(300)

      await addLine('Simuluji útok...', 'system')
      await sleep(200)

      const steps = [
        ['Pokus 1/10^38:', '(0x4a2f...)', 'NESPRÁVNÉ'],
        ['Pokus 2/10^38:', '(0x7c91...)', 'NESPRÁVNÉ'],
        ['Pokus 3/10^38:', '(0x1d44...)', 'NESPRÁVNÉ'],
        ['Pokus 4/10^38:', '...', ''],
      ]
      for (const [step, point, res] of steps) {
        await addLine(`  ${step} testuju bod ${point} ${res}`, res === 'NESPRÁVNÉ' ? 'dim' : 'output')
        await sleep(150)
      }

      await addLine('', 'output')
      await addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim')
      await addLine('EXTRAPOLACE VÝSLEDKŮ:', 'highlight')
      await addLine('', 'output')
      await addLine('  Rychlost útoku (nejrychlejší GPU 2026):', 'output')
      await addLine('  ≈ 10^9 operací / sekunda', 'output')
      await addLine('', 'output')
      await addLine('  Odhadovaný čas prolomení ECC-256:', 'output')
      await addLine('  ≈ 3.4 × 10^29 sekund', 'warning')
      await addLine('  ≈ 1.08 × 10^22 let', 'error')
      await addLine('', 'output')
      await addLine('  Pro srovnání: věk vesmíru ≈ 1.38 × 10^10 let', 'dim')
      await addLine('', 'output')
      await addLine('VÝSLEDEK: Útok SELHAL.', 'error')
      await addLine('ECC-256 je prakticky NEPROLOMITELNÉ klasickým počítačem.', 'success')
      await addLine('', 'output')
      await addLine('Bezpečnost: ██████████ MAXIMÁLNÍ (vůči klasickým počítačům)', 'success')
    },

    compare: async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   SROVNÁNÍ BEZPEČNOSTNÍCH SYSTÉMŮ            ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(300)

      await addLine('┌─────────────────┬──────────────┬──────────────┬───────────┐', 'dim')
      await addLine('│ Algoritmus      │ Klíč         │ Klasický PC  │ Kvantum   │', 'highlight')
      await addLine('├─────────────────┼──────────────┼──────────────┼───────────┤', 'dim')
      await sleep(100)
      await addLine('│ Caesar šifra    │ 25 hodnot    │ < 1 ms       │ < 1 ms    │', 'error')
      await sleep(100)
      await addLine('│ AES-128         │ 128 bitů     │ 10^21 let    │ 10^10 let │', 'output')
      await sleep(100)
      await addLine('│ RSA-2048        │ 2048 bitů    │ 10^15 let    │ Hodiny!   │', 'warning')
      await sleep(100)
      await addLine('│ ECC-256         │ 256 bitů     │ 10^22 let    │ Hodiny!   │', 'warning')
      await sleep(100)
      await addLine('│ CRYSTALS-Kyber  │ 800-1568 B   │ 10^40+ let   │ 10^25 let │', 'success')
      await addLine('└─────────────────┴──────────────┴──────────────┴───────────┘', 'dim')
      await addLine('', 'output')
      await sleep(200)
      await addLine('ZÁVĚR:', 'highlight')
      await addLine('  ✗ Caesar:  PROLOMENÁ (okamžitě)', 'error')
      await addLine('  ✓ ECC-256: BEZPEČNÁ pro klasické počítače', 'success')
      await addLine('  ⚠ ECC-256: OHROŽENA Shorovým algoritmem (kvantum)', 'warning')
      await addLine('  ✓ Kyber:   BEZPEČNÁ i pro kvantové počítače', 'success')
      await addLine('', 'output')
      await addLine('Shorův algoritmus (1994) řeší problém diskrétního logaritmu', 'info')
      await addLine('v polynomiálním čase na kvantovém počítači.', 'info')
    },

    'show math': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   PROBLÉM DISKRÉTNÍHO LOGARITMU (ECDLP)      ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(300)
      await addLine('DEFINICE:', 'output')
      await addLine('  Dáno: bod G (generátor) na eliptické křivce E(Fp)', 'output')
      await addLine('  Dáno: bod Q = k·G  (veřejný klíč)', 'output')
      await addLine('  Hledáme: k  (soukromý klíč)', 'warning')
      await addLine('', 'output')
      await sleep(200)
      await addLine('PROČ JE TO TĚŽKÉ?', 'highlight')
      await addLine('', 'output')
      await addLine('  Sčítání bodů na křivce je snadné:', 'output')
      await addLine('  P + Q = R  →  přímočarý geometrický výpočet O(1)', 'success')
      await addLine('', 'output')
      await addLine('  Násobení skalárem je snadné (opakované sčítání):', 'output')
      await addLine('  k·G = G + G + G + ... (k-krát)  →  O(log k)', 'success')
      await addLine('', 'output')
      await addLine('  Zpětná operace (logaritmus) je EXTRÉMNĚ těžká:', 'output')
      await addLine('  Q → k  =  neznámý počet součtů  →  O(√n)', 'error')
      await addLine('', 'output')
      await sleep(300)
      await addLine('ANALOGIE:', 'highlight')
      await addLine('  Hodiny s ručičkami: snadno posunout o k hodin.', 'output')
      await addLine('  Těžko zjistit, kolikrát ručička přeskočila přes 12.', 'output')
      await addLine('', 'output')
      await addLine('ČÍSELNÝ PŘÍKLAD (malé pole p=97):', 'output')
      await addLine('  G = (13, 7) na křivce y²=x³-3x+3 (mod 97)', 'output')
      await addLine('  k = 42 (tajný klíč)', 'dim')
      await addLine('  Q = 42·G = (34, 21) (veřejný klíč)', 'output')
      await addLine('  Útočník zná G a Q, ale zjistit k=42 trvá...', 'warning')
      await addLine('  ...√97 ≈ 10 kroků pro p=97 (demo pole)', 'output')
      await addLine('  ...√2²⁵⁶ ≈ 10^38 kroků pro secp256k1 (reálné použití)', 'error')
    },
  }

  return (
    <div className="tab-content">
      <h2 className="text-2xl mb-4 glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.8rem' }}>
        {tt.title}
      </h2>

      {/* Context */}
      <div className="border p-3 mb-4 text-xs" style={{ borderColor: '#1a3a1a', color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
        <div style={{ color: '#ffaa00' }}>SCÉNÁŘ:</div>
        <div>Pokus o prolomení ECC-256 klíče. Simulujeme útok hrubou silou a analyzujeme proč je to prakticky nemožné.</div>
        <div>Pro srovnání: Caesarovu šifru prolomíme za &lt;1ms. ECC-256 by trvalo déle než věk vesmíru.</div>
      </div>

      <TerminalEmulator
        welcomeLines={tt.welcomeMsg}
        commandHandlers={commandHandlers}
        prompt="attacker@kryptolab:~$"
      />

      {/* Hints */}
      <div className="mt-4 border p-3 text-xs" style={{ borderColor: '#1a3a1a', color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
        {tt.hint} &nbsp;
        <span style={{ color: '#00aa2b' }}>run attack</span> &nbsp;|&nbsp;
        <span style={{ color: '#00aa2b' }}>compare</span> &nbsp;|&nbsp;
        <span style={{ color: '#00aa2b' }}>show math</span> &nbsp;|&nbsp;
        <span style={{ color: '#00aa2b' }}>reset</span>
      </div>
    </div>
  )
}
