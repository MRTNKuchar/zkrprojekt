import { useState } from 'react'

// Very simple syntax highlighting for Python-style pseudocode
function highlight(code) {
  const lines = code.split('\n')
  return lines.map((line, i) => {
    let html = line
      // Comments
      .replace(/(#.*)$/g, '<span class="code-comment">$1</span>')
      // Strings
      .replace(/(".*?"|'.*?')/g, '<span class="code-string">$1</span>')
      // Keywords
      .replace(/\b(def|return|for|in|if|else|elif|and|or|not|import|from|class|while|True|False|None|mod|let|const|function)\b/g,
               '<span class="code-keyword">$1</span>')
      // Numbers
      .replace(/\b(\d+)\b/g, '<span class="code-number">$1</span>')
      // Function calls
      .replace(/\b([a-zA-Z_]\w*)\s*(?=\()/g, '<span class="code-func">$1</span>')
      // Operators
      .replace(/([+\-*/%=<>!&|^~]+)/g, '<span class="code-op">$1</span>')

    return `<span class="code-line" data-line="${i + 1}">${html}</span>`
  }).join('\n')
}

export default function CodeBlock({ code, title }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border" style={{ borderColor: '#1a3a1a', backgroundColor: '#050f05' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b"
           style={{ borderColor: '#1a3a1a', backgroundColor: 'rgba(0,59,15,0.3)' }}>
        <div className="flex items-center gap-2">
          <span style={{ color: '#ff4444' }}>●</span>
          <span style={{ color: '#ffaa00' }}>●</span>
          <span style={{ color: '#00ff41' }}>●</span>
          <span className="ml-2 text-xs" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
            {title || 'code.py'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 border transition-colors"
          style={{
            color: copied ? '#00ff41' : '#00aa2b',
            borderColor: copied ? '#00ff41' : '#1a3a1a',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'Share Tech Mono, monospace',
          }}
        >
          {copied ? '✓ OK' : 'KOPÍROVAT'}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre
          className="text-sm p-4 leading-6"
          style={{ fontFamily: 'Share Tech Mono, monospace', margin: 0 }}
          dangerouslySetInnerHTML={{ __html: highlight(code) }}
        />
      </div>

      <style>{`
        .code-comment { color: #4a7a4a; font-style: italic; }
        .code-string { color: #aaffaa; }
        .code-keyword { color: #00ffaa; font-weight: bold; }
        .code-number { color: #ffcc44; }
        .code-func { color: #44aaff; }
        .code-op { color: #ff9944; }
        .code-line { display: block; }
        .code-line:hover { background: rgba(0,255,65,0.04); }
      `}</style>
    </div>
  )
}
