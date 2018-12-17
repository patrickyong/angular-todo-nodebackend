import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { SessionService } from '../session.service';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private http: HttpClient, private session: SessionService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Content-Type' : 'application/json; charset=utf-8',
        'Accept'       : 'application/json',
        'Authorization': `Bearer ${this.session.accessToken}`,
      },
    });

    return next.handle(req);
  }
}