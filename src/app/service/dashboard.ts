import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);

  getTotalSummary() {
    return this.http
      .get<
        TotalSummaryResult[]
      >(`${environment.apiUrl}/api/v1/dashboard/get-total-count-summary`)
      .pipe(
        map((data) => {
          return data.map((summary) => ({
            total: summary.total,
            title: summary.title,
            countToday: summary.countToday,
            icon: this.getIcon(summary.title),
            iconBgColor: this.getBgIconColor(summary.title),
            iconColor: this.getIconColor(summary.title),
          }));
        }),
      );
  }

  getIcon(title: string) {
    switch (title) {
      case 'Ventas':
        return 'pi pi-shopping-cart';
      case 'Clientes':
        return 'pi pi-users';
      case 'Productos':
        return 'pi pi-barcode';
      case 'Proveedores':
        return 'pi pi-building';
      default:
        return 'pi pi-shopping-cart';
    }
  }

  getBgIconColor(title: string) {
    switch (title) {
      case 'Ventas':
        return 'bg-green-100 dark:bg-green-500/10';
      case 'Clientes':
        return 'bg-purple-100 dark:bg-purple-500/10';
      case 'Productos':
        return 'bg-amber-100 dark:bg-amber-500/10';
      case 'Proveedores':
        return 'bg-blue-100 dark:bg-blue-500/10';
      default:
        return 'bg-blue-100 dark:bg-blue-500/10';
    }
  }

  getIconColor(title: string) {
    switch (title) {
      case 'Ventas':
        return 'text-green-500 dark:text-green-400';
      case 'Clientes':
        return 'text-purple-500 dark:text-purple-400';
      case 'Productos':
        return 'text-amber-500 dark:text-amber-400';
      case 'Proveedores':
        return 'text-blue-500 dark:text-blue-400';
      default:
        return 'text-blue-500 dark:text-blue-400';
    }
  }
}

export interface TotalSummaryResult {
  total: number;
  title: string;
  countToday: number;
}
