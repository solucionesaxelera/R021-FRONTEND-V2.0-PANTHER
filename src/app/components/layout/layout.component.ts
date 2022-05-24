import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @ViewChild("dialogConsultarCerrarSesion") dialogTemplateConsultarCerrarSesion: any;

  config?: MatDialogConfig;

  showFiller = false;
  panelOpenState = false;
  constructor(
    public dialog: MatDialog,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  openConsultarCerrarSesion(){
    return this.dialog.open(this.dialogTemplateConsultarCerrarSesion, this.config);
  }

  cerrarSesion(){
    localStorage.removeItem("data_current");
    localStorage.removeItem("data_current_refresh");
    this.dialog.closeAll();
    this._router.navigate(["acceso"]); 
  }

}
