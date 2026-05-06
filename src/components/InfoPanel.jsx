import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'

export default function InfoPanel({ type, year, security, accentColor }) {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const ip = t.infoPanel

  const secColors = {
    broken: '#ff4444',
    secure: accentColor || '#e8e8e8',
    quantum: '#aaaaaa',
    quantumSafe: accentColor || '#e8e8e8',
    perfect: accentColor || '#e8e8e8',
  }

  const secKey = security === 'broken' ? 'broken'
    : security === 'quantum' ? 'quantumVulnerable'
    : security === 'quantumSafe' ? 'quantumSafe'
    : security === 'perfect' ? 'perfect'
    : 'secure'

  const secColor = secColors[security] || accentColor || '#e8e8e8'
  const secLabel = ip[secKey]

  return (
    <div className="border text-xs"
         style={{
           borderColor: '#2a2a2a',
           backgroundColor: 'rgba(15,15,15,0.15)',
           fontFamily: 'Share Tech Mono, monospace',
         }}>
      <div className="px-3 py-1" style={{ borderBottom: '1px solid #2a2a2a', color: '#808080' }}>
        ┌─ SYS.INFO ─────────────────
      </div>
      <div className="px-3 py-2 space-y-1">
        <div className="flex justify-between gap-4">
          <span style={{ color: '#808080' }}>{ip.type}:</span>
          <span style={{ color: '#e8e8e8' }}>{type === 'classical' ? ip.classical : ip.modern}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: '#808080' }}>{ip.year}:</span>
          <span style={{ color: '#e8e8e8' }}>{year}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: '#808080' }}>{ip.security}:</span>
          <span style={{ color: secColor, textShadow: `0 0 6px ${secColor}` }}>{secLabel}</span>
        </div>
      </div>
      <div className="px-3 py-1" style={{ borderTop: '1px solid #2a2a2a', color: '#808080' }}>
        └────────────────────────────
      </div>
    </div>
  )
}
