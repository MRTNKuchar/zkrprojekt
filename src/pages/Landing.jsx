import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'

function TypingText({ text, delay = 0 }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (!started) return
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [started, text])

  return (
    <span>
      {displayed}
      {displayed.length < text.length && <span className="cursor" />}
    </span>
  )
}

export default function Landing() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const lt = t.landing
  const [showCards, setShowCards] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowCards(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  const cards = [
    {
      key: 'caesar',
      to: '/caesar',
      data: lt.cards.caesar,
      statusColor: '#ff4444',
      icon: '🔑',
      border: '#ff4444',
    },
    {
      key: 'ecc',
      to: '/ecc',
      data: lt.cards.ecc,
      statusColor: '#00ff41',
      icon: '⚡',
      border: '#00ff41',
    },
    {
      key: 'kyber',
      to: '/kyber',
      data: lt.cards.kyber,
      statusColor: '#00ff41',
      icon: '🔮',
      border: '#00ff41',
    },
    {
      key: 'otp',
      to: '/otp',
      data: lt.cards.otp,
      statusColor: '#00ff41',
      icon: '🔐',
      border: '#00ff41',
    },
  ]

  return (
    <div className="min-h-screen relative flex flex-col" style={{ backgroundColor: 'transparent' }}>
      {/* Hero section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-12" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top label */}
        <div className="mb-6 text-xs tracking-widest" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
          <TypingText text={lt.subtitle} delay={200} />
        </div>

        {/* Main title */}
        <h1
          className="text-7xl md:text-9xl font-bold mb-4 glow"
          style={{ fontFamily: 'VT323, monospace', color: '#00ff41', lineHeight: 1 }}
        >
          <TypingText text={lt.title} delay={600} />
          <span style={{ color: '#00aa2b' }}>
            <TypingText text={lt.titleAccent} delay={1000} />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-sm leading-relaxed mb-10 mt-4"
           style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace', lineHeight: '1.8' }}>
          {lt.description}
        </p>

        {/* Enter button */}
        <Link
          to="/caesar"
          className="inline-block px-8 py-3 text-sm border-2 transition-all duration-300 mb-16"
          style={{
            color: '#00ff41',
            borderColor: '#00ff41',
            fontFamily: 'Share Tech Mono, monospace',
            letterSpacing: '0.15em',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'rgba(0,255,65,0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,65,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {lt.enterBtn}
        </Link>

        {/* Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full transition-all duration-700 ${showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {cards.map(({ key, to, data, statusColor, icon, border }) => (
            <Link
              key={key}
              to={to}
              className="block border text-left p-6 transition-all duration-300 group"
              style={{
                borderColor: '#1a3a1a',
                backgroundColor: 'rgba(0,20,5,0.75)',
                textDecoration: 'none',
                backdropFilter: 'blur(2px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = border
                e.currentTarget.style.backgroundColor = 'rgba(0,40,10,0.9)'
                e.currentTarget.style.boxShadow = `0 0 20px rgba(0,255,65,0.15), inset 0 0 20px rgba(0,255,65,0.05)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1a3a1a'
                e.currentTarget.style.backgroundColor = 'rgba(0,20,5,0.75)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs tracking-widest" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
                  {data.label}
                </span>
                <span
                  className="text-xs px-2 py-0.5 border"
                  style={{ color: statusColor, borderColor: statusColor, fontFamily: 'Share Tech Mono, monospace' }}
                >
                  {data.status}
                </span>
              </div>

              <h2 className="text-2xl mb-3" style={{ color: '#00ff41', fontFamily: 'VT323, monospace' }}>
                {icon} {data.name}
              </h2>

              <p className="text-sm mb-4" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace', lineHeight: '1.6' }}>
                {data.desc}
              </p>

              <div className="flex items-center justify-between text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
                <span>ROK: {data.year}</span>
                <span style={{ color: statusColor }}>VSTOUPIT →</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="mt-12 text-xs animate-bounce" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          {lt.scroll}
        </div>
      </section>

      {/* Bottom info bar */}
      <footer className="border-t py-3 px-4 text-center text-xs" style={{ position: 'relative', zIndex: 1, borderColor: '#1a3a1a', color: '#003b0f', fontFamily: 'Share Tech Mono, monospace' }}>
        KryptoLab v2.0.26 | Vzdělávací projekt | React + Tailwind CSS + Cloudflare Pages
      </footer>
    </div>
  )
}
