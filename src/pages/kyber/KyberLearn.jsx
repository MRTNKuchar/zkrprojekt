import { useLang } from '../../contexts/LanguageContext'
import { useTranslation } from '../../translations'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg mb-3 pb-1 border-b"
          style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.3rem', borderColor: '#1a3a1a' }}>
        ▸ {title}
      </h3>
      <div style={{ color: '#00cc35', fontFamily: 'Share Tech Mono, monospace' }}>
        {children}
      </div>
    </div>
  )
}

function InfoBox({ label, children, color = '#00ff41' }) {
  return (
    <div className="border p-3 mb-3" style={{ borderColor: color, backgroundColor: 'rgba(0,255,65,0.03)' }}>
      <div className="text-xs mb-1" style={{ color, fontFamily: 'Share Tech Mono, monospace' }}>
        ┌─ {label} ─
      </div>
      <div className="text-sm" style={{ color: '#00cc35', fontFamily: 'Share Tech Mono, monospace', lineHeight: '1.6' }}>
        {children}
      </div>
    </div>
  )
}

export default function KyberLearn() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const kl = t.kyber.learn

  return (
    <div className="tab-content max-w-3xl">
      <h2 className="text-3xl mb-6" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', textShadow: '0 0 12px #00ff4188' }}>
        {kl.title}
      </h2>

      {/* Threat */}
      <Section title={kl.threatTitle}>
        <InfoBox label="Peter Shor, 1994" color="#ff6644">
          {kl.threatText}
        </InfoBox>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          {[
            { alg: 'RSA-2048',  classical: '10¹⁵ let', quantum: 'Hodiny ⚠', qc: '#ff4444' },
            { alg: 'ECC-256',   classical: '10²² let', quantum: 'Hodiny ⚠', qc: '#ff4444' },
          ].map(r => (
            <div key={r.alg} className="border p-3 text-xs" style={{ borderColor: '#2a1a1a', backgroundColor: '#0a0505' }}>
              <div style={{ color: '#ff6644', fontFamily: 'Share Tech Mono, monospace', marginBottom: 4 }}>{r.alg}</div>
              <div style={{ color: '#00cc35' }}>Klasický PC: {r.classical}</div>
              <div style={{ color: r.qc }}>Kvantový PC: {r.quantum}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Lattices */}
      <Section title={kl.latticeTitle}>
        <p className="text-sm mb-4 leading-relaxed">{kl.latticeText}</p>
        {/* ASCII lattice visualization */}
        <div className="border p-4 text-center" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05', fontFamily: 'Share Tech Mono, monospace' }}>
          <div className="text-xs mb-2" style={{ color: '#00aa2b' }}>Mřížka Z² — body se pravidelně opakují</div>
          <pre className="text-xs leading-5" style={{ color: '#00ff41', display: 'inline-block', textAlign: 'left' }}>{
`·  ·  ·  ·  ·  ·  ·
·  ●  ·  ●  ·  ●  ·
·  ·  ·  ·  ·  ·  ·
·  ●  ·  ●  ·  ●  ·
·  ·  ·  ·  ·  ·  ·
·  ●  ·  ●  ·  ●  ·`}
          </pre>
          <div className="text-xs mt-2" style={{ color: '#005515' }}>V n dimenzích → hledání nejkratšího vektoru je NP-těžké</div>
        </div>
      </Section>

      {/* LWE */}
      <Section title={kl.lweTitle}>
        <p className="text-sm mb-4 leading-relaxed">{kl.lweText}</p>
        <div className="border p-4 text-center mb-4" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
          <div className="text-xs mb-2" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>Rovnice LWE:</div>
          <div className="text-2xl mb-2" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', letterSpacing: '0.1em', textShadow: '0 0 8px #00ff4166' }}>
            {kl.lweFormula}
          </div>
          <div className="text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
            {kl.lweFormulaDesc}
          </div>
        </div>
        <InfoBox label="Proč je LWE těžké?" color="#00ff41">
          Bez znalosti chybového vektoru e vypadají hodnoty b jako náhodné šumy. Útočník nemůže rozlišit b = As+e od rovnoměrně náhodného vektoru — ani s kvantovým počítačem.
        </InfoBox>
      </Section>

      {/* How ML-KEM works */}
      <Section title={kl.howWorksTitle}>
        <div className="space-y-2 mb-4">
          {kl.howWorksSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 w-5 text-center" style={{ color: '#ffaa44' }}>{i + 1}.</span>
              <span style={{ lineHeight: '1.6' }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Visual flow */}
        <div className="border p-4" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
          <div className="grid grid-cols-3 gap-2 text-xs text-center" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            <div className="border p-2" style={{ borderColor: '#44aaff', color: '#44aaff' }}>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: '1.2rem', marginBottom: 4 }}>ALICE</div>
              <div style={{ color: '#00cc35' }}>zná: veřejný klíč</div>
              <div style={{ color: '#00ff41' }}>zapouzdří sdílený klíč</div>
            </div>
            <div className="flex items-center justify-center flex-col gap-1">
              <div style={{ color: '#00aa2b' }}>(u, v) →</div>
              <div style={{ color: '#005515', fontSize: '10px' }}>ciphertext</div>
              <div style={{ color: '#005515', fontSize: '10px' }}>(veřejně)</div>
            </div>
            <div className="border p-2" style={{ borderColor: '#ffaa44', color: '#ffaa44' }}>
              <div style={{ fontFamily: 'VT323, monospace', fontSize: '1.2rem', marginBottom: 4 }}>BOB</div>
              <div style={{ color: '#00cc35' }}>zná: soukromý klíč s</div>
              <div style={{ color: '#00ff41' }}>rozbalí sdílený klíč</div>
            </div>
          </div>
          <div className="mt-3 text-center text-xs" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
            ✓ Obě strany sdílí stejný klíč — soukromá data nikdy nepřeneseny
          </div>
        </div>
      </Section>

      {/* NIST */}
      <Section title={kl.nistTitle}>
        <InfoBox label="NIST Post-Quantum Cryptography Standardization" color="#ffaa44">
          {kl.nistText}
        </InfoBox>
        <div className="border overflow-hidden" style={{ borderColor: '#1a3a1a' }}>
          {kl.nistRows.map((row, i) => (
            <div key={i} className="grid grid-cols-4 text-xs"
                 style={{ borderBottom: i < kl.nistRows.length - 1 ? '1px solid #1a3a1a' : 'none' }}>
              {row.map((cell, j) => (
                <div key={j} className="px-3 py-2"
                     style={{
                       color: i === 0 ? '#00ff41' : j === 0 ? '#00cc35' : j === 3 ? '#ffaa44' : '#00aa2b',
                       backgroundColor: i === 0 ? 'rgba(0,255,65,0.07)' : 'transparent',
                       fontFamily: 'Share Tech Mono, monospace',
                     }}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Comparison table */}
      <Section title={kl.compTitle}>
        <div className="border overflow-hidden" style={{ borderColor: '#1a3a1a' }}>
          {kl.compRows.map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-xs"
                 style={{ borderBottom: i < kl.compRows.length - 1 ? '1px solid #1a3a1a' : 'none' }}>
              {row.map((cell, j) => (
                <div key={j} className="px-3 py-2"
                     style={{
                       color: i === 0 ? '#00ff41'
                            : j === 0 ? '#00cc35'
                            : j === 1 ? '#aaaaaa'
                            : i < 3 ? '#ff6644' : '#00ff41',
                       backgroundColor: i === 0 ? 'rgba(0,255,65,0.07)'
                                       : i === kl.compRows.length - 1 ? 'rgba(0,255,65,0.04)' : 'transparent',
                       fontFamily: 'Share Tech Mono, monospace',
                     }}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>

      {/* Real-world */}
      <Section title={kl.realWorldTitle}>
        <div className="space-y-1">
          {kl.rw.map((rw, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span style={{ color: '#00ff41' }}>✓</span>
              <span style={{ color: '#00cc35' }}>{rw}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
