import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ModulosService } from 'src/app/services/administrador/modulos/modulos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  
  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();
  listModulos:any=[];

  constructor(
    private _modulosS: ModulosService
  ) { }

  ngOnInit(): void {
    this._modulosS.getModulosByIdRol(this.helper.decodeToken(this.token).id_rol).subscribe(data=>{
      this.listModulos= data.body
    })
  }

}
