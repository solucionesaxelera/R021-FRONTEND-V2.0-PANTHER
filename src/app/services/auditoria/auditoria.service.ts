import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  url = environment.url;
  cadena_service = "";

  private _Auditoria = this.url + 'Auditoria';
  private _Excel = this.url + 'Excel';

  constructor(private _http: HttpClient) { }

  postAuditoria(req: any): Observable<any> {
    return this._http.post<any>(this._Auditoria, req, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  exportarAuditoria(accion: string, usuario: string, fecha: string): Observable<any> {
    this.cadena_service = this._Excel + '?accion=' + accion + '&usuario=' + usuario + '&fecha=' + fecha;
    // console.log(this.cadena_service)
    return this._http.post(this.cadena_service, null, { // SE QUITO EL ANY DEL POST PARA QUE ACEPTE EL BLOB
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      }),
      responseType: 'blob'
    })
    // .pipe(map(data => data))
  }

  getAuditoria(): Observable<any> {
    return this._http.get<any>(this._Auditoria, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  filtrarAuditoria(accion: string, usuario: string, fecha: string): Observable<any> {
    this.cadena_service = this._Auditoria + '?accion=' + accion + '&usuario=' + usuario + '&fecha=' + fecha;
    // console.log(this.cadena_service)
    return this._http.get<any>(this.cadena_service, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  } 
}
