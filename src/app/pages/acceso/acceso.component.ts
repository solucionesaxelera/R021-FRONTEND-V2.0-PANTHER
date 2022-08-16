import { accesoI } from './../../models/acceso';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccesoService } from 'src/app/services/acceso/acceso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatchcodeService } from 'src/app/services/matchcode/matchcode.service';

import { translate, RxTranslation } from '@rxweb/translate';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.scss']
})
export class AccesoComponent implements OnInit {

  @translate({translationName:'acceso'}) acceso: any;

  selectedValue: string="";
  sociedades: any[] = [];

  cargaSociedades:boolean=false;
  sociedadesNull:boolean = false;

  constructor(
    private _accesoS: AccesoService,
    private _snackBar: MatSnackBar,
    private _matchcodeS: MatchcodeService,
    private _router: Router,
    private rxTranslation: RxTranslation
    ) { }

  cambioUsuario(){
    this.sociedades=[];
    this.accesoForm.controls['sociedad'].setValue("");
  }

  ngOnInit(): void {
  }

  accesoForm = new FormGroup({
    usuario: new FormControl('',[Validators.required]),
    clave: new FormControl('',[Validators.required]),
    sociedad: new FormControl('',[Validators.required])
  });

  selectedLanguageControl = new FormControl('es');

  cargarSociedades(){
    this.sociedades=[];
    this.sociedadesNull= false;
    this.cargaSociedades = true;
    let json_req_info_extra = {
      IsCentro: "",
      IsMaterial: "",
      IsValor: "SOCIEDADES",
      IsUsuario: this.accesoForm.controls['usuario'].value.trim()
    }
    if(this.accesoForm.controls['usuario'].value.trim() != "") {
      this._matchcodeS.getSolpeOptionsMatchcodeSociedades(json_req_info_extra).subscribe(data=>{
        this.sociedades = data.etSociedadesField;
        this.cargaSociedades = false;
        this.sociedadesNull = false;
        if(data.etMsgReturnField[0].successField != "X"){
          this.sociedadesNull = true;
        }
      },err=>{
        this.sociedades=[];
        this.sociedadesNull= true;
        this.cargaSociedades = false;
      });
    }else{
      this.cargaSociedades = false;
      this.sociedadesNull = true;
    }
  }

  ListarSociedades(){
    this.cargarSociedades();
  }

  acceder(req:accesoI) {
    this._accesoS.postAccesoS(req).subscribe(data=>{
      localStorage.setItem('data_current',data.body.token);
      localStorage.setItem('data_current_refresh',data.body.refreshToken);
      // this._router.navigateByUrl('').then();
      this._router.navigate(['/']);
    },err=>{
      if(err.status === 401){
        this._snackBar.open('Credenciales incorrectas', 'cerrar',{
          duration:2*1000
        });
      }
    });
  }

  seleccionarIdioma(value:any){
    localStorage.setItem('selectedLanguage', value);
    this.rxTranslation.change(value);
  }

}
