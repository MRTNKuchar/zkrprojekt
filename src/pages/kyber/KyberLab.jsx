import { useState } from 'react'
import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import {
  generateKeyPair,
  encryptString,
  decryptString,
  fmtVec,
  DEMO_PARAMS,
} from '../../utils/kyber'
import CodeBlock from '../../components/CodeBlock'

const KYBER_CODE_SCRATCH = `# ============================================================
# LWE OD NULY — post-kvantova kryptografie bez zavislosti
# Vzdělávací implementace ML-KEM / CRYSTALS-Kyber
# Spusteni: python lwe_scratch.py
# ============================================================
# Parametry (Kyber512 pouziva n=256, q=3329, k=2)
import random

N   = 4   # dimenze vektoru
Q   = 97  # prvocislo (modulus)
M   = 8   # pocet LWE vzorku
ETA = 1   # chyba z {-1, 0, 1}


def small_rand():
    return random.randint(-ETA, ETA)


def mat_vec_mod(A, v):
    """Matice * vektor mod Q."""
    return [sum(A[i][j] * v[j] for j in range(N)) % Q
            for i in range(M)]


def dot_mod(a, b, n=N):
    return sum(x * y for x, y in zip(a, b)) % Q


# ============================================================
#  GENEROVANI KLICU
# ============================================================
def keygen():
    A = [[random.randint(0, Q-1) for _ in range(N)]
         for _ in range(M)]
    s = [small_rand() for _ in range(N)]   # soukromy klic
    e = [small_rand() for _ in range(M)]   # chybovy vektor
    # b = A*s + e  (mod Q)  — verejny klic
    b = [(sum(A[i][j]*s[j] for j in range(N)) + e[i]) % Q
         for i in range(M)]
    return A, b, s


# ============================================================
#  SIFROVANI JEDNOHO BITU
# ============================================================
def encrypt_bit(bit, A, b):
    r  = [random.randint(0, 1) for _ in range(M)]
    e1 = [small_rand() for _ in range(N)]
    e2 = small_rand()
    # u = A^T * r + e1  (mod Q)
    u = [(sum(A[i][j]*r[i] for i in range(M)) + e1[j]) % Q
         for j in range(N)]
    # v = b^T * r + e2 + bit * floor(Q/2)  (mod Q)
    v = (sum(b[i]*r[i] for i in range(M)) + e2 + bit*(Q//2)) % Q
    return u, v


def decrypt_bit(u, v, s):
    d = (v - sum(s[j]*u[j] for j in range(N))) % Q
    half = Q // 2
    return 1 if abs(d - half) < min(d, Q - d) else 0


# ============================================================
#  SIFROVANI RETEZCE
# ============================================================
def encrypt_str(text, A, b):
    bits = []
    for ch in text:
        for i in range(7, -1, -1):
            bits.append((ord(ch) >> i) & 1)
    return [encrypt_bit(bit, A, b) for bit in bits]


def decrypt_str(ciphertexts, s):
    bits = [decrypt_bit(u, v, s) for u, v in ciphertexts]
    result = ""
    for i in range(0, len(bits), 8):
        byte = 0
        for b in bits[i:i+8]:
            byte = (byte << 1) | b
        result += chr(byte)
    return result


if __name__ == "__main__":
    A, b, s = keygen()
    print(f"Soukromy klic s: {s}")
    print(f"Verejny klic  b: {b[:4]}...  (prvni 4 z {M})")

    zprava = "Hi"
    ct = encrypt_str(zprava, A, b)
    dec = decrypt_str(ct, s)
    print(f"\\nZprava: '{zprava}'")
    print(f"Sifrovano: {len(ct)} bitu")
    print(f"Desifrovano: '{dec}'")
    print(f"Shoda: {'ANO' if zprava == dec else 'NE'}")
`

