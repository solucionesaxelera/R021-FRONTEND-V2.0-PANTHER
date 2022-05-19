import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrearSolpeService {

  url = environment.url;

  private _SolpeOptionsPrelim = this.url + 'SolpeOptionsPrelim';

  constructor(private _http: HttpClient) { }

  postSolpeOptionsPrelim(req:any):Observable<any>{
    return this._http.post<any>(this._SolpeOptionsPrelim,req,{
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }
}
