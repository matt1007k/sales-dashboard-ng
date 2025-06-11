import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { YearGraphSaleWidget } from './components/year-graph-sale';
import { StatsWidget } from './components/statswidget';

@Component({
  selector: 'app-dashboard',
  imports: [ButtonModule, YearGraphSaleWidget, StatsWidget],
  standalone: true,
  templateUrl: './dashboard.html',
  styles: ``,
})
export class Dashboard {
  count = signal(0);

  increment() {
    this.count.update((c) => c + 1);
  }
}
