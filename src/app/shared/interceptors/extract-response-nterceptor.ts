import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ExtractResponseInterceptor implements HttpInterceptor {
    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(event => {
                // handle responses
                if (
                    event instanceof HttpResponse &&
                    event.ok &&
                    event.body.ok
                ) {
                    return event.body.value;
                }
                return event;
            }),
            catchError(error => {
                console.error(error);
                return of(error);
            })
        );
    }
}
