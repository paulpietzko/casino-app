import { Injectable } from '@angular/core';
import { Card, Rank, Suit } from '../models/card.model';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  deck: Card[] = [];

  constructor() {
    this.initializeDeck();
  }

  initializeDeck() {
    this.deck = [];
    for (let suit in Suit) {
      if (isNaN(Number(suit))) {
        for (let rank in Rank) {
          if (!isNaN(Number(rank))) {
            this.deck.push(new Card(Suit[suit as keyof typeof Suit], Rank[rank as keyof typeof Rank]));
          }
        }
      }
    }
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCard(): Card {
    const card = this.deck.pop();
    if (!card) {
      throw new Error('Das Deck ist leer');
    }
    return card;
  }
  
}
