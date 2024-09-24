import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account.service';
import { environment } from 'src/environments/environment';
import { environment as prod_environment } from "src/environments/environment.prod";
import { environment_variables } from "src/environments/env-variables";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    apiUrl: string ="";

    constructor(private accountService: AccountService) {
        this.apiUrl = environment_variables.isLive? prod_environment.apiUrl : environment.apiUrl;
     }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to the api url
        const user = this.accountService.userValue;
        const isLoggedIn = user && user.token;
        const isApiUrl = request.url.startsWith(this.apiUrl);
        if (isLoggedIn && isApiUrl) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${user.token}`
                }
            });
        }

        return next.handle(request);
    }
}