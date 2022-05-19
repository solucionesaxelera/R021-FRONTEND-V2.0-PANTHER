import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { agregarPosicionI, tableAgregarPosicionI } from 'src/app/models/crear-solpe';
import { CrearSolpeService } from 'src/app/services/crear-solpe/crear-solpe.service';

import * as moment from 'moment';

@Component({
  selector: 'app-crear-solpe',
  templateUrl: './crear-solpe.component.html',
  styleUrls: ['./crear-solpe.component.scss']
})
export class CrearSolpeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild("dialogAgregarPosicion") dialogTemplateAgregarPosicion: any;

  config?: MatDialogConfig;

  nro_requisicion:any = "";

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _crearSolpeS : CrearSolpeService
  ) { }

  displayedColumns: string[] = ['presu', 'menge', 'meins', 'descr', 'matnr', 'ccosto', 'gl', 'punit', 'totsinigv','accion'];
  
  ELEMENT_DATA_CREAR_SOLPE: tableAgregarPosicionI[] = [];

  dataSourceCrearSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_CREAR_SOLPE);

  agregarPosicionForm = new FormGroup({
    item: new FormControl(''),
    presu: new FormControl('',[Validators.required]),
    menge: new FormControl('',[Validators.required]),
    meins: new FormControl('',[Validators.required]),
    descr: new FormControl('',[Validators.required]),
    matnr: new FormControl('',[Validators.required]),
    ccosto: new FormControl('',[Validators.required]),
    gl: new FormControl('',[Validators.required]),
    punit: new FormControl('',[Validators.required]),
    totsinigv: new FormControl('',[Validators.required]),
  });

  cabeceraCrearSolpeForm = new FormGroup({
    Id:  new FormControl(''),
    Nroreq: new FormControl('',[Validators.required]),
    Area: new FormControl('',[Validators.required]),
    Fecha: new FormControl('',[Validators.required]),
    DescrSolpe: new FormControl('')
  })

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.cabeceraCrearSolpeForm.controls['Fecha'].setValue(moment().format("YYYY-MM-DD"))
    this.dataSourceCrearSolpe.paginator = this.paginator;
  }

  openAgregarPosicion(){
    return this.dialog.open(this.dialogTemplateAgregarPosicion, this.config);
  }

  agregarPosicion(req:agregarPosicionI){
    console.log(this.agregarPosicionForm.valid);
    if(this.agregarPosicionForm.valid ==true){
      this.dataSourceCrearSolpe.data.push({
        item: req.item,
        presu: req.presu,
        menge: req.menge,
        meins: req.meins,
        descr: req.descr,
        matnr: req.matnr,
        ccosto: req.ccosto,
        gl: req.gl,
        punit: req.punit,
        totsinigv: req.totsinigv
      });
      this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
      this.agregarPosicionForm.reset();
      this.dialog.closeAll();
    }
  }

  crearSolpe(req:any){
    let json_req={
      IsAccion: "C",
      IsIdSolpe: "",
      IsItem: "",
      IsSolpePrelimCab: {
        Id: "",
        Nroreq: req.Nroreq,
        Area: req.Area,
        Fecha: moment(req.Fecha).format("YYYYMMDD"),
        DescrSolpe: req.DescrSolpe,
        Detalle: this.dataSourceCrearSolpe.data
      }
    }
    this._crearSolpeS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
      if(data.etMsgReturnField[0].successField == 'X'){
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = [];
      }
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
        duration:5*1000
      });
    })
  }

  validacionInputNroRequisicion(valor:any){
    let texto = document.getElementById('nroreq') as HTMLInputElement;
    this.nro_requisicion += valor.target.value + '|';

    if(this.nro_requisicion.split('|').length == 5){
      texto.value += "-";
    }
  }

  validacionCrearSolpeInputTotalSinIgv(valor:any){
    let code = valor.keyCode;
    if(code>=48 && code<=57){
      return true;
    }
    if(code == 46){
      return true;
    }
    else{
      return false;
    }
  }

  validacionCrearSolpeInputPrecioUnitario(valor:any){
    let code = valor.keyCode;
    if(code>=48 && code<=57){
      return true;
    }
    if(code == 46){
      return true;
    }
    else{
      return false;
    }
  }

  validacionCrearSolpeInputGl(valor:any){
    let code = valor.keyCode;
    if(code>=48 && code<=57){
      return true;
    }else{
      return false;
    }
  }

  validacionCrearSolpeInputCantidad(valor:any){
    let code = valor.keyCode;
    if(code>=48 && code<=57){
      return true;
    }else{
      return false;
    }
  }

  validacionCrearSolpeInputPartida(valor:any){
    let code = valor.keyCode;
    if(code>=48 && code<=57){
      return true;
    }else{
      return false;
    }
  }

  validacionCrearSolpeInputNroSapMat(valor:any){
    let code = valor.keyCode;
    if(code>=48 && code<=57){
      return true;
    }else{
      return false;
    }
  }

  eliminarPosicion(id:number){
   this.dataSourceCrearSolpe.data.splice(id,1);
   this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
  }
}
