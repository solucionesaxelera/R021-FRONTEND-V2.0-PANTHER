import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
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

  deshabilitarModificarInput:boolean = true;
  idSolpe:any = "";

  constructor(
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
    DescrSolpe: new FormControl('')
  })

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
        DescrSolpe: "",
        Detalle: []
      }
    }
    this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{

      this.cabeceraModificarSolpeForm.controls['Nroreq'].setValue(data.esSolpePrelimCabField.nroreqField);
      this.cabeceraModificarSolpeForm.controls['Area'].setValue(data.esSolpePrelimCabField.areaField);
      this.cabeceraModificarSolpeForm.controls['Fecha'].setValue(moment(data.esSolpePrelimCabField.fechaField).format("YYYY-MM-DD"));
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
        DescrSolpe: req.DescrSolpe,
        Detalle: this.dataSourceModificarSolpe.data
      }
    }
    console.log(json_req);
    this._SolpeOptionPrelimS.postSolpeOptionsPrelim(json_req).subscribe(data=>{
      console.log(data);

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

}
