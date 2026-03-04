import { useState } from 'react'
import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import {
  generateKey,
  encrypt,
  decrypt,
  hexToDisplay,
  keyReuseXor,
  textToBytes,
  MAX_MSG_LEN,
} from '../../utils/otp'
import CodeBlock from '../../components/CodeBlock'

const OTP_CODE_SCRATCH = `# ============================================================
# ONE-TIME PAD (Vernamova sifra) — od nuly, bez zavislosti
# Spusteni: python otp_scratch.py
# ============================================================
import os

def generate_key(length):
    """Kryptograficky bezpecny klic stejne dlouhy jako zprava."""
    return list(os.urandom(length))

def xor_bytes(data, key):
    """c[i] = m[i] XOR k[i]"""
    return [b ^ k for b, k in zip(data, key)]

def encrypt(text, key):
    """Sifrovani: kazdy bajt zpravy XOR s odpovidajicim bajtem klice."""
    plaintext_bytes = list(text.encode('utf-8'))
    assert len(key) >= len(plaintext_bytes), "Klic musi byt aspon tak dlouhy jako zprava!"
    return xor_bytes(plaintext_bytes, key)

def decrypt(ciphertext, key):
    """Desifrovani: XOR je vlastni inverzi — decrypt == encrypt."""
    return bytes(xor_bytes(ciphertext, key)).decode('utf-8')

def bytes_to_hex(data):
    return ' '.join(f'{b:02x}' for b in data)


if __name__ == "__main__":
    zprava = "Tajny vzkaz"
    klic = generate_key(len(zprava.encode('utf-8')))

    print(f"Zprava:      {zprava}")
    print(f"Klic:        {bytes_to_hex(klic)}")

    sifrovano = encrypt(zprava, klic)
    print(f"Sifrovano:   {bytes_to_hex(sifrovano)}")

    desifrovano = decrypt(sifrovano, klic)
    print(f"Desifrovano: {desifrovano}")
    print(f"Shoda: {'ANO' if zprava == desifrovano else 'NE'}")


# --- DEMONSTRACE: Katastrofa prepoužiti klice ---
    print("\\n--- Prepoužiti klice (NEBEZPECNE!) ---")
    m1 = b"ATTACK"
    m2 = b"DEFEND"
    k  = generate_key(len(m1))

    c1 = xor_bytes(list(m1), k)
    c2 = xor_bytes(list(m2), k)

    # Utocnik XORuje oba sifrovane texty
    c1_xor_c2 = xor_bytes(c1, c2)
    m1_xor_m2 = xor_bytes(list(m1), list(m2))

    print(f"c1 XOR c2 = {bytes_to_hex(c1_xor_c2)}")
    print(f"m1 XOR m2 = {bytes_to_hex(m1_xor_m2)}")
    print("Klíc se zrusil! Utocnik zna XOR obou zprav.")
`

const OTP_CODE_PROD = `# ============================================================
# ONE-TIME PAD — doporucena implementace (Python stdlib)
# Spusteni: python otp_prod.py
# ============================================================
import secrets

def otp_encrypt(plaintext: bytes, key: bytes) -> bytes:
    """c = m XOR k. Klic musi mit stejnou delku jako zprava."""
    if len(key) != len(plaintext):
        raise ValueError(f"Delka klice ({len(key)}) != delka zpravy ({len(plaintext)})")
    return bytes(m ^ k for m, k in zip(plaintext, key))

# XOR je symetricke: desifrovani == sifrovani
otp_decrypt = otp_encrypt

# --- Generovani klice (OS entropy = kryptograficky bezpecny) ---
message    = "Schuzka ve 22:00".encode('utf-8')
key        = secrets.token_bytes(len(message))

# --- Sifrovani ---
ciphertext = otp_encrypt(message, key)
print(f"Zprava:     {message.decode()}")
print(f"Klic:       {key.hex()}")
print(f"Sifrovano:  {ciphertext.hex()}")

# --- Desifrovani ---
recovered  = otp_decrypt(ciphertext, key)
print(f"Desifr.:    {recovered.decode()}")
print(f"Shoda:      {message == recovered}")

# Pravidlo cislo 1: NIKDY klic neopakovat!
# key2 = secrets.token_bytes(len(nova_zprava))  # Vzdy novy klic!
`

