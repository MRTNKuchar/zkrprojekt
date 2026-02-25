import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'
import TabBar from '../components/TabBar'
import InfoPanel from '../components/InfoPanel'
import CaesarLearn from './caesar/CaesarLearn'
import CaesarLab from './caesar/CaesarLab'
import CaesarTerminal from './caesar/CaesarTerminal'

export default function Caesar() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const [activeTab, setActiveTab] = useState('learn')

  const tabs = [
    { id: 'learn', label: `📚 ${t.tabs.learn}` },
    { id: 'lab', label: `⚗️ ${t.tabs.lab}` },
    { id: 'terminal', label: `>_ ${t.tabs.terminal}` },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'learn': return <CaesarLearn />
      case 'lab': return <CaesarLab />
      case 'terminal': return <CaesarTerminal />
      default: return null
    }
  }

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <Link to="/" className="text-xs mb-2 inline-block transition-colors"
                  style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#00ff41'}
                  onMouseLeave={e => e.currentTarget.style.color = '#00aa2b'}>
              {t.backBtn}
            </Link>
            <h1 className="text-4xl md:text-5xl glow" style={{ color: '#00ff41', fontFamily: 'VT323, monospace' }}>
              {t.caesar.pageTitle}
            </h1>
            <div className="text-xs mt-1" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
              /caesar — šifra posunu
            </div>
          </div>
          <div className="w-56 shrink-0">
            <InfoPanel type="classical" year="~100 př. n. l." security="broken" />
          </div>
        </div>

        {/* Tab bar */}
        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab content */}
        <div className="py-6">
          {renderTab()}
        </div>
      </div>
    </div>
  )
}
