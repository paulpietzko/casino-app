import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blackjack.component.html',
  styleUrl: './blackjack.component.scss'
})
export class BlackjackComponent {
  balance = 1790;
  playerCards = [{ value: 11, alternative: 1 }, { value: 7 }];
  dealerCards = [{ value: 10 }, { value: 2 }];
}