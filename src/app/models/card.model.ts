export enum Suit {
  Clubs,
  Diamonds,
  Hearts,
  Spades,
}

export enum Rank {
  Two = 2,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack = 10,
  Queen = 10,
  King = 10,
  Ace = 11,
}

export class Card {
  alternative: any;
  constructor(public suit: Suit, public rank: Rank) {}
}
