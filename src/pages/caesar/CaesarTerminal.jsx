import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import TerminalEmulator from '../../components/TerminalEmulator'
import { caesarDecrypt, findBestShift } from '../../utils/caesar'

const TARGET = 'KHOOR ZRUOG WKLV LV D VHFUHW PHVVDJH'

export default function CaesarTerminal() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const tt = t.caesar.terminal

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const commandHandlers = {
    help: () => [
      { text: '═══════════════════════════════', type: 'dim' },
      { text: 'DOSTUPNÉ PŘÍKAZY:', type: 'highlight' },
      { text: '  run attack    — útok hrubou silou na zachycenou zprávu', type: 'output' },
      { text: '  show analysis — frekvenční analýza šifrovaného textu', type: 'output' },
      { text: '  target        — zobrazit zachycenou zprávu', type: 'output' },
      { text: '  reset         — vymazat terminál', type: 'output' },
      { text: '═══════════════════════════════', type: 'dim' },
    ],

    target: async (addLine) => {
      await addLine('', 'output')
      await addLine('ZACHYCENÁ ZPRÁVA:', 'warning')
      await addLine(`  "${TARGET}"`, 'highlight')
      await addLine('Zdroj: odposlech komunikace (simulace)', 'dim')
      await addLine('', 'output')
    },

    'run attack': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔═══════════════════════════════════════╗', 'dim')
      await addLine('║   CAESAR BRUTE FORCE ENGINE v2.0      ║', 'highlight')
      await addLine('╚═══════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await addLine(`Cíl: "${TARGET}"`, 'warning')
      await addLine('Metoda: Vyčerpávající prohledávání (všechny klíče 1-25)', 'output')
      await addLine('', 'output')
      await sleep(300)
      await addLine('Spouštím útok...', 'system')
      await sleep(400)
      await addLine('', 'output')

      const best = findBestShift(TARGET)

      for (let shift = 1; shift <= 25; shift++) {
        const dec = caesarDecrypt(TARGET, shift)
        const isBest = shift === best.shift
        await addLine(
          `[${String(shift).padStart(2, '0')}] ${dec}${isBest ? '  ◄◄◄' : ''}`,
          isBest ? 'success' : 'dim'
        )
        await sleep(120)
      }

      await addLine('', 'output')
      await addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim')
      await addLine(`VÝSLEDEK:`, 'highlight')
      await addLine(`  Nejpravděpodobnější klíč:  posun = ${best.shift}`, 'success')
      await addLine(`  Dešifrovaný text:           "${caesarDecrypt(TARGET, best.shift)}"`, 'success')
      await addLine('', 'output')
      await addLine('Čas útoku:   < 1ms', 'output')
      await addLine('Prohledáno:  25/25 klíčů', 'output')
      await addLine('Bezpečnost:  ██░░░░░░░░ NULOVÁ', 'error')
      await addLine('', 'output')
      await addLine('[ ÚTOK DOKONČEN ÚSPĚŠNĚ ]', 'success')
    },

    'show analysis': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔═══════════════════════════════════════╗', 'dim')
      await addLine('║   FREKVENČNÍ ANALÝZA                  ║', 'highlight')
      await addLine('╚═══════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await addLine(`Analyzuji: "${TARGET}"`, 'warning')
      await sleep(300)
      await addLine('', 'output')

      const freq = {}
      for (const ch of TARGET.replace(/[^A-Z]/g, '')) {
        freq[ch] = (freq[ch] || 0) + 1
      }
      const total = Object.values(freq).reduce((a, b) => a + b, 0)
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])

      await addLine('Nejčastější písmena v zachyceném textu:', 'output')
      await sleep(150)
      for (const [letter, count] of sorted.slice(0, 8)) {
        const pct = ((count / total) * 100).toFixed(1)
        const bar = '█'.repeat(Math.round(count))
        await addLine(`  ${letter}: ${bar.padEnd(12)} ${pct}%`, 'output')
        await sleep(80)
      }

      await addLine('', 'output')
      await addLine('Nejčastější písmena v angličtině: E(12.7%), T(9.1%), A(8.2%)', 'dim')
      await addLine('', 'output')
      await addLine('Analýza: Písmeno "R" odpovídá pravděpodobně "E"', 'warning')
      await addLine('         Rozdíl: R(17) - E(4) = 13 pozic = posun 13', 'success')
      await sleep(200)
      await addLine('', 'output')
      await addLine(`Ověření: ${caesarDecrypt(TARGET, 13)}`, 'highlight')
      await addLine('', 'output')
      await addLine('[ ANALÝZA DOKONČENA — klíč = 13 ]', 'success')
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
        <div>Zachytili jste šifrovanou komunikaci. Víte, že je použita Caesarova šifra, ale neznáte klíč.</div>
        <div>Zpráva: <span style={{ color: '#00ff41' }}>"{TARGET}"</span></div>
        <div className="mt-1">Použij terminál pro prolomení šifry.</div>
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
        <span style={{ color: '#00aa2b' }}>show analysis</span> &nbsp;|&nbsp;
        <span style={{ color: '#00aa2b' }}>target</span> &nbsp;|&nbsp;
        <span style={{ color: '#00aa2b' }}>reset</span>
      </div>
    </div>
  )
}
