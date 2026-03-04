import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'

export default function Navbar() {
  const { lang, toggleLang } = useLang()
  const t = useTranslation(lang)
  const location = useLocation()

  const links = [
    { to: '/', label: t.nav.home },
    { to: '/caesar', label: t.nav.caesar },
    { to: '/ecc', label: t.nav.ecc },
    { to: '/kyber', label: t.nav.kyber },
    { to: '/otp', label: t.nav.otp },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b"
         style={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: '#1a3a1a', backdropFilter: 'blur(4px)' }}>
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-lg font-bold glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace', fontSize: '1.4rem' }}>
            KRYPTO<span style={{ color: '#00aa2b' }}>LAB</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(link => {
            const active = location.pathname === link.to
            return (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-1 text-sm transition-all duration-200"
                style={{
                  color: active ? '#00ff41' : '#00aa2b',
                  fontFamily: 'Share Tech Mono, monospace',
                  borderBottom: active ? '1px solid #00ff41' : '1px solid transparent',
                  textShadow: active ? '0 0 8px #00ff41' : 'none',
                }}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Language toggle */}
          <button
            onClick={toggleLang}
            className="ml-4 px-3 py-1 text-sm border transition-all duration-200"
            style={{
              color: '#00ff41',
              borderColor: '#00aa2b',
              fontFamily: 'Share Tech Mono, monospace',
              background: 'transparent',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = 'rgba(0,255,65,0.1)'
              e.currentTarget.style.borderColor = '#00ff41'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#00aa2b'
            }}
          >
            [{t.nav.langToggle}]
          </button>
        </div>
      </div>
    </nav>
  )
}
