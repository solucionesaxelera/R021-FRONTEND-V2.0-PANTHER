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

  @ViewChild(MatPaginator) paginator: any;

  accion: string = "";
  usuario: string = "";
  fecha: string = "";
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
    Fecha: new FormControl(''),
  })

  ngOnInit(): void {
    this.obtenerListadoAuditoria();
  }

  ngAfterViewInit() {
    this.dataSourceAuditoria.paginator = this.paginator;
    this._cd.detectChanges();
  }

  obtenerListadoAuditoria() {
    this._auditoriaS.getAuditoria().subscribe(data => {
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
    this.accion = this.cabeceraAuditoriaForm.get('Accion')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Accion')?.value;
    this.usuario = this.cabeceraAuditoriaForm.get('Usuario')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Usuario')?.value;
    this.fecha = this.cabeceraAuditoriaForm.get('Fecha')?.value == null ? "" : this.formatearFecha(this.cabeceraAuditoriaForm.get('Fecha')?.value, 2);
    this._auditoriaS.filtrarAuditoria(this.accion, this.usuario, this.fecha).subscribe(data => {
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

  async exportar() {
    this.accion = this.cabeceraAuditoriaForm.get('Accion')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Accion')?.value;
    this.usuario = this.cabeceraAuditoriaForm.get('Usuario')?.value == null ? "" : this.cabeceraAuditoriaForm.get('Usuario')?.value;
    this.fecha = this.cabeceraAuditoriaForm.get('Fecha')?.value == null ? "" : this.formatearFecha(this.cabeceraAuditoriaForm.get('Fecha')?.value, 2);
    this._auditoriaS.exportarAuditoria(this.accion, this.usuario, this.fecha).subscribe(data => {
      this.nombreDescarga = 'reporte_auditoria.xlsx';
      FileSaver.saveAs(data, this.nombreDescarga);
    })
    this.dataSourceAuditoria.paginator = this.paginator;
  }

  formatearFecha(fecha: any, indicador: any) {
    if (indicador == 1) { // FECHA PARA MOSTRAR EN TABLA
      return moment(fecha).format("YYYY-MM-DD")
    } else { // SE ENVIA 2 PARA FORMATEAR FECHA Y ENVIAR A SAP
      return moment(fecha).format("YYYYMMDD")
    }
  }

}
