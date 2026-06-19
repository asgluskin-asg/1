import pygame

# Window
WINDOW_W = 1100
WINDOW_H = 750
FPS = 60
TITLE = "Three Card Poker"

# Colors — dingy basement palette
BLACK       = (  0,   0,   0)
NEAR_BLACK  = ( 10,  10,  10)
FELT        = ( 22,  46,  22)       # dark green felt
FELT_DARK   = ( 14,  30,  14)
FELT_LIGHT  = ( 28,  58,  28)
WOOD        = ( 42,  26,  10)       # table edge
WOOD_DARK   = ( 28,  16,   6)
CARD_FACE   = (240, 234, 214)       # aged ivory
CARD_BACK   = ( 92,  26,  26)       # dark red
CARD_BACK2  = ( 72,  18,  18)
RED_SUIT    = (180,  30,  30)
BLACK_SUIT  = ( 18,  18,  18)
GOLD        = (180, 148,  40)
GOLD_DARK   = (120,  98,  24)
CHIP_GREEN  = ( 22,  90,  22)
CHIP_RED    = (160,  28,  28)
CHIP_BLACK  = ( 30,  30,  30)
CHIP_BLUE   = ( 24,  48, 140)
CHIP_WHITE  = (158,  98,  42)
AMBER       = (220, 160,  40)
AMBER_DIM   = (140, 100,  20)
TEXT_BRIGHT = (230, 218, 180)
TEXT_DIM    = (172, 160, 115)
TEXT_RED    = (200,  60,  60)
TEXT_GREEN  = ( 60, 180,  60)
WHITE       = (255, 255, 255)
OVERLAY_BG  = (  0,   0,   0, 180)

# Card dimensions
CARD_W = 80
CARD_H = 112
CARD_RADIUS = 6

# Bet circle dimensions
BET_CIRCLE_R = 44

# Bet limits
BET_MIN = 5
BET_MAX = 200
STARTING_CHIPS = 1000

# Chip denominations  [value, color, label]
CHIPS = [
    (  5, CHIP_WHITE,  " $5"),
    ( 25, CHIP_GREEN,  "$25"),
    (100, CHIP_BLACK,  "$100"),
]

# ── Paytables ──────────────────────────────────────────────────────────────

# Ante Bonus (paid on player straight or better, regardless of dealer qualify)
ANTE_BONUS = {
    "straight_flush": 5,
    "three_of_a_kind": 4,
    "straight": 1,
}

# Pair Plus
PAIR_PLUS = {
    "straight_flush": 40,
    "three_of_a_kind": 30,
    "straight": 6,
    "flush": 3,
    "pair": 1,
}

# Six Card Bonus (best 5-card hand from player 3 + dealer 3)
SIX_CARD_BONUS = {
    "royal_flush": 1000,
    "straight_flush": 200,
    "four_of_a_kind": 50,
    "full_house": 25,
    "flush": 15,
    "straight": 10,
    "three_of_a_kind": 7,
}

# Save file location
import os
SAVE_DIR  = os.path.expanduser("~/.three-card-poker")
SAVE_FILE = os.path.join(SAVE_DIR, "save.json")