const KYBER_CODE_PROD = `# ============================================================
# ML-KEM PRODUKCNI — knihovna kyber-py (NIST FIPS 203)
# Instalace: pip install kyber-py
# Spusteni:  python mlkem_prod.py
# ============================================================
from kyber import Kyber512   # nebo Kyber768, Kyber1024

# --- Generovani klicu (strana B — Bob) ---
pk, sk = Kyber512.keygen()

print(f"Verejny klic  (pk): {len(pk)} bytu")
print(f"Soukromy klic (sk): {len(sk)} bytu")

# --- Zapouzdreni klice (strana A — Alice) ---
# Alice posle Bobovi 'ciphertext', oba ziskaji 'key'
key_a, ciphertext = Kyber512.enc(pk)

print(f"Sdileny klic Alice : {key_a.hex()[:32]}...")
print(f"Ciphertext         : {len(ciphertext)} bytu")

# --- Rozbaleni klice (strana B — Bob) ---
key_b = Kyber512.dec(sk, ciphertext)

print(f"Sdileny klic Bob   : {key_b.hex()[:32]}...")
print(f"Shoda klicu        : {key_a == key_b}")
`

const MAX_MSG_LEN = 4

export default function KyberLab() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const kl = t.kyber.lab

  const [keys, setKeys] = useState(null)
  const [msg, setMsg] = useState('Hi')
  const [ciphertexts, setCiphertexts] = useState(null)
  const [decrypted, setDecrypted] = useState(null)

  const handleGenerate = () => {
    setKeys(generateKeyPair())
    setCiphertexts(null)
    setDecrypted(null)
  }

  const handleEncrypt = () => {
    if (!keys) return
    const text = msg.slice(0, MAX_MSG_LEN)
    setCiphertexts(encryptString(text, keys.A, keys.b))
    setDecrypted(null)
  }

  const handleDecrypt = () => {
    if (!keys || !ciphertexts) return
    setDecrypted(decryptString(ciphertexts, keys.s))
  }

  const btnStyle = (enabled, color = '#00ff41') => ({
    fontFamily: 'Share Tech Mono, monospace',
    color: enabled ? color : '#333',
    borderColor: enabled ? color : '#333',
    background: 'transparent',
    cursor: enabled ? 'pointer' : 'not-allowed',
  })

  return (
    <div className="tab-content">
      <h2 className="text-2xl mb-6" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.8rem', textShadow: '0 0 8px #00ff4166' }}>
        {kl.title}
      </h2>

      {/* Code — od nuly */}
      <div className="mb-4">
        <h3 className="text-sm mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {kl.codeTitle} — od nuly, bez závislostí
        </h3>
        <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          python lwe_scratch.py
        </div>
        <CodeBlock code={KYBER_CODE_SCRATCH} title="lwe_scratch.py" />
      </div>

      {/* Code — produkční */}
      <div className="mb-8">
        <h3 className="text-sm mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ Produkční verze — kyber-py (ML-KEM / NIST FIPS 203)
        </h3>
        <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          pip install kyber-py &nbsp;→&nbsp; python mlkem_prod.py
        </div>
        <CodeBlock code={KYBER_CODE_PROD} title="mlkem_prod.py" />
      </div>

      {/* Interactive demo */}
      <div className="border p-4 mb-6" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
        <h3 className="text-sm mb-1" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {kl.demoTitle}
        </h3>
        <div className="text-xs mb-4" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          Parametry: n={DEMO_PARAMS.N}, q={DEMO_PARAMS.Q}, m={DEMO_PARAMS.M} &nbsp;|&nbsp; chyba ∈ &#123;-1, 0, 1&#125;
        </div>

        {/* Key gen */}
        <div className="mb-4">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 text-sm border transition-all"
            style={btnStyle(true)}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,255,65,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {kl.genBtn}
          </button>
        </div>

        {keys && (
          <div className="mb-4 border p-3 text-xs space-y-2 fade-in" style={{ borderColor: '#1a3a1a', fontFamily: 'Share Tech Mono, monospace' }}>
            <div>
              <span style={{ color: '#ff6644' }}>{kl.privateKey}: </span>
              <span style={{ color: '#ff9944' }}>{fmtVec(keys.s)}</span>
              <span style={{ color: '#5a2a2a' }}> (TAJNÉ!)</span>
            </div>
            <div>
              <span style={{ color: '#00aa2b' }}>{kl.pubVecLabel}: </span>
              <span style={{ color: '#00ff41' }}>{fmtVec(keys.b.slice(0, 4))}…</span>
            </div>
            <div>
              <span style={{ color: '#00aa2b' }}>{kl.matrixLabel}: </span>
              <span style={{ color: '#005515' }}>[{keys.A[0].slice(0, 4).join(', ')}, …]</span>
            </div>
          </div>
        )}

        {/* Encrypt */}
        <div className="mb-4">
          <label className="block text-xs mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
            {kl.msgLabel} (max {MAX_MSG_LEN} znaky):
          </label>
          <div className="flex gap-3 flex-wrap items-center">
            <input
              value={msg}
              onChange={e => { setMsg(e.target.value.slice(0, MAX_MSG_LEN)); setCiphertexts(null); setDecrypted(null) }}
              className="border p-2 text-sm outline-none"
              style={{
                backgroundColor: '#020a05',
                borderColor: '#1a3a1a',
                color: '#00ff41',
                fontFamily: 'Share Tech Mono, monospace',
                caretColor: '#00ff41',
                width: '160px',
              }}
              placeholder={kl.msgPlaceholder}
            />
            <button
              onClick={handleEncrypt}
              disabled={!keys}
              className="px-4 py-2 text-sm border transition-all"
              style={btnStyle(!!keys, '#ffaa44')}
              onMouseEnter={e => { if (keys) e.currentTarget.style.backgroundColor = 'rgba(255,170,68,0.1)' }}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {kl.encBtn}
            </button>
          </div>
          {!keys && <div className="mt-1 text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>↑ {kl.noKeys}</div>}
        </div>

        {ciphertexts && (
          <div className="mb-4 border p-3 text-xs fade-in" style={{ borderColor: '#1a3a1a', fontFamily: 'Share Tech Mono, monospace' }}>
            <div style={{ color: '#00aa2b', marginBottom: 4 }}>{kl.cipherLabel}:</div>
            <div style={{ color: '#ffaa44' }}>
              u = {fmtVec(ciphertexts[0].u)}
            </div>
            <div style={{ color: '#ffaa44' }}>
              v = {ciphertexts[0].v}
            </div>
            <div className="mt-2" style={{ color: '#005515' }}>
              {ciphertexts.length} {kl.bitsInfo} ({msg.length} znak{msg.length > 1 ? 'y' : ''} × 8 bitů)
            </div>
          </div>
        )}

        {/* Decrypt */}
        {ciphertexts && (
          <div className="mb-4">
            <button
              onClick={handleDecrypt}
              className="px-4 py-2 text-sm border transition-all"
              style={btnStyle(true, '#44aaff')}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(68,170,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {kl.decBtn}
            </button>
          </div>
        )}

        {decrypted !== null && (
          <div className="border p-3 fade-in text-xs" style={{
            borderColor: decrypted === msg.slice(0, MAX_MSG_LEN) ? '#00ff41' : '#ff4444',
            fontFamily: 'Share Tech Mono, monospace',
          }}>
            <div style={{ color: '#00aa2b', marginBottom: 4 }}>{kl.decResult}:</div>
            <div style={{ color: '#00ff41', fontSize: '1rem', fontFamily: 'VT323, monospace' }}>
              "{decrypted}"
            </div>
            <div className="mt-2" style={{
              color: decrypted === msg.slice(0, MAX_MSG_LEN) ? '#00ff41' : '#ff4444',
            }}>
              {kl.match}: {decrypted === msg.slice(0, MAX_MSG_LEN) ? 'ANO ✓ — šum byl dostatečně malý' : 'NE ✗ — zkus znovu (vzácná shoda chyb)'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
