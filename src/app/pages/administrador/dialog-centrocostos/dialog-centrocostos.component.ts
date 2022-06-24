import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchcodeService } from 'src/app/services/matchcode/matchcode.service';

@Component({
  selector: 'app-dialog-centrocostos',
  templateUrl: './dialog-centrocostos.component.html',
  styleUrls: ['./dialog-centrocostos.component.scss']
})
export class DialogCentrocostosComponent implements OnInit {

  centrocostos: any =[];
  seleccionarCentroCostos:any=[];

  CentroCostoForm = new FormGroup({
    IsCeco: new FormControl(''),
    IsNameCeco: new FormControl('')
  })

  constructor(
    public dialogRef: MatDialogRef<DialogCentrocostosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _matchcodeS : MatchcodeService
  ) { }

  ngOnInit(): void {
    this.seleccionarCentroCostos = this.data;
    this.listarCentroCostos();
  }

  compareFunction (o1: any, o2: any){
    if(o1.item===o2.item){
      return true;
    } 
    else {
      return false;
    }
  }

  filtrarCentroCosto(req:any){
    this.centrocostos=[];
    let req_json = {
      IsBukrs: "",
      IsCeco: req.IsCeco,
      IsMatnr: "",
      IsNameCeco: req.IsNameCeco,
      IsNameMatnr: "",
      IsParametro: "KOSTL",
      IsSaknr: "",
      IsUsuario: "",
      IsWerks: ""
    }
    this._matchcodeS.postSolpeOptionsMatchcode(req_json).subscribe(data=>{
      for (let i = 0; i < data.etCecoField.length; i++) {
        this.centrocostos.push({
          item: data.etCecoField[i].kostlField,
          name: data.etCecoField[i].ktextField
        });
        if(data.etCecoField.length - 1 == i){
          this.seleccionarCentroCostos = this.data;
        }
      }
    });
  }

  listarCentroCostos(){
    let req = {
      IsBukrs: "",
      IsCeco: "",
      IsMatnr: "",
      IsNameCeco: "",
      IsNameMatnr: "",
      IsParametro: "KOSTL",
      IsSaknr: "",
      IsUsuario: "",
      IsWerks: ""
  }
    this._matchcodeS.postSolpeOptionsMatchcode(req).subscribe(data=>{
      for (let i = 0; i < data.etCecoField.length; i++) {
        this.centrocostos.push({
          item: data.etCecoField[i].kostlField,
          name: data.etCecoField[i].ktextField
        })
        if(data.etCecoField.length - 1 == i){
          this.seleccionarCentroCostos = this.data;
        }
      }
    });
  }

  guardarCentroCostos(): void {
    this.dialogRef.close(this.seleccionarCentroCostos);
  }

  cerrarDialog(): void {
    if(this.data.length >= 1){
      this.dialogRef.close(this.data);
    }else{
      this.dialogRef.close();
    }
  }
}
