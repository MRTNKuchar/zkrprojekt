import { useState } from 'react'
import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import { caesarEncrypt, caesarDecrypt } from '../../utils/caesar'
import CodeBlock from '../../components/CodeBlock'
import FrequencyChart from '../../components/FrequencyChart'

const CAESAR_CODE = `# ============================================================
# CAESAROVA SIFRA — kompletni implementace + brute force
# Spusteni: python caesar.py   (zadne zavislosti!)
# ============================================================

# Ocekavane frekvence pismen v anglictine (%)
FREKVENCE = {
    'E': 12.7, 'T': 9.1, 'A': 8.2, 'O': 7.5, 'I': 7.0,
    'N': 6.7,  'S': 6.3, 'H': 6.1, 'R': 6.0, 'D': 4.3,
    'L': 4.0,  'U': 2.8, 'C': 2.8, 'M': 2.4, 'W': 2.4,
}


def sifrovani(text, posun):
    """Zasifrovani textu Caesarovou sifrou."""
    posun = posun % 26
    vysledek = []
    for znak in text:
        if znak.isalpha():
            zaklad = ord('A') if znak.isupper() else ord('a')
            novy = chr((ord(znak.upper()) - ord('A') + posun) % 26 + zaklad)
            vysledek.append(novy)
        else:
            vysledek.append(znak)  # mezery, interpunkce beze zmeny
    return ''.join(vysledek)


def desifrovani(text, posun):
    """Desifrovani — sifrovani se zapornym posunem."""
    return sifrovani(text, 26 - (posun % 26))


def skore_textu(text):
    """Kolika bodovem se text podoba anglictine (vyssi = lepsi)."""
    text = text.upper()
    celkem = sum(1 for z in text if z.isalpha()) or 1
    skore = 0.0
    for pismeno, ocekavana in FREKVENCE.items():
        pozorovana = (text.count(pismeno) / celkem) * 100
        skore -= abs(pozorovana - ocekavana)  # penalizace za odchylku
    return skore


def brute_force(sifrovany_text):
    """Utok hrubou silou — testuje vsech 25 klicu."""
    print("\\nBRUTE FORCE — testuju vsech 25 klicu:")
    print("-" * 45)
    nejlepsi_skore = float('-inf')
    nejlepsi = (0, "")

    for posun in range(1, 26):
        pokus = desifrovani(sifrovany_text, posun)
        skore = skore_textu(pokus)
        znacka = "  <<< KANDIDAT" if skore > -30 else ""
        print(f"  [{posun:2d}] {pokus[:40]}{znacka}")
        if skore > nejlepsi_skore:
            nejlepsi_skore = skore
            nejlepsi = (posun, pokus)

    print("-" * 45)
    print(f"\\n>>> NALEZENY KLIC: posun = {nejlepsi[0]}")
    print(f">>> DESIFROVANA ZPRAVA: {nejlepsi[1]}")
    return nejlepsi


def frekv_analyza(text):
    """Zobrazi frekvenci pismen v textu."""
    text = text.upper()
    celkem = sum(1 for z in text if z.isalpha()) or 1
    print("\\nFREKVENCNI ANALYZA:")
    for pismeno in sorted(set(z for z in text if z.isalpha()),
                          key=lambda z: -text.count(z))[:8]:
        pocet = text.count(pismeno)
        pct = (pocet / celkem) * 100
        bar = '#' * int(pct)
        print(f"  {pismeno}: {bar:<15} {pct:.1f}%")


# ============================================================
#  SPUSTITELNA UKAZKA
# ============================================================
if __name__ == "__main__":
    zprava = "Tajemstvi je skryto v posunu"
    klic = 13

    zasifrovano = sifrovani(zprava, klic)
    desifrovano = desifrovani(zasifrovano, klic)

    print("=" * 50)
    print(f"Puvodni zprava : {zprava}")
    print(f"Klic (posun)   : {klic}")
    print(f"Zasifrovano    : {zasifrovano}")
    print(f"Desifrovano    : {desifrovano}")
    print(f"Shoda          : {zprava == desifrovano}")
    print("=" * 50)

    # Simulace: utocnik zna jen zasifrovany text
    frekv_analyza(zasifrovano)
    brute_force(zasifrovano)
`

