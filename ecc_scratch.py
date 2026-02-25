# ============================================================
# ECC OD NULY — zadne zavislosti, ciste Python
# Vzdělávací implementace ECDH + ECDSA
# Spusteni: python ecc_scratch.py
# ============================================================
# Krivka: y^2 = x^3 - 3x + 3  (mod 97) — male pole pro demo
# Real ECC: secp256k1 s prvocislem ~2^256
# ============================================================

import random

# --- Parametry krivky (male hodnoty pro jednoduchost demonstrace) ---
P = 97      # prvocislo definujici konecne pole Z_p
A = -3      # koeficient a v rovnici krivky
B =  3      # koeficient b v rovnici krivky
G = (13, 7) # generatorovy bod (lezi na krivce, overeno)

# N = rad bodu G = nejmensi kladne n, pro ktere n*G = bod v nekonecnu
# Pro tuto krivku N = 11  (spocteno iteraci: 11*G = None)
# V realnem ECDSA je N velke prvocislo (~2^256 pro secp256k1)
N = 11


# ============================================================
#  POMOCNE FUNKCE
# ============================================================

def mod_inv(a: int, p: int) -> int:
    """
    Vypocte modularni inverzi cisla a modulo p.
    Pouziva rozsireny Eukliduv algoritmus (bez externi knihovny).
    Vraci x tak, ze (a * x) % p == 1.
    """
    a = a % p
    g, x, u = p, 0, 1
    while a != 0:
        q = g // a
        g, a = a, g - q * a
        x, u = u, x - q * u
    return x % p


def bod_soucet(bod1, bod2):
    """
    Secte dva body na elipticke krivce nad Z_p.

    Specialni pripady:
      - bod v nekonecnu (None) funguje jako neutralni prvek
      - P + (-P) = bod v nekonecnu
    """
    # Neutralni prvek: 0 + Q = Q
    if bod1 is None:
        return bod2
    if bod2 is None:
        return bod1

    x1, y1 = bod1
    x2, y2 = bod2

    # Inverze bodu: P + (-P) = bod v nekonecnu
    if x1 == x2 and (y1 + y2) % P == 0:
        return None

    if bod1 == bod2:
        # Zdvojeni bodu — smernice tecny ke krivce
        # lambda = (3*x1^2 + A) / (2*y1)  mod P
        citatel  = (3 * x1 * x1 + A) % P
        jmenovatel = mod_inv(2 * y1, P)
        lam = (citatel * jmenovatel) % P
    else:
        # Soucet ruznych bodu — smernice secny
        # lambda = (y2 - y1) / (x2 - x1)  mod P
        citatel    = (y2 - y1) % P
        jmenovatel = mod_inv(x2 - x1, P)
        lam = (citatel * jmenovatel) % P

    # Souradnice noveho bodu
    x3 = (lam * lam - x1 - x2) % P
    y3 = (lam * (x1 - x3) - y1) % P
    return (x3, y3)


def skalar_nasob(k: int, bod) -> tuple:
    """
    Vypocte k-nasobek bodu na elipticke krivce.
    Algoritmus: double-and-add (analogie rychleho umocnovani).
    Cas. slozitost: O(log k) souctu bodu.
    """
    vysledek = None   # startujeme s bodem v nekonecnu (= 0)
    scitanec = bod    # postupne: G, 2G, 4G, 8G, ...

    while k > 0:
        if k & 1:     # pokud je nejnizsi bit = 1
            vysledek = bod_soucet(vysledek, scitanec)
        scitanec = bod_soucet(scitanec, scitanec)  # zdvojeni
        k >>= 1       # posun doprava o 1 bit

    return vysledek


def hash_zpravy(zprava: str) -> int:
    """
    Jednoduchy deterministicky hash retezce.
    POZOR: Pouze pro demo — neni kryptograficky bezpecny!
    V realne aplikaci pouzijte SHA-256 z modulu hashlib.
    """
    h = 0
    for znak in zprava:
        h = (h * 31 + ord(znak)) % N
    return h or 1  # hash nesmi byt 0


# ============================================================
#  DEMO: ECDH — VYMENA KLICU
# ============================================================