export default function OtpLab() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const ol = t.otp.lab

  // Main encrypt/decrypt demo
  const [msg, setMsg] = useState('Ahoj')
  const [key, setKey] = useState(null)
  const [cipherBytes, setCipherBytes] = useState(null)
  const [decrypted, setDecrypted] = useState(null)

  // Key reuse demo
  const [msg1, setMsg1] = useState('ATTACK')
  const [msg2, setMsg2] = useState('DEFEND')
  const [reuseResult, setReuseResult] = useState(null)

  const handleGenerate = () => {
    const text = msg.slice(0, MAX_MSG_LEN)
    const plainBytes = textToBytes(text)
    const newKey = generateKey(plainBytes.length)
    setKey(newKey)
    setCipherBytes(null)
    setDecrypted(null)
  }

  const handleEncrypt = () => {
    if (!key) return
    const text = msg.slice(0, MAX_MSG_LEN)
    try {
      const ct = encrypt(text, key)
      setCipherBytes(ct)
      setDecrypted(null)
    } catch {
      /* key too short — shouldn't happen after generateKey */
    }
  }

  const handleDecrypt = () => {
    if (!key || !cipherBytes) return
    const result = decrypt(cipherBytes, key)
    setDecrypted(result ?? '(chyba dekódování)')
  }

  const handleReuseAttack = () => {
    const b1 = textToBytes(msg1.slice(0, MAX_MSG_LEN))
    const b2 = textToBytes(msg2.slice(0, MAX_MSG_LEN))
    const minLen = Math.min(b1.length, b2.length)
    const b1s = b1.slice(0, minLen)
    const b2s = b2.slice(0, minLen)
    const sharedKey = generateKey(minLen)
    const ct1 = b1s.map((b, i) => b ^ sharedKey[i])
    const ct2 = b2s.map((b, i) => b ^ sharedKey[i])
    const xored = keyReuseXor(ct1, ct2)
    setReuseResult({ ct1, ct2, xored, b1s, b2s })
  }

  const btnStyle = (enabled, color = '#00ff41') => ({
    fontFamily: 'Share Tech Mono, monospace',
    color: enabled ? color : '#333',
    borderColor: enabled ? color : '#333',
    background: 'transparent',
    cursor: enabled ? 'pointer' : 'not-allowed',
  })

  const inputStyle = {
    backgroundColor: '#020a05',
    borderColor: '#1a3a1a',
    color: '#00ff41',
    fontFamily: 'Share Tech Mono, monospace',
    caretColor: '#00ff41',
  }

  return (
    <div className="tab-content">
      <h2 className="text-2xl mb-6" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.8rem', textShadow: '0 0 8px #00ff4166' }}>
        {ol.title}
      </h2>

      {/* Code — od nuly */}
      <div className="mb-4">
        <h3 className="text-sm mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {ol.codeTitle} — od nuly, bez závislostí
        </h3>
        <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          python otp_scratch.py
        </div>
        <CodeBlock code={OTP_CODE_SCRATCH} title="otp_scratch.py" />
      </div>

      {/* Code — produkční */}
      <div className="mb-8">
        <h3 className="text-sm mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ Produkční verze — Python secrets (stdlib)
        </h3>
        <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          python otp_prod.py
        </div>
        <CodeBlock code={OTP_CODE_PROD} title="otp_prod.py" />
      </div>

      {/* Interactive demo — encrypt/decrypt */}
      <div className="border p-4 mb-6" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
        <h3 className="text-sm mb-1" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {ol.demoTitle}
        </h3>
        <div className="text-xs mb-4" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          max {MAX_MSG_LEN} znaků &nbsp;|&nbsp; klíč = náhodné bajty (crypto.getRandomValues)
        </div>

        {/* Message input + generate key */}
        <div className="mb-4">
          <label className="block text-xs mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
            {ol.msgLabel}:
          </label>
          <div className="flex gap-3 flex-wrap items-center">
            <input
              value={msg}
              onChange={e => { setMsg(e.target.value.slice(0, MAX_MSG_LEN)); setKey(null); setCipherBytes(null); setDecrypted(null) }}
              className="border p-2 text-sm outline-none"
              style={{ ...inputStyle, width: '200px' }}
              placeholder={ol.msgPlaceholder}
            />
            <button
              onClick={handleGenerate}
              className="px-4 py-2 text-sm border transition-all"
              style={btnStyle(true)}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,255,65,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {ol.genBtn}
            </button>
          </div>
        </div>

        {/* Show key */}
        {key && (
          <div className="mb-4 border p-3 text-xs fade-in" style={{ borderColor: '#1a3a1a', fontFamily: 'Share Tech Mono, monospace' }}>
            <div style={{ color: '#ff6644', marginBottom: 2 }}>{ol.keyLabel}: <span style={{ color: '#5a2a2a' }}>(TAJNÉ!)</span></div>
            <div style={{ color: '#ff9944', wordBreak: 'break-all' }}>{hexToDisplay(key)}</div>
            <div className="mt-1" style={{ color: '#005515' }}>{key.length} {ol.bytesLabel}</div>
          </div>
        )}

        {/* Encrypt */}
        <div className="mb-4">
          <button
            onClick={handleEncrypt}
            disabled={!key}
            className="px-4 py-2 text-sm border transition-all"
            style={btnStyle(!!key, '#ffaa44')}
            onMouseEnter={e => { if (key) e.currentTarget.style.backgroundColor = 'rgba(255,170,68,0.1)' }}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {ol.encBtn}
          </button>
          {!key && <span className="ml-3 text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>↑ {ol.noKey}</span>}
        </div>

        {cipherBytes && (
          <div className="mb-4 border p-3 text-xs fade-in" style={{ borderColor: '#1a3a1a', fontFamily: 'Share Tech Mono, monospace' }}>
            <div style={{ color: '#00aa2b', marginBottom: 4 }}>{ol.cipherLabel}:</div>
            <div style={{ color: '#ffaa44', wordBreak: 'break-all' }}>{hexToDisplay(cipherBytes)}</div>
            <div className="mt-2" style={{ color: '#005515' }}>{cipherBytes.length} {ol.bytesLabel} — {ol.cipherNote}</div>
          </div>
        )}

        {/* Decrypt */}
        {cipherBytes && (
          <div className="mb-4">
            <button
              onClick={handleDecrypt}
              className="px-4 py-2 text-sm border transition-all"
              style={btnStyle(true, '#44aaff')}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(68,170,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {ol.decBtn}
            </button>
          </div>
        )}

        {decrypted !== null && (
          <div className="border p-3 fade-in text-xs" style={{
            borderColor: decrypted === msg.slice(0, MAX_MSG_LEN) ? '#00ff41' : '#ff4444',
            fontFamily: 'Share Tech Mono, monospace',
          }}>
            <div style={{ color: '#00aa2b', marginBottom: 4 }}>{ol.decResult}:</div>
            <div style={{ color: '#00ff41', fontSize: '1rem', fontFamily: 'VT323, monospace' }}>
              "{decrypted}"
            </div>
            <div className="mt-2" style={{ color: decrypted === msg.slice(0, MAX_MSG_LEN) ? '#00ff41' : '#ff4444' }}>
              {ol.match}: {decrypted === msg.slice(0, MAX_MSG_LEN) ? 'ANO ✓' : 'NE ✗'}
            </div>
          </div>
        )}
      </div>

      {/* Key reuse attack demo */}
      <div className="border p-4" style={{ borderColor: '#ff4444', backgroundColor: 'rgba(255,68,68,0.02)' }}>
        <h3 className="text-sm mb-1" style={{ color: '#ff4444', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {ol.reuseTitle}
        </h3>
        <div className="text-xs mb-4" style={{ color: '#5a2a2a', fontFamily: 'Share Tech Mono, monospace' }}>
          {ol.reuseDesc}
        </div>

        <div className="flex gap-3 flex-wrap items-end mb-4">
          <div>
            <label className="block text-xs mb-1" style={{ color: '#ff6644', fontFamily: 'Share Tech Mono, monospace' }}>
              {ol.msg1Label}:
            </label>
            <input
              value={msg1}
              onChange={e => { setMsg1(e.target.value.slice(0, MAX_MSG_LEN)); setReuseResult(null) }}
              className="border p-2 text-sm outline-none"
              style={{ ...inputStyle, borderColor: '#ff4444', width: '150px' }}
            />
          </div>
          <div>
            <label className="block text-xs mb-1" style={{ color: '#ff6644', fontFamily: 'Share Tech Mono, monospace' }}>
              {ol.msg2Label}:
            </label>
            <input
              value={msg2}
              onChange={e => { setMsg2(e.target.value.slice(0, MAX_MSG_LEN)); setReuseResult(null) }}
              className="border p-2 text-sm outline-none"
              style={{ ...inputStyle, borderColor: '#ff4444', width: '150px' }}
            />
          </div>
          <button
            onClick={handleReuseAttack}
            className="px-4 py-2 text-sm border transition-all"
            style={btnStyle(true, '#ff4444')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {ol.reuseBtn}
          </button>
        </div>

        {reuseResult && (
          <div className="border p-3 text-xs fade-in space-y-2" style={{ borderColor: '#2a1a1a', fontFamily: 'Share Tech Mono, monospace' }}>
            <div>
              <span style={{ color: '#ff6644' }}>c1 = m1 ⊕ k: </span>
              <span style={{ color: '#ffaa44' }}>{hexToDisplay(reuseResult.ct1)}</span>
            </div>
            <div>
              <span style={{ color: '#ff6644' }}>c2 = m2 ⊕ k: </span>
              <span style={{ color: '#ffaa44' }}>{hexToDisplay(reuseResult.ct2)}</span>
            </div>
            <div style={{ borderTop: '1px solid #2a1a1a', paddingTop: 8 }}>
              <div style={{ color: '#ff4444', marginBottom: 4 }}>c1 ⊕ c2 = m1 ⊕ m2 (klíč se vyruší):</div>
              <div style={{ color: '#ff9944' }}>{hexToDisplay(reuseResult.xored)}</div>
            </div>
            <div style={{ borderTop: '1px solid #2a1a1a', paddingTop: 8 }}>
              <div style={{ color: '#00aa2b', marginBottom: 2 }}>Kontrola — skutečné m1 ⊕ m2:</div>
              <div style={{ color: '#ffaa44' }}>
                {hexToDisplay(reuseResult.b1s.map((b, i) => b ^ reuseResult.b2s[i]))}
              </div>
              <div className="mt-2" style={{ color: '#ff4444' }}>
                ⚠ Shoda! Útočník zná XOR zpráv — crib dragging může odhalit obě zprávy.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