export default function CaesarLab() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const cl = t.caesar.lab

  const [inputText, setInputText] = useState('Ahoj svete, toto je tajná zpráva!')
  const [shift, setShift] = useState(13)
  const [wrongShift] = useState(7)
  const [mode, setMode] = useState('encrypt') // 'encrypt' | 'decrypt'
  const [showWrong, setShowWrong] = useState(false)

  const encrypted = caesarEncrypt(inputText, shift)
  const decrypted = caesarDecrypt(inputText, shift)
  const wrongDecrypted = caesarDecrypt(encrypted, wrongShift)

  const result = mode === 'encrypt' ? encrypted : decrypted
  const charForChart = mode === 'encrypt' ? encrypted : inputText

  return (
    <div className="tab-content">
      <h2 className="text-2xl mb-6 glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.8rem' }}>
        {cl.title}
      </h2>

      {/* Code section */}
      <div className="mb-8">
        <h3 className="text-sm mb-3" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {cl.codeTitle}
        </h3>
        <CodeBlock code={CAESAR_CODE} title="caesar.py" />
      </div>

      {/* Playground */}
      <div className="border p-4 mb-6" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
        <h3 className="text-sm mb-4" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {cl.playgroundTitle}
        </h3>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-xs mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
            {cl.inputLabel}:
          </label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={3}
            className="w-full border p-2 text-sm resize-none outline-none"
            style={{
              backgroundColor: '#020a02',
              borderColor: '#1a3a1a',
              color: '#00ff41',
              fontFamily: 'Share Tech Mono, monospace',
              caretColor: '#00ff41',
            }}
            placeholder={cl.inputPlaceholder}
            onFocus={e => e.target.style.borderColor = '#00ff41'}
            onBlur={e => e.target.style.borderColor = '#1a3a1a'}
          />
        </div>

        {/* Shift slider */}
        <div className="mb-4">
          <label className="block text-xs mb-2" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
            {cl.shiftLabel}: <span style={{ color: '#00ff41' }}>{shift}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={25}
              value={shift}
              onChange={e => setShift(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: '#00ff41' }}
            />
            <input
              type="number"
              min={1}
              max={25}
              value={shift}
              onChange={e => setShift(Math.max(1, Math.min(25, Number(e.target.value))))}
              className="w-16 border p-1 text-sm text-center outline-none"
              style={{
                backgroundColor: '#020a02',
                borderColor: '#1a3a1a',
                color: '#00ff41',
                fontFamily: 'Share Tech Mono, monospace',
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mb-4 flex-wrap">
          <button
            onClick={() => setMode('encrypt')}
            className="px-4 py-2 text-sm border transition-all"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: mode === 'encrypt' ? '#0a0a0a' : '#00ff41',
              backgroundColor: mode === 'encrypt' ? '#00ff41' : 'transparent',
              borderColor: '#00ff41',
              cursor: 'pointer',
            }}
          >
            {cl.encryptBtn}
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className="px-4 py-2 text-sm border transition-all"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: mode === 'decrypt' ? '#0a0a0a' : '#00ff41',
              backgroundColor: mode === 'decrypt' ? '#00ff41' : 'transparent',
              borderColor: '#00ff41',
              cursor: 'pointer',
            }}
          >
            {cl.decryptBtn}
          </button>
          <button
            onClick={() => setShowWrong(!showWrong)}
            className="px-4 py-2 text-sm border transition-all ml-auto"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: showWrong ? '#0a0a0a' : '#ff4444',
              backgroundColor: showWrong ? '#ff4444' : 'transparent',
              borderColor: '#ff4444',
              cursor: 'pointer',
            }}
          >
            {cl.wrongKey}
          </button>
        </div>

        {/* Result */}
        <div className="border p-3 mb-4" style={{ borderColor: '#1a3a1a' }}>
          <div className="text-xs mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
            {mode === 'encrypt' ? cl.resultEncrypt : cl.resultDecrypt} (klíč: {shift}):
          </div>
          <div className="text-sm break-all" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace', lineHeight: '1.6' }}>
            {result || '—'}
          </div>
        </div>

        {/* Wrong key demo */}
        {showWrong && (
          <div className="border p-3 mb-4 fade-in" style={{ borderColor: '#ff4444', backgroundColor: 'rgba(255,68,68,0.05)' }}>
            <div className="text-xs mb-1 flex items-center gap-2"
                 style={{ color: '#ff4444', fontFamily: 'Share Tech Mono, monospace' }}>
              ⚠ {cl.wrongKeyWarn} (klíč: {wrongShift})
            </div>
            <div className="text-sm break-all" style={{ color: '#ff6666', fontFamily: 'Share Tech Mono, monospace', lineHeight: '1.6' }}>
              {wrongDecrypted || '—'}
            </div>
          </div>
        )}
      </div>

      {/* Frequency chart */}
      <div className="border p-4" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
        <h3 className="text-sm mb-3" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ Frekvenční analýza — {mode === 'encrypt' ? 'zašifrovaný' : 'vstupní'} text
        </h3>
        <FrequencyChart text={charForChart} />
      </div>
    </div>
  )
}
