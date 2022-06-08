import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfiguracionService } from 'src/app/services/administrador/configuracion/configuracion.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent implements OnInit {

  indicadorCarga:Boolean =false;

  constructor(
    private _configuracionS: ConfiguracionService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.obtenerConfiguracion();
  }

  configuracionPasswordForm = new FormGroup({
    num: new FormControl('',[Validators.required])
  })

  obtenerConfiguracion(){
    this.indicadorCarga = true;
    this._configuracionS.getObtenerConfiguracionPassword().subscribe(data=>{
      this.indicadorCarga = false;
      this.configuracionPasswordForm.controls['num'].setValue(data.body[0].num);
    })
  }

  guardarConfiguracion(req:any){
    this.indicadorCarga = true;
    this._configuracionS.postActualizarConfiguracionPassword(req).subscribe(data=>{
      this.indicadorCarga = false;
      this._snackBar.open(data.message, 'cerrar',{
        duration:5*1000
      });
    })
  }

}
