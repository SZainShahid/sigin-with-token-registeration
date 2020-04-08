import { Injectable } from '@angular/core';
import { UserService } from './../shared/user.service';
import { HttpInterceptor, HttpRequest, HttpUserEvent, HttpEvent, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private router: Router) {

    }

    intercept(req: HttpRequest<any>, next: import("@angular/common/http").HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('No-Auth') == "True")
            return next.handle(req.clone());

        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken'))
            });
            return next.handle(clonedreq)
                .do(succ => { }, 
                    err => 
                    { 
                        debugger; 
                        if (err.status === 401) this.router.navigateByUrl('/signin'); 
                    }
                    );
        }
    }

}

