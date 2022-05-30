import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiberarSolpeService {

  url = environment.url;

  private _SolpeOptionsStand = this.url + 'SolpeOptionsStand';

  constructor(private _http: HttpClient) { }

  postSolpeOptionsStand(req: any): Observable<any> {
    return this._http.post<any>(this._SolpeOptionsStand, req, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('data_current')
      })
    })
  }
}
