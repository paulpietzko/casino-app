import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [CurrencyPipe],
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  balance = 0;

  constructor(
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
  ) {}

  ngOnInit() {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.authService.getUserDetails().subscribe({
      next: (response) => {
        this.username = response.data.user.username;
        this.balance = response.data.user.balance;
      },
      error: (error) => {
        console.error('Fehler beim Abrufen der Benutzerdaten', error);
      },
    });
  }

  getFormattedBalance(): string {
    return this.currencyPipe.transform(this.balance, 'CHF') || '';
  }
}
