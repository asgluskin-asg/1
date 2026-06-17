import pygame
import math
from config import *

# ── Font cache ────────────────────────────────────────────────────────────────

_fonts = {}

def font(size, bold=False):
    key = (size, bold)
    if key not in _fonts:
        try:
            _fonts[key] = pygame.font.SysFont("courier new", size, bold=bold)
        except Exception:
            _fonts[key] = pygame.font.SysFont("monospace", size, bold=bold)
    return _fonts[key]


# ── Low-level draw helpers ──────────────────────────────────────────────────────

def draw_rounded_rect(surf, color, rect, radius, border=0, border_color=None):
    pygame.draw.rect(surf, color, rect, border_radius=radius)
    if border and border_color:
        pygame.draw.rect(surf, border_color, rect, border, border_radius=radius)


def draw_text(surf, text, x, y, size=16, color=TEXT_BRIGHT, bold=False,
              anchor="topleft", shadow=True):
    f = font(size, bold)
    rendered = f.render(str(text), True, color)
    rect = rendered.get_rect(**{anchor: (x, y)})
    if shadow:
        sh = f.render(str(text), True, (0, 0, 0))
        surf.blit(sh, rect.move(1, 1))
    surf.blit(rendered, rect)
    return rect


# ── Table background ──────────────────────────────────────────────────────────────

