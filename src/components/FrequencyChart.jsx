import { letterFrequency, EXPECTED_EN_FREQ } from '../utils/caesar'

export default function FrequencyChart({ text }) {
  const observed = letterFrequency(text || 'HELLO WORLD')
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  const maxVal = Math.max(...letters.map(l => Math.max(observed[l] || 0, EXPECTED_EN_FREQ[l] || 0)), 1)

  return (
    <div>
      <div className="flex items-end gap-0.5 h-32 overflow-x-auto pb-1">
        {letters.map(letter => {
          const obs = observed[letter] || 0
          const exp = EXPECTED_EN_FREQ[letter] || 0
          const obsH = (obs / maxVal) * 100
          const expH = (exp / maxVal) * 100

          return (
            <div key={letter} className="flex flex-col items-center gap-0.5 flex-1 min-w-[18px]">
              <div className="flex items-end gap-0.5 w-full h-24">
                {/* Observed */}
                <div
                  className="flex-1 transition-all duration-500"
                  style={{
                    height: `${obsH}%`,
                    backgroundColor: '#00ff41',
                    opacity: 0.8,
                    minHeight: obs > 0 ? '2px' : '0',
                  }}
                  title={`${letter}: ${obs.toFixed(1)}%`}
                />
                {/* Expected */}
                <div
                  className="flex-1 transition-all duration-500"
                  style={{
                    height: `${expH}%`,
                    backgroundColor: '#004415',
                    border: '1px solid #00aa2b',
                    minHeight: '2px',
                  }}
                  title={`${letter} (EN): ${exp.toFixed(1)}%`}
                />
              </div>
              <span className="text-xs" style={{ color: '#005515', fontFamily: 'Share Tech Mono, monospace', fontSize: '9px' }}>
                {letter}
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex gap-4 mt-2 text-xs" style={{ color: '#00aa2b', fontFamily: 'Share Tech Mono, monospace' }}>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3" style={{ backgroundColor: '#00ff41' }} />
          Nalezeno v textu
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 border" style={{ backgroundColor: '#004415', borderColor: '#00aa2b' }} />
          Očekáváno (AJ)
        </span>
      </div>
    </div>
  )
}
