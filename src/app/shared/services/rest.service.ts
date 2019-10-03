import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse,
    HttpClient
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppHttpService {
    constructor(private http: HttpClient) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const token: string = localStorage.getItem('token');

        // if (token) {
        //     request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        // }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    console.log('event--->>>', event);
                }
                return event;
            }));
    }

    /**
     * get
     */
    public get<T>(url: string): Observable<any> {
        return this.http.get<T>(url)
            .pipe(map(response => response));
    }

    /**
     * post
     */
    public post<T>(url: string, data: any) {
        return this.http.post<T>(url, data)
            .pipe(map(response => response));
    }

    /**
     * put
     */
    public put<T>(url: string, data: any) {
        return this.http.put<T>(url, data)
            .pipe(map(response => response));
    }

    /**
     * delete
     */
    public delete<T>(url: string) {
        return this.http.delete<T>(url)
            .pipe(map(response => response));
    }
}