def draw_table(surf):
    surf.fill(NEAR_BLACK)

    # Wood border around the whole table
    border = 18
    table_rect = pygame.Rect(border, border, WINDOW_W - border*2, WINDOW_H - border*2)
    pygame.draw.rect(surf, WOOD, table_rect, border_radius=32)
    pygame.draw.rect(surf, WOOD_DARK, table_rect, 3, border_radius=32)

    # Felt inset
    inset = 12
    felt_rect = table_rect.inflate(-inset*2, -inset*2)
    pygame.draw.rect(surf, FELT, felt_rect, border_radius=24)

    # Subtle lighter center oval for spotlight effect
    cx, cy = WINDOW_W // 2, WINDOW_H // 2
    for r in range(260, 0, -4):
        alpha = int(6 * (1 - r / 260))
        s = pygame.Surface((r*2, r*2), pygame.SRCALPHA)
        pygame.draw.ellipse(s, (*FELT_LIGHT, alpha), s.get_rect())
        surf.blit(s, (cx - r, cy - r), special_flags=pygame.BLEND_RGBA_ADD)

    # Subtle vignette
    vsurf = pygame.Surface((WINDOW_W, WINDOW_H), pygame.SRCALPHA)
    for r in range(max(WINDOW_W, WINDOW_H) // 2, 0, -8):
        alpha = int(max(0, 40 * (r / (max(WINDOW_W, WINDOW_H) // 2) - 0.4)))
        pygame.draw.ellipse(vsurf, (0, 0, 0, alpha),
                            (cx - r, cy - r, r*2, r*2))
    surf.blit(vsurf, (0, 0))

    return felt_rect


def draw_bet_zones(surf, bets, active_bet_zone, state):
    """Draw ANTE, PAIR PLUS, SIX CARD circles."""
    zones = _bet_zone_positions()
    for key, (x, y, label1, label2) in zones.items():
        is_active = (key == active_bet_zone) and state == "BETTING"
        amount = bets.get(key, 0)
        _draw_bet_circle(surf, x, y, label1, label2, amount, is_active, key == "ante")
    return zones


def _bet_zone_positions():
    cx = WINDOW_W // 2
    by = WINDOW_H - 165
    return {
        "pair_plus": (cx - 240, by, "PAIR", "PLUS"),
        "ante":      (cx,       by, "ANTE", ""),
        "six_card":  (cx + 240, by, "6 CARD", "BONUS"),
    }


def _draw_bet_circle(surf, x, y, label1, label2, amount, is_active, is_main):
    r = BET_CIRCLE_R
    ring_color = GOLD if is_active else AMBER_DIM
    ring_w = 3 if is_active else 2
    pygame.draw.circle(surf, ring_color, (x, y), r + 2, ring_w)

    fill_color = (40, 60, 40) if is_active else (28, 44, 28)
    pygame.draw.circle(surf, fill_color, (x, y), r)

    label_color = GOLD if is_active else TEXT_DIM
    draw_text(surf, label1, x, y - 10, 11, label_color, bold=True, anchor="center", shadow=True)
    if label2:
        draw_text(surf, label2, x, y + 2, 11, label_color, bold=True, anchor="center", shadow=True)

    if amount > 0:
        _draw_chip_stack(surf, x, y + r + 24, amount)


def _draw_chip_stack(surf, cx, cy, amount):
    if amount >= 100:
        color, tc = CHIP_BLACK, TEXT_BRIGHT
    elif amount >= 25:
        color, tc = CHIP_GREEN, TEXT_BRIGHT
    else:
        color, tc = CHIP_WHITE, BLACK
    pygame.draw.circle(surf, color, (cx, cy), 20)
    pygame.draw.circle(surf, GOLD_DARK, (cx, cy), 20, 2)
    draw_text(surf, f"${amount}", cx, cy, 11, tc, bold=True, anchor="center", shadow=False)


# ── Cards ──────────────────────────────────────────────────────────────────────

def _card_rect(x, y):
    return pygame.Rect(x - CARD_W//2, y - CARD_H//2, CARD_W, CARD_H)


def draw_card(surf, card, x, y, face_up=True, highlight=False):
    rect = _card_rect(x, y)
    if face_up and card is not None:
        _draw_card_face(surf, card, rect, highlight)
    else:
        _draw_card_back(surf, rect)


def _draw_card_face(surf, card, rect, highlight):
    sh = rect.move(3, 3)
    pygame.draw.rect(surf, (0, 0, 0, 120), sh, border_radius=CARD_RADIUS)

    face_color = (255, 245, 220) if highlight else CARD_FACE
    draw_rounded_rect(surf, face_color, rect, CARD_RADIUS)
    draw_rounded_rect(surf, (180, 168, 148), rect, CARD_RADIUS, border=1)

    suit_color = RED_SUIT if card.is_red() else BLACK_SUIT

    draw_text(surf, card.rank, rect.left + 5, rect.top + 3, 14, suit_color, bold=True, shadow=False)
    draw_text(surf, card.suit, rect.left + 5, rect.top + 17, 13, suit_color, shadow=False)

    draw_text(surf, card.rank, rect.right - 5, rect.bottom - 5, 11, suit_color, bold=True,
              anchor="bottomright", shadow=False)
    draw_text(surf, card.suit, rect.right - 5, rect.bottom - 18, 11, suit_color,
              anchor="bottomright", shadow=False)

    draw_text(surf, card.suit, rect.centerx, rect.centery, 30, suit_color,
              anchor="center", shadow=False)


def _draw_card_back(surf, rect):
    sh = rect.move(3, 3)
    pygame.draw.rect(surf, (0, 0, 0), sh, border_radius=CARD_RADIUS)
    draw_rounded_rect(surf, CARD_BACK, rect, CARD_RADIUS)
    draw_rounded_rect(surf, CARD_BACK2, rect, CARD_RADIUS, border=1)

    inner = rect.inflate(-10, -10)
    for row in range(5):
        for col in range(3):
            dx = inner.left + col * (inner.width // 2) + (row % 2) * (inner.width // 4)
            dy = inner.top + row * (inner.height // 4)
            pygame.draw.rect(surf, (110, 34, 34), (dx, dy, 5, 5), border_radius=1)


def draw_card_area(surf, cards, cx, y, face_up=True, highlights=None, spread=100):
    """Draw 3 cards centered at cx, y."""
    if highlights is None:
        highlights = [False] * len(cards)
    n = len(cards)
    positions = []
    for i, card in enumerate(cards):
        x = cx - (n - 1) * spread // 2 + i * spread
        draw_card(surf, card, x, y, face_up=face_up, highlight=highlights[i] if i < len(highlights) else False)
        positions.append((x, y))
    return positions


def draw_card_slot(surf, x, y):
    """Empty card placeholder."""
    rect = _card_rect(x, y)
    draw_rounded_rect(surf, FELT_DARK, rect, CARD_RADIUS)
    pygame.draw.rect(surf, (40, 60, 40), rect, 1, border_radius=CARD_RADIUS)


# ── HUD elements ─────────────────────────────────────────────────────────────────

def draw_bankroll(surf, chips, last_delta=0):
    x, y = WINDOW_W - 20, 20
    draw_text(surf, "BANKROLL", x, y, 11, TEXT_DIM, anchor="topright")
    draw_text(surf, f"${chips:,}", x, y + 14, 22, TEXT_BRIGHT, bold=True, anchor="topright")
    if last_delta != 0:
        color = TEXT_GREEN if last_delta > 0 else TEXT_RED
        sign  = "+" if last_delta > 0 else ""
        draw_text(surf, f"{sign}${last_delta:,}", x, y + 38, 14, color, anchor="topright")


def draw_chip_selector(surf, active_chip_idx, state):
    if state != "BETTING":
        return
    x, y = 30, WINDOW_H - 80
    draw_text(surf, "SELECT CHIP", x, y - 18, 10, TEXT_DIM)
    for i, (val, color, label) in enumerate(CHIPS):
        cx = x + 28 + i * 68
        cy = y
        selected = (i == active_chip_idx)
        outline = GOLD if selected else GOLD_DARK
        pygame.draw.circle(surf, color, (cx, cy), 24)
        pygame.draw.circle(surf, outline, (cx, cy), 24, 3 if selected else 1)
        draw_text(surf, label, cx, cy, 10, WHITE if color != CHIP_WHITE else BLACK,
                  bold=selected, anchor="center", shadow=False)
        draw_text(surf, str(i+1), cx, cy + 30, 10, TEXT_DIM, anchor="center", shadow=False)


def draw_buttons(surf, state, has_ante):
    buttons = []
    cx = WINDOW_W // 2

    if state == "BETTING":
        if has_ante:
            b = _button(surf, cx, WINDOW_H - 50, "DEAL   [SPACE]", CHIP_GREEN, WHITE)
        else:
            b = _button(surf, cx, WINDOW_H - 50, "DEAL   [SPACE]", (50, 70, 50), (100, 120, 100))
        buttons.append(("deal", b))
        bc = _button(surf, cx + 160, WINDOW_H - 50, "CLEAR  [C]", (70, 40, 40), TEXT_DIM)
        buttons.append(("clear", bc))

    elif state == "PLAYER_DECISION":
        bf = _button(surf, cx - 100, WINDOW_H - 50, "FOLD   [F]", (90, 28, 28), WHITE)
        bp = _button(surf, cx + 100, WINDOW_H - 50, "PLAY   [P]", CHIP_GREEN, WHITE)
        buttons.append(("fold", bf))
        buttons.append(("play", bp))

    elif state in ("PAYOUT", "GAME_OVER"):
        bn = _button(surf, cx, WINDOW_H - 50, "NEW HAND  [SPACE]", CHIP_GREEN, WHITE)
        buttons.append(("new_hand", bn))
        if state == "GAME_OVER":
            br = _button(surf, cx, WINDOW_H - 95, "RESET CHIPS  [R]", (60, 40, 90), TEXT_BRIGHT)
            buttons.append(("reset", br))

    return buttons


def _button(surf, cx, cy, label, bg, fg):
    tw = font(14, True).size(label)[0]
    rect = pygame.Rect(cx - tw//2 - 18, cy - 18, tw + 36, 36)
    draw_rounded_rect(surf, bg, rect, 6)
    draw_rounded_rect(surf, GOLD_DARK, rect, 6, border=1)
    draw_text(surf, label, cx, cy, 14, fg, bold=True, anchor="center", shadow=True)
    return rect


# ── Payout overlay ──────────────────────────────────────────────────────────────────

def draw_payout_banner(surf, lines):
    """lines = list of (text, color) tuples."""
    if not lines:
        return
    padding = 16
    line_h = 28
    total_h = len(lines) * line_h + padding * 2
    total_w = max(font(16, True).size(t)[0] for t, _ in lines) + padding * 4
    x = WINDOW_W // 2 - total_w // 2
    y = WINDOW_H // 2 - total_h // 2 - 30

    bg = pygame.Surface((total_w, total_h), pygame.SRCALPHA)
    bg.fill((0, 0, 0, 190))
    surf.blit(bg, (x, y))
    pygame.draw.rect(surf, GOLD_DARK, (x, y, total_w, total_h), 1, border_radius=4)

    for i, (text, color) in enumerate(lines):
        ty = y + padding + i * line_h
        tw = font(16, True).size(text)[0]
        draw_text(surf, text, WINDOW_W // 2 - tw // 2, ty, 16, color, bold=True, shadow=True)


def draw_hand_label(surf, label, cx, y, color=TEXT_DIM):
    draw_text(surf, label, cx, y, 12, color, anchor="center")


def draw_dealer_status(surf, qualified, x, y):
    if qualified is None:
        return
    text  = "DEALER QUALIFIES" if qualified else "DEALER DOES NOT QUALIFY"
    color = TEXT_RED if not qualified else TEXT_BRIGHT
    draw_text(surf, text, x, y, 12, color, anchor="center", shadow=True)


def draw_game_over(surf):
    cx, cy = WINDOW_W // 2, WINDOW_H // 2 - 60
    draw_text(surf, "BUSTED", cx, cy, 48, TEXT_RED, bold=True, anchor="center")
    draw_text(surf, "Out of chips.", cx, cy + 52, 18, TEXT_DIM, anchor="center")


# ── Instruction strip ──────────────────────────────────────────────────────────────────

def draw_instructions(surf, state):
    hints = {
        "BETTING":         "Click a bet circle to add chips  |  1/2/3 = chip value  |  SPACE = deal  |  C = clear",
        "PLAYER_DECISION": "F = Fold  |  P = Play (match the Ante)",
        "PAYOUT":          "SPACE = new hand",
        "GAME_OVER":       "R = reset chips",
    }
    text = hints.get(state, "")
    if text:
        draw_text(surf, text, WINDOW_W // 2, WINDOW_H - 14, 10, TEXT_DIM,
                  anchor="midbottom", shadow=False)


# ── Paytable sidebar ──────────────────────────────────────────────────────────────

def draw_paytables(surf):
    x, y = 22, 80
    draw_text(surf, "PAIR PLUS", x, y, 10, AMBER_DIM, bold=True)
    pairs = [
        ("Str Flush", "40:1"),
        ("3 of Kind", "30:1"),
        ("Straight",  "6:1"),
        ("Flush",     "3:1"),
        ("Pair",      "1:1"),
    ]
    for i, (hand, pay) in enumerate(pairs):
        draw_text(surf, hand, x, y + 14 + i*14, 9, TEXT_DIM)
        draw_text(surf, pay,  x + 70, y + 14 + i*14, 9, AMBER_DIM)

    y2 = y + 100
    draw_text(surf, "ANTE BONUS", x, y2, 10, AMBER_DIM, bold=True)
    ab = [
        ("Str Flush", "5:1"),
        ("3 of Kind", "4:1"),
        ("Straight",  "1:1"),
    ]
    for i, (hand, pay) in enumerate(ab):
        draw_text(surf, hand, x, y2 + 14 + i*14, 9, TEXT_DIM)
        draw_text(surf, pay,  x + 70, y2 + 14 + i*14, 9, AMBER_DIM)

    y3 = y2 + 70
    draw_text(surf, "6-CARD BONUS", x, y3, 10, AMBER_DIM, bold=True)
    scb = [
        ("Royal Fl",  "1000:1"),
        ("Str Flush", "200:1"),
        ("4 of Kind", "50:1"),
        ("Full House","25:1"),
        ("Flush",     "15:1"),
        ("Straight",  "10:1"),
        ("3 of Kind", "7:1"),
    ]
    for i, (hand, pay) in enumerate(scb):
        draw_text(surf, hand, x, y3 + 14 + i*14, 9, TEXT_DIM)
        draw_text(surf, pay,  x + 75, y3 + 14 + i*14, 9, AMBER_DIM)
