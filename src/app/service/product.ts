import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(page: number, perPage: number, term?: string) {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      ...(term && { term: term }),
    });
    return this.http.get<GetAllProductResult>(
      `${environment.apiUrl}/api/v1/products?${queryParams.toString()}`
    );
  }

  createProduct(product: CreateProductDto) {
    return this.http.post<Product>(
      `${environment.apiUrl}/api/v1/products`,
      product
    );
  }

  editProduct(id: string, product: CreateProductDto) {
    return this.http.put<Product>(
      `${environment.apiUrl}/api/v1/products/${id}`,
      product
    );
  }
}

interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  providerId: string;
  categories: string[];
}

export interface GetAllProductResult {
  data: Product[];
  metadata: {
    currentPage: number;
    perPage: number;
    lastPage: number;
    total: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
  provider: Provider;
  categories: Category[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Provider {
  id: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  businessName: string;
  documentType: string;
  documentNumber: string;
}
