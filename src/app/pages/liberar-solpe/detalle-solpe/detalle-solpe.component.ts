import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { translate } from '@rxweb/translate';


export interface DialogData {
  detalle: any
}

@Component({
  selector: 'app-detalle-solpe',
  templateUrl: './detalle-solpe.component.html',
  styleUrls: ['./detalle-solpe.component.scss']
})
export class DetalleSolpeComponent implements OnInit {

  // @translate({translationName:'listarsolpe'}) listarsolpe: any;
  @ViewChild(MatPaginator,{static : true}) paginator: any;
  listarsolpe:any;

  displayedColumnsListarDetalleSolpe: string[] = ['itemField', 'presuField', 'mengeField', 'meinsField', 'descrField', 'matnrField', 'ccostoField', 'glField', 'punitField', 'totSinigvField'];
  ELEMENT_DATA_LISTAR_DETALLE_SOLPE: any[] = [];
  dataSourceListarDetalleSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_LISTAR_DETALLE_SOLPE);

  constructor(
    public dialogRef: MatDialogRef<DetalleSolpeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.listarsolpe)
    this.listarsolpe = this.data.listarsolpe;
    this.dataSourceListarDetalleSolpe.data = this.data.detalle;
    this.dataSourceListarDetalleSolpe.paginator = this.paginator;
  }

  cerrarDetalle(): void {
    this.dialogRef.close();
  }

}
