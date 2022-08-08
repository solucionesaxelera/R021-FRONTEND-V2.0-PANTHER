import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { tableLiberarSolpe } from 'src/app/models/liberar-solpe';
import { AuditoriaService } from 'src/app/services/auditoria/auditoria.service';
import { LiberarSolpeService } from 'src/app/services/liberar-solpe/liberar-solpe.service';

@Component({
  selector: 'app-liberar-solpe',
  templateUrl: './liberar-solpe.component.html',
  styleUrls: ['./liberar-solpe.component.scss']
})
export class LiberarSolpeComponent implements OnInit {

  @ViewChild(MatPaginator,{static : true}) paginator: any;
  @ViewChild("dialogAprobarSolped") dialogAprobarSolped: any;
  @ViewChild("dialogRechazarSolped") dialogRechazarSolped: any;

  indicadorCarga:Boolean=false;

  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();

  config?: MatDialogConfig;
  id_fila_solped: any = "";
  usuarioCreadorFilaSolped: any = "";
  usuario: any = "";
  fecha: any = "";
  IsComentario:any="";

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _liberarSolpeS: LiberarSolpeService,
    private _auditoriaS : AuditoriaService,
  ) { }

  displayedColumns: string[] = ['id', 'nroreq', 'area', 'fecha', 'descr', 'usuario', 'accion'];

  ELEMENT_DATA_CREAR_SOLPE: tableLiberarSolpe[] = [];

  dataSourceCrearSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_CREAR_SOLPE);

  cabeceraCrearSolpeForm = new FormGroup({
    Id: new FormControl(''),
    Usuario: new FormControl(''),
    Fecha: new FormControl('')
  })

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Datos por página';
    this.obtenerListadoSolpes();
  }

  ngAfterViewInit() {
    this.dataSourceCrearSolpe.paginator = this.paginator;
  }

  openAprobarSolpe(id: any, usuarioCreador: any) {
    this.id_fila_solped = id;
    this.usuarioCreadorFilaSolped = usuarioCreador;
    return this.dialog.open(this.dialogAprobarSolped, this.config);
  }

  openRechazarSolpe(id: any, usuarioCreador: any) {
    this.id_fila_solped = id;
    this.usuarioCreadorFilaSolped = usuarioCreador;
    return this.dialog.open(this.dialogRechazarSolped, this.config);
  }

  obtenerListadoSolpes() {
    this.indicadorCarga=true;
    let json_req = {
      IsAccion: "L",
      IsId: "",
      IsUsuario: this.helper.decodeToken(this.token).usuario,
      IsFechaf: "",
      IsUsuariof: "",
      IsComentario:""
    }

    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      this.indicadorCarga=false;
      if (data.etMsgReturnField[0].successField == 'X') {
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = data.etSolpePrelimCabField;
      }
      else {
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
          duration: 5 * 1000
        });
      }
    })

  }

  aprobarSolpe() {
    this.indicadorCarga=true;
    let json_req = {
      IsAccion: "C",
      IsId: this.id_fila_solped,
      IsUsuario: "",
      IsFechaf: "",
      IsUsuariof: "",
      IsComentario:"",
      IsUsuarioCreador:this.usuarioCreadorFilaSolped
    }

    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      if (data.etMsgReturnField[0].successField == 'X') {
        let json_req_auditoria = {
          id_solpe:this.id_fila_solped,
          usuario:this.helper.decodeToken(this.token).usuario,
          accion:"A"
        }
        this._auditoriaS.postAuditoria(json_req_auditoria).subscribe(data=>{
          console.log(data);
          this.indicadorCarga=false;
        });
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = data.etSolpePrelimCabField;
        this.obtenerListadoSolpes();
      }
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
        duration: 5 * 1000
      });
    })
    this.dialog.closeAll();
  }

  rechazarSolpe() {
    this.indicadorCarga=true;
    let json_req = {
      IsAccion: "R",
      IsId: this.id_fila_solped,
      IsUsuario: "",
      IsFechaf: "",
      IsUsuariof: "",
      IsComentario:this.IsComentario,
      IsUsuarioCreador:this.usuarioCreadorFilaSolped
    }
    console.log(json_req)
    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      if (data.etMsgReturnField[0].successField == 'X') {
        this.IsComentario = ""
        let json_req_auditoria = {
          id_solpe:this.id_fila_solped,
          usuario:this.helper.decodeToken(this.token).usuario,
          accion:"R"
        }
        this._auditoriaS.postAuditoria(json_req_auditoria).subscribe(data=>{
          console.log(data);
          this.indicadorCarga=false;
        });
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = data.etSolpePrelimCabField;
        this.obtenerListadoSolpes();
      }
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
        duration: 5 * 1000
      });
    })
    this.dialog.closeAll();
  }

  buscarSolpe() {
    this.indicadorCarga=true;
    this.usuario = this.cabeceraCrearSolpeForm.get('Usuario')?.value;
    this.fecha = this.cabeceraCrearSolpeForm.get('Fecha')?.value;

    let json_req = {
      IsAccion: "L",
      IsId: "",
      IsUsuario: this.helper.decodeToken(this.token).usuario,
      IsFechaf: this.fecha == null ? "" : this.formatearFecha(this.fecha, 2),
      IsUsuariof: this.usuario,
      IsComentario:""
    }

    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      this.indicadorCarga=false;
      if (data.etMsgReturnField[0].successField == 'X') {
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = data.etSolpePrelimCabField;
      }
      else{
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
          duration: 5 * 1000
        });
      }
    })
    this.dataSourceCrearSolpe.paginator = this.paginator;
  }

  formatearFecha(fecha: any, indicador: any) {
    if (indicador == 1) { // FECHA PARA MOSTRAR EN TABLA
      return moment(fecha).format("DD-MM-YYYY")
    } else { // SE ENVIA 2 PARA FORMATEAR FECHA Y ENVIAR A SAP
      return moment(fecha).format("YYYYMMDD")
    }
  }

}
