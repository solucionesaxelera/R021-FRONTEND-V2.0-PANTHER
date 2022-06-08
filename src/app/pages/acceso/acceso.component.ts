import { accesoI } from './../../models/acceso';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccesoService } from 'src/app/services/acceso/acceso.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso',
  templateUrl: './acceso.component.html',
  styleUrls: ['./acceso.component.scss']
})
export class AccesoComponent implements OnInit {

  constructor(
    private _accesoS: AccesoService,
    private _snackBar: MatSnackBar,
    private _router: Router
    ) { }

  ngOnInit(): void {
  }

  accesoForm = new FormGroup({
    usuario: new FormControl('',[Validators.required]),
    clave: new FormControl('',[Validators.required])
  })

  acceder(req:accesoI) {
    this._accesoS.postAccesoS(req).subscribe(data=>{
      console.log(data.body.token);
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
