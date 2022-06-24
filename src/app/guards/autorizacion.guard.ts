import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot,UrlSegment, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { first, map, Observable, Subject } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { accesoO } from '../models/acceso';
import { ModulosService } from '../services/administrador/modulos/modulos.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AutorizacionGuard implements CanActivate {
  public helper = new JwtHelperService();

  url = environment.url;

  constructor(
    private _router: Router, 
    private _http: HttpClient,
    private _modulosS : ModulosService,
    ){}


  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let url: string = state.url;
    const token = localStorage.getItem('data_current');
    if(token === "undefined"){
      localStorage.removeItem("data_current");
    localStorage.removeItem("data_current_refresh");
      this._router.navigate(["acceso"]); 
      return false;
    }
    if(token && !this.helper.isTokenExpired(token)){
      return this.checkUserRoute(url);
    }else{
      this._router.navigate(["acceso"]); 
      return false;
    }
      
  }

  private async tryRefreshingTokens(token: any): Promise<boolean> {
    const refreshToken = localStorage.getItem("data_current_refresh");
    if(!token || !refreshToken){
      return false;
    }
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken});
    let isRefreshSuccess: boolean = false;
    // isRefreshSuccess = true;
    const refreshRes = await new Promise<any>((resolve, reject) => {
      this._http.post<any>(environment.url+"RefreshToken", credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (res: accesoO) => { isRefreshSuccess = true; resolve(res); },
        error: (err) => { console.log(err); isRefreshSuccess = false; reject(); }
      });
    });
    localStorage.setItem("data_current", refreshRes.token);
    localStorage.setItem("data_current_refresh", refreshRes.refreshToken);
    return isRefreshSuccess;
  }

  async checkUserRoute(url:any):Promise<boolean | Observable<boolean>> {
    let conincidencia:boolean = false;
    const token = localStorage.getItem('data_current')?.toString();
    this.helper.decodeToken(token);
    const isRefreshSuccess = await this.tryRefreshingTokens(token);
    if(!isRefreshSuccess){
      this._router.navigate(["acceso"]);
      return false;
    }else{
      return this._http.get(this.url+"Modulo/IdRol?id_rol="+this.helper.decodeToken(token).id_rol,{
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem('data_current')
        })
      }).toPromise().then(data=>{
        let datafinal:any = data;
        for (let i = 0; i < datafinal.body.length; i++){
          
          if(url=="/"){
            conincidencia = true;
            return true;
          }
          if(datafinal.body[i].url == url){
            conincidencia = true;
            return true;
          }
          if(datafinal.body.length - 1 == i){
            if(conincidencia == false){
              // this._router.navigate(["acceso"]);
              return false;
            }else{
              return false;
            }
          }
        }
        return false;
      }).catch(err => {return false;});
    }
  }
  
}
