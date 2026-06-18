from deck import (
    Deck, eval_three_card, compare_three_card, dealer_qualifies,
    best_five_card, hand_display_name
)
from config import (
    ANTE_BONUS, PAIR_PLUS, SIX_CARD_BONUS,
    BET_MIN, BET_MAX, CHIPS, TEXT_BRIGHT, TEXT_GREEN, TEXT_RED, TEXT_DIM,
    GOLD, AMBER, BET_CIRCLE_R
)
import save as save_module

STATES = ["BETTING", "PLAYER_DECISION", "PAYOUT", "GAME_OVER"]


class Game:
    def __init__(self):
        self.chips = save_module.load()
        self.reset_hand()
        self.active_chip_idx    = 0
        self.active_bet_zone    = "ante"
        self.last_delta         = 0
        self.payout_lines       = []
        self.dealer_qualified   = None
        self.hand_history       = []   # list of net ints, newest first
        self.last_bets          = {"ante": 0, "pair_plus": 0, "six_card": 0}
        self._chips_before_hand = 0

    # ── State transitions ─────────────────────────────────────────────────────────

    def reset_hand(self):
        self.state         = "BETTING"
        self.bets          = {"ante": 0, "pair_plus": 0, "six_card": 0}
        self.play_bet      = 0
        self.player_cards  = []
        self.dealer_cards  = []
        self.dealer_face_up = False
        self.deck          = None
        self.payout_lines  = []
        self.dealer_qualified = None

    def deal(self):
        if self.bets["ante"] == 0:
            return False
        self._chips_before_hand = self.chips + sum(self.bets.values())
        self.last_bets = dict(self.bets)
        self.deck = Deck()
        self.player_cards = self.deck.deal(3)
        self.dealer_cards = self.deck.deal(3)
        self.dealer_face_up = False
        self.state = "PLAYER_DECISION"
        return True

    def fold(self):
        if self.state != "PLAYER_DECISION":
            return
        delta = 0
        lines = []

        # Pair plus resolves independently
        pp = self._resolve_pair_plus()
        delta += pp
        if self.bets["pair_plus"] > 0:
            lines += self._pp_lines(pp)

        # Six card bonus resolves independently
        sc = self._resolve_six_card()
        delta += sc
        if self.bets["six_card"] > 0:
            lines += self._sc_lines(sc)

        # Ante forfeited — already deducted at bet time
        lines.append((f"FOLD — Ante forfeited  -${self.bets['ante']}", TEXT_RED))

        self.dealer_face_up = True
        self.last_delta = delta
        self.chips += delta
        self._record_hand()
        self.payout_lines = lines
        self.state = "PAYOUT" if self.chips > 0 else "GAME_OVER"
        save_module.save(self.chips)

    def play(self):
        if self.state != "PLAYER_DECISION":
            return
        self.play_bet = self.bets["ante"]   # play = match ante
        if self.chips < self.play_bet:
            self.play_bet = self.chips
        self.chips -= self.play_bet

        delta = 0
        lines = []

        self.dealer_face_up = True
        qualifies = dealer_qualifies(self.dealer_cards)
        self.dealer_qualified = qualifies

        p_name, _ = eval_three_card(self.player_cards)
        d_name, _ = eval_three_card(self.dealer_cards)

        if not qualifies:
            # ante pays 1:1 (return stake + winnings), play pushes (return stake only)
            delta += self.bets["ante"] * 2
            delta += self.play_bet
            lines.append(("Dealer does not qualify", TEXT_DIM))
            lines.append((f"Ante wins 1:1  +${self.bets['ante']}", TEXT_GREEN))
            lines.append(("Play — Push", TEXT_DIM))
        else:
            result = compare_three_card(self.player_cards, self.dealer_cards)
            if result == 1:
                delta += self.bets["ante"] * 2
                delta += self.play_bet * 2
                lines.append((f"You win! ({hand_display_name(p_name)})", TEXT_GREEN))
                lines.append((f"Ante + Play win 1:1  +${self.bets['ante'] + self.play_bet}", TEXT_GREEN))
            elif result == -1:
                lines.append((f"Dealer wins ({hand_display_name(d_name)})", TEXT_RED))
                lines.append((f"Ante + Play lost  -${self.bets['ante'] + self.play_bet}", TEXT_RED))
            else:
                delta += self.bets["ante"] + self.play_bet
                lines.append(("Tie — Push", TEXT_DIM))

        # Ante bonus (paid on straight or better regardless of result)
        ab = self._resolve_ante_bonus()
        if ab > 0:
            delta += ab
            lines.append((f"Ante Bonus ({hand_display_name(p_name)})  +${ab}", GOLD))

        # Pair plus
        pp = self._resolve_pair_plus()
        delta += pp
        if self.bets["pair_plus"] > 0:
            lines += self._pp_lines(pp)

        # Six card bonus
        sc = self._resolve_six_card()
        delta += sc
        if self.bets["six_card"] > 0:
            lines += self._sc_lines(sc)

        self.last_delta = delta
        self.chips += delta
        self._record_hand()
        self.payout_lines = lines
        self.state = "PAYOUT" if self.chips > 0 else "GAME_OVER"
        save_module.save(self.chips)

    def _record_hand(self):
        net = self.chips - self._chips_before_hand
        self.hand_history.insert(0, net)
        if len(self.hand_history) > 50:
            self.hand_history.pop()

    # ── Bet helpers ───────────────────────────────────────────────────────────

    def add_chip(self):
        val = CHIPS[self.active_chip_idx][0]
        zone = self.active_bet_zone
        current = self.bets[zone]
        if current + val > BET_MAX:
            return
        if val > self.chips:
            return
        self.bets[zone] += val
        self.chips -= val

    def clear_bets(self):
        for k in self.bets:
            self.chips += self.bets[k]
            self.bets[k] = 0

    def _total_bets(self):
        return sum(self.bets.values())

    # ── Payout calculations ───────────────────────────────────────────────────────

    def _resolve_ante_bonus(self):
        name, _ = eval_three_card(self.player_cards)
        mult = ANTE_BONUS.get(name, 0)
        if mult == 0:
            return 0
        return self.bets["ante"] * mult

    def _resolve_pair_plus(self):
        if self.bets["pair_plus"] == 0:
            return 0
        name, _ = eval_three_card(self.player_cards)
        mult = PAIR_PLUS.get(name, 0)
        if mult == 0:
            return 0   # stake already deducted at bet time
        return self.bets["pair_plus"] * (mult + 1)   # return stake + winnings

    def _resolve_six_card(self):
        if self.bets["six_card"] == 0:
            return 0
        combined = self.player_cards + self.dealer_cards
        name = best_five_card(combined)
        mult = SIX_CARD_BONUS.get(name, 0)
        if mult == 0:
            return 0   # stake already deducted at bet time
        return self.bets["six_card"] * (mult + 1)   # return stake + winnings

    def _pp_lines(self, net):
        name, _ = eval_three_card(self.player_cards)
        mult = PAIR_PLUS.get(name, 0)
        if mult == 0:
            return [(f"Pair Plus — lost  -${self.bets['pair_plus']}", TEXT_RED)]
        profit = self.bets['pair_plus'] * mult
        return [(f"Pair Plus ({hand_display_name(name)} {mult}:1)  +${profit}", TEXT_GREEN)]

    def _sc_lines(self, net):
        combined = self.player_cards + self.dealer_cards
        name = best_five_card(combined)
        mult = SIX_CARD_BONUS.get(name, 0)
        if mult == 0:
            return [(f"6-Card Bonus — lost  -${self.bets['six_card']}", TEXT_RED)]
        return [(f"6-Card ({hand_display_name(name)} {mult}:1)  +${self.bets['six_card']*mult}", TEXT_GREEN)]

    def rebet(self):
        if self.state != "BETTING" or self.last_bets["ante"] == 0:
            return
        self.clear_bets()
        for zone, amount in self.last_bets.items():
            if amount == 0:
                continue
            if self.chips < amount:
                self.clear_bets()
                return
            self.bets[zone] = amount
            self.chips -= amount

    def reset_chips(self):
        self.chips = save_module.reset()
        self.hand_history = []
        self.last_bets = {"ante": 0, "pair_plus": 0, "six_card": 0}
        self.reset_hand()

    # ── Click detection ─────────────────────────────────────────────────────────

    def handle_click(self, pos, zones):
        if self.state != "BETTING":
            return
        for key, (x, y, *_) in zones.items():
            dx, dy = pos[0] - x, pos[1] - y
            if dx*dx + dy*dy <= (BET_CIRCLE_R + 4)**2:
                if self.active_bet_zone == key:
                    self.add_chip()
                else:
                    self.active_bet_zone = key

    def handle_key(self, key):
        import pygame
        if self.state == "BETTING":
            if key == pygame.K_1: self.active_chip_idx = 0
            if key == pygame.K_2: self.active_chip_idx = 1
            if key == pygame.K_3: self.active_chip_idx = 2
            if key == pygame.K_SPACE and self.bets["ante"] > 0: self.deal()
            if key == pygame.K_c: self.clear_bets()
            if key == pygame.K_r: self.rebet()
            if key == pygame.K_a:
                self.active_bet_zone = "ante"
            if key == pygame.K_q:
                self.active_bet_zone = "pair_plus"
            if key == pygame.K_s:
                self.active_bet_zone = "six_card"
            if key == pygame.K_RETURN:
                self.add_chip()
        elif self.state == "PLAYER_DECISION":
            if key == pygame.K_f: self.fold()
            if key == pygame.K_p: self.play()
        elif self.state in ("PAYOUT", "GAME_OVER"):
            if key == pygame.K_SPACE: self.reset_hand()
            if key == pygame.K_r: self.reset_chips()

    def handle_button_click(self, action):
        if action == "deal":     self.deal()
        elif action == "fold":   self.fold()
        elif action == "play":   self.play()
        elif action == "clear":  self.clear_bets()
        elif action == "rebet":  self.rebet()
        elif action == "new_hand": self.reset_hand()
        elif action == "reset":  self.reset_chips()
