import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { tableListarSolpeI } from 'src/app/models/listar-solpe';
import { CrearSolpeService } from 'src/app/services/crear-solpe/crear-solpe.service';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listar-solpe',
  templateUrl: './listar-solpe.component.html',
  styleUrls: ['./listar-solpe.component.scss']
})
export class ListarSolpeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatPaginator) paginatorDetalle: any;
  @ViewChild("dialogDetalleSolpe") dialogTemplateDetalleSolpe: any;
  @ViewChild("dialogComentarioSolpe") dialogTemplateComentarioSolpe: any;

  indicadorCarga:boolean=false;

  IsComentario:any = "";

  config?: MatDialogConfig;
  idSolpeSeleccionada:number=0;

  constructor(
    private _SolpeOptionPrelimS : CrearSolpeService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  displayedColumnsListarSolpe: string[] = ['idField', 'nroreqField', 'areaField', 'fechaField', 'monedaField', 'centroField', 'descrSolpeField', 'estadoField', 'usuarioField', 'detalle'];
  ELEMENT_DATA_LISTAR_SOLPE: tableListarSolpeI[] = [];
  dataSourceListarSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_LISTAR_SOLPE);

  displayedColumnsListarDetalleSolpe: string[] = ['itemField', 'presuField', 'mengeField', 'meinsField', 'descrField', 'matnrField', 'ccostoField', 'glField', 'punitField', 'totSinigvField'];
  ELEMENT_DATA_LISTAR_DETALLE_SOLPE: any[] = [];
  dataSourceListarDetalleSolpe = new MatTableDataSource<any>(this.ELEMENT_DATA_LISTAR_DETALLE_SOLPE);

  cabeceraListarSolpeForm = new FormGroup({
    Id: new FormControl(''),
    Fecha: new FormControl('')
  })

  ngOnInit(): void {
    this.listarSolpes();
  }

  listarSolpes(){
    this.indicadorCarga=true;
    let json_req={
      IsAccion: "L",
      IsIdSolpe: "",
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
      this.dataSourceListarSolpe.data = data.etSolpePrelimCabField;
      this.dataSourceListarSolpe.paginator = this.paginator;
      this.indicadorCarga=false;
    })
  }

  convertirFormatoFecha(input:any){
    return moment(input).format("DD-MM-YYYY")
  }

  listarDetalleSolpe(detalle:any,id:any){
    this.idSolpeSeleccionada = id;
    
    this.dataSourceListarDetalleSolpe.data = detalle;
    this.dataSourceListarDetalleSolpe.paginator = this.paginatorDetalle;
      return this.dialog.open(this.dialogTemplateDetalleSolpe, {
        width: '100%',
      });
  }

  listarComentario(comentario:any,id:any){
    this.idSolpeSeleccionada = id;
    
    this.IsComentario = comentario;
      return this.dialog.open(this.dialogTemplateComentarioSolpe, {
        width: '100%',
      });
  }

  filtrarSolpe(req:any) {
    this.indicadorCarga=true;
    let json_req={
      IsAccion: "L",
      IsIdSolpe: "",
      IsItem: "",
      IsSolpePrelimCab: {
        Id: req.Id,
        Nroreq: "",
        Area: "",
        Fecha: req.Fecha != "" ? moment(req.Fecha).format('YYYYMMDD') : "",
        Moneda: "",
        Centro: "",
        DescrSolpe: "",
        Estado: "",
        Usuario: "",
        Detalle: []
      }
    }
    this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
      console.log(data);
      if(data.etMsgReturnField[0].successField == 'X'){
        this.dataSourceListarSolpe.data = data.etSolpePrelimCabField;
        this.dataSourceListarSolpe.paginator = this.paginator;
      }else{
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar', {
          duration: 5 * 1000
        });
      }
      this.indicadorCarga=false;
    })
  }

  limpiarFiltros(){
    this.cabeceraListarSolpeForm.controls['Id'].setValue("");
    this.cabeceraListarSolpeForm.controls['Fecha'].setValue("");
    this.listarSolpes();
  }

}
