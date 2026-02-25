import { useState } from 'react'
import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'
import {
  generateKeyPair,
  computeSharedSecret,
  signMessage,
  verifySignature,
  pointToHex,
  sigToHex,
} from '../../utils/ecc'
import CodeBlock from '../../components/CodeBlock'
import EccCurveVis from '../../components/EccCurveVis'

const ECC_CODE_SCRATCH = `# ============================================================
# ECC OD NULY — zadne zavislosti, ciste Python
# Vzdělávací implementace ECDH + ECDSA
# Spusteni: python ecc_scratch.py
# ============================================================
# Krivka: y^2 = x^3 - 3x + 3  (mod 97) — male pole pro demo
# Real ECC: secp256k1 s prvocislem ~2^256
# ============================================================

import random

# --- Parametry krivky ---
P = 97      # prvocislo definujici konecne pole Z_p
A = -3      # koeficient a v rovnici krivky
B =  3      # koeficient b v rovnici krivky
G = (13, 7) # generatorovy bod (lezi na krivce, overeno)

# N = rad bodu G = nejmensi n, pro ktere n*G = bod v nekonecnu
# Pro tuto krivku N = 11  (spocteno iteraci)
N = 11


def mod_inv(a, p):
    """Modularni inverze pres rozsireny Eukliduv algoritmus."""
    a = a % p
    g, x, u = p, 0, 1
    while a != 0:
        q = g // a
        g, a = a, g - q * a
        x, u = u, x - q * u
    return x % p


def bod_soucet(bod1, bod2):
    """Secte dva body na elipticke krivce nad Z_p."""
    if bod1 is None: return bod2
    if bod2 is None: return bod1
    x1, y1 = bod1
    x2, y2 = bod2
    if x1 == x2 and (y1 + y2) % P == 0:
        return None  # bod v nekonecnu (neutralni prvek)
    if bod1 == bod2:
        # Zdvojeni bodu — smernice tecny
        # lambda = (3*x1^2 + A) / (2*y1)  mod P
        citatel    = (3 * x1 * x1 + A) % P
        jmenovatel = mod_inv(2 * y1, P)
        lam = (citatel * jmenovatel) % P
    else:
        # Soucet ruznych bodu — smernice secny
        # lambda = (y2 - y1) / (x2 - x1)  mod P
        citatel    = (y2 - y1) % P
        jmenovatel = mod_inv(x2 - x1, P)
        lam = (citatel * jmenovatel) % P
    x3 = (lam * lam - x1 - x2) % P
    y3 = (lam * (x1 - x3) - y1) % P
    return (x3, y3)


def skalar_nasob(k, bod):
    """k-nasobek bodu — double-and-add algoritmus, O(log k)."""
    vysledek = None   # bod v nekonecnu = neutralni prvek
    scitanec = bod    # G, 2G, 4G, 8G, ...
    while k > 0:
        if k & 1:     # nejnizsi bit je 1
            vysledek = bod_soucet(vysledek, scitanec)
        scitanec = bod_soucet(scitanec, scitanec)
        k >>= 1
    return vysledek


def hash_zpravy(zprava):
    """Jednoduchy hash — POUZE PRO DEMO, ne kryptograficky!"""
    h = 0
    for znak in zprava:
        h = (h * 31 + ord(znak)) % N
    return h or 1  # hash nesmi byt 0


# ============================================================
#  ECDH — VYMENA KLICU
# ============================================================
def demo_ecdh():
    # Soukromy klic musi byt v [1, N-1]
    alice_soukr = random.randint(2, N - 1)
    bob_soukr   = random.randint(2, N - 1)

    alice_verejn = skalar_nasob(alice_soukr, G)  # A = a*G
    bob_verejn   = skalar_nasob(bob_soukr,   G)  # B = b*G

    #   Alice: a * B = a*b*G
    #   Bob:   b * A = b*a*G  (stejne!)
    alice_sdilene = skalar_nasob(alice_soukr, bob_verejn)
    bob_sdilene   = skalar_nasob(bob_soukr,  alice_verejn)

    print("=" * 56)
    print("  ECDH - vymena klicu na elipticke krivce")
    print(f"  Krivka: y^2 = x^3 + ({A})x + {B}  (mod {P})")
    print("=" * 56)
    print(f"  [ALICE] soukromy klic  : {alice_soukr:<4}  (NIKDY neposila!)")
    print(f"  [ALICE] verejny klic   : {alice_verejn}")
    print(f"  [BOB]   soukromy klic  : {bob_soukr:<4}  (NIKDY neposila!)")
    print(f"  [BOB]   verejny klic   : {bob_verejn}")
    print(f"  [ALICE] sdilene tajemstvi: {alice_sdilene}")
    print(f"  [BOB]   sdilene tajemstvi: {bob_sdilene}")
    print(f"  Shoda: {'ANO' if alice_sdilene == bob_sdilene else 'NE'}")
    return alice_soukr, alice_verejn


# ============================================================
#  ECDSA — PODPIS ZPRAVY
# ============================================================
def demo_ecdsa(alice_soukr, alice_verejn):
    zprava = "Tajemstvi je bezpecne"
    h = hash_zpravy(zprava)

    # Nonce k: opakujeme dokud r != 0 a s != 0
    while True:
        k = random.randint(2, N - 1)
        R = skalar_nasob(k, G)
        if R is None: continue
        r = R[0] % N
        if r == 0: continue
        # s = k^-1 * (h + a*r)  mod N
        s = (mod_inv(k, N) * (h + alice_soukr * r)) % N
        if s != 0: break

    # Overeni: u1*G + u2*VK_Alice musi dat bod s x == r
    s_inv = mod_inv(s, N)
    u1 = (h * s_inv) % N
    u2 = (r * s_inv) % N
    overovaci_bod = bod_soucet(skalar_nasob(u1, G), skalar_nasob(u2, alice_verejn))
    platny = overovaci_bod is not None and overovaci_bod[0] % N == r

    print(f"\\n  [ECDSA] Zprava  : '{zprava}'")
    print(f"  [ECDSA] Podpis  : r={r}, s={s}")
    print(f"  [ECDSA] Overeni : {'PLATNY' if platny else 'NEPLATNY'}")


if __name__ == "__main__":
    alice_soukr, alice_verejn = demo_ecdh()
    demo_ecdsa(alice_soukr, alice_verejn)
`

