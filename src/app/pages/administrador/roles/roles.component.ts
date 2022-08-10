import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { translate } from '@rxweb/translate';
import { crearRolI, modificarRolI, rolesI } from 'src/app/models/administrador/roles';
import { ModulosService } from 'src/app/services/administrador/modulos/modulos.service';
import { RolesService } from 'src/app/services/administrador/roles/roles.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @translate({translationName:'roles'}) roles: any;

  @ViewChild(MatPaginator,{static : true}) paginator: any;
  @ViewChild('dialogCrearRol') dialogTemplateCrearRol: any;
  @ViewChild('dialogModificarRol') dialogTemplateModificarRol: any;
  @ViewChild('dialogAsignarModuloRol') dialogTemplateAsignarModuloRol: any;
  @ViewChild('dialogEliminarRol') dialogTemplateEliminarRol: any;

  config?: MatDialogConfig;
  idRolSeleccionado:number = 0;
  listaModulos:any = [];
  seleccionarOpciones:any = [];

  displayedColumnsRoles: string[] = [
    'nombre',
    'accion',
    'asignar_modulo'
  ];
  public ELEMENT_DATA_ROLES: rolesI[] =[];
  dataSourceRoles = new MatTableDataSource<rolesI>(this.ELEMENT_DATA_ROLES);
  
  crearRolForm = new FormGroup({
    nombre: new FormControl('',[Validators.required]),
  });

  modificarRolForm = new FormGroup({
    nombre: new FormControl('',[Validators.required]),
  });

  constructor(
    private _rolesS: RolesService,
    private _modulosS: ModulosService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.paginator._intl.itemsPerPageLabel = '';
    this.listarRoles();
    this.listarModulos();
  }

  compareFunction (o1: any, o2: any){
    if(o1.id===o2.id){
      return true;
    } 
    else {
      return false;
    }
  }

  listarRoles(){
    this._rolesS.getRoles().subscribe(data=>{
      this.dataSourceRoles.paginator = this.paginator;
      this.dataSourceRoles.data = data.body;
    })
  }

  openDialogCrearRol() {
    return this.dialog.open(this.dialogTemplateCrearRol, this.config);
  }

  openDialogModificarRol(id:number){
    this.idRolSeleccionado = id;
    this._rolesS.getRolById(id).subscribe(data=>{
      this.modificarRolForm.controls['nombre'].setValue(data.body[0].nombre);
      return this.dialog.open(this.dialogTemplateModificarRol, this.config);
    });
  }

  openDialogAsignarModuloRol(id_rol:number) {
    this.idRolSeleccionado = id_rol;
    this.cargarModulosByIdRol(id_rol);
    this.seleccionarOpciones=[];
  }

  openDialogEliminarRol(id_rol:number) {
    this.idRolSeleccionado = id_rol;
    return this.dialog.open(this.dialogTemplateEliminarRol, this.config);
  }

  crearRol(req:crearRolI) {
    this._rolesS.postCrearRol(req).subscribe(data=>{
      this.listarRoles();
      this.crearRolForm.reset();
      this.dialog.closeAll();
      this._snackBar.open(data.message, 'cerrar',{
        duration:2*1000,
        panelClass:['background-snackbar']
      });
    });
  }

  modificarRol(req:modificarRolI) {
    this._rolesS.putModificarRol(this.idRolSeleccionado,req).subscribe(data=>{
      this.listarRoles();
      this.modificarRolForm.reset();
      this.dialog.closeAll();
      this._snackBar.open(data.message, 'cerrar',{
        duration:2*1000,
        panelClass:['background-snackbar']
      });
    });
  }

  listarModulos(){
    this._modulosS.getModulos().subscribe(data=>{
      this.listaModulos = data.body;
    });
  }

  cargarModulosByIdRol(id_rol:number){
    this._modulosS.getModulosByIdRol(id_rol).subscribe(data=>{
      for (let i = 0; i < data.body.length; i++) {
        this.seleccionarOpciones.push({id:data.body[i].id_modulo,name:data.body[i].modulo});
      }
      return this.dialog.open(this.dialogTemplateAsignarModuloRol, this.config);
    });
  }

  asignarModulosRol(){
    let modules=[];
    for (let i = 0; i < this.seleccionarOpciones.length; i++) {
      modules.push({
        id_modulo: this.seleccionarOpciones[i].id,
        evento:"1"
      })
    }

    let json_req = {
      id_rol: this.idRolSeleccionado,
      modulos:modules
    }

    this._modulosS.postAsignarModuloRol(json_req).subscribe(data=>{
      this.dialog.closeAll();
      this._snackBar.open(data.message, 'cerrar',{
        duration:2*1000,
        panelClass:['background-snackbar']
      });
    })
  }

  eliminarRol(){
    this._rolesS.deleteEliminarRol(this.idRolSeleccionado).subscribe(data=>{
      this.listarRoles();
      this.dialog.closeAll();
      this._snackBar.open(data.message, 'cerrar',{
        duration:2*1000,
        panelClass:['background-snackbar']
      });
    })
  }

}
