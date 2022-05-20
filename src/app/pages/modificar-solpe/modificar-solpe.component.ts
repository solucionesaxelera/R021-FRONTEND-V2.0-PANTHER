import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { tableModificarPosicionI } from 'src/app/models/modificar-solpe';
import { CrearSolpeService } from 'src/app/services/crear-solpe/crear-solpe.service';

@Component({
  selector: 'app-modificar-solpe',
  templateUrl: './modificar-solpe.component.html',
  styleUrls: ['./modificar-solpe.component.scss']
})
export class ModificarSolpeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild("dialogEditarPosicion") dialogTemplateEditarPosicion: any;
  @ViewChild("dialogEliminarSolpe") dialogTemplateEliminarSolpe: any;

  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();

  config?: MatDialogConfig;
  deshabilitarModificarInput:boolean = true;
  idSeleccionadoEditarPosicion:number = 0;
  idSolpe:any = "";

  constructor(
    public dialog: MatDialog,
    private _SolpeOptionPrelimS : CrearSolpeService,
    private _snackBar: MatSnackBar,
  ) { }

  displayedColumnsModificarSolpe: string[] = ['presu', 'menge', 'meins', 'descr', 'matnr', 'ccosto', 'gl', 'punit', 'totsinigv','accion'];
  
  ELEMENT_DATA_MODIFICAR_SOLPE: tableModificarPosicionI[] = [];

  dataSourceModificarSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_MODIFICAR_SOLPE);

  cabeceraModificarSolpeForm = new FormGroup({
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

  buscarSolpe(){
    this.dataSourceModificarSolpe.data = [];
    let json_req={
      IsAccion: "B",
      IsIdSolpe: this.idSolpe,
      IsItem: "",
      IsSolpePrelimCab: {
        Id: "",
        Nroreq: "",
        Area: "",
        Fecha: "",
        Moneda: "",
        Centro: "",
        DescrSolpe: "",
        Estado: "",
        Usuario: "",
        Detalle: []
      }
    }
    this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{

      if(data.etMsgReturnField[0].successField=="X"){
        this.cabeceraModificarSolpeForm.controls['Nroreq'].setValue(data.esSolpePrelimCabField.nroreqField);
        this.cabeceraModificarSolpeForm.controls['Area'].setValue(data.esSolpePrelimCabField.areaField);
        this.cabeceraModificarSolpeForm.controls['Fecha'].setValue(moment(data.esSolpePrelimCabField.fechaField).format("YYYY-MM-DD"));
        this.cabeceraModificarSolpeForm.controls['Moneda'].setValue(data.esSolpePrelimCabField.monedaField);
        this.cabeceraModificarSolpeForm.controls['Centro'].setValue(data.esSolpePrelimCabField.centroField);
        this.cabeceraModificarSolpeForm.controls['DescrSolpe'].setValue(data.esSolpePrelimCabField.descrSolpeField);
  
        for (let i = 0; i < data.esSolpePrelimCabField.detalleField.length; i++) {
          this.dataSourceModificarSolpe.data.push({
            item: data.esSolpePrelimCabField.detalleField[i].itemField,
            presu: data.esSolpePrelimCabField.detalleField[i].presuField,
            menge: data.esSolpePrelimCabField.detalleField[i].mengeField,
            meins: data.esSolpePrelimCabField.detalleField[i].meinsField,
            descr: data.esSolpePrelimCabField.detalleField[i].descrField,
            matnr: data.esSolpePrelimCabField.detalleField[i].matnrField,
            ccosto: data.esSolpePrelimCabField.detalleField[i].ccostoField,
            gl: data.esSolpePrelimCabField.detalleField[i].glField,
            punit: data.esSolpePrelimCabField.detalleField[i].punitField,
            totsinigv: data.esSolpePrelimCabField.detalleField[i].totSinigvField
          });
          this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
        }
        this.dataSourceModificarSolpe.paginator = this.paginator;
      }
      else{
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
          duration:5*1000
        });
      }

    })
  }

  modificarSolpe(req:any){
    let json_req={
      IsAccion: "M",
      IsIdSolpe: "",
      IsItem: "",
      IsSolpePrelimCab: {
        Id: this.idSolpe,
        Nroreq: req.Nroreq,
        Area: req.Area,
        Fecha: moment(req.Fecha).format("YYYYMMDD"),
        Moneda:req.Moneda,
        Centro:req.Centro,
        DescrSolpe: req.DescrSolpe,
        Estado: "",
        Usuario:this.helper.decodeToken(this.token).usuario,
        Detalle: this.dataSourceModificarSolpe.data
      }
    }
    this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
      if(data.etMsgReturnField[0].successField == 'X'){
        this.idSolpe="";
        this.dataSourceModificarSolpe.data = [];
        this.cabeceraModificarSolpeForm.reset();
      }
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
        duration:5*1000
      });
    });
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
    this.dataSourceModificarSolpe.data.splice(id,1);
    this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
  }

  abrirEditarPosicion(id:number){
    this.idSeleccionadoEditarPosicion = id;
    
    this.editarPosicionForm.controls['presu'].setValue(this.dataSourceModificarSolpe.data[id].presu);
    this.editarPosicionForm.controls['menge'].setValue(this.dataSourceModificarSolpe.data[id].menge);
    this.editarPosicionForm.controls['meins'].setValue(this.dataSourceModificarSolpe.data[id].meins);
    this.editarPosicionForm.controls['descr'].setValue(this.dataSourceModificarSolpe.data[id].descr);
    this.editarPosicionForm.controls['matnr'].setValue(this.dataSourceModificarSolpe.data[id].matnr);
    this.editarPosicionForm.controls['ccosto'].setValue(this.dataSourceModificarSolpe.data[id].ccosto);
    this.editarPosicionForm.controls['gl'].setValue(this.dataSourceModificarSolpe.data[id].gl);
    this.editarPosicionForm.controls['punit'].setValue(this.dataSourceModificarSolpe.data[id].punit);
    this.editarPosicionForm.controls['totsinigv'].setValue(this.dataSourceModificarSolpe.data[id].totsinigv);

    return this.dialog.open(this.dialogTemplateEditarPosicion, this.config);
  }

  editarPosicion(req:any){

    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].presu = req.presu;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].menge = req.menge;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].meins = req.meins;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].descr = req.descr;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].matnr = req.matnr;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].ccosto = req.ccosto;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].gl = req.gl;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].punit = req.punit;
    this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].totsinigv = req.totsinigv;

    this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
    if(this.editarPosicionForm.valid){
      this.editarPosicionForm.reset();
      this.dialog.closeAll();
    }
  }

  abrirEliminarSolpe(){
    return this.dialog.open(this.dialogTemplateEliminarSolpe, this.config);
  }

  eliminarSolpe(){
    let json_req={
      IsAccion: "ES",
      IsIdSolpe: this.idSolpe,
      IsItem: "",
      IsSolpePrelimCab: {
        Id: "",
        Nroreq: "",
        Area: "",
        Fecha: "",
        Moneda: "",
        Centro: "",
        DescrSolpe: "",
        Estado: "",
        Usuario: "",
        Detalle: []
      }
    }
    this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
      if(data.etMsgReturnField[0].successField == 'X'){
        this.idSolpe="";
        this.dataSourceModificarSolpe.data = [];
        this.cabeceraModificarSolpeForm.reset();
        this.dialog.closeAll();
      }
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
        duration:5*1000
      });
    });
  }

}