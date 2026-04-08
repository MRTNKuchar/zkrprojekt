import { useState } from 'react'

// ─── Caesar diagram ──────────────────────────────────────────────────────────
export function CaesarDiagram({ lang }) {
  const [shift, setShift] = useState(3)
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div>
      {/* Shift control */}
      <div className="flex items-center gap-3 mb-4" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
        <span style={{ color: '#00aa2b', fontSize: '0.75rem' }}>
          {lang === 'cs' ? 'POSUN' : 'SHIFT'} =
        </span>
        <button
          onClick={() => setShift(s => s <= 1 ? 25 : s - 1)}
          style={{ color: '#00ff41', background: 'none', border: '1px solid #1a3a1a', padding: '1px 8px', cursor: 'pointer', fontFamily: 'inherit' }}
        >−</button>
        <span style={{ color: '#00ff41', minWidth: 24, textAlign: 'center' }}>{shift}</span>
        <button
          onClick={() => setShift(s => s >= 25 ? 1 : s + 1)}
          style={{ color: '#00ff41', background: 'none', border: '1px solid #1a3a1a', padding: '1px 8px', cursor: 'pointer', fontFamily: 'inherit' }}
        >+</button>
      </div>

      {/* Alphabet rows */}
      {[0, 13].map(offset => (
        <div key={offset} className="mb-3">
          {/* Plaintext row */}
          <div className="flex gap-0">
            {alpha.slice(offset, offset + 13).map((ch, i) => (
              <div key={ch} style={{
                width: 22, textAlign: 'center', fontSize: '0.7rem',
                color: '#00ff41', fontFamily: 'Share Tech Mono, monospace',
                borderTop: '1px solid #1a3a1a', borderLeft: i === 0 ? '1px solid #1a3a1a' : 'none',
                borderRight: '1px solid #1a3a1a', padding: '2px 0',
              }}>{ch}</div>
            ))}
          </div>
          {/* Arrow row */}
          <div className="flex gap-0">
            {alpha.slice(offset, offset + 13).map((ch, i) => (
              <div key={ch} style={{
                width: 22, textAlign: 'center', fontSize: '0.6rem',
                color: '#005515', fontFamily: 'Share Tech Mono, monospace',
              }}>↓</div>
            ))}
          </div>
          {/* Ciphertext row */}
          <div className="flex gap-0">
            {alpha.slice(offset, offset + 13).map((ch, i) => {
              const idx = (offset + i + shift) % 26
              return (
                <div key={ch} style={{
                  width: 22, textAlign: 'center', fontSize: '0.7rem',
                  color: '#ffaa44', fontFamily: 'Share Tech Mono, monospace',
                  borderBottom: '1px solid #1a3a1a', borderLeft: i === 0 ? '1px solid #1a3a1a' : 'none',
                  borderRight: '1px solid #1a3a1a', padding: '2px 0',
                }}>{alpha[idx]}</div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="mt-3 text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
        {lang === 'cs'
          ? `E(x) = (x + ${shift}) mod 26 · D(x) = (x − ${shift} + 26) mod 26`
          : `E(x) = (x + ${shift}) mod 26 · D(x) = (x − ${shift} + 26) mod 26`}
      </div>
    </div>
  )
}

// ─── ECC diagram ─────────────────────────────────────────────────────────────
// Curve y²=x³-3x+3 computed points, viewBox 0 0 300 180
// x∈[-2,3.3] → svgX = 15 + (x+2)*45, y center at svgY=90, scale 15px/unit
const UPPER = '37,75 47,66 60,60 82,57 105,59 128,64 150,71 172,75 195,70 217,57 240,40 263,21 276,9'
const LOWER = '37,105 47,114 60,120 82,123 105,121 128,116 150,109 172,105 195,110 217,123 240,140 263,159 276,171'

export function EccDiagram({ lang }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Curve SVG */}
        <div>
          <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
            y²=x³−3x+3 (mod 97)
          </div>
          <svg viewBox="0 0 300 180" style={{ width: '100%', maxWidth: 300, display: 'block' }}>
            {/* Grid lines */}
            <line x1="15" y1="90" x2="290" y2="90" stroke="#0a1a0a" strokeWidth="1" />
            <line x1="128" y1="5" x2="128" y2="175" stroke="#0a1a0a" strokeWidth="1" />
            <text x="285" y="87" fontSize="8" fill="#005515" fontFamily="Share Tech Mono, monospace">x</text>
            <text x="131" y="12" fontSize="8" fill="#005515" fontFamily="Share Tech Mono, monospace">y</text>

            {/* Curve */}
            <polyline points={UPPER} fill="none" stroke="#00aa2b" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={LOWER} fill="none" stroke="#00aa2b" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />

            {/* Generator G = (13,7) scaled: x=13→ svgX=15+(13+2)*45=690... too far off range */}
            {/* Use visual G near (1,1): svgX=172, svgY=75 */}
            <circle cx="172" cy="75" r="4" fill="#00ff41" />
            <text x="176" y="72" fontSize="8" fill="#00ff41" fontFamily="Share Tech Mono, monospace">G</text>

            {/* 2G visual approx at (-0.5, 2.09) → svgX=105, svgY=59 */}
            <circle cx="105" cy="59" r="4" fill="#ffaa44" />
            <text x="90" y="55" fontSize="8" fill="#ffaa44" fontFamily="Share Tech Mono, monospace">2G</text>

            {/* Geometric line through G tangent → hits curve at -2G, reflects to 2G */}
            <line x1="60" y1="62" x2="260" y2="84" stroke="#1a3a1a" strokeWidth="0.8" strokeDasharray="4,3" />
            {/* Reflection vertical */}
            <line x1="105" y1="59" x2="105" y2="121" stroke="#ffaa44" strokeWidth="0.6" strokeDasharray="2,2" />
          </svg>
        </div>

        {/* ECDH protocol */}
        <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem' }}>
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-1 mb-2">
              <div style={{ color: '#44aaff' }}>ALICE</div>
              <div style={{ color: '#ffaa44', textAlign: 'right' }}>BOB</div>
            </div>
            <div className="grid grid-cols-2 gap-1 mb-1">
              <div style={{ color: '#ff4444' }}>privA → tajné</div>
              <div style={{ color: '#ff4444', textAlign: 'right' }}>tajné ← privB</div>
            </div>
            <div className="grid grid-cols-2 gap-1 mb-1">
              <div style={{ color: '#44aaff' }}>pubA = privA·G</div>
              <div style={{ color: '#ffaa44', textAlign: 'right' }}>pubB = privB·G</div>
            </div>
            {/* Exchange arrows */}
            <div className="border-t border-b py-1 my-2 text-center" style={{ borderColor: '#1a3a1a', color: '#005515' }}>
              <div>pubA ——————→</div>
              <div>←—————— pubB</div>
            </div>
            {/* Shared secret */}
            <div style={{ color: '#44aaff' }}>privA · pubB</div>
            <div style={{ color: '#ffaa44', textAlign: 'right' }}>privB · pubA</div>
            <div className="mt-2 text-center border p-1" style={{ borderColor: '#00ff41', color: '#00ff41' }}>
              = privA·privB·G
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Lattice / LWE diagram ───────────────────────────────────────────────────
export function LatticeDiagram({ lang }) {
  // 5×5 lattice in SVG, target point with noise
  const pts = []
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      pts.push({ x: 40 + c * 55, y: 40 + r * 45 })
    }
  }
  // "Noisy" target: near (2,2) lattice point (c=2,r=2) = (150, 130), displaced
  const target = { x: 168, y: 116 }
  const nearest = { x: 150, y: 130 }

  return (
    <div>
      <svg viewBox="0 0 300 220" style={{ width: '100%', maxWidth: 300, display: 'block' }}>
        {/* Grid lines */}
        {[0,1,2,3,4].map(r => (
          <line key={`h${r}`} x1="40" y1={40 + r * 45} x2="260" y2={40 + r * 45}
            stroke="#0a1a0a" strokeWidth="0.5" />
        ))}
        {[0,1,2,3,4].map(c => (
          <line key={`v${c}`} x1={40 + c * 55} y1="40" x2={40 + c * 55} y2="220"
            stroke="#0a1a0a" strokeWidth="0.5" />
        ))}

        {/* Lattice points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#00aa2b" />
        ))}

        {/* Nearest lattice point (highlighted) */}
        <circle cx={nearest.x} cy={nearest.y} r="4" fill="none" stroke="#00ff41" strokeWidth="1.5" />

        {/* Target point (noisy) */}
        <circle cx={target.x} cy={target.y} r="4" fill="#ff4444" />
        <text x={target.x + 6} y={target.y - 4} fontSize="8" fill="#ff4444"
          fontFamily="Share Tech Mono, monospace">
          b = As + e
        </text>

        {/* Arrow from target to nearest */}
        <line x1={target.x} y1={target.y} x2={nearest.x + 4} y2={nearest.y - 4}
          stroke="#ffaa44" strokeWidth="1" strokeDasharray="3,2" />
        <text x={nearest.x - 55} y={nearest.y + 16} fontSize="7" fill="#ffaa44"
          fontFamily="Share Tech Mono, monospace">
          {lang === 'cs' ? 'nejbližší bod?' : 'closest point?'}
        </text>

        {/* Label: "šum e" */}
        <text x="185" y="108" fontSize="7" fill="#005515" fontFamily="Share Tech Mono, monospace">
          {lang === 'cs' ? 'šum e' : 'noise e'}
        </text>
      </svg>

      <div className="mt-2 text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
        {lang === 'cs'
          ? 'CVP: dáno b=As+e, najdi s — výpočetně neřešitelné pro velké dimenze'
          : 'CVP: given b=As+e, find s — computationally infeasible in high dimensions'}
      </div>
    </div>
  )
}

// ─── OTP / XOR diagram ───────────────────────────────────────────────────────
const BITS = {
  msg: [0, 1, 1, 0, 1, 0, 1, 1],
  key: [1, 0, 1, 1, 0, 1, 0, 0],
}
BITS.ct = BITS.msg.map((b, i) => b ^ BITS.key[i])

export function OtpDiagram({ lang }) {
  const rows = [
    { label: lang === 'cs' ? 'Zpráva (M)' : 'Message (M)', bits: BITS.msg, color: '#00ff41' },
    { label: lang === 'cs' ? 'Klíč (K)'   : 'Key (K)',     bits: BITS.key, color: '#ffaa44' },
    { label: 'XOR ⊕',                                       bits: null,      color: '#005515' },
    { label: lang === 'cs' ? 'Šifrogram (C)' : 'Ciphertext (C)', bits: BITS.ct, color: '#44aaff' },
  ]

  const Cell = ({ val, color }) => (
    <div style={{
      width: 28, textAlign: 'center', padding: '3px 0',
      fontSize: '0.75rem', color, fontFamily: 'Share Tech Mono, monospace',
      border: '1px solid #1a3a1a', marginRight: -1,
    }}>{val}</div>
  )

  return (
    <div>
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center gap-2 mb-0.5">
          <div style={{
            width: 110, fontSize: '0.7rem', textAlign: 'right',
            color: row.color, fontFamily: 'Share Tech Mono, monospace', flexShrink: 0,
          }}>{row.label}</div>
          <div className="flex">
            {row.bits
              ? row.bits.map((b, i) => <Cell key={i} val={b} color={row.color} />)
              : BITS.msg.map((_, i) => <Cell key={i} val="⊕" color={row.color} />)
            }
          </div>
        </div>
      ))}

      {/* Decrypt */}
      <div className="mt-4 border-t pt-3" style={{ borderColor: '#1a3a1a' }}>
        <div className="text-xs mb-2" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
          {lang === 'cs' ? '── Dešifrování ──' : '── Decryption ──'}
        </div>
        {[
          { label: lang === 'cs' ? 'Šifrogram (C)' : 'Ciphertext (C)', bits: BITS.ct,  color: '#44aaff' },
          { label: lang === 'cs' ? 'Klíč (K)'      : 'Key (K)',        bits: BITS.key, color: '#ffaa44' },
          { label: 'XOR ⊕',                                              bits: null,     color: '#005515' },
          { label: lang === 'cs' ? 'Zpráva (M)' : 'Message (M)',       bits: BITS.msg, color: '#00ff41' },
        ].map((row, ri) => (
          <div key={ri} className="flex items-center gap-2 mb-0.5">
            <div style={{
              width: 110, fontSize: '0.7rem', textAlign: 'right',
              color: row.color, fontFamily: 'Share Tech Mono, monospace', flexShrink: 0,
            }}>{row.label}</div>
            <div className="flex">
              {row.bits
                ? row.bits.map((b, i) => <Cell key={i} val={b} color={row.color} />)
                : BITS.ct.map((_, i) => <Cell key={i} val="⊕" color={row.color} />)
              }
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace' }}>
        {lang === 'cs'
          ? 'C = M ⊕ K   ·   M = C ⊕ K   ·   klíč musí být náhodný a jednorázový'
          : 'C = M ⊕ K   ·   M = C ⊕ K   ·   key must be random and used only once'}
      </div>
    </div>
  )
}
