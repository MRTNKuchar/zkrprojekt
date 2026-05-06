import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg mb-3 pb-1 border-b"
          style={{ color: '#e8e8e8', fontFamily: 'VT323, monospace', fontSize: '1.3rem', borderColor: '#2a2a2a' }}>
        ▸ {title}
      </h3>
      <div style={{ color: '#b0b0b0', fontFamily: 'Share Tech Mono, monospace' }}>
        {children}
      </div>
    </div>
  )
}

function InfoBox({ label, children, color = '#e8e8e8' }) {
  return (
    <div className="border p-3 mb-3" style={{ borderColor: color, backgroundColor: 'rgba(220,220,220,0.03)' }}>
      <div className="text-xs mb-1" style={{ color, fontFamily: 'Share Tech Mono, monospace' }}>
        ┌─ {label} ─
      </div>
      <div className="text-sm" style={{ color: '#b0b0b0', fontFamily: 'Share Tech Mono, monospace', lineHeight: '1.6' }}>
        {children}
      </div>
    </div>
  )
}

export default function OtpLearn() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const kl = t.otp.learn

  return (
    <div className="tab-content max-w-3xl">
      <h2 className="text-3xl mb-6" style={{ color: '#e8e8e8', fontFamily: 'VT323, monospace', textShadow: '0 0 12px #e8e8e888' }}>
        {kl.title}
      </h2>

      {/* History */}
      <Section title={kl.historyTitle}>
        <InfoBox label="Gilbert Vernam, 1917" color="#aaaaaa">
          {kl.historyText}
        </InfoBox>
        <InfoBox label="Claude Shannon, 1949" color="#e8e8e8">
          {kl.shannonText}
        </InfoBox>
      </Section>

      {/* How it works */}
      <Section title={kl.howTitle}>
        <p className="text-sm mb-4 leading-relaxed">{kl.howText}</p>
        <div className="border p-4 mb-4" style={{ borderColor: '#2a2a2a', backgroundColor: '#080808', fontFamily: 'Share Tech Mono, monospace' }}>
          <div className="text-xs mb-3" style={{ color: '#808080' }}>Příklad XOR šifrování (ASCII):</div>
          <div className="space-y-2 text-xs" style={{ letterSpacing: '0.05em' }}>
            <div className="flex gap-4 flex-wrap">
              <span style={{ color: '#808080' }}>Zpráva:   </span>
              <span style={{ color: '#e8e8e8' }}>H    I</span>
              <span style={{ color: '#505050' }}>= 72 73 (dec) = 01001000 01001001 (bin)</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              <span style={{ color: '#808080' }}>Klíč:     </span>
              <span style={{ color: '#aaaaaa' }}>K    L</span>
              <span style={{ color: '#505050' }}>= 75 76 (dec) = 01001011 01001100 (bin)</span>
            </div>
            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 8, marginTop: 4 }}>
              <div className="flex gap-4 flex-wrap">
                <span style={{ color: '#808080' }}>XOR:      </span>
                <span style={{ color: '#505050' }}>         = 00000011 00000101 = 03 05 (hex)</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                <span style={{ color: '#808080' }}>Šifrováno:</span>
                <span style={{ color: '#cccccc' }}>03 05 (hex) — nerozpoznatelný šum</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 8 }}>
              <div style={{ color: '#808080' }}>Dešifrování: Šifrovaný XOR Klíč = Zpráva (XOR je vlastní inverzí)</div>
              <div style={{ color: '#505050' }}>03 05 XOR 4B 4C = 48 49 = "HI" ✓</div>
            </div>
          </div>
        </div>

        {/* Formula */}
        <div className="border p-4 text-center mb-4" style={{ borderColor: '#2a2a2a', backgroundColor: '#080808' }}>
          <div className="text-xs mb-2" style={{ color: '#808080', fontFamily: 'Share Tech Mono, monospace' }}>Vernamova šifra:</div>
          <div className="mb-2" style={{ color: '#e8e8e8', fontFamily: 'VT323, monospace', fontSize: '1.8rem', textShadow: '0 0 8px #e8e8e866', letterSpacing: '0.1em' }}>
            c = m ⊕ k
          </div>
          <div className="text-xs" style={{ color: '#505050', fontFamily: 'Share Tech Mono, monospace' }}>
            m = zpráva (plaintext), k = klíč (key), c = šifrovaný text (ciphertext)
          </div>
          <div className="text-xs mt-2" style={{ color: '#505050', fontFamily: 'Share Tech Mono, monospace' }}>
            Dešifrování: m = c ⊕ k &nbsp;(XOR je symetrická operace)
          </div>
        </div>
      </Section>

      {/* Perfect Secrecy */}
      <Section title={kl.perfectTitle}>
        <InfoBox label="Shannonova věta o dokonalém utajení" color="#e8e8e8">
          {kl.perfectText}
        </InfoBox>
        <p className="text-sm mb-4 leading-relaxed">{kl.perfectExplain}</p>
        <div className="border p-4" style={{ borderColor: '#2a2a2a', backgroundColor: '#080808', fontFamily: 'Share Tech Mono, monospace' }}>
          <div className="text-xs mb-2" style={{ color: '#808080' }}>Formálně: P(m | c) = P(m)</div>
          <div className="text-xs" style={{ color: '#505050', lineHeight: '1.8' }}>
            Pravděpodobnost zprávy m za podmínky c je stejná jako bez znalosti c.<br />
            Pozorování šifrového textu nedává útočníkovi žádnou informaci.<br />
            Platí za předpokladu: klíč je náhodný, stejně dlouhý jako zpráva, použitý JEDNOU.
          </div>
        </div>
      </Section>

      {/* Requirements & Weaknesses */}
      <Section title={kl.reqTitle}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="border p-3" style={{ borderColor: '#e8e8e8', backgroundColor: '#080808' }}>
            <div className="text-xs mb-2" style={{ color: '#e8e8e8', fontFamily: 'Share Tech Mono, monospace' }}>Požadavky pro bezpečnost:</div>
            <div className="space-y-1 text-xs" style={{ fontFamily: 'Share Tech Mono, monospace', color: '#b0b0b0' }}>
              {kl.requirements.map((r, i) => (
                <div key={i}>✓ {r}</div>
              ))}
            </div>
          </div>
          <div className="border p-3" style={{ borderColor: '#ff4444', backgroundColor: '#080808' }}>
            <div className="text-xs mb-2" style={{ color: '#ff4444', fontFamily: 'Share Tech Mono, monospace' }}>Praktické problémy:</div>
            <div className="space-y-1 text-xs" style={{ fontFamily: 'Share Tech Mono, monospace', color: '#cccccc' }}>
              {kl.problems.map((p, i) => (
                <div key={i}>✗ {p}</div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Key reuse disaster */}
      <Section title={kl.reuseTitle}>
        <p className="text-sm mb-4 leading-relaxed">{kl.reuseText}</p>
        <div className="border p-4 mb-3" style={{ borderColor: '#ff4444', backgroundColor: 'rgba(255,68,68,0.03)', fontFamily: 'Share Tech Mono, monospace' }}>
          <div className="text-xs mb-2" style={{ color: '#ff4444' }}>Útok přepoužitým klíčem:</div>
          <div className="space-y-1 text-xs" style={{ lineHeight: '1.8' }}>
            <div><span style={{ color: '#808080' }}>c1 = m1 ⊕ k</span></div>
            <div><span style={{ color: '#808080' }}>c2 = m2 ⊕ k</span></div>
            <div style={{ borderTop: '1px solid #2a1a1a', paddingTop: 6, marginTop: 6 }}>
              <span style={{ color: '#cccccc' }}>c1 ⊕ c2 = m1 ⊕ k ⊕ m2 ⊕ k = m1 ⊕ m2</span>
            </div>
            <div style={{ color: '#505050' }}>Klíč se vyruší! Útočník zná XOR obou zpráv.</div>
            <div style={{ color: '#ff4444', marginTop: 4 }}>Z m1 ⊕ m2 lze metodou "crib dragging" odvodit obě zprávy.</div>
          </div>
        </div>
        <InfoBox label="Projekt VENONA (NSA, 1943–1980)" color="#aaaaaa">
          {kl.veronaText}
        </InfoBox>
      </Section>

      {/* Real world uses */}
      <Section title={kl.realWorldTitle}>
        <div className="space-y-1">
          {kl.rw.map((rw, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span style={{ color: '#e8e8e8' }}>✓</span>
              <span style={{ color: '#b0b0b0' }}>{rw}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* QKD — solution to key distribution */}
      <Section title={kl.qkdTitle}>
        <InfoBox label="BB84 — Bennett & Brassard, 1984" color="#aaaaaa">
          {kl.qkdText}
        </InfoBox>
        <p className="text-sm mb-4 leading-relaxed">{kl.qkdExplain}</p>

        {/* BB84 polarizations */}
        <div className="border p-4 mb-4" style={{ borderColor: '#2a2a2a', backgroundColor: '#080808', fontFamily: 'Share Tech Mono, monospace' }}>
          <div className="text-xs mb-3" style={{ color: '#808080' }}>Čtyři polarizační stavy BB84:</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div style={{ color: '#e8e8e8', marginBottom: 4 }}>Základ + (rektilineární):</div>
              <div style={{ color: '#505050' }}>bit 0 → <span style={{ color: '#e8e8e8', fontSize: '1.1rem' }}>─</span> (horizontální 0°)</div>
              <div style={{ color: '#505050' }}>bit 1 → <span style={{ color: '#e8e8e8', fontSize: '1.1rem' }}>│</span> (vertikální 90°)</div>
            </div>
            <div>
              <div style={{ color: '#aaaaaa', marginBottom: 4 }}>Základ × (diagonální):</div>
              <div style={{ color: '#505050' }}>bit 0 → <span style={{ color: '#aaaaaa', fontSize: '1.1rem' }}>/</span> (diagonální 45°)</div>
              <div style={{ color: '#505050' }}>bit 1 → <span style={{ color: '#aaaaaa', fontSize: '1.1rem' }}>\</span> (anti-diag. 135°)</div>
            </div>
          </div>
        </div>

        {/* BB84 steps */}
        <div className="space-y-2 mb-4">
          {kl.qkdSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 w-5 text-center" style={{ color: '#aaaaaa' }}>{i + 1}.</span>
              <span style={{ lineHeight: '1.6' }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Eve detection */}
        <InfoBox label="Detekce odposlechu — QBER" color="#cccccc">
          {kl.qkdEveText}
        </InfoBox>

        {/* Real world QKD */}
        <div className="space-y-1 mt-3">
          {kl.qkdRw.map((rw, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span style={{ color: '#aaaaaa' }}>⚛</span>
              <span style={{ color: '#b0b0b0' }}>{rw}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
