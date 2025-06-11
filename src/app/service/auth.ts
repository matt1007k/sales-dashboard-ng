import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

export const KEY_APP = '@SALES_DASHBOARD';
export const AUTH_TOKENS = `${KEY_APP}:AUTH_TOKENS`;
export const AUTH_USER = `${KEY_APP}:AUTH_USER`;

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  documentType: string;
  documentNumber: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}

interface AuthTokens {
  token: string;
  refresh_token: string;
}

interface LoginResult {
  data: {
    data: User;
    tokens: AuthTokens;
  };
}

interface LoginDto {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(body: LoginDto) {
    return this.http
      .post<LoginResult>(`${environment.apiUrl}/api/v1/users/login`, body)
      .pipe(
        map(({ data: { data: user, tokens } }) => {
          localStorage.setItem(AUTH_USER, JSON.stringify(user));
          localStorage.setItem(AUTH_TOKENS, JSON.stringify(tokens));
          return user;
        })
      );
  }

  isAuthenticated(): boolean {
    console.log(this.getAuthUser);

    return (
      this.getAuthUser !== null && Object.keys(this.getAuthUser).length > 0
    );
  }
  get getAuthUser(): User | null {
    return JSON.parse(localStorage.getItem(AUTH_USER) || '{}');
  }

  get getAuthTokens(): AuthTokens | null {
    return JSON.parse(localStorage.getItem(AUTH_TOKENS) || '{}');
  }

  logout() {
    localStorage.removeItem(AUTH_USER);
    localStorage.removeItem(AUTH_TOKENS);
  }
}
