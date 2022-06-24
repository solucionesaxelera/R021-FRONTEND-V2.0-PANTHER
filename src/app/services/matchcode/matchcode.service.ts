import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class MatchcodeService {

  url = environment.url;

  private _SolpeOptionsMatchcode = this.url + 'SolpeOptionsMatchcode';
  private _SolpeOptionsMatchcodeSociedades = this.url + 'SolpeOptionsMatchSociedades';
  private _SolpeOptionsInfo = this.url + 'SolpeOptionsInfo';

  constructor(private _http: HttpClient) { }

  postSolpeOptionsMatchcode(req: any): Observable<any> {
    return this._http.post<any>(this._SolpeOptionsMatchcode, req, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }

  getSolpeOptionsMatchcodeSociedades(req:any): Observable<any> {
    return this._http.post<any>(this._SolpeOptionsMatchcodeSociedades,req)
  }

  postInfoExtra(req:any) {
    return this._http.post<any>(this._SolpeOptionsInfo,req,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    });
  }

}
