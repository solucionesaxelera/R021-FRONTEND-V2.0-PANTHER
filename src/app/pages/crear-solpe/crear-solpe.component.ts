import { ChangeDetectorRef, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { MatSort, MatSortable, Sort } from '@angular/material/sort';
import { MatchcodeService } from 'src/app/services/matchcode/matchcode.service';
import { UsuariosService } from 'src/app/services/administrador/usuarios/usuarios.service';
import { translate } from '@rxweb/translate';

@Component({
  selector: 'app-crear-solpe',
  templateUrl: './crear-solpe.component.html',
  styleUrls: ['./crear-solpe.component.scss']
})
export class CrearSolpeComponent implements OnInit {

  @translate({translationName:'crearsolpe'}) crearsolpe: any;

  @ViewChild(MatPaginator,{static : true}) paginator: any;
  @ViewChild(MatSort) sort: any;

  indicadorCarga:Boolean=false;
  totalSinIgv:any=0;

  tipoMonedas:any = [];

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
    private _cd:ChangeDetectorRef,
    private _matchcodeS: MatchcodeService,
    private _usuariosS: UsuariosService
  ) { 
    
  }

  displayedColumns: string[] = ['presu', 'menge', 'meins', 'descr', 'matnr', 'stock', 'ccosto','gl', 'punit', 'totsinigv','accion'];
  
  ELEMENT_DATA_CREAR_SOLPE: any[] = [];

  dataSourceCrearSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_CREAR_SOLPE);

  cabeceraCrearSolpeForm = new FormGroup({
    Id:  new FormControl(''),
    // Nroreq: new FormControl(''),
    Area: new FormControl('',[Validators.required]),
    Fecha: new FormControl('',[Validators.required]),
    Moneda: new FormControl('',[Validators.required]),
    Centro: new FormControl('',[Validators.required]),
    DescrSolpe: new FormControl('')
  });


  detalleJson = {
    ParaSerusado: "",
    Locacion:  "",
    FechaReque:  "",
    ProveSuge:  "",
    Ocotiza:  "",
    SoNomb:  "",
    SoCargo:  "",
    SoAsigna: "",
    SoFecha: moment().format("YYYY-MM-DD"),
    CoNomb: "",
    CoCargo: "",
    CoAsigna: "",
    CoCorreo:"",
    CoFecha: moment().format("YYYY-MM-DD"),
    AuNomb: "",
    AuCargo: "",
    AuAsigna: "",
    AuCorreo:"",
    AuFecha: moment().format("YYYY-MM-DD")
  }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = '';
    this._usuariosS.getUsuarioById(this.helper.decodeToken(this.token).id).subscribe(data=>{
      this.detalleJson.SoNomb = data.body[0].nombres + " " + data.body[0].ape_pat + " " + data.body[0].ape_mat;
      this.detalleJson.SoCargo = data.body[0].cargo;

      let req_json_sap = {
        IsAccion: "L",
        IsAprobador1: "",
        IsAprobador2: "",
        IsCreador: data.body[0].usuario,
        ItCcosto: [],
        ItSociedad: []
      }
      this._usuariosS.postAprobadoresSAP(req_json_sap).subscribe(dataAprobadores=>{
        if(dataAprobadores.esSolpeUsersField.aprobador2Field == ""){
          this._usuariosS.getUsuarioByUsuario(dataAprobadores.esSolpeUsersField.aprobador1Field).subscribe(dataUsuario=>{
            this.detalleJson.CoNomb = dataUsuario.body[0].nombres + " " + dataUsuario.body[0].ape_pat + " " + dataUsuario.body[0].ape_mat;
            this.detalleJson.CoCargo = dataUsuario.body[0].cargo;
            this.detalleJson.CoCorreo = dataUsuario.body[0].correo;
            this.detalleJson.AuNomb = dataUsuario.body[0].nombres + " " + dataUsuario.body[0].ape_pat + " " + dataUsuario.body[0].ape_mat;
            this.detalleJson.AuCargo = dataUsuario.body[0].cargo;
            this.detalleJson.AuCorreo = dataUsuario.body[0].correo;
          });
        }else{
          this._usuariosS.getUsuarioByUsuario(dataAprobadores.esSolpeUsersField.aprobador1Field).subscribe(dataUsuario=>{
            this.detalleJson.CoNomb = dataUsuario.body[0].nombres + " " + dataUsuario.body[0].ape_pat + " " + dataUsuario.body[0].ape_mat;
            this.detalleJson.CoCargo = dataUsuario.body[0].cargo;
            this.detalleJson.CoCorreo = dataUsuario.body[0].correo;
          });
          this._usuariosS.getUsuarioByUsuario(dataAprobadores.esSolpeUsersField.aprobador2Field).subscribe(dataUsuario=>{
            this.detalleJson.AuNomb = dataUsuario.body[0].nombres + " " + dataUsuario.body[0].ape_pat + " " + dataUsuario.body[0].ape_mat;
            this.detalleJson.AuCargo = dataUsuario.body[0].cargo;
            this.detalleJson.AuCorreo = dataUsuario.body[0].correo;
          });
        }

      });
    });
  }

  ngAfterViewInit() {
    this.cabeceraCrearSolpeForm.controls['Fecha'].setValue(moment().format("YYYY-MM-DD"))
    this.dataSourceCrearSolpe.paginator = this.paginator;
    this.dataSourceCrearSolpe.sort = this.sort;
    this._cd.detectChanges();
    this.cargarTipoMonedas();
  }

  openAgregarPosicion(){
    if(this.dataSourceCrearSolpe.data.length >= 2 ){
      
      this.idSeleccionadoEditarPosicion = this.verificarItem(this.dataSourceCrearSolpe.data.length+1);
      this.dataSourceCrearSolpe.data.push({
        item: this.verificarItem(this.dataSourceCrearSolpe.data.length + 1),
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
      this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
    }else{
      this.idSeleccionadoEditarPosicion = this.dataSourceCrearSolpe.data.length +1;
      this.dataSourceCrearSolpe.data.push({
        item: this.dataSourceCrearSolpe.data.length + 1,
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
      this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
    }

  }
  verificarItem(item:number){
    if(this.dataSourceCrearSolpe.data[this.dataSourceCrearSolpe.data.length-1].item==item){
      return item +1;
    }else{
      return item
    }
  }

  crearSolpe(req:any){

    if(this.detalleJson.ParaSerusado.trim() == "" &&
    this.detalleJson.Locacion.trim() == "" &&
    this.detalleJson.FechaReque.trim() == "" &&
    this.detalleJson.ProveSuge.trim() == "" &&
    this.detalleJson.Ocotiza.trim() == ""){
      this._snackBar.open("Por favor complete todos los campos obligatorios.", 'cerrar',{
        duration:5*1000
      });
    }else{
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
          Usuario:this.helper.decodeToken(this.token).usuario.trim(),
          Detalle: this.dataSourceCrearSolpe.data,
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
          CoCorreo: this.detalleJson.CoCorreo,
          CoFecha: moment(this.detalleJson.CoFecha).format("YYYYMMDD"),
          AuNomb: this.detalleJson.AuNomb,
          AuCargo: this.detalleJson.AuCargo,
          AuAsigna: this.detalleJson.AuAsigna,
          AuCorreo: this.detalleJson.AuCorreo,
          AuFecha: moment(this.detalleJson.AuFecha).format("YYYYMMDD"),
          Sociedad: this.helper.decodeToken(this.token).sociedad.trim(),
          Comentario:""
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
          });
          this.cabeceraCrearSolpeForm.reset();
          this.dataSourceCrearSolpe.data = [];
          this.indicadorCarga=false;
  
          this.detalleJson.ParaSerusado = "";
          this.detalleJson.Locacion = "";
          this.detalleJson.FechaReque = "";
          this.detalleJson.ProveSuge = "";
          this.detalleJson.Ocotiza = "";
          this.totalSinIgv = 0;
          // this.detalleJson.SoNomb = "";
          // this.detalleJson.SoCargo = "";
          // this.detalleJson.SoAsigna = ""; 
          // this.detalleJson.SoFecha = "";
          // this.detalleJson.CoNomb = "";
          // this.detalleJson.CoCargo = "";
          // this.detalleJson.CoAsigna = "";
          // this.detalleJson.CoFecha = "";
          // this.detalleJson.AuNomb = "";
          // this.detalleJson.AuCargo = "";
          // this.detalleJson.AuAsigna = "";
          // this.detalleJson.AuFecha = "";
  
        }else{
          this.indicadorCarga=false;
        }
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
          duration:5*1000
        });
      })
    }

  }


  validacionInputNroRequisicion(valor:any){
    let code = valor.keyCode;
    if(code>=48 && code<=57){
      if(valor.target.value.length == 4){
        valor.target.value += "-"
      }
      return true;
    }else{
      return false;
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
    }
    else{
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
    if(this.dataSourceCrearSolpe.data.length>=2)
    for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
      if(this.dataSourceCrearSolpe.data[ind].item == item){
        this.totalSinIgv = parseFloat(this.totalSinIgv) - parseFloat(this.dataSourceCrearSolpe.data[ind].totsinigv);
        this.dataSourceCrearSolpe.data.splice(ind,1)
      }
    }else{
      this.dataSourceCrearSolpe.data=[];
    }
    this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
    this.idSeleccionadoEditarPosicion = 0;
  }

  abrirEditarPosicion(id:number){
    this.idSeleccionadoEditarPosicion = id;
  }

  editarPosicion(req:any,item:any){
    if(
      // req.presu.trim()=="" ||
      req.menge.trim()=="" ||
      req.descr.trim()=="" ||
      // req.matnr.trim()=="" ||
      req.ccosto.trim()=="" ||
      req.gl.trim()=="" ||
      req.punit.trim()==""
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
          Nroreq: "",
          Area: this.cabeceraCrearSolpeForm.controls['Area'].value,
          Fecha:moment(this.cabeceraCrearSolpeForm.controls['Fecha'].value).format("YYYYMMDD"),
          Moneda:this.cabeceraCrearSolpeForm.controls['Moneda'].value,
          Centro:this.cabeceraCrearSolpeForm.controls['Centro'].value,
          DescrSolpe: this.cabeceraCrearSolpeForm.controls['DescrSolpe'].value,
          Estado: "",
          Usuario:this.helper.decodeToken(this.token).usuario.trim(),
          Detalle: [this.dataSourceCrearSolpe.data[this.dataSourceCrearSolpe.data.length - 1]],
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
          Comentario:""
        }
      }
      // let json_req_info_extra_und = {
      //   IsCentro: this.cabeceraCrearSolpeForm.controls['Centro'].value,
      //   IsMaterial: req.matnr,
      //   IsValor: "UNIDAD"
      // }
      // this._matchcodeS.postInfoExtra(json_req_info_extra_und).subscribe(dataextra=>{
        this.totalSinIgv = 0;
        // if(dataextra.etMsgReturnField[0].successField == 'X'){
          for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
            if(this.dataSourceCrearSolpe.data[ind].item == item){
              this.dataSourceCrearSolpe.data[ind].presu = req.presu;
              this.dataSourceCrearSolpe.data[ind].menge = req.menge;
              // this.dataSourceCrearSolpe.data[ind].meins = dataextra.esUnitField;
              this.dataSourceCrearSolpe.data[ind].descr = req.descr;
              this.dataSourceCrearSolpe.data[ind].matnr = req.matnr;
              this.dataSourceCrearSolpe.data[ind].ccosto = req.ccosto;
              this.dataSourceCrearSolpe.data[ind].gl = req.gl;
              this.dataSourceCrearSolpe.data[ind].punit = req.punit;
              // this.dataSourceCrearSolpe.data[ind].totsinigv = req.totsinigv;
              this.dataSourceCrearSolpe.data[ind].totsinigv = (req.menge * req.punit).toFixed(2);
              this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
             
              // if(ind>=1){
                
              // }else{
              //   this.totalSinIgv = parseFloat(this.dataSourceCrearSolpe.data[ind].totsinigv);
              // }

              // this.totalSinIgv = parseFloat(this.totalSinIgv) + parseFloat(this.dataSourceCrearSolpe.data[ind].totsinigv);
            }
            this.totalSinIgv = parseFloat(this.totalSinIgv) + parseFloat(this.dataSourceCrearSolpe.data[ind].totsinigv);
            if(this.dataSourceCrearSolpe.data.length - 1 == ind){
              // let json_req_info_extra = {
              //   IsCentro: this.cabeceraCrearSolpeForm.controls['Centro'].value,
              //   IsMaterial: req.matnr,
              //   IsValor: "STOCK"
              // }
              // this._matchcodeS.postInfoExtra(json_req_info_extra).subscribe(dataStock=>{
              //   this.dataSourceCrearSolpe.data[ind].stock = dataStock.esCantidadField;
              //   this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
              //   if(dataStock.etMsgReturnField[0].successField == 'X'){
                  this._crearSolpeS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
                    if(data.etMsgReturnField[0].successField == 'X'){
                          this.idSeleccionadoEditarPosicion = 0;
                    }else{
                      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
                        duration:5*1000
                      });
                    }
                  },err=>{
                    this._snackBar.open("Ocurrió un error con el servicio.", 'cerrar',{
                      duration:5*1000
                    });
                  });
              //   }else{
              //     this._snackBar.open(dataStock.etMsgReturnField[0].messageField, 'cerrar',{
              //       duration:5*1000
              //     });
              //   }
              // });
  
            }
          }
      //   }else{
      //     this._snackBar.open(dataextra.etMsgReturnField[0].messageField, 'cerrar',{
      //       duration:5*1000
      //     });
      //   }
      // })


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

  matchcodeAgregarPosicion(name:string,value:string,item:any){
    const dialogRef = this.dialog.open(MatchcodeComponent, {
      width: '40%',
      data: {name: name,value:value},
      disableClose:true
    });
    dialogRef.afterClosed().subscribe(result => {
      for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
        if(this.dataSourceCrearSolpe.data[ind].item == item){
          switch (name) {
            case  "MATNR":
              this.dataSourceCrearSolpe.data[ind].matnr = result.matnrField;
              this.dataSourceCrearSolpe.data[ind].maktgField = result.maktgField;
              this.calcularStockUnidadDesdeMatchcode(result.matnrField,item)
              break;
            case  "KOSTL":
              this.dataSourceCrearSolpe.data[ind].ccosto = result;
              break;
            case  "MSEHI":
              this.dataSourceCrearSolpe.data[ind].meins = result;
            break;
            case  "SAKNR":
              this.dataSourceCrearSolpe.data[ind].gl = result;
              break;
            default:
              break;
          } 
        }
      }
    });
  }

  acortarDescripcion(valor:string){
    // let result = valor;
    // return (result.length > 80) ? ((result).slice(0, 80) + '...') : result
    return valor;
  }

  calcularTotalSinIgv(data:any){
    return data.toFixed(2)
  }

  calcularStockUnidadDesdeMatchcode(value:any,item:any){
    let json_req_info_extra_stock = {
      IsCentro: this.cabeceraCrearSolpeForm.controls['Centro'].value,
      IsMaterial: value,
      IsValor: "STOCK"
    }
    this._matchcodeS.postInfoExtra(json_req_info_extra_stock).subscribe(data=>{
      console.log(data);
      for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
        if(this.dataSourceCrearSolpe.data[ind].item == item){
          this.dataSourceCrearSolpe.data[ind].stock = data.esCantidadField;
        }
      }
    });

    let json_req_info_extra_und = {
      IsCentro: this.cabeceraCrearSolpeForm.controls['Centro'].value,
      IsMaterial: value,
      IsValor: "UNIDAD"
    }
    this._matchcodeS.postInfoExtra(json_req_info_extra_und).subscribe(data=>{
      console.log(data);
      for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
        if(this.dataSourceCrearSolpe.data[ind].item == item){
          this.dataSourceCrearSolpe.data[ind].meins = data.esUnitField;
        }
      }
    });
  }

  calcularStockUnidadInput(value:any,e:any,item:any){
    console.log("...CARGANDO")
    if(e.key=='Enter'){
      let json_req_info_extra_stock = {
        IsCentro: this.cabeceraCrearSolpeForm.controls['Centro'].value,
        IsMaterial: value,
        IsValor: "STOCK"
      }
      this._matchcodeS.postInfoExtra(json_req_info_extra_stock).subscribe(data=>{
        console.log(data);
        for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
          if(this.dataSourceCrearSolpe.data[ind].item == item){
            this.dataSourceCrearSolpe.data[ind].stock = data.esCantidadField;
          }
        }
      });

      let json_req_info_extra_und = {
        IsCentro: this.cabeceraCrearSolpeForm.controls['Centro'].value,
        IsMaterial: value,
        IsValor: "UNIDAD"
      }
      this._matchcodeS.postInfoExtra(json_req_info_extra_und).subscribe(data=>{
        console.log(data);
        for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
          if(this.dataSourceCrearSolpe.data[ind].item == item){
            this.dataSourceCrearSolpe.data[ind].meins = data.esUnitField;
          }
        }
      });
    }
  }
  
  cargarTipoMonedas(){
    let req_json = {
      IsBukrs: this.helper.decodeToken(this.token).sociedad,
      IsCeco: "",
      IsMatnr: "",
      IsNameCeco: "",
      IsNameMatnr: "",
      IsParametro: "WAERS",
      IsSaknr: "",
      IsUsuario: "",
      IsWerks: "",
      ItBukrs:[]
    }
    this._matchcodeS.postSolpeOptionsMatchcode(req_json).subscribe(data=>{
      console.log(data);
      this.tipoMonedas = data.etMonedasField;
    });
  }

}
