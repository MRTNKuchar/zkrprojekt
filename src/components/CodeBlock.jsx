import { useState } from 'react'

// Token-based syntax highlighter — avoids applying regexes on already-injected HTML
const TOKEN_PATTERNS = [
  { type: 'comment', re: /(#.*)$/ },
  { type: 'string',  re: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/ },
  { type: 'keyword', re: /\b(def|return|for|in|if|else|elif|and|or|not|import|from|class|while|True|False|None|let|const|function|async|await)\b/ },
  { type: 'number',  re: /\b(\d+)\b/ },
  { type: 'func',    re: /\b([a-zA-Z_]\w*)(?=\s*\()/ },
  { type: 'op',      re: /([+\-*/%=!|^~]+|[<>]=?)/ },
]

const TOKEN_CLASS = {
  comment: 'code-comment',
  string:  'code-string',
  keyword: 'code-keyword',
  number:  'code-number',
  func:    'code-func',
  op:      'code-op',
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function tokenizeLine(line) {
  const tokens = []
  let remaining = line

  while (remaining.length > 0) {
    let best = null

    for (const { type, re } of TOKEN_PATTERNS) {
      const m = remaining.match(re)
      if (m && (best === null || m.index < best.index)) {
        best = { index: m.index, text: m[1] ?? m[0], raw: m[0], type }
      }
    }

    if (!best) {
      tokens.push({ text: remaining, type: null })
      break
    }

    if (best.index > 0) {
      tokens.push({ text: remaining.slice(0, best.index), type: null })
    }
    tokens.push({ text: best.text, type: best.type })
    remaining = remaining.slice(best.index + best.raw.length)
  }

  return tokens
}

function highlight(code) {
  return code.split('\n').map((line, i) => {
    const tokenHtml = tokenizeLine(line).map(({ text, type }) => {
      const safe = escHtml(text)
      return type ? `<span class="${TOKEN_CLASS[type]}">${safe}</span>` : safe
    }).join('')
    return `<span class="code-line" data-line="${i + 1}">${tokenHtml}</span>`
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
    <div className="border" style={{ borderColor: '#2a2a2a', backgroundColor: '#080808' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b"
           style={{ borderColor: '#2a2a2a', backgroundColor: 'rgba(15,15,15,0.3)' }}>
        <div className="flex items-center gap-2">
          <span style={{ color: '#ff4444' }}>●</span>
          <span style={{ color: '#aaaaaa' }}>●</span>
          <span style={{ color: '#e8e8e8' }}>●</span>
          <span className="ml-2 text-xs" style={{ color: '#808080', fontFamily: 'Share Tech Mono, monospace' }}>
            {title || 'code.py'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 border transition-colors"
          style={{
            color: copied ? '#e8e8e8' : '#808080',
            borderColor: copied ? '#e8e8e8' : '#2a2a2a',
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
        .code-number { color: #bbbbbb; }
        .code-func { color: #cccccc; }
        .code-op { color: #ff9944; }
        .code-line { display: block; }
        .code-line:hover { background: rgba(220,220,220,0.04); }
      `}</style>
    </div>
  )
}
