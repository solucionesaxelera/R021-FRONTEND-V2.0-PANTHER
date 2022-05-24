import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  url = environment.url;

  private _obtenerConfiguracionPasswordS = this.url + 'Configuration/get_configuration_password';
  private _actualizarConfiguracionPasswordS = this.url + 'Configuration/post_configuration_password?id=';
  private _actualizarEstadoPasswordUsuarioS = this.url + 'Configuration/configuration_password?id_user=';

  constructor(
    private _http: HttpClient
  ) { }

  getObtenerConfiguracionPassword():Observable<any>{
    return this._http.get<any>(this._obtenerConfiguracionPasswordS, { 
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  postActualizarConfiguracionPassword(req:any):Observable<any>{
    return this._http.post<any>(this._actualizarConfiguracionPasswordS+1, req,{ 
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

}
