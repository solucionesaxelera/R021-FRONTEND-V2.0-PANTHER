import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccesoService } from '../../acceso/acceso.service';
import { crearUsuarioI, crearUsuarioO, modificarEstadoUsuarioI, modificarEstadoUsuarioO, modificarRolUsuarioI, modificarRolUsuarioO, modificarUsuarioI, modificarUsuarioO, usuarioByIdO, usuariosO } from 'src/app/models/administrador/usuarios';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  url = environment.url;

  private _usuariosS = this.url + 'Usuario';
  private _crearUsuarioS = this.url + 'Usuario';
  private _usuarioByIdS = this.url + 'Usuario/';
  private _modificarUsuarioS = this.url + 'Usuario/';
  private _modificarRolUsuarioS = this.url + 'Usuario/UpdateRol?id=';
  private _modificarEstadoUsuarioS = this.url + 'Usuario/UpdateStatus?id=';
  private _eliminarUsuarioS = this.url + 'Usuario/';

  constructor(
    private _http: HttpClient,
    private _accesoS: AccesoService
  ) { }

  getUsuarios():Observable<any> {
    return this._http.get<any>(this._usuariosS, { 
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  postCrearUsuario(req:crearUsuarioI):Observable<crearUsuarioO> {
    return this._http.post<crearUsuarioO>(this._crearUsuarioS,req, { 
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  getUsuarioById(id:number):Observable<usuarioByIdO> {
    return this._http.get<usuarioByIdO>(this._usuarioByIdS+id, { 
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  putModificarUsuario(id:number,req:modificarUsuarioI):Observable<modificarUsuarioO> {
    return this._http.put<modificarUsuarioO>(this._modificarUsuarioS+id,req,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    });
  }

  putModificarRolUsuario(id:number, req:modificarRolUsuarioI):Observable<modificarRolUsuarioO> {
    return this._http.put<modificarRolUsuarioO>(this._modificarRolUsuarioS+id,req,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    });
  }

  putModificarEstadoUsuario(id:number, req:modificarEstadoUsuarioI):Observable<modificarEstadoUsuarioO> {
    return this._http.put<modificarEstadoUsuarioO>(this._modificarEstadoUsuarioS+id,req,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    });
  }

  deleteEliminarUsuario(id:number) {
    return this._http.delete<modificarEstadoUsuarioO>(this._eliminarUsuarioS+id,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    });
  }

}
