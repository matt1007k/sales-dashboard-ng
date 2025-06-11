import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../service/auth';

export class UserToken {}
export class Permissions {
  canActivate(currentUser: UserToken, path: string): boolean {
    console.log(currentUser, path);
    return true;
  }
}

@Injectable()
export class CanActivateAuth implements CanActivate {
  constructor(
    private permissions: Permissions,
    private currentUser: UserToken
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    console.log(route, state);
    return this.permissions.canActivate(this.currentUser, state.url);
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  authService = inject(AuthService);
  router = inject(Router);

  canActivate(): boolean {
    console.log(this.authService.isAuthenticated());

    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
