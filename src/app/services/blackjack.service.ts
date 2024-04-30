import { Injectable } from '@angular/core';

export interface Card {
  value: number;
  suit: string;
  code: string;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private deck: Card[] = [];
  private suits = ['H', 'D', 'C', 'S'];
  private values = [
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
    'A',
  ];

  constructor() {
    this.initializeDeck();
  }

  private initializeDeck(): void {
    this.deck = [];
    for (let suit of this.suits) {
      for (let value of this.values) {
        this.deck.push({
          value: this.getCardNumericValue(value),
          suit: suit,
          code: value + '-' + suit,
        });
      }
    }
    this.shuffleDeck();
  }

  public newGame(): void {
    this.initializeDeck();
  }

  private shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  private getCardNumericValue(value: string): number {
    if (value === 'A') {
      return 11;
    } else if (['J', 'Q', 'K'].includes(value)) {
      return 10;
    } else {
      return parseInt(value);
    }
  }

  public dealCard(): Card {
    const card = this.deck.pop();
    if (!card) {
      throw new Error('No more cards in the deck.');
      // Oder das Deck neu initialisieren:
      // this.initializeDeck();
      // return this.deck.pop();
    }
    return card;
  }
}
