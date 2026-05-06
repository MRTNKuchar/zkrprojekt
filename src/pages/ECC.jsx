import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'
import TabBar from '../components/TabBar'
import InfoPanel from '../components/InfoPanel'
import EccLearn from './ecc/EccLearn'
import EccLab from './ecc/EccLab'
import EccTerminal from './ecc/EccTerminal'
import { BookIcon, FlaskIcon } from '../components/Icons'

export default function ECC() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const [activeTab, setActiveTab] = useState('learn')

  const tabs = [
    { id: 'learn', icon: <BookIcon />, label: t.tabs.learn },
    { id: 'lab', icon: <FlaskIcon />, label: t.tabs.lab },
    { id: 'terminal', label: `>_ ${t.tabs.terminal}` },
  ]

  const renderTab = () => {
    switch (activeTab) {
      case 'learn': return <EccLearn />
      case 'lab': return <EccLab />
      case 'terminal': return <EccTerminal />
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
                  style={{ color: '#808080', fontFamily: 'Share Tech Mono, monospace', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#e8e8e8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#808080'}>
              {t.backBtn}
            </Link>
            <h1 className="text-4xl md:text-5xl glow" style={{ color: '#e8e8e8', fontFamily: 'VT323, monospace' }}>
              {t.ecc.pageTitle}
            </h1>
            <div className="text-xs mt-1" style={{ color: '#505050', fontFamily: 'Share Tech Mono, monospace' }}>
              /ecc — eliptické křivky
            </div>
          </div>
          <div className="w-56 shrink-0">
            <InfoPanel type="modern" year="1985" security="quantum" />
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
