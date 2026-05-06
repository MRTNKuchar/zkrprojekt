import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'

const N = 12
const C_ALICE  = '#ffaa44'
const C_BOB    = '#44aaff'
const C_EVE    = '#ff4444'
const C_GREEN  = '#00ff41'
const C_DIM    = '#00aa2b'
// UI panels — same neutral dark as other pages
const C_UI_BG     = 'rgba(8,8,8,0.85)'
const C_UI_BG2    = '#0e0e0e'
const C_UI_BORDER = '#2a2a2a'
const C_TEXT      = '#808080'
const C_TEXT_DIM  = '#505050'
// Scene — keep green tint for quantum channel feel
const C_SCENE_BG     = '#050f05'
const C_SCENE_BG2    = '#0a1a0a'
const C_SCENE_BORDER = '#1a3a1a'

function randBit() { return Math.random() < 0.5 ? 0 : 1 }
function measure(bit, srcBasis, dstBasis) {
  return srcBasis === dstBasis ? bit : randBit()
}
function basisSym(b) { return b === 0 ? '⊕' : '⊗' }
function photonAngle(basis, bit) {
  return basis === 0 ? (bit === 0 ? 0 : 90) : (bit === 0 ? 45 : 135)
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function QKD() {
  const { lang } = useLang()
  const t = useTranslation(lang)

  const [isRunning, setIsRunning]       = useState(false)
  const [eveActive, setEveActive]       = useState(false)
  const [speed, setSpeed]               = useState(5)
  const [stepNum, setStepNum]           = useState(0)
  const [stepText, setStepText]         = useState('Připraveno ke spuštění')
  const [progress, setProgress]         = useState(0)
  const [log, setLog]                   = useState([{ id: 0, text: 'Klikni na SPUSTIT pro zahájení simulace...', cls: '' }])
  const [measurements, setMeasurements] = useState({ alice: null, bob: null, eve: null })
  const [bases, setBases]               = useState({ alice: null, bob: null, eve: null })
  const [sifting, setSifting]           = useState(null)
  const [results, setResults]           = useState(null)

  const photonRef  = useRef(null)
  const svgRef     = useRef(null)
  const runningRef = useRef(false)
  const logIdRef   = useRef(1)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  function getSpd() { return 1100 - speed * 100 }

  function addLog(text, cls = '') {
    if (!mountedRef.current) return
    const id = logIdRef.current++
    setLog(prev => [...prev, { id, text, cls }])
  }

  function setPhoton(left, opacity, rotation, color, transitionMs) {
    if (!photonRef.current || !svgRef.current) return
    photonRef.current.style.transition = transitionMs ? `left ${transitionMs}ms cubic-bezier(0.4,0,0.6,1)` : 'none'
    photonRef.current.style.left    = left
    photonRef.current.style.opacity = opacity
    svgRef.current.style.color      = color
    svgRef.current.style.transform  = `rotate(${rotation}deg)`
    svgRef.current.style.filter     = `drop-shadow(0 0 8px ${color})`
  }

  async function runSim() {
    if (runningRef.current) return
    runningRef.current = true
    setIsRunning(true)

    // Reset
    setLog([])
    setSifting(null)
    setResults(null)
    setProgress(0)
    setMeasurements({ alice: null, bob: null, eve: null })
    setBases({ alice: null, bob: null, eve: null })
    setPhoton('11%', 0, 0, C_ALICE, 0)

    const eve = eveActive
    setStepNum(1)
    setStepText(eve ? 'Alice posílá fotony — Eve odposlouchává' : 'Alice posílá fotony Bobovi')
    await sleep(400)

    const data = { aBits: [], aBases: [], eBases: [], eBits: [], bBases: [], bBits: [] }

    for (let i = 0; i < N; i++) {
      if (!mountedRef.current) break
      const spd = getSpd()
      const aBit   = randBit()
      const aBasis = randBit()
      data.aBits.push(aBit)
      data.aBases.push(aBasis)

      const angle = photonAngle(aBasis, aBit)
      const color = aBasis === 0 ? C_ALICE : C_BOB

      setBases(prev => ({ ...prev, alice: { sym: basisSym(aBasis), color: aBasis === 0 ? C_ALICE : C_BOB } }))
      setMeasurements(prev => ({ ...prev, alice: `bit=${aBit} báze=${basisSym(aBasis)}` }))

      setPhoton('11%', 1, angle, color, 0)
      await sleep(spd * 0.3)

      if (eve) {
        setPhoton('50%', 1, angle, color, spd * 0.6)
        await sleep(spd * 0.6)

        const eBasis = randBit()
        const eBit   = measure(aBit, aBasis, eBasis)
        data.eBases.push(eBasis)
        data.eBits.push(eBit)

        const eAngle = photonAngle(eBasis, eBit)
        const eColor = eBasis === 0 ? C_ALICE : C_BOB

        setBases(prev => ({ ...prev, eve: { sym: basisSym(eBasis), color: eBasis === 0 ? C_ALICE : C_BOB } }))
        setMeasurements(prev => ({ ...prev, eve: `měří ${basisSym(eBasis)} → ${eBit}` }))
        setPhoton('50%', 1, eAngle, eColor, 0)
        await sleep(spd * 0.35)

        setPhoton('89%', 1, eAngle, eColor, spd * 0.6)
        await sleep(spd * 0.6)

        const bBasis = randBit()
        const bBit   = measure(eBit, eBasis, bBasis)
        data.bBases.push(bBasis)
        data.bBits.push(bBit)

        setBases(prev => ({ ...prev, bob: { sym: basisSym(bBasis), color: bBasis === 0 ? C_ALICE : C_BOB } }))
        setMeasurements(prev => ({ ...prev, bob: `měří ${basisSym(bBasis)} → ${bBit}` }))

        const matchBases = aBasis === bBasis
        const isError    = matchBases && aBit !== bBit
        let txt = `#${i + 1}  Alice: ${aBit}${basisSym(aBasis)} → Eve: ${eBit}${basisSym(eBasis)} → Bob: ${bBit}${basisSym(bBasis)}`
        let cls = ''
        if (matchBases) { txt += isError ? '  ⚠ chyba!' : '  ✓ shoda'; cls = isError ? 'err' : 'ok' }
        else { txt += '  — různé báze' }
        addLog(txt, cls)

      } else {
        setPhoton('89%', 1, angle, color, spd * 1.2)
        await sleep(spd * 1.2)

        const bBasis = randBit()
        const bBit   = measure(aBit, aBasis, bBasis)
        data.bBases.push(bBasis)
        data.bBits.push(bBit)

        setBases(prev => ({ ...prev, bob: { sym: basisSym(bBasis), color: bBasis === 0 ? C_ALICE : C_BOB } }))
        setMeasurements(prev => ({ ...prev, bob: `měří ${basisSym(bBasis)} → ${bBit}` }))

        const matchBases = aBasis === bBasis
        let txt = `#${i + 1}  Alice: ${aBit}${basisSym(aBasis)} → Bob: ${bBit}${basisSym(bBasis)}`
        let cls = ''
        if (matchBases) { txt += '  ✓ shoda bází'; cls = 'ok' }
        else { txt += '  — různé báze' }
        addLog(txt, cls)
      }

      await sleep(spd * 0.25)
      setPhoton('11%', 0, 0, C_ALICE, 0)
      setMeasurements({ alice: null, bob: null, eve: null })
      setBases({ alice: null, bob: null, eve: null })
      setProgress(i + 1)
      await sleep(180)
    }

    setStepNum(2)
    setStepText('Sifting — porovnávají báze veřejně')
    await sleep(500)

    let aliceKey = '', bobKey = '', errors = 0, siftedCount = 0
    const cells = data.aBases.map((ab, i) => {
      const bb = data.bBases[i]
      const match = ab === bb
      let cellType = 'discard'
      if (match) {
        siftedCount++
        const err = data.aBits[i] !== data.bBits[i]
        if (err) { cellType = 'error'; errors++ } else { cellType = 'match' }
        aliceKey += data.aBits[i]
        bobKey   += data.bBits[i]
      }
      return { ab, bb, aliceBit: data.aBits[i], bobBit: data.bBits[i], cellType }
    })

    setSifting({ cells, aliceKey, bobKey })

    await sleep(600)
    setStepNum(3)
    setStepText('Hotovo — vyhodnocení')

    const qber    = siftedCount > 0 ? errors / siftedCount : 0
    const verdict = qber > 0.11 ? 'attack' : (eve && errors > 0) ? 'risk' : 'safe'
    setResults({ sent: N, sifted: siftedCount, errors, qber, verdict })

    if (verdict === 'attack') addLog(`QBER ${(qber * 100).toFixed(0)}% > 11% → klíč zahozen, kanál kompromitován!`, 'danger')
    else if (verdict === 'risk') addLog(`Eve vnesla ${errors} chyb. Ve větším vzorku by se prozradila.`, 'err')
    else addLog(`Klíč bezpečně sdílen. Délka: ${siftedCount} bitů, QBER: ${(qber * 100).toFixed(0)}%`, 'success')

    runningRef.current = false
    setIsRunning(false)
  }

  function resetSim() {
    if (runningRef.current) return
    setStepNum(0)
    setStepText('Připraveno ke spuštění')
    setProgress(0)
    setLog([{ id: 0, text: 'Klikni na SPUSTIT pro zahájení simulace...', cls: '' }])
    setPhoton('11%', 0, 0, C_ALICE, 0)
    setSifting(null)
    setResults(null)
    setMeasurements({ alice: null, bob: null, eve: null })
    setBases({ alice: null, bob: null, eve: null })
  }

  const uiPanel    = { backgroundColor: C_UI_BG,    border: `1px solid ${C_UI_BORDER}`, borderRadius: 3 }
  const scenePanel = { backgroundColor: C_SCENE_BG, border: `1px solid ${C_SCENE_BORDER}`, borderRadius: 3 }
  const mono       = { fontFamily: 'Share Tech Mono, monospace' }

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-5">
          <Link to="/" className="text-xs mb-2 inline-block"
            style={{ color: '#505050', ...mono, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8e8e8'}
            onMouseLeave={e => e.currentTarget.style.color = '#505050'}>
            {t.backBtn}
          </Link>
          <h1 style={{ fontFamily: 'VT323, monospace', fontSize: '2.8rem', color: '#e8e8e8', textShadow: '0 0 16px rgba(220,220,220,0.3)', lineHeight: 1 }}>
            {t.qkd.pageTitle}
          </h1>
          <div style={{ fontSize: 11, color: '#505050', ...mono, marginTop: 4 }}>
            /qkd — BB84 protokol — Bennett &amp; Brassard, 1984
          </div>
        </div>

        {/* Intro */}
        <div className="mb-4 p-4 text-sm" style={{ ...uiPanel, color: C_TEXT, ...mono, lineHeight: 1.9 }}>
          <span style={{ color: C_ALICE, fontWeight: 700 }}>Alice</span> chce poslat{' '}
          <span style={{ color: C_BOB, fontWeight: 700 }}>Bobovi</span> tajný klíč.
          Pošle sérii fotonů — každý nese bit zakódovaný v jedné ze dvou bází:{' '}
          <span style={{ color: C_ALICE }}>⊕</span> rektilineární nebo{' '}
          <span style={{ color: C_BOB }}>⊗</span> diagonální.
          Bob bázi musí tipovat; po přenosu si veřejně řeknou použité báze a nechají si jen ty fotony, kde se shodli.
          Pokud odposlouchává <span style={{ color: C_EVE, fontWeight: 700 }}>Eve</span>,
          musí taky tipovat a tím fyzikálně narušuje fotony —{' '}
          <strong style={{ color: '#e8e8e8' }}>kvantová mechanika prozradí každého odposlouchávače</strong>.
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center mb-4 p-3" style={uiPanel}>
          <button onClick={runSim} disabled={isRunning} style={{
            background: isRunning ? C_UI_BG2 : C_GREEN, color: isRunning ? C_UI_BORDER : '#000',
            border: `1px solid ${isRunning ? C_UI_BORDER : C_GREEN}`, padding: '7px 18px',
            ...mono, fontSize: 12, letterSpacing: '0.1em', cursor: isRunning ? 'not-allowed' : 'pointer',
            borderRadius: 2, fontWeight: 700, transition: 'all 0.15s',
          }}>
            ▶ SPUSTIT
          </button>
          <button onClick={resetSim} disabled={isRunning} style={{
            background: 'transparent', color: isRunning ? C_UI_BORDER : C_DIM,
            border: `1px solid ${C_UI_BORDER}`, padding: '7px 18px',
            ...mono, fontSize: 12, letterSpacing: '0.1em', cursor: isRunning ? 'not-allowed' : 'pointer',
            borderRadius: 2, transition: 'all 0.15s',
          }}>
            ↺ RESET
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: isRunning ? 'not-allowed' : 'pointer', ...mono, fontSize: 12, color: eveActive ? C_EVE : C_TEXT, userSelect: 'none' }}>
            <input type="checkbox" checked={eveActive} disabled={isRunning}
              onChange={e => !isRunning && setEveActive(e.target.checked)}
              style={{ accentColor: C_EVE, width: 14, height: 14 }} />
            Eve odposlouchává
          </label>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, ...mono, fontSize: 12, color: C_TEXT }}>
            <span>Rychlost:</span>
            <input type="range" min={1} max={10} value={speed}
              onChange={e => setSpeed(parseInt(e.target.value))}
              style={{ accentColor: C_GREEN, width: 90 }} />
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 mb-4" style={{ backgroundColor: C_UI_BG2, border: `1px solid ${C_UI_BORDER}`, borderRadius: 2, ...mono, fontSize: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ background: C_GREEN, color: '#000', width: 20, height: 20, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>{stepNum}</span>
            <span style={{ color: '#e8e8e8' }}>{stepText}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C_TEXT }}>
            <span>{progress} / {N}</span>
            <div style={{ width: 90, height: 3, background: C_UI_BORDER, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: C_GREEN, width: `${(progress / N) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
        </div>

        {/* Scene */}
        <div className="mb-4 relative" style={{ ...scenePanel, padding: '28px 20px', minHeight: 240, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', height: 190 }}>

            {/* Alice */}
            <Actor name="ALICE" role="odesílatel" color={C_ALICE} bg="#0d1a09"
              basis={bases.alice} measurement={measurements.alice}>
              <svg width="50" height="50" viewBox="0 0 64 64" fill="none" stroke={C_ALICE} strokeWidth="3" strokeLinecap="round">
                <rect x="8" y="22" width="32" height="20" rx="2"/>
                <circle cx="40" cy="32" r="5" fill={C_ALICE}/>
                <line x1="46" y1="32" x2="58" y2="32"/>
                <line x1="48" y1="26" x2="54" y2="22" strokeWidth="2"/>
                <line x1="48" y1="38" x2="54" y2="42" strokeWidth="2"/>
                <line x1="14" y1="28" x2="20" y2="28" strokeWidth="2"/>
                <line x1="14" y1="32" x2="24" y2="32" strokeWidth="2"/>
                <line x1="14" y1="36" x2="18" y2="36" strokeWidth="2"/>
              </svg>
            </Actor>

            {/* Eve (center, only when active) */}
            {eveActive && (
              <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', zIndex: 5 }}>
                <Actor name="EVE" role="odposlech" color={C_EVE} bg="#1a0909"
                  basis={bases.eve} measurement={measurements.eve}>
                  <svg width="50" height="50" viewBox="0 0 64 64" fill="none" stroke={C_EVE} strokeWidth="3" strokeLinejoin="round">
                    <path d="M 8 32 Q 32 14 56 32 Q 32 50 8 32 Z"/>
                    <circle cx="32" cy="32" r="9"/>
                    <circle cx="32" cy="32" r="4" fill={C_EVE}/>
                    <circle cx="35" cy="29" r="1.5" fill="#050f05"/>
                  </svg>
                </Actor>
              </div>
            )}

            {/* Bob */}
            <Actor name="BOB" role="příjemce" color={C_BOB} bg="#09121a"
              basis={bases.bob} measurement={measurements.bob}>
              <svg width="50" height="50" viewBox="0 0 64 64" fill="none" stroke={C_BOB} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
                <line x1="6" y1="32" x2="18" y2="32"/>
                <polygon points="18,24 32,32 18,40" fill="none"/>
                <rect x="32" y="20" width="22" height="24" rx="2"/>
                <circle cx="43" cy="32" r="3" fill={C_BOB}/>
                <line x1="38" y1="26" x2="48" y2="26" strokeWidth="2"/>
                <line x1="38" y1="38" x2="48" y2="38" strokeWidth="2"/>
              </svg>
            </Actor>

            {/* Channel line */}
            <div style={{
              position: 'absolute', top: '43%', left: 110, right: 110, height: 2, zIndex: 1,
              background: `repeating-linear-gradient(90deg, ${C_SCENE_BORDER} 0, ${C_SCENE_BORDER} 7px, transparent 7px, transparent 14px)`,
            }} />

            {/* Photon */}
            <div ref={photonRef} style={{ position: 'absolute', top: '43%', left: '11%', width: 36, height: 36, transform: 'translate(-50%, -50%)', opacity: 0, zIndex: 4 }}>
              <svg ref={svgRef} viewBox="0 0 48 48" width="36" height="36" style={{ color: C_ALICE, display: 'block' }}>
                <circle cx="24" cy="24" r="7" fill="currentColor"/>
                <line x1="24" y1="5" x2="24" y2="43" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Channel label */}
          <div style={{ textAlign: 'center', marginTop: 6, ...mono, fontSize: 10, color: C_SCENE_BORDER, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            kvantový kanál
          </div>
        </div>

        {/* Sifting table */}
        {sifting && (
          <div className="mb-4 p-4" style={uiPanel}>
            <div style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#e8e8e8', marginBottom: 14, textTransform: 'uppercase' }}>
              ▸ Sifting — porovnání bází
            </div>
            {[
              { label: 'ALICE — báze:', cells: sifting.cells.map(c => ({ sym: basisSym(c.ab), color: c.ab === 0 ? C_ALICE : C_BOB })) },
              { label: 'BOB — báze:', cells: sifting.cells.map(c => ({ sym: basisSym(c.bb), color: c.bb === 0 ? C_ALICE : C_BOB })) },
            ].map(({ label, cells }) => (
              <div key={label} className="mb-3">
                <div style={{ ...mono, fontSize: 10, color: C_TEXT, marginBottom: 4 }}>{label}</div>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {cells.map((c, i) => (
                    <div key={i} style={{ width: 25, height: 25, border: `1px solid ${C_UI_BORDER}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono, fontSize: 11, fontWeight: 700, color: c.color, background: C_UI_BG2 }}>
                      {c.sym}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mb-3">
              <div style={{ ...mono, fontSize: 10, color: C_TEXT, marginBottom: 4 }}>SHODA (zelená = ponecháno):</div>
              <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {sifting.cells.map((c, i) => {
                  const bg    = c.cellType === 'match' ? '#001800' : c.cellType === 'error' ? '#1e0000' : C_UI_BG2
                  const color = c.cellType === 'match' ? C_GREEN : c.cellType === 'error' ? '#ff6644' : C_TEXT_DIM
                  const sym   = c.cellType === 'match' ? '✓' : c.cellType === 'error' ? '×' : '—'
                  return (
                    <div key={i} style={{ width: 25, height: 25, border: `1px solid ${C_UI_BORDER}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', ...mono, fontSize: 11, fontWeight: 700, color, background: bg }}>
                      {sym}
                    </div>
                  )
                })}
              </div>
            </div>
            {[
              { label: 'ALICE — klíč:', key: sifting.aliceKey, color: C_GREEN },
              { label: 'BOB — klíč:',  key: sifting.bobKey,   color: C_BOB },
            ].map(({ label, key, color }) => (
              <div key={label} className="mb-2">
                <div style={{ ...mono, fontSize: 10, color: C_TEXT, marginBottom: 3 }}>{label}</div>
                <div style={{ ...mono, fontSize: 15, fontWeight: 700, letterSpacing: '0.35em', padding: '7px 12px', background: C_UI_BG2, border: `1px solid ${C_UI_BORDER}`, borderRadius: 2, color }}>
                  {key || '(prázdný)'}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            {[
              { label: 'Posláno',     value: results.sent,                                          color: C_GREEN },
              { label: 'Po siftingu', value: results.sifted,                                        color: C_GREEN },
              { label: 'Chyb',        value: results.errors,                                        color: results.errors > 0 ? C_EVE : C_GREEN },
              { label: 'QBER',        value: `${(results.qber * 100).toFixed(0)}%`,                 color: results.qber > 0.11 ? C_EVE : C_GREEN },
              { label: 'Stav',        value: results.verdict === 'attack' ? 'ÚTOK' : results.verdict === 'risk' ? 'Riziko' : 'Bezpečné', color: results.verdict === 'attack' ? C_EVE : results.verdict === 'risk' ? C_ALICE : C_GREEN },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ ...uiPanel, padding: '12px 14px', textAlign: 'center' }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C_TEXT, marginBottom: 5 }}>{label}</div>
                <div style={{ fontFamily: 'VT323, monospace', fontSize: 30, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Log */}
        <div style={{ ...uiPanel, padding: '12px 14px', ...mono, fontSize: 12, maxHeight: 190, overflowY: 'auto', lineHeight: 1.7 }}>
          {log.map(e => (
            <div key={e.id} style={{
              color: e.cls === 'ok' ? C_GREEN : e.cls === 'err' ? '#ff6644' : e.cls === 'danger' ? C_EVE : e.cls === 'success' ? '#00cc35' : C_TEXT_DIM,
              fontWeight: e.cls === 'danger' || e.cls === 'success' ? 700 : 400,
              marginBottom: 2,
            }}>
              {e.text}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

function Actor({ name, role, color, bg, basis, measurement, children }) {
  return (
    <div style={{ width: 105, textAlign: 'center', position: 'relative', zIndex: 5 }}>
      <div style={{
        width: 85, height: 85, border: `2px solid ${color}`, borderRadius: 6, background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 8px', position: 'relative', boxShadow: `3px 3px 0 ${color}`,
      }}>
        {children}
        {basis && (
          <div style={{
            position: 'absolute', top: -11, right: -11, width: 26, height: 26,
            background: basis.color, border: `2px solid ${basis.color}`, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 13, color: '#000', fontFamily: 'Share Tech Mono, monospace',
          }}>
            {basis.sym}
          </div>
        )}
      </div>
      <div style={{ fontWeight: 700, fontSize: 12, color, fontFamily: 'Share Tech Mono, monospace' }}>{name}</div>
      <div style={{ fontSize: 10, color: '#505050', fontFamily: 'Share Tech Mono, monospace' }}>{role}</div>
      {measurement && (
        <div style={{
          marginTop: 4, background: bg, border: `1px solid ${color}`, borderRadius: 2,
          padding: '2px 5px', fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
          color, whiteSpace: 'nowrap', display: 'inline-block',
        }}>
          {measurement}
        </div>
      )}
    </div>
  )
}
