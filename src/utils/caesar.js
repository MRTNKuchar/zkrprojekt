const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function caesarEncrypt(text, shift) {
  shift = ((shift % 26) + 26) % 26
  return text
    .split('')
    .map(char => {
      const upper = char.toUpperCase()
      const idx = ALPHABET.indexOf(upper)
      if (idx === -1) return char
      const shifted = (idx + shift) % 26
      return char === upper ? ALPHABET[shifted] : ALPHABET[shifted].toLowerCase()
    })
    .join('')
}

export function caesarDecrypt(text, shift) {
  return caesarEncrypt(text, 26 - (((shift % 26) + 26) % 26))
}

export function bruteForceAll(ciphertext) {
  return Array.from({ length: 26 }, (_, i) => ({
    shift: i,
    text: caesarDecrypt(ciphertext, i),
  }))
}

// Simple English/Czech frequency scoring
const CZECH_FREQ = { E: 10.0, A: 8.5, O: 8.0, I: 7.5, N: 6.5, T: 6.0, S: 5.8, R: 5.2, V: 5.0, K: 4.8 }
const EN_FREQ = { E: 12.7, T: 9.1, A: 8.2, O: 7.5, I: 7.0, N: 6.7, S: 6.3, H: 6.1, R: 6.0, D: 4.3 }

export function scoreText(text) {
  const upper = text.toUpperCase()
  const total = upper.replace(/[^A-Z]/g, '').length || 1
  let score = 0
  for (const [letter, freq] of Object.entries(EN_FREQ)) {
    const count = (upper.split(letter).length - 1)
    const observed = (count / total) * 100
    score -= Math.abs(observed - freq)
  }
  return score
}

export function findBestShift(ciphertext) {
  let best = { shift: 0, score: -Infinity }
  for (let shift = 0; shift < 26; shift++) {
    const decrypted = caesarDecrypt(ciphertext, shift)
    const score = scoreText(decrypted)
    if (score > best.score) best = { shift, score, text: decrypted }
  }
  return best
}

export function letterFrequency(text) {
  const counts = {}
  const upper = text.toUpperCase()
  let total = 0
  for (const char of upper) {
    if (ALPHABET.includes(char)) {
      counts[char] = (counts[char] || 0) + 1
      total++
    }
  }
  const result = {}
  for (const letter of ALPHABET) {
    result[letter] = total > 0 ? ((counts[letter] || 0) / total) * 100 : 0
  }
  return result
}

export const EXPECTED_EN_FREQ = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2, G: 2.0, H: 6.1,
  I: 7.0, J: 0.2, K: 0.8, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9,
  Q: 0.1, R: 6.0, S: 6.3, T: 9.1, U: 2.8, V: 1.0, W: 2.4, X: 0.2,
  Y: 2.0, Z: 0.1,
}
