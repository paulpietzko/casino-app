import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

interface UserDetails {
  data: {
    user: {
      id: string;
      balance: number;
    };
  };
}

@Component({
  selector: 'app-slots',
  standalone: true,
  templateUrl: './slots.component.html',
  imports: [CommonModule],
  styleUrls: ['./slots.component.scss'],
})
export class SlotsComponent implements OnInit {
  reels: string[][] = [
    ['🍒', '🍋', '🍊', '🍉', '🍇'],
    ['🍒', '🍋', '🍊', '🍉', '🍇'],
    ['🍒', '🍋', '🍊', '🍉', '🍇'],
  ];

  currentSymbols: string[] = [];
  balance: number = 0;
  bet: number = 5;
  possibleBets: number[] = [5, 10, 20, 50, 100];

  constructor(private snackBar: MatSnackBar, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.fetchUserDetails().subscribe({
      next: (userDetails: UserDetails | null) => {
        if (userDetails) {
          this.balance = userDetails.data.user.balance;
        }
      },
      error: (error: any) => {
        console.error('Fehler beim Abrufen der Benutzerdetails', error);
      },
    });
  }

  setBet(amount: number): void {
    if (amount <= this.balance) {
      this.bet = amount;
    }
  }

  isSpinning = false;

  spin(): void {
    if (this.bet > this.balance) {
      this.snackBar.open('Nicht genug Guthaben!', 'OK', { duration: 3000 });
      return;
    }

    this.authService.updateUserBalance(-this.bet);
  
    this.isSpinning = true;
    this.balance -= this.bet;
  
    setTimeout(() => {
      this.currentSymbols = this.reels.map(reel => {
        const randomIndex = Math.floor(Math.random() * reel.length);
        return reel[randomIndex];
      });
  
      this.calculateWin();
      this.isSpinning = false;
    }, 1000);
  }
  
  calculateWin(): void {
    const uniqueSymbols = new Set(this.currentSymbols);
    let winAmount = 0;
  
    if (uniqueSymbols.size === 1) { // Alle Symbole sind gleich
      winAmount = this.bet * 5; // Gewinnmultiplikator kann angepasst werden
      this.snackBar.open('Großer Gewinn!', 'OK', { duration: 3000 });
    } else if (uniqueSymbols.size === 2) { // Zwei Symbole sind gleich
      winAmount = this.bet * 0.5; // Gewinnmultiplikator kann angepasst werden
      this.snackBar.open('Kleiner Gewinn!', 'OK', { duration: 3000 });
    }
  
    // Aktualisieren Sie die Benutzerbalance, wenn es einen Gewinn gibt
    if (winAmount > 0) {
      this.authService.updateUserBalance(winAmount);
    }
  }
}