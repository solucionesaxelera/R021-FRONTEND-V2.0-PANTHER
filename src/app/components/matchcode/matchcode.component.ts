import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { matchcodeCentroCostoI, matchcodeGLI, matchcodeMaterialI } from 'src/app/models/matchcode';
import { MatchcodeService } from 'src/app/services/matchcode/matchcode.service';

export interface DialogData {
  name: string;
  value:string;
}

@Component({
  selector: 'app-matchcode',
  templateUrl: './matchcode.component.html',
  styleUrls: ['./matchcode.component.scss']
})
export class MatchcodeComponent implements OnInit {

  indicadorCarga:boolean = false;
  ELEMENT_DATA: any[]=[];

  displayedColumnsMATNR: string[] = ['matnrField', 'maktgField'];
  dataSourceMATNR = new MatTableDataSource<any>(this.ELEMENT_DATA);

  displayedColumnsKOSTL: string[] = ['kostlField', 'ktextField'];
  dataSourceKOSTL = new MatTableDataSource<any>(this.ELEMENT_DATA);

  displayedColumnsWERKS: string[] = ['werksField', 'name1Field'];
  dataSourceWERKS = new MatTableDataSource<any>(this.ELEMENT_DATA);

  displayedColumnsMSEHI: string[] = ['msehiField', 'msehlField'];
  dataSourceMSEHI = new MatTableDataSource<any>(this.ELEMENT_DATA);

  displayedColumnsSAKNR: string[] = ['saknrField', 'ktoplField', 'txt50Field'];
  dataSourceSAKNR = new MatTableDataSource<any>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: any;

  constructor(
    public dialogRef: MatDialogRef<MatchcodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _matchcodeS : MatchcodeService,
  ) { }

  matchcodeMaterialForm = new FormGroup({
    IsMatnr: new FormControl(''),
    IsNameMatnr: new FormControl('')
  })

  matchcodeCentroCostoForm = new FormGroup({
    IsCeco: new FormControl(''),
    IsNameCeco: new FormControl('')
  })

  matchcodeGLForm = new FormGroup({
    IsBukrs: new FormControl(''),
    IsSaknr: new FormControl('')
  })

  ngOnInit(): void {
    this.ELEMENT_DATA = [];
    this.indicadorCarga=true;
    let req_json = {
      IsBukrs: "",
      IsCeco: "",
      IsMatnr: "",
      IsNameCeco: "",
      IsNameMatnr: "",
      IsParametro: this.data.name,
      IsSaknr: "",
      IsUsuario: "",
      IsWerks: ""
    }
    this._matchcodeS.postSolpeOptionsMatchcode(req_json).subscribe(data=>{
      if(this.data.name == "MATNR"){
        this.dataSourceMATNR.data =data.etMatnrField;
        this.dataSourceMATNR.paginator = this.paginator;
      }
      if(this.data.name == "KOSTL") {
        this.dataSourceKOSTL.data =data.etCecoField;
        this.dataSourceKOSTL.paginator = this.paginator;
      }
      if(this.data.name == "WERKS") {
        this.dataSourceWERKS.data =data.etCentroField;
        this.dataSourceWERKS.paginator = this.paginator;
      }
      if(this.data.name == "MSEHI") {
        this.dataSourceMSEHI.data =data.etUnidadesField;
        this.dataSourceMSEHI.paginator = this.paginator;
      }
      if(this.data.name == "SAKNR") {
        this.dataSourceSAKNR.data =data.etGlField;
        this.dataSourceSAKNR.paginator = this.paginator;
      }
      this.indicadorCarga=false;
    })
  }

  filtrarMatchcodeMaterial(req:matchcodeMaterialI){
    this.ELEMENT_DATA = [];
    this.dataSourceMATNR.data = [];
    this.indicadorCarga=true;
    let req_json = {
      IsBukrs: "",
      IsCeco: "",
      IsMatnr: req.IsMatnr,
      IsNameCeco: "",
      IsNameMatnr: req.IsNameMatnr,
      IsParametro: this.data.name,
      IsSaknr: "",
      IsUsuario: "",
      IsWerks: ""
    }
    this._matchcodeS.postSolpeOptionsMatchcode(req_json).subscribe(data=>{
      this.dataSourceMATNR.data =data.etMatnrField;
      this.dataSourceMATNR.paginator = this.paginator;
      this.indicadorCarga=false;
    });
  }

  filtrarMatchcodeCentroCosto(req:matchcodeCentroCostoI){
    this.ELEMENT_DATA = [];
    this.dataSourceKOSTL.data = [];
    this.indicadorCarga=true;
    let req_json = {
      IsBukrs: "",
      IsCeco: req.IsCeco,
      IsMatnr: "",
      IsNameCeco: req.IsNameCeco,
      IsNameMatnr: "",
      IsParametro: this.data.name,
      IsSaknr: "",
      IsUsuario: "",
      IsWerks: ""
    }
    this._matchcodeS.postSolpeOptionsMatchcode(req_json).subscribe(data=>{
      this.dataSourceKOSTL.data =data.etCecoField;
        this.dataSourceKOSTL.paginator = this.paginator;
      this.indicadorCarga=false;
    });
  }

  filtrarMatchcodeGL(req:matchcodeGLI){
    this.ELEMENT_DATA = [];
    this.dataSourceSAKNR.data = [];
    this.indicadorCarga=true;
    let req_json = {
      IsBukrs: req.IsBukrs,
      IsCeco: "",
      IsMatnr: "",
      IsNameCeco: "",
      IsNameMatnr: "",
      IsParametro: this.data.name,
      IsSaknr: req.IsSaknr,
      IsUsuario: "",
      IsWerks: ""
    }
    this._matchcodeS.postSolpeOptionsMatchcode(req_json).subscribe(data=>{
      this.dataSourceSAKNR.data =data.etGlField;
      this.dataSourceSAKNR.paginator = this.paginator;
      this.indicadorCarga=false;
    });
  }

}
