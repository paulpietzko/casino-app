import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slots',
  standalone: true,
  templateUrl: './slots.component.html',
  imports: [CommonModule],
  styleUrl: './slots.component.scss',
})
export class SlotsComponent {
  slots: number[] = [1, 2, 3];

  spin() {
    this.slots = this.slots.map(() => Math.floor(Math.random() * 9) + 1);
  }
}
