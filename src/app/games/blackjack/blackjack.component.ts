import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService, Card } from '../../services/blackjack.service';
import { JetonService } from '../../services/jeton.service';

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
  public playerHand: Card[] = [];
  public dealerHand: Card[] = [];
  public isGameOver: boolean = false;
  public playerDone: boolean = false;
  public jetonValues = [5, 10, 20, 50, 100];

  constructor(
    private gameService: GameService, 
    public jetonService: JetonService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame(): void {
    this.gameService.newGame();    
    const card1 = this.gameService.dealCard();
    const card2 = this.gameService.dealCard();
    const dealerCard = this.gameService.dealCard();

    if (card1 && card2 && dealerCard) {
      this.playerHand = [card1, card2];
      this.dealerHand = [dealerCard];
      this.isGameOver = false;
      this.playerDone = false;
    } else {
      this.snackBar.open('Fehler beim Starten eines neuen Spiels', 'OK', { duration: 3000 });
    }
  }

  // Jetons
  onDragStart(event: DragEvent): void {
    this.jetonService.onDragStart(event);
  }

  onDragOver(event: DragEvent): void {
    this.jetonService.onDragOver(event);
  }
  
  onDrop(event: DragEvent): void {
    this.jetonService.onDrop(event, this.snackBar);
  }

  removeJeton(index: number): void {
    this.jetonService.removeJeton(index);
    this.snackBar.open('Jeton entfernt', 'OK', { duration: 3000 });
  }

  get setJetons(): number[] {
    return this.jetonService.getSetJetons();
  }
  
  // Game Logic

  hit(): void {
    if (!this.isGameOver && !this.playerDone) {
      const card = this.gameService.dealCard();
      if (card) {
        this.playerHand.push(card);
        if (this.getHandValue(this.playerHand) > 21) {
          this.snackBar.open('Busted!', 'OK', { duration: 3000 });
          this.isGameOver = true;
        }
      } else {
        this.snackBar.open('Keine Karten mehr im Deck', 'OK', { duration: 3000 });
      }
    }
  }

  stand(): void {
    if (!this.isGameOver && !this.playerDone) {
      this.playerDone = true;
      this.dealerTurn();
    }
  }

  dealerTurn() {
    while (this.getHandValue(this.dealerHand) < 17) {
      const card = this.gameService.dealCard();
      if (card) {
        this.dealerHand.push(card);
      }
    }
    this.checkWinner();
  }

  doubleDown(): void {
    if (this.playerHand.length === 2 && !this.isGameOver) {
      this.hit();
      if (!this.isGameOver) {
        this.stand();
      }
    }
  }

  canSplit(): boolean {
    return this.playerHand.length === 2 && this.playerHand[0].value === this.playerHand[1].value;
  }

  split(): void {
    // Die Logik zum Splitten der Hand, wenn zwei Karten den gleichen Wert haben.
    // Dies erfordert eine erweiterte Spiellogik, um mehrere Spielerhände zu verwalten.
  }

  private getHandValue(hand: Card[]): number {
    let value = hand.reduce((acc, card) => acc + card.value, 0);
    let aces = hand.filter(card => card.value === 11).length;

    while (value > 21 && aces > 0) {
      value -= 10; // Ace can be 1 instead of 11
      aces -= 1;
    }

    return value;
  }

  private checkWinner(): void {
    const playerValue = this.getHandValue(this.playerHand);
    const dealerValue = this.getHandValue(this.dealerHand);
    this.isGameOver = true;

    if (playerValue > 21) {
      this.snackBar.open('Du hast verloren!', 'OK', { duration: 3000 });
    } else if (dealerValue > 21 || playerValue > dealerValue) {
      this.snackBar.open('Du hast gewonnen!', 'OK', { duration: 3000 });
    } else if (playerValue < dealerValue) {
      this.snackBar.open('Du hast verloren!', 'OK', { duration: 3000 });
    } else {
      this.snackBar.open('Unentschieden!', 'OK', { duration: 3000 });
    }
  }
}