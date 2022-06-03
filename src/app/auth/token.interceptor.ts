import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { accesoO } from '../models/acceso';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AutorizacionGuard } from '../guards/autorizacion.guard';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private _router: Router,private _http: HttpClient,private _autorizacionGuard:AutorizacionGuard) {}
  public helper = new JwtHelperService();
  intercept(request: HttpRequest<any>, next: HttpHandler):Observable<any>{
    // console.log(this._router.url);
    let isRefreshSuccess;
    const token = localStorage.getItem('data_current');
    
    
    const re = "/acceso";
    // console.log(request.url.search(re) )
    if (this._router.url !== '/acceso') {
        // console.log("estamos aqui")
        if(token && !this.helper.isTokenExpired(token)){
            // console.log(this.helper.isTokenExpired(token))
          // isRefreshSuccess = this.tryRefreshingTokens(localStorage.getItem("data_current")); 
        //   this._autorizacionGuard.canActivate()
        }
        
    }
    // return next.handle(request);
    return from(this.validar(request,next));
  }

    async validar(request: HttpRequest<any>, next: HttpHandler) {
        // console.log("iniciando")
        // const result = await this._autorizacionGuard.canActivate();
        const token = localStorage.getItem('data_current');
        if(token && this.helper.isTokenExpired(token)==true){
          this._router.navigate(["acceso"]); 
        }
        // console.log(result);


        return next.handle(request).toPromise();
    }

}