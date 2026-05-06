import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../contexts/LanguageContext'
import { useTranslation } from '../translations'
import { CaesarDiagram, EccDiagram, LatticeDiagram, OtpDiagram } from './glossary/CipherDiagrams'

// ─── Category config ─────────────────────────────────────────────────────────
const CAT = {
  general: { cs: 'Obecné',  en: 'General', color: '#808080' },
  caesar:  { cs: 'Caesar',  en: 'Caesar',  color: '#ff4444' },
  ecc:     { cs: 'ECC',     en: 'ECC',     color: '#e8e8e8' },
  kyber:   { cs: 'Kyber',   en: 'Kyber',   color: '#cccccc' },
  otp:     { cs: 'OTP',     en: 'OTP',     color: '#aaaaaa' },
}

// ─── Terms ───────────────────────────────────────────────────────────────────
const TERMS = [
  // General
  { cat: 'general', cs: 'Kryptografie', en: 'Cryptography',
    defCs: 'Věda o metodách zabezpečení informací pomocí matematiky. Zahrnuje šifrování, autentizaci, digitální podpisy a výměnu klíčů.',
    defEn: 'The science of securing information using mathematics. Covers encryption, authentication, digital signatures and key exchange.' },
  { cat: 'general', cs: 'Šifra', en: 'Cipher',
    defCs: 'Algoritmus pro transformaci čitelné zprávy (plaintext) na nečitelný tvar (ciphertext). Reverzibilní pomocí klíče.',
    defEn: 'An algorithm transforming a readable message (plaintext) into an unreadable form (ciphertext). Reversible using a key.' },
  { cat: 'general', cs: 'Plaintext', en: 'Plaintext',
    defCs: 'Původní, nezašifrovaná zpráva. Vstup do šifrovacího algoritmu.',
    defEn: 'The original, unencrypted message. Input to an encryption algorithm.' },
  { cat: 'general', cs: 'Ciphertext', en: 'Ciphertext',
    defCs: 'Zašifrovaná zpráva. Bez znalosti klíče by měla být nečitelná i pro útočníka s neomezeným výkonem.',
    defEn: 'The encrypted message. Should be unreadable without the key, even for an attacker with unlimited power.' },
  { cat: 'general', cs: 'Klíč', en: 'Key',
    defCs: 'Tajný parametr řídící šifrování a dešifrování. Bezpečnost závisí na utajení klíče, ne algoritmu (Kerckhoffův princip).',
    defEn: 'Secret parameter controlling encryption/decryption. Security depends on key secrecy, not algorithm secrecy (Kerckhoffs\'s principle).' },
  { cat: 'general', cs: 'Symetrická kryptografie', en: 'Symmetric cryptography',
    defCs: 'Stejný klíč pro šifrování i dešifrování. Rychlá, ale vyžaduje bezpečný přenos klíče oběma stranám. Příklady: AES, OTP.',
    defEn: 'Same key for encryption and decryption. Fast, but requires secure key exchange between parties. Examples: AES, OTP.' },
  { cat: 'general', cs: 'Asymetrická kryptografie', en: 'Asymmetric cryptography',
    defCs: 'Pár klíčů: veřejný (sdílet lze) + soukromý (tajný). Řeší problém distribuce klíčů. Příklady: ECC, RSA, ML-KEM.',
    defEn: 'Key pair: public (shareable) + private (secret). Solves the key distribution problem. Examples: ECC, RSA, ML-KEM.' },
  { cat: 'general', cs: 'XOR', en: 'XOR (Exclusive OR)',
    defCs: 'Bitová operace: výsledek je 1 pokud se vstupy liší. 0⊕0=0, 0⊕1=1, 1⊕1=0. Klíčová operace v OTP a proudových šifrách.',
    defEn: 'Bitwise operation: result is 1 if inputs differ. 0⊕0=0, 0⊕1=1, 1⊕1=0. Key operation in OTP and stream ciphers.' },
  { cat: 'general', cs: 'Modulární aritmetika', en: 'Modular arithmetic',
    defCs: '"Hodinová" aritmetika — výsledek je zbytek po dělení: 17 mod 5 = 2. Základ kryptografie s veřejným klíčem.',
    defEn: '"Clock" arithmetic — result is the remainder after division: 17 mod 5 = 2. Foundation of public-key cryptography.' },
  { cat: 'general', cs: 'Kerckhoffův princip', en: "Kerckhoffs's principle",
    defCs: 'Bezpečnost kryptosystému musí záviset pouze na klíči, ne na tajnosti algoritmu. Algoritmus může být veřejně znám.',
    defEn: 'Security of a cryptosystem must depend only on the key, not algorithm secrecy. The algorithm may be publicly known.' },
  { cat: 'general', cs: 'Digitální podpis', en: 'Digital signature',
    defCs: 'Kryptografický mechanismus ověřující autenticitu a integritu zprávy. Vytvořen soukromým klíčem, ověřen veřejným.',
    defEn: 'Cryptographic mechanism verifying message authenticity and integrity. Created with private key, verified with public key.' },
  { cat: 'general', cs: 'Hash funkce', en: 'Hash function',
    defCs: 'Jednosměrná funkce: z libovolné zprávy vytvoří otisk pevné délky. Nelze z otisku rekonstruovat původní data.',
    defEn: 'One-way function: produces a fixed-length fingerprint from any input. Original data cannot be reconstructed from the hash.' },

  // Caesar
  { cat: 'caesar', cs: 'Substituční šifra', en: 'Substitution cipher',
    defCs: 'Každý symbol plaintext je nahrazen jiným symbolem podle pevného pravidla. Caesarova šifra je nejjednodušší případ.',
    defEn: 'Each plaintext symbol is replaced by another according to a fixed rule. The Caesar cipher is the simplest case.' },
  { cat: 'caesar', cs: 'Brute force útok', en: 'Brute force attack',
    defCs: 'Útok vyčerpáním všech možných klíčů. Caesarova šifra má jen 25 klíčů — počítač je vyzkouší za zlomek sekundy.',
    defEn: 'Attack by exhausting all possible keys. The Caesar cipher has only 25 keys — a computer tries them all instantly.' },
  { cat: 'caesar', cs: 'Frekvenční analýza', en: 'Frequency analysis',
    defCs: 'Útok využívající statistiku: v češtině dominují E, A, O. Pokud v ciphertextu dominuje jiné písmeno, snadno odhalíme klíč.',
    defEn: 'Attack using letter frequency statistics: if X dominates in ciphertext when E is most common, the shift is revealed.' },
  { cat: 'caesar', cs: 'ROT13', en: 'ROT13',
    defCs: 'Speciální Caesarova šifra s posunem 13. Protože abeceda má 26 písmen, šifrování = dešifrování. Používán pro skrytí spoilerů.',
    defEn: 'Caesar cipher with shift 13. Since the alphabet has 26 letters, encryption equals decryption. Used to hide spoilers.' },
  { cat: 'caesar', cs: 'Monoalfabetická šifra', en: 'Monoalphabetic cipher',
    defCs: 'Každé písmeno plaintext je vždy nahrazeno stejným symbolem. Zachovává frekvenci → zranitelná na frekvenční analýzu.',
    defEn: 'Each plaintext letter is always replaced by the same symbol. Preserves frequency → vulnerable to frequency analysis.' },

  // ECC
  { cat: 'ecc', cs: 'Eliptická křivka', en: 'Elliptic curve',
    defCs: 'Množina bodů splňující y²=x³+ax+b. V kryptografii se pracuje nad konečným tělesem (mod p) pro diskrétní strukturu.',
    defEn: 'Set of points satisfying y²=x³+ax+b. In cryptography defined over a finite field (mod p) for discrete structure.' },
  { cat: 'ecc', cs: 'Generátorový bod G', en: 'Generator point G',
    defCs: 'Pevně daný bod na křivce. Všechny veřejné klíče jsou násobky G. Jeho znalost není bezpečnostní slabinou.',
    defEn: 'A fixed public point on the curve. All public keys are multiples of G. Knowing G is not a security weakness.' },
  { cat: 'ecc', cs: 'Skalární násobení', en: 'Scalar multiplication',
    defCs: 'k×G = G+G+…+G (k-krát). Jednosměrná operace: znaje G a k×G, nelze k snadno najít. Základ bezpečnosti ECC.',
    defEn: 'k×G = G+G+…+G (k times). One-way: given G and k×G, finding k is computationally infeasible. Core of ECC security.' },
  { cat: 'ecc', cs: 'Diskrétní logaritmus', en: 'Discrete logarithm',
    defCs: 'Problém: znáš G a Q=k×G, najdi k. Na dostatečně velkých ECC křivkách výpočetně neřešitelný ani superpočítačem.',
    defEn: 'Problem: given G and Q=k×G, find k. On sufficiently large ECC curves computationally infeasible even for supercomputers.' },
  { cat: 'ecc', cs: 'ECDH', en: 'Elliptic Curve Diffie-Hellman',
    defCs: 'Protokol výměny klíčů: Alice a Bob sdílí veřejné klíče a každý nezávisle vypočítá stejné sdílené tajemství privA·privB·G.',
    defEn: 'Key exchange protocol: Alice and Bob share public keys and each independently computes the same shared secret privA·privB·G.' },
  { cat: 'ecc', cs: 'ECDSA', en: 'EC Digital Signature Algorithm',
    defCs: 'Digitální podpis na eliptických křivkách. Podpis ověřuje identitu a integritu. Používán v TLS, SSH, Bitcoinu.',
    defEn: 'Digital signature on elliptic curves. Signature verifies identity and integrity. Used in TLS, SSH, Bitcoin.' },
  { cat: 'ecc', cs: 'Veřejný klíč', en: 'Public key',
    defCs: 'Bod Q = k·G na křivce. Volně sdílet. Z Q nelze rekonstruovat soukromý klíč k (problém diskrétního logaritmu).',
    defEn: 'Point Q = k·G on the curve. Freely shareable. Private key k cannot be recovered from Q (discrete logarithm problem).' },
  { cat: 'ecc', cs: 'Soukromý klíč', en: 'Private key',
    defCs: 'Náhodné celé číslo k, kde 1 ≤ k < N (N = řád grupy). Absolutně tajné. Generuje veřejný klíč: Q = k·G.',
    defEn: 'Random integer k where 1 ≤ k < N (N = group order). Absolutely secret. Generates public key: Q = k·G.' },

  // Kyber
  { cat: 'kyber', cs: 'Mřížka', en: 'Lattice',
    defCs: 'Pravidelná struktura bodů v n-rozměrném prostoru, generovaná lineárními kombinacemi bázových vektorů. Základ post-kvantové kryptografie.',
    defEn: 'Regular structure of points in n-dimensional space, generated by linear combinations of basis vectors. Foundation of post-quantum cryptography.' },
  { cat: 'kyber', cs: 'LWE (Learning With Errors)', en: 'Learning With Errors',
    defCs: 'Těžký matematický problém: dáno b≈As+e (s = tajemství, e = malý šum), najdi s. Kvantové počítače ho neumí efektivně řešit.',
    defEn: 'Hard math problem: given b≈As+e (s = secret, e = small noise), find s. Quantum computers cannot solve it efficiently.' },
  { cat: 'kyber', cs: 'KEM', en: 'Key Encapsulation Mechanism',
    defCs: 'Protokol pro bezpečné "zabalení" symetrického klíče pomocí veřejného klíče příjemce. Výstup: šifrovaný klíč + sdílené tajemství.',
    defEn: 'Protocol for securely encapsulating a symmetric key using the recipient\'s public key. Output: ciphertext + shared secret.' },
  { cat: 'kyber', cs: 'Post-kvantová kryptografie', en: 'Post-quantum cryptography',
    defCs: 'Algoritmy odolné vůči kvantovým počítačům. Nezávisejí na faktorizaci ani diskrétním logaritmu, které Shorův algoritmus řeší.',
    defEn: 'Algorithms resistant to quantum computers. Do not rely on factoring or discrete log, which Shor\'s algorithm solves.' },
  { cat: 'kyber', cs: 'Shorův algoritmus', en: "Shor's algorithm",
    defCs: 'Kvantový algoritmus (Peter Shor, 1994) efektivně řešící faktorizaci a diskrétní logaritmus. Rozbíjí RSA a ECC.',
    defEn: 'Quantum algorithm (Peter Shor, 1994) efficiently solving factoring and discrete logarithm. Breaks RSA and ECC.' },
  { cat: 'kyber', cs: 'Groverův algoritmus', en: "Grover's algorithm",
    defCs: 'Kvantový prohledávací algoritmus. Urychluje brute force kvadraticky → AES-256 má efektivně jen 128 bitů bezpečnosti.',
    defEn: 'Quantum search algorithm. Speeds up brute force quadratically → AES-256 has effectively only 128 bits of security.' },
  { cat: 'kyber', cs: 'NIST FIPS 203', en: 'NIST FIPS 203',
    defCs: 'Americký federální standard pro ML-KEM (CRYSTALS-Kyber), vydaný v srpnu 2024. První standardizovaný post-kvantový KEM.',
    defEn: 'US federal standard for ML-KEM (CRYSTALS-Kyber), published August 2024. The first standardized post-quantum KEM.' },

  // OTP
  { cat: 'otp', cs: 'One-Time Pad', en: 'One-Time Pad (OTP)',
    defCs: 'Šifra s jednorázovým náhodným klíčem stejné délky jako zpráva. Jedná se o jedinou šifru s matematicky dokazenou dokonalou bezpečností.',
    defEn: 'Cipher with a one-time random key as long as the message. The only cipher with mathematically proven perfect secrecy.' },
  { cat: 'otp', cs: 'Dokonalá bezpečnost', en: 'Perfect secrecy',
    defCs: 'Shannonova definice (1949): ciphertext nenese žádnou statistickou informaci o plaintextu. Útočník s neomezenou výpočetní silou se nic nedozví.',
    defEn: 'Shannon\'s definition (1949): ciphertext carries no statistical information about plaintext. Unlimited computing power reveals nothing.' },
  { cat: 'otp', cs: 'Vernamova šifra', en: 'Vernam cipher',
    defCs: 'Patentovaný název pro OTP (Gilbert Vernam, 1919). Operace: C = M ⊕ K. Dešifrování: M = C ⊕ K.',
    defEn: 'Patented name for OTP (Gilbert Vernam, 1919). Encryption: C = M ⊕ K. Decryption: M = C ⊕ K.' },
  { cat: 'otp', cs: 'Klíčové opakování', en: 'Key reuse',
    defCs: 'Katastrofální chyba: c₁⊕c₂ = m₁⊕m₂ (klíč se vyruší). Útočník metodou crib dragging může rekonstruovat obě zprávy.',
    defEn: 'Catastrophic error: c₁⊕c₂ = m₁⊕m₂ (key cancels out). Attacker can use crib dragging to reconstruct both messages.' },
  { cat: 'otp', cs: 'QKD', en: 'Quantum Key Distribution',
    defCs: 'Distribuce klíče pomocí kvantových vlastností fotonů. Jakýkoliv odposlech narušuje kvantový stav a je fyzikálně detekovatelný.',
    defEn: 'Key distribution using quantum properties of photons. Any eavesdropping disturbs the quantum state and is physically detectable.' },
  { cat: 'otp', cs: 'BB84 protokol', en: 'BB84 protocol',
    defCs: 'První QKD protokol (Bennett & Brassard, 1984). Fotony přenáší bity ve dvou náhodných bázích. Odposlech způsobí měřitelné chyby.',
    defEn: 'First QKD protocol (Bennett & Brassard, 1984). Photons carry bits in two random bases. Eavesdropping causes measurable errors.' },
  { cat: 'otp', cs: 'No-cloning theorem', en: 'No-cloning theorem',
    defCs: 'Kvantový zákon: nelze dokonale zkopírovat neznámý kvantový stav. Garantuje, že odposlech QKD klíče zanechá detekovatelné stopy.',
    defEn: 'Quantum law: an unknown quantum state cannot be perfectly copied. Guarantees that QKD eavesdropping leaves detectable traces.' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────
function TermCard({ term, lang }) {
  const cat = CAT[term.cat]
  return (
    <div className="border p-3" style={{ borderColor: '#2a2a2a', backgroundColor: 'rgba(8,8,8,0.6)' }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs px-1.5 py-0.5 border"
          style={{ color: cat.color, borderColor: cat.color, fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem' }}>
          {lang === 'cs' ? cat.cs : cat.en}
        </span>
      </div>
      <div className="mb-0.5" style={{ color: '#e8e8e8', fontFamily: 'VT323, monospace', fontSize: '1.15rem', lineHeight: 1.2 }}>
        {lang === 'cs' ? term.cs : term.en}
      </div>
      {term.cs !== term.en && (
        <div className="mb-2" style={{ color: '#505050', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem' }}>
          {lang === 'cs' ? term.en : term.cs}
        </div>
      )}
      <div style={{ color: '#808080', fontFamily: 'Share Tech Mono, monospace', fontSize: '0.72rem', lineHeight: 1.6 }}>
        {lang === 'cs' ? term.defCs : term.defEn}
      </div>
    </div>
  )
}

function DiagramCard({ title, subtitle, color, children }) {
  return (
    <div className="border p-4" style={{ borderColor: '#2a2a2a', backgroundColor: 'rgba(8,8,8,0.6)' }}>
      <div className="mb-1" style={{ color, fontFamily: 'VT323, monospace', fontSize: '1.4rem' }}>
        ▸ {title}
      </div>
      <div className="mb-4 text-xs" style={{ color: '#505050', fontFamily: 'Share Tech Mono, monospace' }}>
        {subtitle}
      </div>
      {children}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function Glossary() {
  const { lang } = useLang()
  const t = useTranslation(lang)
  const g = t.glossary

  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = TERMS.filter(term => {
    if (activeFilter !== 'all' && term.cat !== activeFilter) return false
    if (search.trim()) {
      const s = search.toLowerCase()
      return term.cs.toLowerCase().includes(s) ||
             term.en.toLowerCase().includes(s) ||
             term.defCs.toLowerCase().includes(s) ||
             term.defEn.toLowerCase().includes(s)
    }
    return true
  })

  const diagrams = [
    {
      key: 'caesar', color: '#ff4444',
      title: 'Caesarova šifra',
      subtitle: lang === 'cs' ? 'Substituční posun abecedy' : 'Alphabet substitution shift',
      component: <CaesarDiagram lang={lang} />,
    },
    {
      key: 'ecc', color: '#e8e8e8',
      title: 'ECC',
      subtitle: lang === 'cs' ? 'Skalární násobení na eliptické křivce + ECDH' : 'Scalar multiplication on elliptic curve + ECDH',
      component: <EccDiagram lang={lang} />,
    },
    {
      key: 'kyber', color: '#cccccc',
      title: 'ML-KEM / Kyber',
      subtitle: lang === 'cs' ? 'Mřížkový problém (CVP / LWE)' : 'Lattice problem (CVP / LWE)',
      component: <LatticeDiagram lang={lang} />,
    },
    {
      key: 'otp', color: '#aaaaaa',
      title: 'One-Time Pad',
      subtitle: lang === 'cs' ? 'XOR operace — šifrování a dešifrování' : 'XOR operation — encryption and decryption',
      component: <OtpDiagram lang={lang} />,
    },
  ]

  return (
    <div className="min-h-screen pt-12" style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-xs mb-2 inline-block transition-colors"
            style={{ color: '#808080', fontFamily: 'Share Tech Mono, monospace', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = '#e8e8e8'}
            onMouseLeave={e => e.currentTarget.style.color = '#808080'}>
            {t.backBtn}
          </Link>
          <h1 className="text-4xl md:text-5xl glow" style={{ color: '#e8e8e8', fontFamily: 'VT323, monospace' }}>
            {g.pageTitle}
          </h1>
          <div className="text-xs mt-1" style={{ color: '#505050', fontFamily: 'Share Tech Mono, monospace' }}>
            {g.subtitle}
          </div>
        </div>

        {/* ── POJMY SECTION ── */}
        <section className="mb-16">
          {/* Filter + search bar */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {/* Category filters */}
            {[['all', g.filterAll, '#808080'], ...Object.entries(CAT).map(([k, v]) => [k, lang === 'cs' ? v.cs : v.en, v.color])].map(([key, label, color]) => {
              const active = activeFilter === key
              return (
                <button key={key} onClick={() => setActiveFilter(key)}
                  style={{
                    fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem',
                    padding: '3px 10px', cursor: 'pointer',
                    color: active ? '#080808' : color,
                    backgroundColor: active ? color : 'transparent',
                    border: `1px solid ${color}`,
                  }}>
                  {label}
                </button>
              )
            })}

            {/* Search */}
            <input
              type="text"
              placeholder={g.search}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                marginLeft: 'auto',
                fontFamily: 'Share Tech Mono, monospace', fontSize: '0.75rem',
                background: 'rgba(8,8,8,0.6)', color: '#e8e8e8',
                border: '1px solid #2a2a2a', padding: '3px 10px',
                outline: 'none', width: 200,
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#e8e8e8'}
              onBlur={e => e.currentTarget.style.borderColor = '#2a2a2a'}
            />
          </div>

          {/* Terms grid */}
          {filtered.length === 0 ? (
            <div className="text-sm" style={{ color: '#505050', fontFamily: 'Share Tech Mono, monospace' }}>
              {g.noResults}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(term => (
                <TermCard key={term.cs} term={term} lang={lang} />
              ))}
            </div>
          )}
        </section>

        {/* ── DIAGRAMS SECTION ── */}
        <section>
          <h2 className="text-2xl mb-6 pb-2 border-b"
            style={{ color: '#e8e8e8', fontFamily: 'VT323, monospace', borderColor: '#2a2a2a' }}>
            {g.diagramsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {diagrams.map(d => (
              <DiagramCard key={d.key} title={d.title} subtitle={d.subtitle} color={d.color}>
                {d.component}
              </DiagramCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
