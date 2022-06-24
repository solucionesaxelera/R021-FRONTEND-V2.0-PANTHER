import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatchcodeService } from 'src/app/services/matchcode/matchcode.service';

@Component({
  selector: 'app-dialog-sociedades',
  templateUrl: './dialog-sociedades.component.html',
  styleUrls: ['./dialog-sociedades.component.scss']
})
export class DialogSociedadesComponent implements OnInit {

  sociedades: any =[];
  seleccionarSociedades:any=[];

  constructor(
    public dialogRef: MatDialogRef<DialogSociedadesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _matchcodeS : MatchcodeService
  ) { }

  ngOnInit(): void {
    this.seleccionarSociedades = this.data;
    this.listarSociedades();
  }

  compareFunction (o1: any, o2: any){
    if(o1.item===o2.item){
      return true;
    } 
    else {
      return false;
    }
  }

  listarSociedades(){
    let req = {
      IsBukrs: "",
      IsCeco: "",
      IsMatnr: "",
      IsNameCeco: "",
      IsNameMatnr: "",
      IsParametro: "BUKRS",
      IsSaknr: "",
      IsUsuario: "",
      IsWerks: ""
  }
    this._matchcodeS.postSolpeOptionsMatchcode(req).subscribe(data=>{
      for (let i = 0; i < data.etSocieField.length; i++) {
        this.sociedades.push({
          item: data.etSocieField[i].bukrsField,
          name: data.etSocieField[i].butxtField
        })
      }
    });
  }

  guardarSociedades(): void {
    this.dialogRef.close(this.seleccionarSociedades);
  }

  cerrarDialog(): void {
    if(this.data.length >= 1){
      this.dialogRef.close(this.data);
    }else{
      this.dialogRef.close();
    }
  }

}
