import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { asignarModuloRolI, asignarModuloRolO, moduloByIdRolO, ModulosO } from 'src/app/models/administrador/modulos';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  url = environment.url;

  private _modulosS = this.url + 'Modulo';
  private _asignarModulosRolS = this.url + 'AsignaModulo';
  private _modulosByIdRolS = this.url + 'Modulo/IdRol?id_rol=';

  constructor(
    private _http: HttpClient
  ) { }

  getModulos():Observable<any>{
    return this._http.get<any>(this._modulosS, { 
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  postAsignarModuloRol(req:any):Observable<asignarModuloRolO> {
    return  this._http.post<asignarModuloRolO>(this._asignarModulosRolS, req, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    });
  }

  getModulosByIdRol(id_rol:number):Observable<any> {
    return  this._http.get<any>(this._modulosByIdRolS+id_rol, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    });
  }
}
