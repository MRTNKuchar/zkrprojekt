export default function TabBar({ tabs, activeTab, onTabChange, accentColor = '#00ff41' }) {
  return (
    <div className="flex border-b" style={{ borderColor: '#1a3a1a' }}>
      {tabs.map(tab => {
        const active = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="px-4 py-2 text-sm transition-all duration-200 relative"
            style={{
              fontFamily: 'Share Tech Mono, monospace',
              color: active ? accentColor : '#00aa2b',
              background: active ? `${accentColor}11` : 'transparent',
              borderBottom: active ? `2px solid ${accentColor}` : '2px solid transparent',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textShadow: active ? `0 0 8px ${accentColor}88` : 'none',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.color = accentColor
                e.currentTarget.style.background = `${accentColor}08`
              }
            }}
            onMouseLeave={e => {
              if (!active) {
                e.currentTarget.style.color = '#00aa2b'
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
