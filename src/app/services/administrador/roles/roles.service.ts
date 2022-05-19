import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { crearRolI, crearRolO, modificarRolI, modificarRolO, obtenerRolByIdO, rolesI } from 'src/app/models/administrador/roles';
import { environment } from 'src/environments/environment';
import { AccesoService } from '../../acceso/acceso.service';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  url = environment.url;

  private _rolesS = this.url + 'Rol';
  private _crearRolS = this.url + 'Rol';
  private _obtenerRolbyIdS = this.url + 'Rol/';
  private _modificarRolS = this.url + 'Rol/';
  private _eliminarRolS = this.url + 'Rol/'

  constructor(
    private _http: HttpClient
  ) { }

  getRoles():Observable<any>{
    return this._http.get<any>(this._rolesS, { 
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  postCrearRol(req:crearRolI):Observable<crearRolO>{
    return this._http.post<crearRolO>(this._crearRolS,req,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  getRolById(id:number):Observable<obtenerRolByIdO>{
    return this._http.get<obtenerRolByIdO>(this._obtenerRolbyIdS+id,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  putModificarRol(id:number,req:modificarRolI):Observable<modificarRolO>{
    return this._http.put<modificarRolO>(this._modificarRolS+id,req,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  deleteEliminarRol(id:number):Observable<any> {
    return this._http.delete<modificarRolO>(this._eliminarRolS+id,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

}
