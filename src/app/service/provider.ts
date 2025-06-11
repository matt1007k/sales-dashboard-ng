import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  private http = inject(HttpClient);

  getProvidersSimple(term?: string) {
    const searchParams = new URLSearchParams({
      perPage: '8',
      ...(term && { term: term }),
    });
    return this.http.get<{ data: Provider[] }>(
      `${environment.apiUrl}/api/v1/providers?${searchParams.toString()}`
    );
  }
}

export interface Provider {
  id: string;
  businessName: string;
  address: string;
  phone: string;
  documentType: string;
  documentNumber: string;
  createdAt: string;
  updatedAt: string;
}
