import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModulosService } from 'src/app/services/administrador/modulos/modulos.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @ViewChild("dialogConsultarCerrarSesion") dialogTemplateConsultarCerrarSesion: any;

  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();
  config?: MatDialogConfig;

  modulosAdministracion:any=[];
  modulosSolpe:any =[];

  showFiller = false;
  panelOpenState = false;
  constructor(
    public dialog: MatDialog,
    private _router: Router,
    private _modulosS: ModulosService
  ) { }

  ngOnInit(): void {
    if(this._router.url !="/"){
      this._modulosS.getModulosByIdRol(this.helper.decodeToken(this.token).id_rol).subscribe(data=>{
        for (let i = 0; i < data.body.length; i++) {
          if(data.body[i].url.substr(1,14) == "administracion"){
            this.modulosAdministracion = [...this.modulosAdministracion,data.body[i]]
          }if(data.body[i].url.substr(1,5) == "solpe"){
            this.modulosSolpe = [...this.modulosSolpe,data.body[i]]
          }
        }
      })
    }

  }

  openConsultarCerrarSesion(){
    return this.dialog.open(this.dialogTemplateConsultarCerrarSesion, this.config);
  }

  cerrarSesion(){
    localStorage.removeItem("data_current");
    localStorage.removeItem("data_current_refresh");
    this.dialog.closeAll();
    this._router.navigate(["acceso"]); 
  }

}