const ECC_CODE_PROD = `# ============================================================
# ECC PRODUKCNI — knihovna cryptography (NIST P-256)
# Instalace: pip install cryptography
# Spusteni:  python ecc_prod.py
# ============================================================
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes

# Krivka NIST P-256 (secp256r1) — standard pro TLS, HTTPS
CURVE = ec.SECP256R1()

# --- ALICE ---
alice_priv = ec.generate_private_key(CURVE)
alice_pub  = alice_priv.public_key()

# --- BOB ---
bob_priv = ec.generate_private_key(CURVE)
bob_pub  = bob_priv.public_key()

# --- ECDH: vymena klicu ---
alice_sdilene = alice_priv.exchange(ec.ECDH(), bob_pub)
bob_sdilene   = bob_priv.exchange(ec.ECDH(), alice_pub)

assert alice_sdilene == bob_sdilene, "Tajemstvi se neshoduji!"

print(f"Sdilene tajemstvi (prvnich 16 B): {alice_sdilene.hex()[:32]}...")
print(f"Shoda: {alice_sdilene == bob_sdilene}")

# --- ECDSA: podpis zpravy ---
zprava = b"Tajemstvi je bezpecne"

podpis = alice_priv.sign(zprava, ec.ECDSA(hashes.SHA256()))

try:
    alice_pub.verify(podpis, zprava, ec.ECDSA(hashes.SHA256()))
    print("Overeni podpisu: OK — zprava nebyla zmenena")
except Exception:
    print("Overeni selhalo!")

# Pokus o overeni pozmenene zpravy
try:
    alice_pub.verify(podpis, zprava + b"X", ec.ECDSA(hashes.SHA256()))
except Exception:
    print("Pozmenena zprava: ZAMÍTNUTA — podpis neodpovida")
`

