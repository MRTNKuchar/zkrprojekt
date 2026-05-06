import { useState, useRef, useEffect } from 'react'

export default function TerminalEmulator({ welcomeLines = [], commandHandlers = {}, prompt = 'kryptolab@terminal:~$' }) {
  const [lines, setLines] = useState(welcomeLines.map(l => ({ text: l, type: 'system' })))
  const [inputVal, setInputVal] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState([])
  const [histIdx, setHistIdx] = useState(-1)
  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const addLine = (text, type = 'output', delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => {
        setLines(prev => [...prev, { text, type, id: Math.random() }])
        resolve()
      }, delay)
    })
  }

  const addLines = async (lineArr, baseDelay = 80) => {
    for (let i = 0; i < lineArr.length; i++) {
      await addLine(lineArr[i].text, lineArr[i].type || 'output', baseDelay * i)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cmd = inputVal.trim().toLowerCase()
    if (!cmd) return

    const newHistory = [cmd, ...history].slice(0, 50)
    setHistory(newHistory)
    setHistIdx(-1)
    setInputVal('')

    setLines(prev => [...prev, { text: `${prompt} ${cmd}`, type: 'command', id: Math.random() }])

    if (isRunning) return
    setIsRunning(true)

    if (cmd === 'reset' || cmd === 'clear') {
      setLines(welcomeLines.map(l => ({ text: l, type: 'system' })))
    } else if (cmd === 'help') {
      const helpLines = commandHandlers['help']?.()
      if (helpLines) await addLines(helpLines)
    } else if (commandHandlers[cmd]) {
      await commandHandlers[cmd](addLine, addLines)
    } else {
      await addLine(`bash: ${cmd}: příkaz nenalezen. Zadej "help".`, 'error')
    }

    setIsRunning(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx)
      setInputVal(history[idx] || '')
    } else if (e.key === 'ArrowDown') {
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInputVal(idx === -1 ? '' : history[idx])
    }
  }

  const lineColors = {
    system: '#808080',
    command: '#e8e8e8',
    output: '#b0b0b0',
    success: '#e8e8e8',
    error: '#ff4444',
    warning: '#aaaaaa',
    highlight: '#aaffaa',
    dim: '#505050',
    info: '#cccccc',
  }

  return (
    <div
      className="border h-96 flex flex-col cursor-text"
      style={{ borderColor: '#2a2a2a', backgroundColor: '#020a02' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b"
           style={{ borderColor: '#2a2a2a', backgroundColor: 'rgba(15,15,15,0.3)' }}>
        <span style={{ color: '#ff4444' }}>●</span>
        <span style={{ color: '#aaaaaa' }}>●</span>
        <span style={{ color: '#e8e8e8' }}>●</span>
        <span className="ml-2 text-xs" style={{ color: '#808080', fontFamily: 'Share Tech Mono, monospace' }}>
          bash — kryptolab terminal
        </span>
        {isRunning && (
          <span className="ml-auto text-xs animate-pulse" style={{ color: '#aaaaaa' }}>
            ● SPUŠTĚNO
          </span>
        )}
      </div>

      {/* Output */}
      <div className="flex-1 overflow-y-auto p-3 text-sm"
           style={{ fontFamily: 'Share Tech Mono, monospace' }}>
        {lines.map((line, i) => (
          <div
            key={line.id || i}
            className="terminal-line leading-5"
            style={{ color: lineColors[line.type] || '#b0b0b0', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
          >
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="border-t px-3 py-2" style={{ borderColor: '#2a2a2a' }}>
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-xs shrink-0" style={{ color: '#e8e8e8', fontFamily: 'Share Tech Mono, monospace' }}>
            {prompt}
          </span>
          <input
            ref={inputRef}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{
              color: '#e8e8e8',
              fontFamily: 'Share Tech Mono, monospace',
              caretColor: '#e8e8e8',
            }}
          />
          {!isRunning && <span className="cursor" />}
        </form>
      </div>
    </div>
  )
}
