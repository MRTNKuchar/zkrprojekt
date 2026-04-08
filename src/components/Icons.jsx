// SVG icon components for KryptoLab
// All icons use currentColor and are sized to 1em by default

const base = { display: 'inline', verticalAlign: '-0.1em' }

export function BookIcon({ size = '1em', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ ...base, ...style }}>
      <path d="M8 14V4" />
      <path d="M8 4C6 3 3 3 1 4v9c2-1 5-1 7 0" />
      <path d="M8 4c2-1 5-1 7 0v9c-2-1-5-1-7 0" />
    </svg>
  )
}

export function FlaskIcon({ size = '1em', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ ...base, ...style }}>
      <path d="M6 1h4M6 1v5L2 13h12L10 6V1" />
      <path d="M5 10h4" />
    </svg>
  )
}

export function KeyIcon({ size = '1em', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ ...base, ...style }}>
      <circle cx="5.5" cy="5.5" r="3.5" />
      <path d="M8.5 8.5L15 15" />
      <path d="M12 12v2M14 10v2" />
    </svg>
  )
}

export function LightningIcon({ size = '1em', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" style={{ ...base, ...style }}>
      <path d="M9 1L4 9h5l-2 6 7-8h-5z" />
    </svg>
  )
}

export function DiamondIcon({ size = '1em', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ ...base, ...style }}>
      <path d="M8 1l6 5-6 9-6-9z" />
      <path d="M2 6h12" />
    </svg>
  )
}

export function LockIcon({ size = '1em', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ ...base, ...style }}>
      <rect x="3" y="7" width="10" height="8" rx="1" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" />
      <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PersonIcon({ size = '1em', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ ...base, ...style }}>
      <circle cx="8" cy="4" r="3" />
      <path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  )
}
