// Simple ECC simulation over small finite field for educational purposes
// We use the curve y² = x³ + ax + b (mod p)

// Small prime field for visualization: p=97, curve y²=x³-3x+3
const DEMO_P = 97
const DEMO_A = -3
const DEMO_B = 3

// N = order of generator point G = smallest n where n*G = infinity
// For this curve with G=(13,7): N=11  (computed by iteration)
const DEMO_N = 11

function mod(n, m) {
  return ((n % m) + m) % m
}

function modInverse(a, p) {
  // Extended Euclidean algorithm
  a = mod(a, p)
  let [old_r, r] = [a, p]
  let [old_s, s] = [1, 0]
  while (r !== 0) {
    const q = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s]
  }
  return mod(old_s, p)
}

function pointAdd(P, Q, a, p) {
  if (P === null) return Q
  if (Q === null) return P
  if (P[0] === Q[0] && P[1] === mod(-Q[1], p)) return null

  let lambda
  if (P[0] === Q[0] && P[1] === Q[1]) {
    // Point doubling
    const num = mod(3 * P[0] * P[0] + a, p)
    const den = mod(2 * P[1], p)
    lambda = mod(num * modInverse(den, p), p)
  } else {
    const num = mod(Q[1] - P[1], p)
    const den = mod(Q[0] - P[0], p)
    lambda = mod(num * modInverse(den, p), p)
  }
  const x = mod(lambda * lambda - P[0] - Q[0], p)
  const y = mod(lambda * (P[0] - x) - P[1], p)
  return [x, y]
}

function scalarMult(k, P, a, p) {
  let result = null
  let addend = P
  let kk = k
  while (kk > 0) {
    if (kk & 1) result = pointAdd(result, addend, a, p)
    addend = pointAdd(addend, addend, a, p)
    kk >>= 1
  }
  return result
}

// Generator point on y²=x³-3x+3 (mod 97)
// Let's find a valid point
function findCurvePoints(p, a, b) {
  const points = []
  for (let x = 0; x < p; x++) {
    const rhs = mod(x * x * x + a * x + b, p)
    for (let y = 0; y < p; y++) {
      if (mod(y * y, p) === rhs) {
        points.push([x, y])
      }
    }
  }
  return points
}

// Precompute and cache
let _curvePoints = null
function getCurvePoints() {
  if (!_curvePoints) _curvePoints = findCurvePoints(DEMO_P, DEMO_A, DEMO_B)
  return _curvePoints
}

// Get a fixed generator point
function getGenerator() {
  const pts = getCurvePoints()
  // Pick a point with reasonable coordinates
  return pts.find(([x]) => x > 5 && x < 20) || pts[0]
}

export function generateKeyPair() {
  const G = getGenerator()
  const a = DEMO_A
  // Private key must be in [2, N-1] where N is the subgroup order
  const privateKey = 2 + Math.floor(Math.random() * (DEMO_N - 2))
  const publicKey = scalarMult(privateKey, G, a, DEMO_P)
  return { privateKey, publicKey, G }
}

export function computeSharedSecret(myPrivateKey, theirPublicKey) {
  return scalarMult(myPrivateKey, theirPublicKey, DEMO_A, DEMO_P)
}

// Simple hash for demo (not cryptographic)
// Result is in [1, N-1] so it fits the subgroup order
function simpleHash(msg) {
  let hash = 0
  for (const ch of msg) {
    hash = (hash * 31 + ch.charCodeAt(0)) % DEMO_N
  }
  return hash || 1
}

// ECDSA signing — all modular arithmetic is done modulo N (subgroup order)
export function signMessage(message, privateKey, G) {
  const h = simpleHash(message)
  // Retry until we get valid r and s (non-zero)
  for (let attempt = 0; attempt < 50; attempt++) {
    const k = 2 + Math.floor(Math.random() * (DEMO_N - 2))
    const R = scalarMult(k, G, DEMO_A, DEMO_P)
    if (!R) continue
    const r = mod(R[0], DEMO_N)
    if (r === 0) continue
    const kInv = modInverse(k, DEMO_N)
    const s = mod(kInv * (h + privateKey * r), DEMO_N)
    if (s === 0) continue
    return { r, s }
  }
  return null
}

export function verifySignature(message, signature, publicKey, G) {
  if (!signature || !publicKey) return false
  const { r, s } = signature
  const h = simpleHash(message)
  const sInv = modInverse(s, DEMO_N)
  const u1 = mod(h * sInv, DEMO_N)
  const u2 = mod(r * sInv, DEMO_N)
  const P1 = scalarMult(u1, G, DEMO_A, DEMO_P)
  const P2 = scalarMult(u2, publicKey, DEMO_A, DEMO_P)
  const point = pointAdd(P1, P2, DEMO_A, DEMO_P)
  if (!point) return false
  return mod(point[0], DEMO_N) === r
}

export function getCurvePointsForVis() {
  return getCurvePoints()
}

export function getGeneratorPoint() {
  return getGenerator()
}

// Format point as hex string for display
export function pointToHex(point) {
  if (!point) return 'O (bod v nekonečnu)'
  const x = point[0].toString(16).padStart(4, '0')
  const y = point[1].toString(16).padStart(4, '0')
  return `(0x${x}, 0x${y})`
}

export function sigToHex(sig) {
  if (!sig) return ''
  const r = sig.r.toString(16).padStart(4, '0')
  const s = sig.s.toString(16).padStart(4, '0')
  return `r=0x${r}, s=0x${s}`
}
