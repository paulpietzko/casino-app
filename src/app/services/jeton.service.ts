import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class JetonService {
  private _setJetons: number[] = [];

  constructor(private authService: AuthService) {}

  addJeton(value: number, callback: () => void): void {
    this._setJetons.push(value);
    this.updateUserBalance(-value, callback);
  }

  removeJeton(index: number, callback: () => void): void {
    if (index >= 0 && index < this._setJetons.length) {
      const value = this._setJetons.splice(index, 1)[0];
      this.updateUserBalance(-value, callback);
    }
  }

  updateUserBalance(change: number, callback: () => void): void {
    this.authService.updateUserBalance(change).subscribe({
      next: (newBalance) => {
        console.log(`Balance aktualisiert: ${newBalance}`);
        callback();
      },
      error: (error) =>
        console.error('Fehler beim Aktualisieren der Balance', error),
    });
  }

  getSetJetons(): number[] {
    return this._setJetons;
  }

  getTotalBet(): number {
    return this._setJetons.reduce((acc, value) => acc + value, 0);
  }

  onDragStart(event: DragEvent): void {
    if (event.dataTransfer && event.target instanceof HTMLElement) {
      const value = event.target.getAttribute('data-value');
      if (value) {
        event.dataTransfer.setData('text/plain', value);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, snackBar: MatSnackBar, callback: () => void): void {
    event.preventDefault();
    if (event.dataTransfer) {
      const value = parseInt(event.dataTransfer.getData('text'));
      if (!isNaN(value)) {
        this.addJeton(value, callback);
        snackBar.open(`Jeton im Wert von ${value} gesetzt`, 'OK', {
          duration: 3000,
        });
      }
    }
  }
}
