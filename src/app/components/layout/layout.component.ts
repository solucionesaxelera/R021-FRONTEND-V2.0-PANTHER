import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModulosService } from 'src/app/services/administrador/modulos/modulos.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { translate } from '@rxweb/translate';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  layoutlang: any = {
    TitleMenuAdmin:"",
    TitleMenuSolpe:"",
    dialogTitleCerrarSesion:"",
    dialogSalirSi:"",
    dialogSalirNo:""
  };

  @ViewChild("dialogConsultarCerrarSesion") dialogTemplateConsultarCerrarSesion: any;

  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();
  config?: MatDialogConfig;
  usersesion:any="";

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
   
    if(this.token == "" || this.token == undefined ){
      localStorage.setItem("data_current","");
      this._router.navigate(["acceso"]); 
     
    }else{
      this.usersesion=this.helper.decodeToken(this.token).usuario.trim();
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
   
    if(localStorage.getItem("selectedLanguage") == undefined){
      localStorage.setItem("selectedLanguage","es");
    }
   
    if(localStorage.getItem("selectedLanguage") as string == "es"){
      this.layoutlang.TitleMenuAdmin = "Administración",
      this.layoutlang.TitleMenuSolpe = "Solpe",
      this.layoutlang.dialogTitleCerrarSesion = "Está seguro(a) que desea cerrar sesión?",
      this.layoutlang.dialogSalirSi = "Si",
      this.layoutlang.dialogSalirNo = "No"
    }else if(localStorage.getItem("selectedLanguage") as string == "en") {
      this.layoutlang.TitleMenuAdmin = "Administration",
      this.layoutlang.TitleMenuSolpe = "Solpe",
      this.layoutlang.dialogTitleCerrarSesion = "Are you sure you want to log out?",
      this.layoutlang.dialogSalirSi = "Yes",
      this.layoutlang.dialogSalirNo = "No"
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
