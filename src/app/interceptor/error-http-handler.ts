import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHttpHandlerInterceptor implements HttpInterceptor {
  private router = inject(Router);
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('ErrorHttpHandlerInterceptor');

        if (error.status === 400) {
          window.alert(error.error.message);
        }
        if (error.status === 401) {
          this.router.navigate(['/auth/login']);
        }

        // this.notificationService.show({
        //   severity: 'error',
        //   summary: 'Error',
        //   detail: error.error.message,
        // });
        return throwError(() => error);
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  show({ severity, summary, detail }: ToastMessageOptions) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  }
}
