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

function Badge({ children, color }) {
  return (
    <span className="inline-block px-2 py-0.5 text-xs border mr-2 mb-1"
          style={{ color, borderColor: color, fontFamily: 'Share Tech Mono, monospace' }}>
      {children}
    </span>
  )
}

export default function CaesarLearn() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const cl = t.caesar.learn

  // Animated alphabet demo
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const shifted = alphabet.slice(3) + alphabet.slice(0, 3)
  const examplePlain = 'CAESAR'
  const exampleCipher = examplePlain.split('').map(c => {
    const idx = alphabet.indexOf(c)
    return alphabet[(idx + 3) % 26]
  }).join('')

  return (
    <div className="tab-content max-w-3xl">
      <h2 className="text-3xl mb-6 glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace' }}>
        {cl.title}
      </h2>

      <Section title={cl.inventor}>
        <InfoBox label={cl.inventorName} color="#ffaa00">
          {cl.inventorText}
        </InfoBox>
      </Section>

      <Section title={cl.howWorks}>
        <p className="text-sm mb-4 leading-relaxed">{cl.howWorksText}</p>

        {/* Visual demo */}
        <div className="border p-4 mb-4" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
          <div className="text-xs mb-3" style={{ color: '#00aa2b' }}>{cl.example}:</div>
          <div className="overflow-x-auto">
            <div className="flex gap-0 mb-1">
              <span className="text-xs w-20 shrink-0" style={{ color: '#00aa2b' }}>{cl.alphabet} (A):</span>
              <div className="flex gap-1">
                {alphabet.split('').map(c => (
                  <span key={c} className="text-xs w-5 text-center" style={{ color: '#005515' }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-0 mb-3">
              <span className="text-xs w-20 shrink-0" style={{ color: '#00aa2b' }}>{cl.alphabet} (B):</span>
              <div className="flex gap-1">
                {shifted.split('').map((c, i) => (
                  <span key={i} className="text-xs w-5 text-center" style={{ color: '#00ff41' }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-0 mb-1">
              <span className="text-xs w-20 shrink-0" style={{ color: '#00aa2b' }}>{cl.plaintext}:</span>
              <div className="flex gap-1">
                {examplePlain.split('').map((c, i) => (
                  <span key={i} className="text-xs w-5 text-center font-bold" style={{ color: '#00ff41' }}>{c}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-0">
              <span className="text-xs w-20 shrink-0" style={{ color: '#00aa2b' }}>{cl.ciphertext}:</span>
              <div className="flex gap-1">
                {exampleCipher.split('').map((c, i) => (
                  <span key={i} className="text-xs w-5 text-center font-bold" style={{ color: '#ffaa00' }}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <InfoBox label={cl.formula}>
          <pre className="text-xs whitespace-pre-wrap" style={{ color: '#aaffaa' }}>{cl.formulaText}</pre>
        </InfoBox>
      </Section>

      <Section title={cl.historyCases}>
        <InfoBox label={cl.case1Title} color="#00ff41">
          {cl.case1Text}
        </InfoBox>
        <InfoBox label={cl.case2Title} color="#ffaa00">
          {cl.case2Text}
        </InfoBox>
        <InfoBox label={cl.case3Title} color="#44aaff">
          {cl.case3Text}
        </InfoBox>
      </Section>

      <Section title={cl.consequences}>
        <div className="border-l-2 pl-4 mb-4 text-sm leading-relaxed"
             style={{ borderColor: '#ff4444', color: '#ff8888' }}>
          {cl.consequencesText}
        </div>
      </Section>

      <Section title={cl.weakness}>
        <div className="space-y-2">
          {[cl.weakness1, cl.weakness2, cl.weakness3].map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span style={{ color: '#ff4444' }}>✗</span>
              <span style={{ color: '#cc8888' }}>{w}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
