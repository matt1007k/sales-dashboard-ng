import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withInMemoryScrolling,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {
  AuthGuard,
  CanActivateAuth,
  Permissions,
  UserToken,
} from './guards/can-activate-auth';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ErrorHttpHandlerInterceptor } from './interceptor/error-http-handler';
import { errorHttpInterceptor } from './interceptor/error-http-interceptor';
import { authInterceptor } from './interceptor/auth-http-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      withEnabledBlockingInitialNavigation()
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([errorHttpInterceptor, authInterceptor])
    ),

    providePrimeNG({
      theme: {
        preset: Aura,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
    CanActivateAuth,
    AuthGuard,
    UserToken,
    Permissions,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHttpHandlerInterceptor,
      multi: true,
    },
  ],
};
