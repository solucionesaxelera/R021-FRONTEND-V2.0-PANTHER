import { accesoI } from './../../models/acceso';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccesoService } from 'src/app/services/acceso/acceso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatchcodeService } from 'src/app/services/matchcode/matchcode.service';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.scss']
})
export class AccesoComponent implements OnInit {
  selectedValue: string="";
  sociedades: any[] = [];
  constructor(
    private _accesoS: AccesoService,
    private _snackBar: MatSnackBar,
    private _matchcodeS: MatchcodeService,
    private _router: Router
    ) { }
 
  ngOnInit(): void {
    this.cargarSociedades();
  }

  accesoForm = new FormGroup({
    usuario: new FormControl('',[Validators.required]),
    clave: new FormControl('',[Validators.required]),
    sociedad: new FormControl('',[Validators.required])
  });

  cargarSociedades(){
    this._matchcodeS.getSolpeOptionsMatchcodeSociedades().subscribe(data=>{
      this.sociedades = data.etSocieField
    });
  }

  acceder(req:accesoI) {
    this._accesoS.postAccesoS(req).subscribe(data=>{
      localStorage.setItem('data_current',data.body.token);
      localStorage.setItem('data_current_refresh',data.body.refreshToken);
      this._router.navigateByUrl('/solpe/crear-solpe').then();
    },err=>{
      if(err.status === 401){
        this._snackBar.open('Credenciales incorrectas', 'cerrar',{
          duration:2*1000
        });
      }
    });
  }

}
