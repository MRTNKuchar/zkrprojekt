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
    <div className="border p-3 mb-3" style={{ borderColor: color, backgroundColor: `rgba(0,255,65,0.03)` }}>
      <div className="text-xs mb-1" style={{ color, fontFamily: 'Share Tech Mono, monospace' }}>
        ┌─ {label} ─
      </div>
      <div className="text-sm" style={{ color: '#00cc35', fontFamily: 'Share Tech Mono, monospace', lineHeight: '1.6' }}>
        {children}
      </div>
    </div>
  )
}

export default function EccLearn() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const el = t.ecc.learn

  return (
    <div className="tab-content max-w-3xl">
      <h2 className="text-3xl mb-6 glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace' }}>
        {el.title}
      </h2>

      <Section title={el.title}>
        <InfoBox label={el.inventorName} color="#44aaff">
          {el.inventorText}
        </InfoBox>
      </Section>

      <Section title={el.howWorks}>
        <p className="text-sm mb-4 leading-relaxed">{el.howWorksText}</p>

        {/* Curve equation display */}
        <div className="border p-4 mb-4 text-center" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
          <div className="text-xs mb-2" style={{ color: '#00aa2b' }}>{el.curve}:</div>
          <div className="text-3xl glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', letterSpacing: '0.1em' }}>
            {el.curveEq}
          </div>
          <div className="text-xs mt-2" style={{ color: '#005515' }}>{el.curveDesc}</div>
        </div>
      </Section>

      <Section title={el.ecdh}>
        <div className="space-y-2">
          {el.ecdhSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 w-5 text-center" style={{ color: '#ffaa00' }}>{i + 1}.</span>
              <span style={{ lineHeight: '1.6' }}>{step}</span>
            </div>
          ))}
        </div>

        {/* Visual ECDH flow */}
        <div className="mt-4 border p-4" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
          <div className="grid grid-cols-3 gap-2 text-xs text-center" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            <div className="border p-2" style={{ borderColor: '#44aaff', color: '#44aaff' }}>
              <div className="text-base mb-1" style={{ fontFamily: 'VT323, monospace', fontSize: '1.2rem' }}>ALICE</div>
              <div style={{ color: '#00aa2b' }}>privátní: a</div>
              <div style={{ color: '#00ff41' }}>veřejný: A=a·G</div>
            </div>
            <div className="flex items-center justify-center flex-col gap-1">
              <div style={{ color: '#00aa2b' }}>A →</div>
              <div style={{ color: '#005515' }}>← B</div>
              <div className="mt-1" style={{ color: '#005515', fontSize: '10px' }}>veřejné klíče</div>
            </div>
            <div className="border p-2" style={{ borderColor: '#ffaa00', color: '#ffaa00' }}>
              <div className="text-base mb-1" style={{ fontFamily: 'VT323, monospace', fontSize: '1.2rem' }}>BOB</div>
              <div style={{ color: '#00aa2b' }}>privátní: b</div>
              <div style={{ color: '#00ff41' }}>veřejný: B=b·G</div>
            </div>
          </div>
          <div className="mt-3 text-center text-xs" style={{ color: '#00ff41', fontFamily: 'Share Tech Mono, monospace' }}>
            Alice: S = a·B = a·b·G &nbsp;|&nbsp; Bob: S = b·A = b·a·G
          </div>
          <div className="mt-1 text-center text-xs" style={{ color: '#00aa2b' }}>
            ✓ Obě strany sdílí stejné S, aniž si ho přenesly přes síť
          </div>
        </div>
      </Section>

      <Section title={el.vsRSA}>
        <div className="border overflow-hidden" style={{ borderColor: '#1a3a1a' }}>
          {el.vsRSARows.map((row, i) => (
            <div key={i} className="grid grid-cols-3 text-xs"
                 style={{ borderBottom: i < el.vsRSARows.length - 1 ? '1px solid #1a3a1a' : 'none' }}>
              {row.map((cell, j) => (
                <div key={j} className="px-3 py-2"
                     style={{
                       color: i === 0 ? '#00ff41' : j === 0 ? '#00cc35' : j === 1 ? '#ff6666' : '#44ff44',
                       backgroundColor: i === 0 ? 'rgba(0,255,65,0.07)' : 'transparent',
                       fontFamily: 'Share Tech Mono, monospace',
                       fontWeight: i === 0 ? 'bold' : 'normal',
                     }}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="text-xs mt-2" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          ECC poskytuje stejnou ochranu s ~6× kratšími klíči než RSA.
        </div>
      </Section>

      <Section title={el.quantum}>
        <InfoBox label="Shorův algoritmus" color="#ff4444">
          {el.quantumText}
        </InfoBox>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          {[
            { label: 'Klasický počítač', status: 'BEZPEČNÁ', color: '#00ff41', desc: '2¹²⁸ operací nutných pro prolomení ECC-256' },
            { label: 'Kvantový počítač', status: 'OHROŽENA', color: '#ff4444', desc: 'Shorův algoritmus: polynomiální čas' },
            { label: 'Post-kvantová', status: 'BEZPEČNÁ', color: '#44aaff', desc: 'CRYSTALS-Kyber, Dilithium — lattice kryptografie' },
          ].map(item => (
            <div key={item.label} className="border p-2 text-xs"
                 style={{ borderColor: item.color, backgroundColor: 'rgba(0,255,65,0.02)' }}>
              <div style={{ color: item.color, fontFamily: 'Share Tech Mono, monospace' }}>{item.label}</div>
              <div className="mt-1" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>{item.status}</div>
              <div className="mt-1" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace', fontSize: '10px' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={el.realWorld}>
        <div className="space-y-1">
          {[el.rw1, el.rw2, el.rw3, el.rw4, el.rw5].map((rw, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span style={{ color: '#00ff41' }}>✓</span>
              <span style={{ color: '#00cc35' }}>{rw}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
