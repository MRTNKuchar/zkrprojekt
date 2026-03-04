import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import TerminalEmulator from '../../components/TerminalEmulator'

export default function OtpTerminal() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const tt = t.otp.terminal

  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  const commandHandlers = {
    help: () => [
      { text: '═══════════════════════════════════════════', type: 'dim' },
      { text: 'DOSTUPNÉ PŘÍKAZY:', type: 'highlight' },
      { text: '  show history  — historie Vernamovy šifry', type: 'output' },
      { text: '  show perfect  — Shannonova věta o dokonalém utajení', type: 'output' },
      { text: '  show reuse    — demonstrace katastrofy přepoužití klíče', type: 'output' },
      { text: '  show qkd      — BB84: kvantová distribuce OTP klíče', type: 'output' },
      { text: '  compare       — OTP vs moderní šifry', type: 'output' },
      { text: '  reset         — vymazat terminál', type: 'output' },
      { text: '═══════════════════════════════════════════', type: 'dim' },
    ],

    'show history': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   HISTORIE VERNAMOVY ŠIFRY (OTP)             ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(200)

      const events = [
        ['1917', 'Gilbert Vernam patentuje "šifrovací stroj" pro telegraf AT&T', 'warning'],
        ['1917', 'Joseph Mauborgne navrhuje použití náhodného klíče — vznik OTP', 'output'],
        ['1943', 'NSA spouští projekt VENONA (odposlech sovětských zpráv)', 'warning'],
        ['1945', 'Hotlinka Moskva–Washington (Washington–DC) používá OTP', 'success'],
        ['1949', 'Claude Shannon dokazuje: OTP má dokonalé utajení (Perfect Secrecy)', 'success'],
        ['1956', 'KGB špiónská sít používá "jednorázové listy" (one-time pads)', 'output'],
        ['1980', 'Projekt VENONA odhalen — sovětské zprávy prolomeny přepoužitím klíče', 'error'],
        ['2001', 'Poslední výměna OTP klíčů na Červeném telefonu', 'dim'],
      ]

      for (const [year, desc, type] of events) {
        await addLine(`  [${year}] ${desc}`, type)
        await sleep(120)
      }
      await addLine('', 'output')
      await addLine('OTP je jediná šifra s matematicky dokazenou dokonalou bezpečností.', 'success')
    },

    'show perfect': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   SHANNONOVA VĚTA O DOKONALÉM UTAJENÍ        ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(300)

      await addLine('Definice (Shannon, 1949):', 'output')
      await addLine('  Šifra má "perfect secrecy" pokud:', 'output')
      await addLine('  P(plaintext | ciphertext) = P(plaintext)', 'warning')
      await addLine('', 'output')
      await sleep(400)

      await addLine('Co to znamená?', 'system')
      await sleep(200)
      await addLine('  Útočník vidí šifrovaný text c.', 'output')
      await addLine('  Ale c neříká NIC o původní zprávě m.', 'output')
      await addLine('  Každý šifrovaný text je stejně pravděpodobný pro jakoukoliv zprávu.', 'output')
      await addLine('', 'output')
      await sleep(400)

      await addLine('Proč?', 'system')
      await sleep(200)
      await addLine('  Pro každou zprávu m a každý ciphertext c existuje právě jeden klíč k,', 'output')
      await addLine('  který m zašifruje na c. Protože k je náhodný, c neodhaluje nic o m.', 'output')
      await addLine('', 'output')
      await sleep(300)

      await addLine('Příklad:', 'highlight')
      await addLine('  Zpráva: "ANO" (délka 3 bajty)', 'output')
      await sleep(100)
      await addLine('  Klíč:   5f 3a 91  →  Ciphertext: 1e 7b f2', 'output')
      await sleep(100)
      await addLine('  Alternativně:', 'dim')
      await addLine('  Zpráva: "NE " (délka 3 bajty)', 'output')
      await addLine('  Klíč:   70 51 d2  →  Ciphertext: 1e 7b f2', 'output')
      await addLine('', 'output')
      await sleep(300)
      await addLine('STEJNÝ šifrovaný text! Bez klíče nelze rozlišit "ANO" od "NE ".', 'error')
      await addLine('', 'output')
      await addLine('Podmínky:', 'highlight')
      await addLine('  1. Klíč je kryptograficky náhodný', 'success')
      await addLine('  2. Klíč je stejně dlouhý jako zpráva', 'success')
      await addLine('  3. Klíč je použit JEDNOU a zničen', 'success')
      await addLine('  Porušení KTERÉKOLIV podmínky ruší dokonalé utajení!', 'error')
    },

    'show reuse': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   KATASTROFA: PŘEPOUŽITÍ KLÍČE               ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(200)

      await addLine('SCÉNÁŘ: Alice posílá Bobovi DVĚ zprávy stejným klíčem k:', 'output')
      await sleep(300)

      await addLine('', 'output')
      await addLine('  Zpráva 1 (m1): "ATTACK"', 'success')
      await addLine('  Zpráva 2 (m2): "DEFEND"', 'success')
      await addLine('  Klíč (k):       [tajný, stejný pro obě]', 'dim')
      await addLine('', 'output')
      await sleep(400)

      await addLine('Šifrování:', 'system')
      await sleep(100)
      await addLine('  c1 = m1 XOR k  =  41 54 54 41 43 4b XOR k  =  [...]', 'warning')
      await sleep(100)
      await addLine('  c2 = m2 XOR k  =  44 45 46 45 4e 44 XOR k  =  [...]', 'warning')
      await addLine('', 'output')
      await sleep(400)

      await addLine('ÚTOK (Eva odposlouchá c1 a c2):', 'error')
      await sleep(200)
      await addLine('  c1 XOR c2', 'dim')
      await sleep(100)
      await addLine('  = (m1 XOR k) XOR (m2 XOR k)', 'dim')
      await sleep(100)
      await addLine('  = m1 XOR m2 XOR k XOR k', 'dim')
      await sleep(100)
      await addLine('  = m1 XOR m2  (klíč se vyruší!)', 'error')
      await addLine('', 'output')
      await sleep(400)

      await addLine('Výsledek pro Eva:', 'highlight')
      await addLine('  m1 XOR m2 = "ATTACK" XOR "DEFEND"', 'output')
      await sleep(100)

      // XOR "ATTACK" and "DEFEND" manually
      const m1 = [0x41, 0x54, 0x54, 0x41, 0x43, 0x4b]
      const m2 = [0x44, 0x45, 0x46, 0x45, 0x4e, 0x44]
      const xored = m1.map((b, i) => b ^ m2[i])
      const hexStr = xored.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
      await addLine(`  = ${hexStr}`, 'error')
      await addLine('', 'output')
      await sleep(300)

      await addLine('Crib Dragging Attack:', 'highlight')
      await sleep(200)
      await addLine('  Eva zkusí odhadnout slovo v m1, napr. "ATTACK"...', 'output')
      await sleep(200)
      await addLine('  XOR s m1 XOR m2 → dostane m2: "DEFEND"', 'error')
      await addLine('', 'output')
      await sleep(300)

      await addLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'dim')
      await addLine('HISTORICKÝ PŘÍPAD: Projekt VENONA (NSA, 1943-1980)', 'highlight')
      await addLine('  Sovětská rozvědka (KGB/GRU) opakovala části klíčových knih.', 'output')
      await addLine('  NSA analyzovala ~3000 zpráv — prolomena přepoužitím klíče.', 'warning')
      await addLine('  Výsledek: odhalena síť sovětských špiónů (Rosenbergové, atd.)', 'error')
    },

    'show qkd': async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   QKD — KVANTOVÁ DISTRIBUCE OTP KLÍČE        ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(200)

      await addLine('PROBLÉM OTP:', 'system')
      await addLine('  Klíč musí být stejně dlouhý jako zpráva.', 'warning')
      await addLine('  Jak ho bezpečně předat? Kurýr? Satelit? Po síti NE!', 'warning')
      await addLine('', 'output')
      await sleep(400)

      await addLine('ŘEŠENÍ: BB84 protokol (Bennett & Brassard, 1984)', 'highlight')
      await sleep(200)
      await addLine('  Využívá kvantové vlastnosti fotonů k distribuci klíče.', 'output')
      await addLine('  Bezpečnost garantují fyzikální zákony — ne výpočetní složitost.', 'success')
      await addLine('', 'output')
      await sleep(400)

      await addLine('PRINCIP BB84:', 'system')
      await sleep(150)

      const randBit = () => Math.random() < 0.5 ? 0 : 1
      const randBase = () => Math.random() < 0.5 ? '+' : 'x'
      const N = 8
      const SYMBOL = { '+0': '─', '+1': '│', 'x0': '/', 'x1': '\\' }
      const aliceBits  = Array.from({ length: N }, () => randBit())
      const aliceBases = Array.from({ length: N }, () => randBase())
      const bobBases   = Array.from({ length: N }, () => randBase())
      const bobBits    = aliceBits.map((b, i) =>
        aliceBases[i] === bobBases[i] ? b : randBit()
      )
      const matchIdx = aliceBases.reduce((acc, ab, i) => {
        if (ab === bobBases[i]) acc.push(i)
        return acc
      }, [])

      await addLine(`  Alice bity:   [ ${aliceBits.join('  ')} ]`, 'success')
      await addLine(`  Alice základy:[ ${aliceBases.join('  ')} ]`, 'output')
      await addLine(`  Alice fotony: [ ${aliceBases.map((b,i) => SYMBOL[`${b}${aliceBits[i]}`]).join('  ')} ]  → kvantový kanál →`, 'dim')
      await sleep(300)
      await addLine(`  Bob základy:  [ ${bobBases.join('  ')} ]`, 'warning')
      await addLine(`  Bob bity:     [ ${bobBits.join('  ')} ]`, 'warning')
      await addLine('', 'output')
      await sleep(300)

      await addLine('  Veřejné srovnání ZÁKLADŮ (ne bitů):', 'system')
      const matchStr = aliceBases.map((a, i) => a === bobBases[i] ? '✓' : '✗').join('  ')
      await addLine(`  Shoda:        [ ${matchStr} ]`, 'output')
      await sleep(200)
      const sifted = matchIdx.map(i => aliceBits[i])
      await addLine(`  Prosátý klíč: [ ${sifted.join(' ')} ]  (${sifted.length} bitů z ${N})`, 'success')
      await addLine('', 'output')
      await sleep(400)

      await addLine('DETEKCE ODPOSLECHU — bez klonovací teorém:', 'system')
      await sleep(200)
      await addLine('  Eva nemůže foton přečíst a poslat přesnou kopii.', 'output')
      await addLine('  Musí foton změřit → změní jeho stav → zvýší QBER.', 'output')
      await addLine('  QBER bez Evy: ~0%  |  QBER s Evou: ~25%', 'warning')
      await addLine('  Práh detekce: QBER > 11% → přenos přerušen.', 'error')
      await addLine('', 'output')
      await sleep(300)

      await addLine('NASAZENÍ:', 'highlight')
      await addLine('  ID Quantique (Švýcarsko) — QKD pro banky', 'success')
      await addLine('  Čína: satelit Micius (2016) — 1200 km QKD', 'success')
      await addLine('  EU: OPENQKD — budování evropské QKD infrastruktury', 'success')
      await addLine('', 'output')
      await addLine('OTP + QKD = informačně-teoreticky dokonalá bezpečnost.', 'success')
    },

    compare: async (addLine) => {
      await addLine('', 'output')
      await addLine('╔══════════════════════════════════════════════╗', 'dim')
      await addLine('║   OTP vs MODERNÍ KRYPTOGRAFIE                ║', 'highlight')
      await addLine('╚══════════════════════════════════════════════╝', 'dim')
      await addLine('', 'output')
      await sleep(200)

      await addLine('┌──────────────┬────────────┬────────────┬──────────────────┐', 'dim')
      await addLine('│ Šifra        │ Bezpečnost │ Klíč       │ Praktičnost      │', 'highlight')
      await addLine('├──────────────┼────────────┼────────────┼──────────────────┤', 'dim')
      await sleep(100)
      await addLine('│ Caesar       │ Nulová     │ 1 číslo    │ Snadná, neb. 0   │', 'error')
      await sleep(100)
      await addLine('│ AES-256      │ 10³² let   │ 32 B fix.  │ Výborná          │', 'success')
      await sleep(100)
      await addLine('│ ECC (ECDH)   │ 10²² let   │ 32–66 B    │ Výborná          │', 'success')
      await sleep(100)
      await addLine('│ OTP          │ DOKONALÁ   │ = |zpráva| │ Nepraktická (!)  │', 'warning')
      await addLine('└──────────────┴────────────┴────────────┴──────────────────┘', 'dim')
      await addLine('', 'output')
      await sleep(200)

      await addLine('Proč se OTP nepoužívá v praxi?', 'highlight')
      await sleep(200)
      await addLine('  Problem 1: Klíč je stejně dlouhý jako zpráva.', 'warning')
      await addLine('             Jak bezpečně přenést 1 GB klíč pro 1 GB soubor?', 'output')
      await sleep(150)
      await addLine('  Problem 2: Klíč lze použít jen jednou — obrovská logistika.', 'warning')
      await sleep(150)
      await addLine('  Problem 3: Klíče musí být fyzicky předány — nelze po síti.', 'warning')
      await addLine('', 'output')
      await sleep(300)

      await addLine('Kdy se OTP STÁLE používá?', 'highlight')
      await sleep(200)
      await addLine('  - Diplomatické komunikace (krátké zprávy, klíče kurýrem)', 'success')
      await addLine('  - Vojenské komunikace (high-value, předpřipravené klíče)', 'success')
      await addLine('  - Situace kde jsou klíče fyzicky sdíleny předem', 'success')
      await addLine('', 'output')
      await addLine('ZÁVĚR: Dokonalá teorie, nepraktická praxe.', 'warning')
      await addLine('       AES-256 s dobrým klíčem je pro praxi dostačující.', 'success')
    },
  }

  return (
    <div className="tab-content">
      <h2 className="text-2xl mb-4" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.8rem', textShadow: '0 0 8px #00ff4166' }}>
        {tt.title}
      </h2>

      <div className="border p-3 mb-4 text-xs" style={{ borderColor: '#1a3a1a', color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
        <div style={{ color: '#ffaa44' }}>SCÉNÁŘ:</div>
        <div>Analýza Vernamovy šifry — jediné šifry s matematicky dokazenou dokonalou bezpečností. Proč se přesto nepoužívá v praxi?</div>
      </div>

      <TerminalEmulator
        welcomeLines={tt.welcomeMsg}
        commandHandlers={commandHandlers}
        prompt="analyst@kryptolab:~$"
        accentColor="#00ff41"
      />

      <div className="mt-4 border p-3 text-xs" style={{ borderColor: '#1a3a1a', color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
        {tt.hint} &nbsp;
        <span style={{ color: '#00cc35' }}>show history</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>show perfect</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>show reuse</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>show qkd</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>compare</span> &nbsp;|&nbsp;
        <span style={{ color: '#00cc35' }}>reset</span>
      </div>
    </div>
  )
}
