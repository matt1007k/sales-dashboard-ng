import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(term?: string) {
    const queryParams = new URLSearchParams({
      ...(term && { term: term }),
      perPage: '10',
    });
    return this.http.get<{ data: Category[] }>(
      `${environment.apiUrl}/api/v1/categories?${queryParams.toString()}`
    );
  }
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
