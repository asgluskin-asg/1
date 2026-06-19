# Three Card Poker

Standalone desktop Three Card Poker for Mac. Dingy basement casino aesthetic. No sound. Full casino rules.

## Setup

```bash
pip install pygame
python3 main.py
```

## Rules

**Ante** is required. **Pair Plus** and **6-Card Bonus** are optional side bets.

After seeing your 3 cards: **Fold** (lose Ante) or **Play** (match the Ante).

Dealer must have Queen-high or better to qualify.

### Ante Bonus (paid on straight or better regardless of result)
| Hand | Pays |
|------|------|
| Straight Flush | 5:1 |
| Three of a Kind | 4:1 |
| Straight | 1:1 |

### Pair Plus
| Hand | Pays |
|------|------|
| Straight Flush | 40:1 |
| Three of a Kind | 30:1 |
| Straight | 6:1 |
| Flush | 3:1 |
| Pair | 1:1 |

### Six Card Bonus (best 5-card hand from your 3 + dealer's 3)
| Hand | Pays |
|------|------|
| Royal Flush | 1000:1 |
| Straight Flush | 200:1 |
| Four of a Kind | 50:1 |
| Full House | 25:1 |
| Flush | 15:1 |
| Straight | 10:1 |
| Three of a Kind | 7:1 |

## Controls

| Key | Action |
|-----|--------|
| `1` / `2` / `3` | Select chip ($5 / $25 / $100) |
| Click bet circle | Place chip on that spot |
| `SPACE` | Deal / New Hand |
| `F` | Fold |
| `P` | Play |
| `C` | Clear all bets |
| `R` | Reset chips (Game Over screen) |

Bankroll is saved to `~/.three-card-poker/save.json` and persists between sessions.
