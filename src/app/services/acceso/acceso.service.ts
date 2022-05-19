import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { accesoI, accesoO } from 'src/app/models/acceso';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  url = environment.url;

  private _accesoS = this.url + 'Login';

  constructor(private _http: HttpClient) { 
  }

  postAccesoS(req:accesoI):Observable<accesoO> {
    return this._http.post<accesoO>(this._accesoS,req);
  }

  getToken() {
    let token: any = localStorage.getItem('data_current');
    console.log("get token: ",token);
    return token.replace(/["']/g, "");
  }
}
