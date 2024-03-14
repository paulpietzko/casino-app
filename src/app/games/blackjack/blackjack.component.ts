import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Card, Rank } from '../../models/card.model';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss'],
})
export class BlackjackComponent {
  balance = 1790;
  playerCards: Card[] = [];
  dealerCards: Card[] = [];
  currentBet = 0;
  inGame = false;

  constructor(private gameService: GameService, private snackBar: MatSnackBar) {}

  placeBet(amount: number) {
    if (this.balance < amount) {
      this.snackBar.open('Nicht genug Guthaben!', 'Schliessen', { duration: 5000 });
      return;
    }

    if (this.inGame) {
      this.snackBar.open('Spiel bereits gestartet!', 'Schliessen', { duration: 5000 });
      return;
    }

    this.currentBet = amount;
    this.balance -= amount;
    this.startGame();
  }

  startGame() {
    this.playerCards = [
      this.gameService.dealCard(),
      this.gameService.dealCard(),
    ];
    this.dealerCards = [
      this.gameService.dealCard(),
      this.gameService.dealCard(),
    ];
    this.inGame = true;
    // Hier könnte man weitere Logik hinzufügen, z.B. sofortiges Überprüfen auf Blackjack
  }

  hit() {
    if (!this.inGame) {
      this.snackBar.open('Bitte setzen Sie zuerst einen Einsatz!', 'Schliessen', { duration: 5000 });
      return;
    }

    this.playerCards.push(this.gameService.dealCard());

    if (this.calculateScore(this.playerCards) > 21) {
      this.snackBar.open('Bust!', 'Schliessen', { duration: 5000 });
      this.endGame();
    }
  }

  stand() {
    if (!this.inGame) {
      this.snackBar.open('Bitte setzen Sie zuerst einen Einsatz!', 'Schliessen', { duration: 5000 });
      return;
    }

    let dealerScore = this.calculateScore(this.dealerCards);
    while (dealerScore < 17) {
      this.dealerCards.push(this.gameService.dealCard());
      dealerScore = this.calculateScore(this.dealerCards);
    }

    this.resolveGame();
  }

  calculateScore(cards: Card[]): number {
    let score = 0;
    let aces = 0;

    for (const card of cards) {
      if (card.rank === Rank.Ace) {
        aces += 1;
        score += 11;
      } else {
        score += card.rank;
      }
    }

    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }

    return score;
  }

  resolveGame() {
    const playerScore = this.calculateScore(this.playerCards);
    const dealerScore = this.calculateScore(this.dealerCards);

    if (playerScore > 21 || (dealerScore > playerScore && dealerScore <= 21)) {
      this.snackBar.open('Sie haben verlorenz!', 'Schliessen', { duration: 5000 });
    } else if (playerScore === dealerScore) {
      this.snackBar.open('Unentschieden!', 'Schliessen', { duration: 5000 });
      this.balance += this.currentBet;
    } else {
      this.snackBar.open('Sie haben gewonnen!', 'Schliessen', { duration: 5000 });
      this.balance += this.currentBet * 2;
    }

    this.endGame();
  }

  endGame() {
    this.inGame = false;
    this.currentBet = 0;
    // Hier könnten Sie die Karten zurücksetzen oder ähnliche Aufräumarbeiten durchführen
  }
}
