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
  listSociedades:any=[];

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
    for (let i = 0; i < this.data.sociedades.length; i++) {
      this.listSociedades.push({
        Item:this.data.sociedades[i].item
      })
    }
    this.seleccionarCentroCostos = this.data.cecos;
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
    let seleccionTemporal = this.seleccionarCentroCostos;
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
      IsWerks: "",
      ItBukrs:this.listSociedades
    }
    this._matchcodeS.postSolpeOptionsMatchcode(req_json).subscribe(data=>{
      for (let i = 0; i < data.etCecoField.length; i++) {
        this.centrocostos.push({
          item: data.etCecoField[i].kostlField,
          name: data.etCecoField[i].ktextField,
          sociedad: data.etCecoField[i].butxtField
        });
        if(data.etCecoField.length - 1 == i){
          // this.seleccionarCentroCostos = this.data;
          this.seleccionarCentroCostos = [...seleccionTemporal]
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
      IsWerks: "",
      ItBukrs:this.listSociedades
  }
    this._matchcodeS.postSolpeOptionsMatchcode(req).subscribe(data=>{
      for (let i = 0; i < data.etCecoField.length; i++) {
        this.centrocostos.push({
          item: data.etCecoField[i].kostlField,
          name: data.etCecoField[i].ktextField,
          sociedad: data.etCecoField[i].butxtField
        })
        if(data.etCecoField.length - 1 == i){
          this.centrocostos=[...this.centrocostos];
          this.seleccionarCentroCostos = this.data.cecos;
        }
      }
    });
  }

  guardarCentroCostos(): void {
    this.dialogRef.close(this.seleccionarCentroCostos);
  }

  cerrarDialog(): void {
    console.log(this.data)
    if(this.data.cecos.length >= 1){
      this.dialogRef.close(this.data.cecos);
    }else{
      this.dialogRef.close([]);
    }
  }

  seleccionarTodo(){
    this.seleccionarCentroCostos = [];
    for (let i = 0; i < this.centrocostos.length; i++) {
      this.seleccionarCentroCostos.push({item:this.centrocostos[i].item,name:this.centrocostos[i].name})
    }
  }

  deseleccionarTodo(){
    this.seleccionarCentroCostos = [];
  }

}
