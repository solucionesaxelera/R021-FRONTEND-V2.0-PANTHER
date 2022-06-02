import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { agregarPosicionI, tableAgregarPosicionI } from 'src/app/models/crear-solpe';
import { CrearSolpeService } from 'src/app/services/crear-solpe/crear-solpe.service';

import * as moment from 'moment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuditoriaService } from 'src/app/services/auditoria/auditoria.service';
import { MatchcodeComponent } from 'src/app/components/matchcode/matchcode.component';

@Component({
  selector: 'app-crear-solpe',
  templateUrl: './crear-solpe.component.html',
  styleUrls: ['./crear-solpe.component.scss']
})
export class CrearSolpeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild("dialogAgregarPosicion") dialogTemplateAgregarPosicion: any;
  @ViewChild("dialogEditarPosicion") dialogTemplateEditarPosicion: any;

  indicadorCarga:Boolean=false;

  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();

  config?: MatDialogConfig;

  nro_requisicion:any = "";
  idSeleccionadoEditarPosicion:number = 0;

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _crearSolpeS : CrearSolpeService,
    private _auditoriaS : AuditoriaService,
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
    Moneda: new FormControl('',[Validators.required]),
    Centro: new FormControl('',[Validators.required]),
    DescrSolpe: new FormControl('')
  });

  editarPosicionForm = new FormGroup({
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
    if(this.agregarPosicionForm.valid ==true){
      this.dataSourceCrearSolpe.data.push({
        item: this.dataSourceCrearSolpe.data.length + 1,
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
    this.indicadorCarga=true;
    let json_req={
      IsAccion: "C",
      IsIdSolpe: "",
      IsItem: "",
      IsSolpePrelimCab: {
        Id: "",
        Nroreq: req.Nroreq,
        Area: req.Area,
        Fecha: moment(req.Fecha).format("YYYYMMDD"),
        Moneda:req.Moneda,
        Centro:req.Centro,
        DescrSolpe: req.DescrSolpe,
        Estado: "",
        Usuario:this.helper.decodeToken(this.token).usuario,
        Detalle: this.dataSourceCrearSolpe.data
      }
    }
    
    this._crearSolpeS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
      if(data.etMsgReturnField[0].successField == 'X'){
        let json_req_auditoria = {
          id_solpe:data.esSolpePrelimCabField.idField,
          usuario:this.helper.decodeToken(this.token).usuario,
          accion:"C"
        }
        this._auditoriaS.postAuditoria(json_req_auditoria).subscribe(data=>{
          console.log(data)
        });
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = [];
        this.indicadorCarga=false;
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

  abrirEditarPosicion(id:number){
    this.idSeleccionadoEditarPosicion = id;

    this.editarPosicionForm.controls['presu'].setValue(this.dataSourceCrearSolpe.data[id].presu);
    this.editarPosicionForm.controls['menge'].setValue(this.dataSourceCrearSolpe.data[id].menge);
    this.editarPosicionForm.controls['meins'].setValue(this.dataSourceCrearSolpe.data[id].meins);
    this.editarPosicionForm.controls['descr'].setValue(this.dataSourceCrearSolpe.data[id].descr);
    this.editarPosicionForm.controls['matnr'].setValue(this.dataSourceCrearSolpe.data[id].matnr);
    this.editarPosicionForm.controls['ccosto'].setValue(this.dataSourceCrearSolpe.data[id].ccosto);
    this.editarPosicionForm.controls['gl'].setValue(this.dataSourceCrearSolpe.data[id].gl);
    this.editarPosicionForm.controls['punit'].setValue(this.dataSourceCrearSolpe.data[id].punit);
    this.editarPosicionForm.controls['totsinigv'].setValue(this.dataSourceCrearSolpe.data[id].totsinigv);

    return this.dialog.open(this.dialogTemplateEditarPosicion, this.config);
  }

  editarPosicion(req:any){

    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].presu = req.presu;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].menge = req.menge;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].meins = req.meins;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].descr = req.descr;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].matnr = req.matnr;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].ccosto = req.ccosto;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].gl = req.gl;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].punit = req.punit;
    this.dataSourceCrearSolpe.data[this.idSeleccionadoEditarPosicion].totsinigv = req.totsinigv;

    this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
    if(this.editarPosicionForm.valid){
      this.editarPosicionForm.reset();
      this.dialog.closeAll();
    }
  }

  matchcodeCabecera(name:string,value:string){
    const dialogRef = this.dialog.open(MatchcodeComponent, {
      width: '40%',
      data: {name: name,value:value},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(name == "WERKS"){
        this.cabeceraCrearSolpeForm.controls['Centro'].setValue(result);
      }
    });
  }

  matchcodeAgregarPosicion(name:string,value:string){
    const dialogRef = this.dialog.open(MatchcodeComponent, {
      width: '40%',
      data: {name: name,value:value},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(name == "MATNR"){
        this.agregarPosicionForm.controls['matnr'].setValue(result);
      }
      if(name == "KOSTL"){
        this.agregarPosicionForm.controls['ccosto'].setValue(result);
      }
    });
  }

  matchcodeEditarPosicion(name:string,value:string){
    const dialogRef = this.dialog.open(MatchcodeComponent, {
      width: '40%',
      data: {name: name,value:value},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(name == "MATNR"){
        this.editarPosicionForm.controls['matnr'].setValue(result);
      }
      if(name == "KOSTL"){
        this.editarPosicionForm.controls['ccosto'].setValue(result);
      }
    });
  }


  acortarDescripcion(valor:string){
    let result = valor;
    return (result.length > 80) ? ((result).slice(0, 80) + '...') : result
  }
}
