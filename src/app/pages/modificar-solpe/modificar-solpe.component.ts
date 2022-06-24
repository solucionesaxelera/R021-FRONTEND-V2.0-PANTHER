import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { MatchcodeComponent } from 'src/app/components/matchcode/matchcode.component';
import { tableModificarPosicionI } from 'src/app/models/modificar-solpe';
import { AuditoriaService } from 'src/app/services/auditoria/auditoria.service';
import { CrearSolpeService } from 'src/app/services/crear-solpe/crear-solpe.service';
import { MatchcodeService } from 'src/app/services/matchcode/matchcode.service';

@Component({
  selector: 'app-modificar-solpe',
  templateUrl: './modificar-solpe.component.html',
  styleUrls: ['./modificar-solpe.component.scss']
})
export class ModificarSolpeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any;
  // @ViewChild("dialogEditarPosicion") dialogTemplateEditarPosicion: any;
  @ViewChild("dialogEliminarSolpe") dialogTemplateEliminarSolpe: any;
  @ViewChild(MatSort) sort: any;

  indicadorCarga:Boolean=false;

  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();

  config?: MatDialogConfig;
  deshabilitarModificarInput:boolean = true;
  idSeleccionadoEditarPosicion:number = 0;
  agregarPosicionButton:boolean = false;
  idSolpe:any = "";

  constructor(
    public dialog: MatDialog,
    private _SolpeOptionPrelimS : CrearSolpeService,
    private _snackBar: MatSnackBar,
    private _auditoriaS : AuditoriaService,
    private _cd:ChangeDetectorRef,
    private _matchcodeS: MatchcodeService
  ) { }

  displayedColumnsModificarSolpe: string[] = ['presu', 'menge', 'meins', 'descr', 'matnr', 'stock','ccosto', 'gl', 'punit', 'totsinigv','accion'];
  
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

  // editarPosicionForm = new FormGroup({
  //   item: new FormControl(''),
  //   presu: new FormControl('',[Validators.required]),
  //   menge: new FormControl('',[Validators.required]),
  //   meins: new FormControl('',[Validators.required]),
  //   descr: new FormControl('',[Validators.required]),
  //   matnr: new FormControl('',[Validators.required]),
  //   ccosto: new FormControl('',[Validators.required]),
  //   gl: new FormControl('',[Validators.required]),
  //   punit: new FormControl('',[Validators.required]),
  //   totsinigv: new FormControl('',[Validators.required]),
  // });

  detalleJson = {
    ParaSerusado: "",
    Locacion:  "",
    FechaReque:  "",
    ProveSuge:  "",
    Ocotiza:  "",
    SoNomb:  "",
    SoCargo:  "",
    SoAsigna: "",
    SoFecha: "",
    CoNomb: "",
    CoCargo: "",
    CoAsigna: "",
    CoFecha: "",
    AuNomb: "",
    AuCargo: "",
    AuAsigna: "",
    AuFecha: ""
  }

  ngOnInit(): void {
  }

  openAgregarPosicion(){
    if(this.dataSourceModificarSolpe.data.length >= 2 ){
      
      this.idSeleccionadoEditarPosicion = this.verificarItem(this.dataSourceModificarSolpe.data.length+1);
      this.dataSourceModificarSolpe.data.push({
        item: this.verificarItem(this.dataSourceModificarSolpe.data.length + 1),
        presu: "",
        menge: "",
        meins: "",
        descr: "",
        matnr: "",
        ccosto: "",
        gl: "",
        punit: "",
        totsinigv: ""
      });
      this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
    }else{
      this.idSeleccionadoEditarPosicion = this.dataSourceModificarSolpe.data.length +1;
      this.dataSourceModificarSolpe.data.push({
        item: this.dataSourceModificarSolpe.data.length + 1,
        presu: "",
        menge: "",
        meins: "",
        descr: "",
        matnr: "",
        ccosto: "",
        gl: "",
        punit: "",
        totsinigv: ""
      });
      this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
    }
  }

  verificarItem(item:number){
    if(this.dataSourceModificarSolpe.data[this.dataSourceModificarSolpe.data.length-1].item==item){
      return item +1;
    }else{
      return item
    }
  }

  buscarSolpe(){
    this.idSeleccionadoEditarPosicion=0;
    this.indicadorCarga = true;
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
      this.indicadorCarga = false;
      if(data.etMsgReturnField[0].successField=="X"){
        this.cabeceraModificarSolpeForm.controls['Nroreq'].setValue(data.esSolpePrelimCabField.nroreqField);
        this.cabeceraModificarSolpeForm.controls['Area'].setValue(data.esSolpePrelimCabField.areaField);
        this.cabeceraModificarSolpeForm.controls['Fecha'].setValue(moment(data.esSolpePrelimCabField.fechaField).format("YYYY-MM-DD"));
        this.cabeceraModificarSolpeForm.controls['Moneda'].setValue(data.esSolpePrelimCabField.monedaField);
        this.cabeceraModificarSolpeForm.controls['Centro'].setValue(data.esSolpePrelimCabField.centroField);
        this.cabeceraModificarSolpeForm.controls['DescrSolpe'].setValue(data.esSolpePrelimCabField.descrSolpeField);

        this.detalleJson.ParaSerusado = data.esSolpePrelimCabField.paraSerusadoField;
        this.detalleJson.Locacion = data.esSolpePrelimCabField.locacionField;
        this.detalleJson.FechaReque = moment(data.esSolpePrelimCabField.fechaRequeField).format("YYYY-MM-DD");
        this.detalleJson.ProveSuge = data.esSolpePrelimCabField.proveSugeField;
        this.detalleJson.Ocotiza = data.esSolpePrelimCabField.ocotizaField;
        this.detalleJson.SoNomb = data.esSolpePrelimCabField.soNombField;
        this.detalleJson.SoCargo = data.esSolpePrelimCabField.soCargoField;
        this.detalleJson.SoAsigna = data.esSolpePrelimCabField.soAsignaField;
        this.detalleJson.SoFecha = moment(data.esSolpePrelimCabField.soFechaField).format("YYYY-MM-DD");
        this.detalleJson.CoNomb = data.esSolpePrelimCabField.coNombField;
        this.detalleJson.CoCargo = data.esSolpePrelimCabField.coCargoField;
        this.detalleJson.CoAsigna = data.esSolpePrelimCabField.coAsignaField;
        this.detalleJson.CoFecha = moment(data.esSolpePrelimCabField.coFechaField).format("YYYY-MM-DD");
        this.detalleJson.AuNomb = data.esSolpePrelimCabField.auNombField;
        this.detalleJson.AuCargo = data.esSolpePrelimCabField.auCargoField;
        this.detalleJson.AuAsigna = data.esSolpePrelimCabField.auAsignaField;
        this.detalleJson.AuFecha = moment(data.esSolpePrelimCabField.auFechaField).format("YYYY-MM-DD");
  
        this.metodoPushTabla(data.esSolpePrelimCabField.detalleField);
        // for (let i = 0; i < data.esSolpePrelimCabField.detalleField.length; i++) {
        //   this.agregarPosicionButton = true;
        //   this.dataSourceModificarSolpe.data.push({
        //     item: data.esSolpePrelimCabField.detalleField[i].itemField,
        //     presu: data.esSolpePrelimCabField.detalleField[i].presuField,
        //     menge: data.esSolpePrelimCabField.detalleField[i].mengeField,
        //     meins: data.esSolpePrelimCabField.detalleField[i].meinsField,
        //     descr: data.esSolpePrelimCabField.detalleField[i].descrField,
        //     matnr: data.esSolpePrelimCabField.detalleField[i].matnrField,
        //     stock: this.calcularStock(data.esSolpePrelimCabField.detalleField[i].matnrField),
        //     ccosto: data.esSolpePrelimCabField.detalleField[i].ccostoField,
        //     gl: data.esSolpePrelimCabField.detalleField[i].glField,
        //     punit: data.esSolpePrelimCabField.detalleField[i].punitField,
        //     totsinigv: data.esSolpePrelimCabField.detalleField[i].totSinigvField
        //   });
        //   this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
        //   console.log(this.dataSourceModificarSolpe.data)
        // }
        // this.dataSourceModificarSolpe.paginator = this.paginator;
        // this.dataSourceModificarSolpe.sort = this.sort;
      }
      else{
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
          duration:5*1000
        });
      }

    })
  }

  async metodoPushTabla(data:any){
      
      for (let i = 0; i < data.length; i++) {
          this.agregarPosicionButton = true;
          let stock_temp = await this.calcularStock(data[i].matnrField);
          await this.dataSourceModificarSolpe.data.push({
            item: data[i].itemField,
            presu: data[i].presuField,
            menge: data[i].mengeField,
            meins: data[i].meinsField,
            descr: data[i].descrField,
            matnr: data[i].matnrField,
            stock: stock_temp,
            ccosto: data[i].ccostoField,
            gl: data[i].glField,
            punit: data[i].punitField,
            totsinigv: data[i].totSinigvField
          });
          // this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
          console.log(this.dataSourceModificarSolpe.data)
        }
        this.dataSourceModificarSolpe.paginator = this.paginator;
        this.dataSourceModificarSolpe.sort = this.sort;
  }

  modificarSolpe(req:any){

    if(this.detalleJson.ParaSerusado.trim() == "" &&
    this.detalleJson.Locacion.trim() == "" &&
    this.detalleJson.FechaReque.trim() == "" &&
    this.detalleJson.ProveSuge.trim() == "" &&
    this.detalleJson.Ocotiza.trim() == ""){
      this._snackBar.open("Por favor complete todos los campos obligatorios.", 'cerrar',{
        duration:5*1000
      });
    }else{
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
          Detalle: this.dataSourceModificarSolpe.data,
          ParaSerusado: this.detalleJson.ParaSerusado,
          Locacion:  this.detalleJson.Locacion,
          FechaReque:  moment(this.detalleJson.FechaReque).format("YYYYMMDD"),
          ProveSuge:  this.detalleJson.ProveSuge,
          Ocotiza:  this.detalleJson.Ocotiza,
          SoNomb:  this.detalleJson.SoNomb,
          SoCargo:  this.detalleJson.SoCargo,
          SoAsigna: this.detalleJson.SoAsigna,
          SoFecha: moment(this.detalleJson.SoFecha).format("YYYYMMDD"),
          CoNomb: this.detalleJson.CoNomb,
          CoCargo: this.detalleJson.CoCargo,
          CoAsigna: this.detalleJson.CoAsigna,
          CoFecha: moment(this.detalleJson.CoFecha).format("YYYYMMDD"),
          AuNomb: this.detalleJson.AuNomb,
          AuCargo: this.detalleJson.AuCargo,
          AuAsigna: this.detalleJson.AuAsigna,
          AuFecha: moment(this.detalleJson.AuFecha).format("YYYYMMDD"),
          Sociedad: this.helper.decodeToken(this.token).sociedad.trim()
        }
      }
      this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
        if(data.etMsgReturnField[0].successField == 'X'){
  
          let json_req_auditoria = {
            id_solpe:data.esSolpePrelimCabField.idField,
            usuario:this.helper.decodeToken(this.token).usuario,
            accion:"M"
          }
          this._auditoriaS.postAuditoria(json_req_auditoria).subscribe(data=>{
          });
          this.idSolpe="";
          this.dataSourceModificarSolpe.data = [];
          this.cabeceraModificarSolpeForm.reset();
          this.agregarPosicionButton = false;
  
          this.detalleJson.ParaSerusado = "";
          this.detalleJson.Locacion = "";
          this.detalleJson.FechaReque = "";
          this.detalleJson.ProveSuge = "";
          this.detalleJson.Ocotiza = "";
          this.detalleJson.SoNomb = "";
          this.detalleJson.SoCargo = "";
          this.detalleJson.SoAsigna = ""; 
          this.detalleJson.SoFecha = "";
          this.detalleJson.CoNomb = "";
          this.detalleJson.CoCargo = "";
          this.detalleJson.CoAsigna = "";
          this.detalleJson.CoFecha = "";
          this.detalleJson.AuNomb = "";
          this.detalleJson.AuCargo = "";
          this.detalleJson.AuAsigna = "";
          this.detalleJson.AuFecha = "";
  
        }
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
          duration:5*1000
        });
      });
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

  eliminarPosicion(item:number){
    // this.dataSourceModificarSolpe.data.splice(id,1);
    // this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
    if(this.dataSourceModificarSolpe.data.length>=2)
    for (let ind = 0; ind < this.dataSourceModificarSolpe.data.length; ind++) {
      if(this.dataSourceModificarSolpe.data[ind].item == item){
        this.dataSourceModificarSolpe.data.splice(ind,1)
      }
    }else{
      this.dataSourceModificarSolpe.data=[];
    }
    this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
    this.idSeleccionadoEditarPosicion = 0;
  }

  abrirEditarPosicion(id:number){
    this.idSeleccionadoEditarPosicion = id;
    
    // this.editarPosicionForm.controls['presu'].setValue(this.dataSourceModificarSolpe.data[id].presu);
    // this.editarPosicionForm.controls['menge'].setValue(this.dataSourceModificarSolpe.data[id].menge);
    // this.editarPosicionForm.controls['meins'].setValue(this.dataSourceModificarSolpe.data[id].meins);
    // this.editarPosicionForm.controls['descr'].setValue(this.dataSourceModificarSolpe.data[id].descr);
    // this.editarPosicionForm.controls['matnr'].setValue(this.dataSourceModificarSolpe.data[id].matnr);
    // this.editarPosicionForm.controls['ccosto'].setValue(this.dataSourceModificarSolpe.data[id].ccosto);
    // this.editarPosicionForm.controls['gl'].setValue(this.dataSourceModificarSolpe.data[id].gl);
    // this.editarPosicionForm.controls['punit'].setValue(this.dataSourceModificarSolpe.data[id].punit);
    // this.editarPosicionForm.controls['totsinigv'].setValue(this.dataSourceModificarSolpe.data[id].totsinigv);

    // return this.dialog.open(this.dialogTemplateEditarPosicion, this.config);
  }

  editarPosicion(req:any,item:any){

    if(
      req.presu.trim()=="" ||
      req.menge.trim()=="" ||
      req.descr.trim()=="" ||
      req.matnr.trim()=="" ||
      req.ccosto.trim()=="" ||
      req.gl.trim()=="" ||
      req.punit.trim()=="" ||
      req.totsinigv.trim()==""
      ){
        
      this._snackBar.open("Complete todos los campos", 'cerrar',{
        duration:5*1000
      });
    }else{
      
      let json_req={
        IsAccion: "V",
        IsIdSolpe: "",
        IsItem: "",
        IsSolpePrelimCab: {
          Id: "",
          Nroreq: this.cabeceraModificarSolpeForm.controls['Nroreq'].value,
          Area: this.cabeceraModificarSolpeForm.controls['Area'].value,
          Fecha:this.cabeceraModificarSolpeForm.controls['Moneda'].value ,
          Moneda:this.cabeceraModificarSolpeForm.controls['Moneda'].value,
          Centro:this.cabeceraModificarSolpeForm.controls['Centro'].value,
          DescrSolpe: this.cabeceraModificarSolpeForm.controls['DescrSolpe'].value,
          Estado: "",
          Usuario:this.helper.decodeToken(this.token).usuario.trim(),
          Detalle: this.dataSourceModificarSolpe.data,
          ParaSerusado: "",
          Locacion:  "",
          FechaReque:  "",
          ProveSuge:  "",
          Ocotiza:  "",
          SoNomb:  "",
          SoCargo: "",
          SoAsigna: "",
          SoFecha: "",
          CoNomb: "",
          CoCargo: "",
          CoAsigna: "",
          CoFecha: "",
          AuNomb: "",
          AuCargo: "",
          AuAsigna: "",
          AuFecha: "",
          Sociedad: "",
        }
      }
      this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
        if(data.etMsgReturnField[0].successField == 'X'){
          for (let ind = 0; ind < this.dataSourceModificarSolpe.data.length; ind++) {
            if(this.dataSourceModificarSolpe.data[ind].item == item){
              this.dataSourceModificarSolpe.data[ind].presu = req.presu;
              this.dataSourceModificarSolpe.data[ind].menge = req.menge;
              this.dataSourceModificarSolpe.data[ind].meins = req.meins;
              this.dataSourceModificarSolpe.data[ind].descr = req.descr;
              this.dataSourceModificarSolpe.data[ind].matnr = req.matnr;
              this.dataSourceModificarSolpe.data[ind].ccosto = req.ccosto;
              this.dataSourceModificarSolpe.data[ind].gl = req.gl;
              this.dataSourceModificarSolpe.data[ind].punit = req.punit;
              this.dataSourceModificarSolpe.data[ind].totsinigv = req.totsinigv;
              this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
            }
            if(this.dataSourceModificarSolpe.data.length - 1 == ind){
              this.idSeleccionadoEditarPosicion = 0;
              let json_req_info_extra = {
                IsCentro: this.cabeceraModificarSolpeForm.controls['Centro'].value,
                IsMaterial: req.matnr,
                IsValor: "STOCK"
              }
              this._matchcodeS.postInfoExtra(json_req_info_extra).subscribe(data=>{
                this.dataSourceModificarSolpe.data[ind].stock = data.esCantidadField;
                this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
              })
              let json_req_info_extra_und = {
                IsCentro: this.cabeceraModificarSolpeForm.controls['Centro'].value,
                IsMaterial: req.matnr,
                IsValor: "UNIDAD"
              }
              this._matchcodeS.postInfoExtra(json_req_info_extra_und).subscribe(data=>{
                this.dataSourceModificarSolpe.data[ind].meins = data.esUnitField;
                this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
              })
            }
          }
        }else{
          this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
            duration:5*1000
          });
        }
      },err=>{
        this._snackBar.open("Ocurrió un error con el servicio SAP.", 'cerrar',{
          duration:5*1000
        });
      });
    }

    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].presu = req.presu;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].menge = req.menge;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].meins = req.meins;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].descr = req.descr;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].matnr = req.matnr;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].ccosto = req.ccosto;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].gl = req.gl;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].punit = req.punit;
    // this.dataSourceModificarSolpe.data[this.idSeleccionadoEditarPosicion].totsinigv = req.totsinigv;

    // this.dataSourceModificarSolpe.data = [...this.dataSourceModificarSolpe.data];
    // if(this.editarPosicionForm.valid){
    //   this.editarPosicionForm.reset();
    //   this.dialog.closeAll();
    // }
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
        let json_req_auditoria = {
          id_solpe:data.esSolpePrelimCabField.idField,
          usuario:this.helper.decodeToken(this.token).usuario,
          accion:"E"
        }
        this._auditoriaS.postAuditoria(json_req_auditoria).subscribe(data=>{
          console.log(data)
        });
        this.idSolpe="";
        this.dataSourceModificarSolpe.data = [];
        this.cabeceraModificarSolpeForm.reset();

        this.detalleJson.ParaSerusado = "";
        this.detalleJson.Locacion = "";
        this.detalleJson.FechaReque = "";
        this.detalleJson.ProveSuge = "";
        this.detalleJson.Ocotiza = "";
        this.detalleJson.SoNomb = "";
        this.detalleJson.SoCargo = "";
        this.detalleJson.SoAsigna = ""; 
        this.detalleJson.SoFecha = "";
        this.detalleJson.CoNomb = "";
        this.detalleJson.CoCargo = "";
        this.detalleJson.CoAsigna = "";
        this.detalleJson.CoFecha = "";
        this.detalleJson.AuNomb = "";
        this.detalleJson.AuCargo = "";
        this.detalleJson.AuAsigna = "";
        this.detalleJson.AuFecha = "";

        this.dialog.closeAll();
      }
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
        duration:5*1000
      });
    });
  }

  matchcodeCabecera(name:string,value:string){
    console.log(value)
    const dialogRef = this.dialog.open(MatchcodeComponent, {
      width: '40%',
      data: {name: name,value:value},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      if(name == "WERKS"){
        this.cabeceraModificarSolpeForm.controls['Centro'].setValue(result);
      }
    });
  }
  
  // matchcodeAgregarPosicion(name:string){
  //   const dialogRef = this.dialog.open(MatchcodeComponent, {
  //     width: '40%',
  //     data: {name: name},
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if(name == "MATNR"){
  //       this.agregarPosicionForm.controls['matnr'].setValue(result);
  //     }
  //     if(name == "KOSTL"){
  //       this.agregarPosicionForm.controls['ccosto'].setValue(result);
  //     }
  //   });
  // }

  matchcodeEditarPosicion(name:string,value:string){
    const dialogRef = this.dialog.open(MatchcodeComponent, {
      width: '40%',
      data: {name: name,value:value},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      // if(name == "MATNR"){
      //   this.editarPosicionForm.controls['matnr'].setValue(result);
      // }
      // if(name == "KOSTL"){
      //   this.editarPosicionForm.controls['ccosto'].setValue(result);
      // }
      // if(name == "MSEHI"){
      //   this.editarPosicionForm.controls['meins'].setValue(result);
      // }
      // if(name == "SAKNR"){
      //   this.editarPosicionForm.controls['gl'].setValue(result);
      // }
    });
  }

  matchcodeAgregarPosicion(name:string,value:string,item:any){
    const dialogRef = this.dialog.open(MatchcodeComponent, {
      width: '40%',
      data: {name: name,value:value},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      for (let ind = 0; ind < this.dataSourceModificarSolpe.data.length; ind++) {
        if(this.dataSourceModificarSolpe.data[ind].item == item){
          switch (name) {
            case  "MATNR":
              this.dataSourceModificarSolpe.data[ind].matnr = result;
              break;
            case  "KOSTL":
              this.dataSourceModificarSolpe.data[ind].ccosto = result;
              break;
            case  "MSEHI":
              this.dataSourceModificarSolpe.data[ind].meins = result;
            break;
            case  "SAKNR":
              this.dataSourceModificarSolpe.data[ind].gl = result;
              break;
            default:
              break;
          } 
        }
      }
    });
  }

  acortarDescripcion(valor:string){
    let result = valor;
    return (result.length > 80) ? ((result).slice(0, 80) + '...') : result
  }

  calcularStock(matnr:string){
    let return_data:string="";
    let json_req_info_extra = {
      IsCentro: this.cabeceraModificarSolpeForm.controls['Centro'].value,
      IsMaterial: matnr,
      IsValor: "STOCK"
    }
    return new Promise(resolve => {
      this._matchcodeS.postInfoExtra(json_req_info_extra).subscribe(data=>{
        console.log(data.esCantidadField.trim())
        return_data = data.esCantidadField.trim();
        resolve(return_data);
      })
    });
    
  }

}
