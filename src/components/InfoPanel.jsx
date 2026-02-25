import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'

export default function InfoPanel({ type, year, security, accentColor }) {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const ip = t.infoPanel

  const secColors = {
    broken: '#ff4444',
    secure: accentColor || '#00ff41',
    quantum: '#ffaa00',
    quantumSafe: accentColor || '#00ff41',
  }

  const secKey = security === 'broken' ? 'broken'
    : security === 'quantum' ? 'quantumVulnerable'
    : security === 'quantumSafe' ? 'quantumSafe'
    : 'secure'

  const secColor = secColors[security] || accentColor || '#00ff41'
  const secLabel = ip[secKey]

  return (
    <div className="border text-xs"
         style={{
           borderColor: '#1a3a1a',
           backgroundColor: 'rgba(0,59,15,0.15)',
           fontFamily: 'Share Tech Mono, monospace',
         }}>
      <div className="px-3 py-1" style={{ borderBottom: '1px solid #1a3a1a', color: '#00aa2b' }}>
        ┌─ SYS.INFO ─────────────────
      </div>
      <div className="px-3 py-2 space-y-1">
        <div className="flex justify-between gap-4">
          <span style={{ color: '#00aa2b' }}>{ip.type}:</span>
          <span style={{ color: '#00ff41' }}>{type === 'classical' ? ip.classical : ip.modern}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: '#00aa2b' }}>{ip.year}:</span>
          <span style={{ color: '#00ff41' }}>{year}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span style={{ color: '#00aa2b' }}>{ip.security}:</span>
          <span style={{ color: secColor, textShadow: `0 0 6px ${secColor}` }}>{secLabel}</span>
        </div>
      </div>
      <div className="px-3 py-1" style={{ borderTop: '1px solid #1a3a1a', color: '#00aa2b' }}>
        └────────────────────────────
      </div>
    </div>
  )
}
