#!/usr/bin/env python3
"""
Three Card Poker — Mac desktop game
Run: python3 main.py
Requires: pip install pygame
"""
import pygame
import sys

from config import *
import render as R
from game import Game


def main():
    pygame.init()
    pygame.display.set_caption(TITLE)
    screen = pygame.display.set_mode((WINDOW_W, WINDOW_H), pygame.RESIZABLE)
    clock  = pygame.time.Clock()

    game = Game()

    while True:
        # ── Events ──────────────────────────────────────────────────────────────
        zones = {}   # populated each frame after draw_bet_zones
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            elif event.type == pygame.KEYDOWN:
                game.handle_key(event.key)

            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                # Check bet zones
                if game.state == "BETTING":
                    game.handle_click(event.pos, _last_zones)

                # Check buttons
                for action, rect in _last_buttons:
                    if rect.collidepoint(event.pos):
                        game.handle_button_click(action)

        # ── Draw ───────────────────────────────────────────────────────────────────
        R.draw_table(screen)
        R.draw_paytables(screen)

        zones = R.draw_bet_zones(screen, game.bets, game.active_bet_zone, game.state)
        _last_zones.clear()
        _last_zones.update(zones)

        # Card slot placeholders (always shown)
        W, H = screen.get_size()
        cx = W // 2
        dealer_y  = int(H * 0.267)   # ~200 at default 750h
        player_y  = int(H * 0.560)   # ~420 at default 750h
        spread    = 100

        for i in range(3):
            dx = cx - spread + i * spread
            R.draw_card_slot(screen, dx, dealer_y)
            R.draw_card_slot(screen, dx, player_y)

        # Dealer cards
        if game.dealer_cards:
            R.draw_card_area(
                screen, game.dealer_cards, cx, dealer_y,
                face_up=game.dealer_face_up, spread=spread
            )

        # Player cards
        if game.player_cards:
            R.draw_card_area(
                screen, game.player_cards, cx, player_y,
                face_up=True, spread=spread
            )

        # Labels
        R.draw_hand_label(screen, "DEALER", cx, dealer_y - 75)
        R.draw_hand_label(screen, "YOUR HAND", cx, player_y - 75)

        if game.state in ("PAYOUT", "GAME_OVER") and game.dealer_qualified is not None:
            R.draw_dealer_status(screen, game.dealer_qualified, cx, dealer_y - 58)

        # Hand name labels after reveal
        if game.state in ("PAYOUT", "GAME_OVER") and game.dealer_face_up:
            from deck import eval_three_card, hand_display_name
            if game.dealer_cards:
                dn, _ = eval_three_card(game.dealer_cards)
                R.draw_hand_label(screen, hand_display_name(dn), cx, dealer_y + 70, color=TEXT_DIM)
            if game.player_cards:
                pn, _ = eval_three_card(game.player_cards)
                R.draw_hand_label(screen, hand_display_name(pn), cx, player_y + 70, color=TEXT_DIM)

        # Play bet indicator
        if game.play_bet > 0:
            R.draw_text(screen, f"PLAY  ${game.play_bet}", cx, player_y - 55, 13,
                        R.AMBER, anchor="center")

        if game.state == "GAME_OVER":
            R.draw_game_over(screen)

        # HUD
        R.draw_bankroll(screen, game.chips, game.last_delta if game.state in ("PAYOUT", "GAME_OVER") else 0)
        R.draw_chip_selector(screen, game.active_chip_idx, game.state)

        R.draw_hand_history(screen, game.hand_history)

        buttons = R.draw_buttons(screen, game.state, game.bets["ante"] > 0,
                                 has_rebet=game.last_bets["ante"] > 0)
        _last_buttons.clear()
        _last_buttons.extend(buttons)

        R.draw_instructions(screen, game.state)

        pygame.display.flip()
        clock.tick(FPS)


_last_zones   = {}
_last_buttons = []

if __name__ == "__main__":
    main()
