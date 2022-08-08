import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { tableAuditoria } from 'src/app/models/auditoria';
import { AuditoriaService } from 'src/app/services/auditoria/auditoria.service';

import * as FileSaver from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {

  @ViewChild(MatPaginator,{static : true}) paginator: any;

  indicadorCarga:Boolean=false;

  accion: string = "";
  usuario: string = "";
  fechaDesde: string = "";
  fechaHasta: string = "";
  nombreDescarga: string = "";

  constructor(
    private _auditoriaS: AuditoriaService,
    private _snackBar: MatSnackBar,
    private _cd:ChangeDetectorRef
  ) { }

  displayedColumns: string[] = ['id', 'codi_solpe', 'usuario', 'fecha', 'hora', 'accion']

  ELEMENT_DATA_AUDITORIA: tableAuditoria[] = []

  dataSourceAuditoria = new MatTableDataSource<any>(this.ELEMENT_DATA_AUDITORIA);

  cabeceraAuditoriaForm = new FormGroup({
    Accion: new FormControl(''),
    Usuario: new FormControl(''),
    FechaDesde: new FormControl(''),
    FechaHasta: new FormControl(''),
  })

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Datos por página';
    this.obtenerListadoAuditoria();
  }

  ngAfterViewInit() {
    this.dataSourceAuditoria.paginator = this.paginator;
    this._cd.detectChanges();
  }

  obtenerListadoAuditoria() {
    this.indicadorCarga = true;
    this._auditoriaS.getAuditoria().subscribe(data => {
      this.indicadorCarga = false;
      if (data.status == 1) {
        this.cabeceraAuditoriaForm.reset();
        this.dataSourceAuditoria.data = data.body.auditoria;
        // this.is_loading = false;
      }
      else {
        // this.is_loading = false;
        this._snackBar.open(data.message, 'cerrar', {
          duration: 5 * 1000
        });
      }
    })
  }

  buscarAuditoria() {
    if(this.cabeceraAuditoriaForm.get('FechaDesde')?.value > this.cabeceraAuditoriaForm.get('FechaHasta')?.value ){
      this._snackBar.open("La 'Fecha Desde' debe ser menor a la 'Fecha Hasta'", 'cerrar', {
        duration: 5 * 1000
      });
    }else{
      this.indicadorCarga = true;
      this.accion = this.cabeceraAuditoriaForm.get('Accion')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Accion')?.value;
      this.usuario = this.cabeceraAuditoriaForm.get('Usuario')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Usuario')?.value;
      this.fechaDesde = this.cabeceraAuditoriaForm.get('FechaDesde')?.value == null ? "" : this.formatearFecha(this.cabeceraAuditoriaForm.get('FechaDesde')?.value, 2);
      this.fechaHasta = this.cabeceraAuditoriaForm.get('FechaHasta')?.value == null ? "" : this.formatearFecha(this.cabeceraAuditoriaForm.get('FechaHasta')?.value, 2);
      this._auditoriaS.filtrarAuditoria(this.accion, this.usuario, this.fechaDesde, this.fechaHasta).subscribe(data => {
        this.indicadorCarga = false;
        if (data.status == 1) {
          this.dataSourceAuditoria.data = data.body.auditoria;
        }
        else {
          this._snackBar.open(data.message, 'cerrar', {
            duration: 5 * 1000
          });
        }
      })
      this.dataSourceAuditoria.paginator = this.paginator;
    }
  }

  async exportar() {
    this.indicadorCarga = true;
    this.accion = this.cabeceraAuditoriaForm.get('Accion')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Accion')?.value;
    this.usuario = this.cabeceraAuditoriaForm.get('Usuario')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Usuario')?.value;
    this.fechaDesde = this.cabeceraAuditoriaForm.get('FechaDesde')?.value == null ? "" : this.formatearFecha(this.cabeceraAuditoriaForm.get('FechaDesde')?.value, 2);
    this.fechaHasta = this.cabeceraAuditoriaForm.get('FechaHasta')?.value == null ? "" : this.formatearFecha(this.cabeceraAuditoriaForm.get('FechaHasta')?.value, 2);
    this._auditoriaS.exportarAuditoria(this.accion, this.usuario, this.fechaDesde, this.fechaHasta).subscribe(data => {
      this.nombreDescarga = 'reporte_auditoria.xlsx';
      FileSaver.saveAs(data, this.nombreDescarga);
      console.log("TERMINÓ CARGA")
      this.indicadorCarga = false;
    })
    this.dataSourceAuditoria.paginator = this.paginator;
  }

  formatearFecha(fecha: any, indicador: any) {
    if (indicador == 1) { // FECHA PARA MOSTRAR EN TABLA
      return moment(fecha).format("DD-MM-YYYY")
    } else { // SE ENVIA 2 PARA FORMATEAR FECHA Y ENVIAR A SAP
      return moment(fecha).format("YYYYMMDD")
    }
  }

}
