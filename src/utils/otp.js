// One-Time Pad (Vernam cipher) — educational implementation

export function generateKey(length) {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
}

export function textToBytes(text) {
  return Array.from(new TextEncoder().encode(text))
}

export function bytesToText(bytes) {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes))
  } catch {
    return null
  }
}

export function bytesToHex(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0')).join(' ')
}

export function hexToDisplay(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')
}

// XOR two byte arrays (shorter is padded with 0)
export function xorBytes(a, b) {
  const len = Math.max(a.length, b.length)
  return Array.from({ length: len }, (_, i) => (a[i] ?? 0) ^ (b[i] ?? 0))
}

// Encrypt: ciphertext[i] = plaintext[i] XOR key[i]
export function encrypt(text, key) {
  const plainBytes = textToBytes(text)
  if (key.length < plainBytes.length) throw new Error('Key too short')
  return plainBytes.map((b, i) => b ^ key[i])
}

// Decrypt: plaintext[i] = ciphertext[i] XOR key[i]  (XOR is its own inverse)
export function decrypt(cipherBytes, key) {
  if (key.length < cipherBytes.length) return null
  const plainBytes = cipherBytes.map((b, i) => b ^ key[i])
  return bytesToText(plainBytes)
}

// Key-reuse attack: c1 XOR c2 = m1 XOR m2 (key cancels out)
export function keyReuseXor(ct1, ct2) {
  return xorBytes(ct1, ct2)
}

export const MAX_MSG_LEN = 16
