import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnDestroy {
  isAuthenticated: boolean = false;
  private authSub: Subscription;
  snackBar: any;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.authSub = this.authService.getIsAuthenticated().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.snackBar.open('Erfolgreich abgemeldet', 'Schliessen', {
        duration: 3000,
      });
    });
    this.router.navigate(['/welcome']);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
