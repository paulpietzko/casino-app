import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [CurrencyPipe]
})
export class HomeComponent implements OnInit, OnDestroy {
  username: string | null = null;
  balance = 0;
  private userSubscription?: Subscription;

  constructor(private authService: AuthService, private currencyPipe: CurrencyPipe) {}

  ngOnInit() {
    this.userSubscription = this.authService.getUserDetails().subscribe({
      next: (user) => {
        this.username = user.name;
        this.balance = user.balance;
      },
      error: (error) => {
        console.error('Fehler beim Abrufen der Benutzerdetails', error);
      },
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  getFormattedBalance(): string {
    return this.currencyPipe.transform(this.balance, 'CHF') || '';
  }
}
