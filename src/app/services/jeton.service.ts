import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class JetonService {
  private _setJetons: number[] = [];

  constructor() {}

  addJeton(value: number): void {
    this._setJetons.push(value);
  }

  removeJeton(index: number): void {
    if (index >= 0 && index < this._setJetons.length) {
      this._setJetons.splice(index, 1);
    }
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

  onDrop(event: DragEvent, snackBar: MatSnackBar): void {
    event.preventDefault();
    if (event.dataTransfer) {
      const value = parseInt(event.dataTransfer.getData('text'));
      if (!isNaN(value)) {
        this.addJeton(value);
        snackBar.open(`Jeton im Wert von ${value} gesetzt`, 'OK', { duration: 3000 });
      }
    }
  }
}
