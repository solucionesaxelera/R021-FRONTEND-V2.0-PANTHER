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

@Component({
  selector: 'app-crear-solpe',
  templateUrl: './crear-solpe.component.html',
  styleUrls: ['./crear-solpe.component.scss']
})
export class CrearSolpeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

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
    private _cd:ChangeDetectorRef
  ) { }

  displayedColumns: string[] = ['presu', 'menge', 'meins', 'descr', 'matnr', 'ccosto', 'gl', 'punit', 'totsinigv','accion'];
  
  ELEMENT_DATA_CREAR_SOLPE: any[] = [];

  dataSourceCrearSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_CREAR_SOLPE);

  cabeceraCrearSolpeForm = new FormGroup({
    Id:  new FormControl(''),
    Nroreq: new FormControl('',[Validators.required]),
    Area: new FormControl('',[Validators.required]),
    Fecha: new FormControl('',[Validators.required]),
    Moneda: new FormControl('',[Validators.required]),
    Centro: new FormControl('',[Validators.required]),
    DescrSolpe: new FormControl('')
  });

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    this.cabeceraCrearSolpeForm.controls['Fecha'].setValue(moment().format("YYYY-MM-DD"))
    this.dataSourceCrearSolpe.paginator = this.paginator;
    this.dataSourceCrearSolpe.sort = this.sort;
    this._cd.detectChanges();
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

  eliminarPosicion(item:number){
    if(this.dataSourceCrearSolpe.data.length>=2)
    for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
      if(this.dataSourceCrearSolpe.data[ind].item == item){
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
      req.presu.trim()=="" ||
      req.menge.trim()=="" ||
      req.meins.trim()=="" ||
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
      
      for (let ind = 0; ind < this.dataSourceCrearSolpe.data.length; ind++) {
        if(this.dataSourceCrearSolpe.data[ind].item == item){
          this.dataSourceCrearSolpe.data[ind].presu = req.presu;
          this.dataSourceCrearSolpe.data[ind].menge = req.menge;
          this.dataSourceCrearSolpe.data[ind].meins = req.meins;
          this.dataSourceCrearSolpe.data[ind].descr = req.descr;
          this.dataSourceCrearSolpe.data[ind].matnr = req.matnr;
          this.dataSourceCrearSolpe.data[ind].ccosto = req.ccosto;
          this.dataSourceCrearSolpe.data[ind].gl = req.gl;
          this.dataSourceCrearSolpe.data[ind].punit = req.punit;
          this.dataSourceCrearSolpe.data[ind].totsinigv = req.totsinigv;
          this.dataSourceCrearSolpe.data = [...this.dataSourceCrearSolpe.data];
        }
        if(this.dataSourceCrearSolpe.data.length - 1 == ind){
          this.idSeleccionadoEditarPosicion = 0;
        }
      }
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
              this.dataSourceCrearSolpe.data[ind].matnr = result;
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
    let result = valor;
    return (result.length > 80) ? ((result).slice(0, 80) + '...') : result
  }

}