def demo_ecdh():
    """
    Ukazka Diffie-Hellman vymeny klicu na elipticke krivce.

    Alice a Bob si odvodi spolecne tajemstvi (sdileny bod),
    aniz by si kdy poslali svuj soukromy klic.
    """
    # Soukromy klic musi byt v rozsahu [1, N-1] — rad podskupiny je N
    alice_soukr = random.randint(2, N - 1)
    bob_soukr   = random.randint(2, N - 1)

    # Verejny klic = soukromy_klic * G  (skalarne nasobeni)
    alice_verejn = skalar_nasob(alice_soukr, G)  # A = a*G
    bob_verejn   = skalar_nasob(bob_soukr,   G)  # B = b*G

    # Sdilene tajemstvi: obe strany dospejou ke stejnemu bodu
    #   Alice: a * B = a * (b*G) = a*b*G
    #   Bob:   b * A = b * (a*G) = a*b*G  (stejne!)
    alice_sdilene = skalar_nasob(alice_soukr, bob_verejn)
    bob_sdilene   = skalar_nasob(bob_soukr,  alice_verejn)

    shoda = alice_sdilene == bob_sdilene

    print("=" * 56)
    print("  ECDH - vymena klicu na elipticke krivce")
    print(f"  Krivka: y^2 = x^3 + ({A})x + {B}  (mod {P})")
    print("=" * 56)
    print(f"  [ALICE] soukromy klic  : {alice_soukr:<4}  (NIKDY neposila!)")
    print(f"  [ALICE] verejny klic   : {alice_verejn}")
    print(f"  [BOB]   soukromy klic  : {bob_soukr:<4}  (NIKDY neposila!)")
    print(f"  [BOB]   verejny klic   : {bob_verejn}")
    print(f"  [ALICE] sdilene tajemstvi: {alice_sdilene}")
    print(f"  [BOB]   sdilene tajemstvi: {bob_sdilene}")
    print(f"  Shoda: {'ANO' if shoda else 'NE'}")

    return alice_soukr, alice_verejn


# ============================================================
#  DEMO: ECDSA — PODPIS A OVERENI ZPRAVY
# ============================================================

def demo_ecdsa(alice_soukr: int, alice_verejn):
    """
    Ukazka digitalnich podpisu pomoci ECDSA.

    Alice podepise zpravu svym soukromym klicem.
    Bob over podpis pomoci Alicina verejneho klice.
    """
    zprava = "Tajemstvi je bezpecne"
    h = hash_zpravy(zprava)

    # --- Podpisova faze (Alice) ---
    # Generujeme nonce k dokud nedostaneme platny podpis (r != 0, s != 0)
    while True:
        k = random.randint(2, N - 1)
        R = skalar_nasob(k, G)
        if R is None:
            continue
        r = R[0] % N
        if r == 0:
            continue
        # s = k^-1 * (h + a*r)  mod N
        k_inv = mod_inv(k, N)
        s = (k_inv * (h + alice_soukr * r)) % N
        if s != 0:
            break

    # --- Overovaci faze (Bob) ---
    s_inv = mod_inv(s, N)
    u1 = (h * s_inv) % N           # u1 = h * s^-1
    u2 = (r * s_inv) % N           # u2 = r * s^-1

    # Overovaci bod: u1*G + u2*VK_Alice
    overovaci_bod = bod_soucet(
        skalar_nasob(u1, G),
        skalar_nasob(u2, alice_verejn)
    )

    platny = overovaci_bod is not None and overovaci_bod[0] % N == r

    print()
    print("=" * 56)
    print("  ECDSA - podpis a overeni zpravy")
    print("=" * 56)
    print(f"  Zprava   : '{zprava}'")
    print(f"  Hash (h) : {h}")
    print(f"  Nonce (k): {k}  (jednorazovy, TAJNY)")
    print(f"  Podpis   : (r={r}, s={s})")
    print(f"  Overeni  : {'PLATNY' if platny else 'NEPLATNY'}")


# ============================================================
#  VSTUPNI BOD
# ============================================================

if __name__ == "__main__":
    alice_soukr, alice_verejn = demo_ecdh()
    demo_ecdsa(alice_soukr, alice_verejn)
