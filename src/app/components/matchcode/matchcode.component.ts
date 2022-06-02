import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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

  @ViewChild(MatPaginator) paginator: any;

  constructor(
    public dialogRef: MatDialogRef<MatchcodeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _matchcodeS : MatchcodeService,
  ) { }

  ngOnInit(): void {
    this.ELEMENT_DATA = [];
    this.indicadorCarga=true;
    let req_json = {
      IsCeco: "",
      IsMatnr: "",
      IsNameCeco: "",
      IsNameMatnr: "",
      IsParametro: this.data.name,
      IsUsuario: ""
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
      this.indicadorCarga=false;
    })
  }

}
