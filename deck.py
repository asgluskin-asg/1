import random
from itertools import combinations

RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A']
SUITS = ['♠','♥','♦','♣']
RANK_VAL = {r: i for i, r in enumerate(RANKS, 2)}   # 2→2 … A→14

class Card:
    def __init__(self, rank, suit):
        self.rank = rank
        self.suit = suit
        self.val  = RANK_VAL[rank]

    def is_red(self):
        return self.suit in ('♥', '♦')

    def __repr__(self):
        return f"{self.rank}{self.suit}"


class Deck:
    def __init__(self):
        self.cards = [Card(r, s) for s in SUITS for r in RANKS]
        random.shuffle(self.cards)

    def deal(self, n=1):
        return [self.cards.pop() for _ in range(n)]


# ── Three-card hand evaluation ─────────────────────────────────────────────────────────

HAND_RANKS_3 = [
    "straight_flush",
    "three_of_a_kind",
    "straight",
    "flush",
    "pair",
    "high_card",
]
HAND_RANK_3_VAL = {h: i for i, h in enumerate(HAND_RANKS_3)}


def _rank_vals(cards):
    return sorted((c.val for c in cards), reverse=True)


def eval_three_card(cards):
    """Return (hand_name, tiebreak_tuple) for a 3-card hand."""
    vals   = _rank_vals(cards)
    suits  = [c.suit for c in cards]
    is_fl  = len(set(suits)) == 1
    sorted_vals = sorted(vals)
    # Straight: consecutive, also A-2-3
    gaps    = sorted_vals[2] - sorted_vals[0]
    is_str  = (len(set(vals)) == 3 and gaps == 2)
    # Special: A-2-3
    if set(sorted_vals) == {2, 3, 14}:
        is_str = True

    counts  = {}
    for v in vals:
        counts[v] = counts.get(v, 0) + 1
    freq = sorted(counts.values(), reverse=True)

    if is_fl and is_str:
        name = "straight_flush"
    elif freq == [3]:
        name = "three_of_a_kind"
    elif is_str:
        name = "straight"
    elif is_fl:
        name = "flush"
    elif freq[0] == 2:
        name = "pair"
        # tiebreak: pair rank first, then kicker
        pair_r = [v for v, c in counts.items() if c == 2][0]
        kick_r = [v for v, c in counts.items() if c == 1][0]
        return name, (pair_r, kick_r)
    else:
        name = "high_card"

    return name, tuple(vals)


def compare_three_card(hand_a, hand_b):
    """Return 1 if a wins, -1 if b wins, 0 tie."""
    na, ta = eval_three_card(hand_a)
    nb, tb = eval_three_card(hand_b)
    ra, rb = HAND_RANK_3_VAL[na], HAND_RANK_3_VAL[nb]
    if ra != rb:
        return 1 if ra < rb else -1   # lower index = better hand
    # same category — tiebreak
    if ta > tb: return  1
    if ta < tb: return -1
    return 0


def dealer_qualifies(hand):
    """Dealer must have Queen high or better."""
    name, tiebreak = eval_three_card(hand)
    if name != "high_card":
        return True
    return tiebreak[0] >= RANK_VAL['Q']


# ── Five-card hand evaluation (for Six Card Bonus) ────────────────────────────

HAND_RANKS_5 = [
    "royal_flush",
    "straight_flush",
    "four_of_a_kind",
    "full_house",
    "flush",
    "straight",
    "three_of_a_kind",
    "two_pair",
    "pair",
    "high_card",
]


def _is_straight_5(vals):
    s = sorted(set(vals))
    if len(s) < 5:
        return False
    if s[-1] - s[0] == 4:
        return True
    # A-2-3-4-5
    if set(s) >= {2, 3, 4, 5, 14}:
        return True
    return False


def eval_five_card(cards):
    """Return the best 5-card hand name from a list of 5 cards."""
    vals  = [c.val for c in cards]
    suits = [c.suit for c in cards]
    is_fl = len(set(suits)) == 1
    is_st = _is_straight_5(vals)
    counts = {}
    for v in vals:
        counts[v] = counts.get(v, 0) + 1
    freq = sorted(counts.values(), reverse=True)

    if is_fl and is_st:
        if sorted(vals) == [10, 11, 12, 13, 14] or set(vals) == {10, 11, 12, 13, 14}:
            return "royal_flush"
        return "straight_flush"
    if freq[0] == 4:   return "four_of_a_kind"
    if freq == [3, 2]: return "full_house"
    if is_fl:          return "flush"
    if is_st:          return "straight"
    if freq[0] == 3:   return "three_of_a_kind"
    if freq[:2] == [2, 2]: return "two_pair"
    if freq[0] == 2:   return "pair"
    return "high_card"


def best_five_card(cards):
    """Return best 5-card hand name from a pool of cards (3-6)."""
    if len(cards) <= 5:
        return eval_five_card(cards)
    best = None
    best_rank = 999
    for combo in combinations(cards, 5):
        name = eval_five_card(list(combo))
        rank = HAND_RANKS_5.index(name)
        if rank < best_rank:
            best_rank = rank
            best = name
    return best


def hand_display_name(name):
    return {
        "straight_flush":  "Straight Flush",
        "three_of_a_kind": "Three of a Kind",
        "straight":        "Straight",
        "flush":           "Flush",
        "pair":            "Pair",
        "high_card":       "High Card",
        "royal_flush":     "Royal Flush",
        "four_of_a_kind":  "Four of a Kind",
        "full_house":      "Full House",
        "two_pair":        "Two Pair",
    }.get(name, name.replace("_", " ").title())