export default function EccLab() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const el = t.ecc.lab

  const [aliceKeys, setAliceKeys] = useState(null)
  const [bobKeys, setBobKeys] = useState(null)
  const [aliceShared, setAliceShared] = useState(null)
  const [bobShared, setBobShared] = useState(null)
  const [exchangeDone, setExchangeDone] = useState(false)
  const [msg, setMsg] = useState('Ahoj Bobe, posílám ti tajnou zprávu!')
  const [tamperMsg, setTamperMsg] = useState('')
  const [signature, setSignature] = useState(null)
  const [verifyResult, setVerifyResult] = useState(null)
  const [verifyTamper, setVerifyTamper] = useState(null)
  const [highlightPt, setHighlightPt] = useState(null)

  const handleGenerate = () => {
    const alice = generateKeyPair()
    const bob = generateKeyPair()
    setAliceKeys(alice)
    setBobKeys(bob)
    setAliceShared(null)
    setBobShared(null)
    setExchangeDone(false)
    setSignature(null)
    setVerifyResult(null)
    setVerifyTamper(null)
    setHighlightPt(alice.publicKey)
  }

  const handleExchange = () => {
    if (!aliceKeys || !bobKeys) return
    const as = computeSharedSecret(aliceKeys.privateKey, bobKeys.publicKey)
    const bs = computeSharedSecret(bobKeys.privateKey, aliceKeys.publicKey)
    setAliceShared(as)
    setBobShared(bs)
    setExchangeDone(true)
  }

  const handleSign = () => {
    if (!aliceKeys) return
    const sig = signMessage(msg, aliceKeys.privateKey, aliceKeys.G)
    setSignature(sig)
    setVerifyResult(null)
    setVerifyTamper(null)
    setTamperMsg('')
  }

  const handleVerify = () => {
    if (!aliceKeys || !signature) return
    const ok = verifySignature(msg, signature, aliceKeys.publicKey, aliceKeys.G)
    setVerifyResult(ok)
  }

  const handleVerifyTamper = () => {
    if (!aliceKeys || !signature) return
    const tampered = tamperMsg || msg + 'X'
    const ok = verifySignature(tampered, signature, aliceKeys.publicKey, aliceKeys.G)
    setVerifyTamper(ok)
  }

  const secretMatch = aliceShared && bobShared &&
    aliceShared[0] === bobShared[0] && aliceShared[1] === bobShared[1]

  return (
    <div className="tab-content">
      <h2 className="text-2xl mb-6 glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.8rem' }}>
        {el.title}
      </h2>

      {/* Code — od nuly */}
      <div className="mb-4">
        <h3 className="text-sm mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {el.codeTitle} — od nuly, bez závislostí
        </h3>
        <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          python ecc_scratch.py
        </div>
        <CodeBlock code={ECC_CODE_SCRATCH} title="ecc_scratch.py" />
      </div>

      {/* Code — produkční */}
      <div className="mb-8">
        <h3 className="text-sm mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ Produkční verze — knihovna cryptography (P-256)
        </h3>
        <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          pip install cryptography &nbsp;→&nbsp; python ecc_prod.py
        </div>
        <CodeBlock code={ECC_CODE_PROD} title="ecc_prod.py" />
      </div>

      {/* ECDH simulation */}
      <div className="border p-4 mb-6" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
        <h3 className="text-sm mb-4" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
          ▸ {el.ecdhTitle}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Alice */}
          <div className="border p-3" style={{ borderColor: '#44aaff' }}>
            <div className="text-center text-sm mb-3" style={{ color: '#44aaff', fontFamily: 'VT323, monospace', fontSize: '1.3rem' }}>
              👩 {el.aliceLabel}
            </div>
            {aliceKeys ? (
              <div className="space-y-2 text-xs" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                <div>
                  <span style={{ color: '#ff6666' }}>{el.privateKey}: </span>
                  <span style={{ color: '#ff4444' }}>{aliceKeys.privateKey} (TAJNÉ!)</span>
                </div>
                <div>
                  <span style={{ color: '#00aa2b' }}>{el.publicKey}: </span>
                  <span style={{ color: '#00ff41' }}>{pointToHex(aliceKeys.publicKey)}</span>
                </div>
                {aliceShared && (
                  <div>
                    <span style={{ color: '#ffaa00' }}>{el.sharedSecret}: </span>
                    <span style={{ color: '#ffcc44' }}>{pointToHex(aliceShared)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-center" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
                — klíče nebyly vygenerovány —
              </div>
            )}
          </div>

          {/* Bob */}
          <div className="border p-3" style={{ borderColor: '#ffaa00' }}>
            <div className="text-center text-sm mb-3" style={{ color: '#ffaa00', fontFamily: 'VT323, monospace', fontSize: '1.3rem' }}>
              👨 {el.bobLabel}
            </div>
            {bobKeys ? (
              <div className="space-y-2 text-xs" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                <div>
                  <span style={{ color: '#ff6666' }}>{el.privateKey}: </span>
                  <span style={{ color: '#ff4444' }}>{bobKeys.privateKey} (TAJNÉ!)</span>
                </div>
                <div>
                  <span style={{ color: '#00aa2b' }}>{el.publicKey}: </span>
                  <span style={{ color: '#00ff41' }}>{pointToHex(bobKeys.publicKey)}</span>
                </div>
                {bobShared && (
                  <div>
                    <span style={{ color: '#ffaa00' }}>{el.sharedSecret}: </span>
                    <span style={{ color: '#ffcc44' }}>{pointToHex(bobShared)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-center" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
                — klíče nebyly vygenerovány —
              </div>
            )}
          </div>
        </div>

        {/* Shared secret match banner */}
        {exchangeDone && (
          <div className="border p-2 mb-4 text-center text-sm fade-in"
               style={{
                 borderColor: secretMatch ? '#00ff41' : '#ff4444',
                 color: secretMatch ? '#00ff41' : '#ff4444',
                 fontFamily: 'Share Tech Mono, monospace',
                 textShadow: secretMatch ? '0 0 8px #00ff41' : '0 0 8px #ff4444',
               }}>
            {secretMatch ? `✓ ${el.sharedSecretMatch}` : '✗ Tajemství se neshodují!'}
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 text-sm border transition-all"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: '#00ff41',
              borderColor: '#00ff41',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,255,65,0.1)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {el.generateBtn}
          </button>
          <button
            onClick={handleExchange}
            disabled={!aliceKeys || !bobKeys}
            className="px-4 py-2 text-sm border transition-all"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: aliceKeys && bobKeys ? '#ffaa00' : '#333',
              borderColor: aliceKeys && bobKeys ? '#ffaa00' : '#333',
              background: 'transparent',
              cursor: aliceKeys && bobKeys ? 'pointer' : 'not-allowed',
            }}
            onMouseEnter={e => { if (aliceKeys && bobKeys) e.currentTarget.style.backgroundColor = 'rgba(255,170,0,0.1)' }}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {el.exchangeBtn}
          </button>
        </div>
      </div>

      {/* Curve visualization + Sign/Verify */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Curve */}
        <div className="border p-4" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
          <h3 className="text-sm mb-3" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
            ▸ {el.curveTitle}
          </h3>
          <EccCurveVis highlightPoint={highlightPt} />
          <div className="mt-2 text-xs whitespace-pre-line" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
            {el.curveInfo}
          </div>
        </div>

        {/* Sign/Verify */}
        <div className="border p-4" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
          <h3 className="text-sm mb-4" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
            ▸ {el.signTitle}
          </h3>

          <div className="mb-3">
            <label className="block text-xs mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
              {el.msgLabel}:
            </label>
            <input
              value={msg}
              onChange={e => { setMsg(e.target.value); setSignature(null); setVerifyResult(null); setVerifyTamper(null) }}
              className="w-full border p-2 text-sm outline-none"
              style={{
                backgroundColor: '#020a02',
                borderColor: '#1a3a1a',
                color: '#00ff41',
                fontFamily: 'Share Tech Mono, monospace',
                caretColor: '#00ff41',
              }}
              placeholder={el.msgPlaceholder}
            />
          </div>

          {signature && (
            <div className="mb-3 border p-2" style={{ borderColor: '#1a3a1a' }}>
              <div className="text-xs mb-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
                {el.signatureLabel}:
              </div>
              <div className="text-xs break-all" style={{ color: '#ffaa00', fontFamily: 'Share Tech Mono, monospace' }}>
                {sigToHex(signature)}
              </div>
            </div>
          )}

          {verifyResult !== null && (
            <div className="mb-2 border p-2 fade-in text-xs"
                 style={{
                   borderColor: verifyResult ? '#00ff41' : '#ff4444',
                   color: verifyResult ? '#00ff41' : '#ff4444',
                   fontFamily: 'Share Tech Mono, monospace',
                 }}>
              {verifyResult ? `✓ ${el.verifyOk}` : `✗ ${el.verifyFail}`}
            </div>
          )}

          {verifyTamper !== null && (
            <div className="mb-2 border p-2 fade-in text-xs"
                 style={{
                   borderColor: verifyTamper ? '#00ff41' : '#ff4444',
                   color: verifyTamper ? '#00ff41' : '#ff4444',
                   fontFamily: 'Share Tech Mono, monospace',
                 }}>
              Pozměněná zpráva: {verifyTamper ? `✓ ${el.verifyOk}` : `✗ ${el.verifyFail}`}
            </div>
          )}

          {signature && (
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: '#ffaa00', fontFamily: 'Share Tech Mono, monospace' }}>
                Pozměnit zprávu (demo):
              </label>
              <input
                value={tamperMsg}
                onChange={e => setTamperMsg(e.target.value)}
                placeholder={msg + 'X'}
                className="w-full border p-2 text-sm outline-none"
                style={{
                  backgroundColor: '#0a0202',
                  borderColor: '#3a1a1a',
                  color: '#ff6666',
                  fontFamily: 'Share Tech Mono, monospace',
                  caretColor: '#ff4444',
                }}
              />
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleSign}
              disabled={!aliceKeys}
              className="px-3 py-1.5 text-xs border transition-all"
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                color: aliceKeys ? '#00ff41' : '#333',
                borderColor: aliceKeys ? '#00ff41' : '#333',
                background: 'transparent',
                cursor: aliceKeys ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => { if (aliceKeys) e.currentTarget.style.backgroundColor = 'rgba(0,255,65,0.1)' }}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {el.signBtn}
            </button>
            <button
              onClick={handleVerify}
              disabled={!signature}
              className="px-3 py-1.5 text-xs border transition-all"
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                color: signature ? '#44aaff' : '#333',
                borderColor: signature ? '#44aaff' : '#333',
                background: 'transparent',
                cursor: signature ? 'pointer' : 'not-allowed',
              }}
              onMouseEnter={e => { if (signature) e.currentTarget.style.backgroundColor = 'rgba(68,170,255,0.1)' }}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {el.verifyBtn}
            </button>
            {signature && (
              <button
                onClick={handleVerifyTamper}
                className="px-3 py-1.5 text-xs border transition-all"
                style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  color: '#ff4444',
                  borderColor: '#ff4444',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,68,68,0.1)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                OVĚŘIT POZMĚNĚNOU
              </button>
            )}
          </div>

          {!aliceKeys && (
            <div className="mt-3 text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
              ↑ Nejdřív vygeneruj klíče výše
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
