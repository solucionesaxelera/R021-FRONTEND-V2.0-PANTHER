import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { accesoO } from '../models/acceso';

@Injectable({
  providedIn: 'root'
})

export class AutorizacionGuard implements CanActivate {
  public helper = new JwtHelperService();
  constructor(private _router: Router, private _http: HttpClient){}


  public async canActivate(){
    const token = localStorage.getItem('data_current');
    if(token && !this.helper.isTokenExpired(token)){
      // console.log(this.helper.decodeToken(token))
      return true;
    }

    const isRefreshSuccess = await this.tryRefreshingTokens(token); 
    if (!isRefreshSuccess) { 
      this._router.navigate(["acceso"]); 
    }
    return isRefreshSuccess;
      
  }

  private async tryRefreshingTokens(token: any): Promise<boolean> {
    const refreshToken = localStorage.getItem("data_current_refresh");
    if(!token || !refreshToken){
      return false;
    }
   
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken});
    let isRefreshSuccess: boolean;
    const refreshRes = await new Promise<any>((resolve, reject) => {
      this._http.post<any>("http://localhost:9021/api/RefreshToken", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (res: accesoO) => resolve(res),
        error: (_) => { reject; isRefreshSuccess = false; }
      });
    });

    localStorage.setItem("data_current", refreshRes.token);
    localStorage.setItem("data_current_refresh", refreshRes.refreshToken);
    isRefreshSuccess = true;
    return isRefreshSuccess;

  }
  
}
