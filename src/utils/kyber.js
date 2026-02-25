// Simplified LWE-based Key Encapsulation — educational demo
// Illustrates concepts behind CRYSTALS-Kyber / NIST ML-KEM standard
// NOT for production use
//
// Parameters (tiny for readability — real Kyber512 uses n=256, q=3329)
const N   = 4   // vector dimension
const Q   = 97  // prime modulus
const M   = 8   // LWE samples (rows of matrix A)
// Error distribution: uniform in {-1, 0, 1}
// Max decryption error = M + 1 + N = 13 < Q/4 = 24.25  → reliable

function mod(a, q) {
  return ((a % q) + q) % q
}

function smallRand() {
  return Math.floor(Math.random() * 3) - 1  // {-1, 0, 1}
}

function randMatrix(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * Q))
  )
}

// ============================================================
//  KEY GENERATION
// ============================================================

export function generateKeyPair() {
  // Public parameter: random matrix A ∈ Z_q^(M×N)
  const A = randMatrix(M, N)

  // Private key: small secret vector s ∈ {-1,0,1}^N
  const s = Array.from({ length: N }, smallRand)

  // Error vector e ∈ {-1,0,1}^M
  const e = Array.from({ length: M }, smallRand)

  // Public key component: b = A·s + e  (mod q)
  const b = A.map((row, i) =>
    mod(row.reduce((sum, a, j) => sum + a * s[j], 0) + e[i], Q)
  )

  return { A, b, s }
}

// ============================================================
//  ENCRYPTION of one bit ∈ {0, 1}
// ============================================================

export function encryptBit(bit, A, b) {
  // Random binary vector r ∈ {0,1}^M
  const r  = Array.from({ length: M }, () => Math.round(Math.random()))
  const e1 = Array.from({ length: N }, smallRand)  // small error
  const e2 = smallRand()                            // small scalar error

  // u = A^T · r + e1  (mod q)  — ciphertext vector of length N
  const u = Array.from({ length: N }, (_, j) =>
    mod(A.reduce((sum, row, i) => sum + row[j] * r[i], 0) + e1[j], Q)
  )

  // v = b^T · r + e2 + bit · ⌊q/2⌋  (mod q)  — scalar
  const bTr = b.reduce((sum, bi, i) => sum + bi * r[i], 0)
  const v = mod(bTr + e2 + bit * Math.floor(Q / 2), Q)

  return { u, v }
}

// ============================================================
//  DECRYPTION of one bit
// ============================================================

export function decryptBit({ u, v }, s) {
  // d = v - s^T · u  (mod q)
  const d = mod(v - s.reduce((sum, si, i) => sum + si * u[i], 0), Q)

  // Round: closer to 0 (→ bit=0) or to q/2 (→ bit=1)?
  const half = Math.floor(Q / 2)
  return (Math.min(d, Q - d) < Math.abs(d - half)) ? 0 : 1
}

// ============================================================
//  ENCRYPT / DECRYPT string (bit by bit)
// ============================================================

export function encryptString(text, A, b) {
  const ciphertexts = []
  for (const ch of text) {
    const code = ch.charCodeAt(0)
    for (let i = 7; i >= 0; i--) {
      ciphertexts.push(encryptBit((code >> i) & 1, A, b))
    }
  }
  return ciphertexts
}

export function decryptString(ciphertexts, s) {
  let result = ''
  for (let i = 0; i < ciphertexts.length; i += 8) {
    const byte = ciphertexts
      .slice(i, i + 8)
      .reduce((acc, ct) => (acc << 1) | decryptBit(ct, s), 0)
    result += String.fromCharCode(byte)
  }
  return result
}

// ============================================================
//  DISPLAY HELPERS
// ============================================================

export function fmtVec(v) {
  return '[' + v.map(x => String(x).padStart(3)).join(', ') + ']'
}

export function fmtBit(bit) {
  return bit === 1 ? '1' : '0'
}

export const DEMO_PARAMS = { N, Q, M }
