export default function TabBar({ tabs, activeTab, onTabChange }) {
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
              color: active ? '#00ff41' : '#00aa2b',
              background: active ? 'rgba(0,255,65,0.07)' : 'transparent',
              borderBottom: active ? '2px solid #00ff41' : '2px solid transparent',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textShadow: active ? '0 0 8px #00ff41' : 'none',
            }}
            onMouseEnter={e => {
              if (!active) {
                e.currentTarget.style.color = '#00ff41'
                e.currentTarget.style.background = 'rgba(0,255,65,0.04)'
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
