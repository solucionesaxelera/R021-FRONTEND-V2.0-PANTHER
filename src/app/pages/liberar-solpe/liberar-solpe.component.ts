import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { tableLiberarSolpe } from 'src/app/models/liberar-solpe';
import { LiberarSolpeService } from 'src/app/services/liberar-solpe/liberar-solpe.service';

@Component({
  selector: 'app-liberar-solpe',
  templateUrl: './liberar-solpe.component.html',
  styleUrls: ['./liberar-solpe.component.scss']
})
export class LiberarSolpeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild("dialogAprobarSolped") dialogAprobarSolped: any;
  @ViewChild("dialogRechazarSolped") dialogRechazarSolped: any;

  public helper = new JwtHelperService();
  token = localStorage.getItem('data_current')?.toString();

  config?: MatDialogConfig;
  id_fila_solped: any = "";
  // is_loading: any = true;
  usuario: any = "";
  fecha: any = "";

  constructor(
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _liberarSolpeS: LiberarSolpeService
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
    this.obtenerListadoSolpes();
  }

  ngAfterViewInit() {
    // this.cabeceraCrearSolpeForm.controls['Fecha'].setValue(moment().format("YYYY-MM-DD"))
    this.dataSourceCrearSolpe.paginator = this.paginator;
  }

  openAprobarSolpe(id: any) {
    this.id_fila_solped = id;
    return this.dialog.open(this.dialogAprobarSolped, this.config);
  }

  openRechazarSolpe(id: any) {
    this.id_fila_solped = id;
    return this.dialog.open(this.dialogRechazarSolped, this.config);
  }

  obtenerListadoSolpes() {
    let json_req = {
      IsAccion: "L",
      IsId: "",
      IsUsuario: this.helper.decodeToken(this.token).usuario,
      IsFechaf: "",
      IsUsuariof: ""
    }

    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      // console.log("RESPUESTA DE LIBERAR SOLPE - LISTAR: ", data);
      if (data.etMsgReturnField[0].successField == 'X') {
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = data.etSolpePrelimCabField;
        // this.is_loading = false;
      }
      else {
        // this.is_loading = false;
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
          duration: 5 * 1000
        });
      }
    })

  }

  aprobarSolpe() {
    // console.log("aprobar solpe: ", this.id_fila_solped);
    let json_req = {
      IsAccion: "C",
      IsId: this.id_fila_solped,
      IsUsuario: "",
      IsFechaf: "",
      IsUsuariof: ""
    }

    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      // console.log("RESPUESTA DE LIBERAR SOLPE - APROBAR: ", data);
      if (data.etMsgReturnField[0].successField == 'X') {
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = data.etSolpePrelimCabField;
        this.obtenerListadoSolpes();
      }
      // console.log(this.dataSourceCrearSolpe.data)
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
        duration: 5 * 1000
      });
    })
    this.dialog.closeAll();
  }

  rechazarSolpe() {
    // console.log("rechazar solpe: ", this.id_fila_solped);
    let json_req = {
      IsAccion: "R",
      IsId: this.id_fila_solped,
      IsUsuario: "",
      IsFechaf: "",
      IsUsuariof: ""
    }

    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      // console.log("RESPUESTA DE LIBERAR SOLPE - RECHAZAR: ", data);
      if (data.etMsgReturnField[0].successField == 'X') {
        this.cabeceraCrearSolpeForm.reset();
        this.dataSourceCrearSolpe.data = data.etSolpePrelimCabField;
        this.obtenerListadoSolpes();
      }
      // console.log(this.dataSourceCrearSolpe.data)
      this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
        duration: 5 * 1000
      });
    })
    this.dialog.closeAll();
  }

  buscarSolpe() {

    this.usuario = this.cabeceraCrearSolpeForm.get('Usuario')?.value;
    this.fecha = this.cabeceraCrearSolpeForm.get('Fecha')?.value;
    console.log(this.usuario, this.fecha)

    let json_req = {
      IsAccion: "L",
      IsId: "",
      IsUsuario: this.helper.decodeToken(this.token).usuario,
      IsFechaf: this.fecha == null ? "" : this.formatearFecha(this.fecha, 2),
      IsUsuariof: this.usuario
    }

    this._liberarSolpeS.postSolpeOptionsStand(json_req).subscribe(data => {
      // console.log("RESPUESTA DE LIBERAR SOLPE - RECHAZAR: ", data);
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
      return moment(fecha).format("YYYY-MM-DD")
    } else { // SE ENVIA 2 PARA FORMATEAR FECHA Y ENVIAR A SAP
      return moment(fecha).format("YYYYMMDD")
    }
  }

}
