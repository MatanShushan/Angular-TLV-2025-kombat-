import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'power-bar',
  standalone: true,
  imports: [UpperCasePipe],
  templateUrl: './power-bar.component.html',
  styleUrl: './power-bar.component.scss'
})
export class PowerBarComponent {
  label = input<string>();
  value = input.required<number>();
  max = input<number>(100);
  side = input<'left' | 'right'>();

  isFinish = input<boolean>();

  percent = computed(() => {
    const p = (this.value() / this.max()) * 100;
    return Math.max(0, Math.min(100, isFinite(p) ? p : 0));
  });

  displayPercent = computed(() => Math.round(this.percent()));


  isRight = computed(() => this.side() === 'right');

 
}
