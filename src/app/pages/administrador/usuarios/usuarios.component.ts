import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import { bodyUsuarioO, crearUsuarioI, modificarEstadoUsuarioI, modificarRolUsuarioI, modificarUsuarioI, usuariosO } from 'src/app/models/administrador/usuarios';
import { RolesService } from 'src/app/services/administrador/roles/roles.service';
import { UsuariosService } from 'src/app/services/administrador/usuarios/usuarios.service';
import { DialogCentrocostosComponent } from '../dialog-centrocostos/dialog-centrocostos.component';
import { DialogSociedadesComponent } from '../dialog-sociedades/dialog-sociedades.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})

export class UsuariosComponent implements OnInit {

  public helper = new JwtHelperService();

  checked = false;
  segundoAprobadorDisabled: boolean = true;

  ItCcosto:any=[];
  ItSociedad:any=[];

  disabledBtnCeco:boolean = true;

  idUsuarioSesion = this.helper.decodeToken(localStorage.getItem('data_current')?.toString());
  
  @ViewChild(MatPaginator) paginator: any;
  @ViewChild('dialogCrearUsuario') dialogTemplateCrearUsuario: any;
  @ViewChild('dialogModificarUsuario') dialogTemplateModificarUsuario: any;
  @ViewChild('dialogModificarRolUsuario') dialogTemplateModificarRolUsuario: any;
  @ViewChild('dialogModificarClaveUsuario') dialogTemplateModificarClaveUsuario: any;
  @ViewChild('dialogEliminarUsuario') dialogTemplateEliminarUsuario: any;

  config?: MatDialogConfig;
  idUsuarioSeleccionado:number = 0;
  usuarioSeleccionado:string = "";

  listaRoles:any=[];
  
  displayedColumnsUsuarios: string[] = [
    'nombres', 
    'ape_pat', 
    'ape_mat', 
    'correo',
    'usuario',
    'estado',
    'accion',
    'rol'
  ];
  public ELEMENT_DATA_USUARIOS: bodyUsuarioO[] =[];
  dataSourceUsuarios = new MatTableDataSource<bodyUsuarioO>(this.ELEMENT_DATA_USUARIOS);

  crearUsuarioForm = new FormGroup({
    nombres: new FormControl('',[Validators.required]),
    ape_pat: new FormControl('',[Validators.required]),
    ape_mat: new FormControl('',[Validators.required]),
    correo: new FormControl('',[Validators.required]),
    telefono: new FormControl('',[Validators.required]),
    cargo: new FormControl('',[Validators.required]),
    usuario: new FormControl('',[Validators.required]),
    clave: new FormControl('',[Validators.required]),
    id_rol: new FormControl('',[Validators.required]),
    isPrimerAprobador: new FormControl('',[Validators.required]),
    isSegundoAprobador: new FormControl(''),
  });

  modificarUsuarioForm = new FormGroup({
    nombres: new FormControl('',[Validators.required]),
    ape_pat: new FormControl('',[Validators.required]),
    ape_mat: new FormControl('',[Validators.required]),
    correo: new FormControl('',[Validators.required]),
    telefono: new FormControl('',[Validators.required]),
    cargo: new FormControl('',[Validators.required]),
    isPrimerAprobador: new FormControl('',[Validators.required]),
    isSegundoAprobador: new FormControl(''),
  });
  
  modificarRolUsuarioForm = new FormGroup({
    id_rol: new FormControl('',[Validators.required])
  });

  modificarClaveUsuarioForm = new FormGroup({
    clave: new FormControl('',[Validators.required]),
    status_password: new FormControl('0'),
  });

  constructor(
    private _usuariosS: UsuariosService,
    private _rolesS: RolesService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.listarUsuarios();
    this.listarRoles();
  }

  openDialogSociedades(): void{

    const dialogRefSociedades =this.dialog.open(DialogSociedadesComponent, {
      width: '500px',
      disableClose:true,
      data: this.ItSociedad,
    });

    dialogRefSociedades.afterClosed().subscribe(result => {
      this.ItSociedad = result;
      if(this.ItSociedad.length >= 1){
        this.disabledBtnCeco = false;
      }else{
        this.disabledBtnCeco = true;
      }
    });
  }
  openDialogCentroCostos(): void{
    
    const dialogRefCentroCostos =this.dialog.open(DialogCentrocostosComponent, {
      width: '630px',
      disableClose:true,
      data: {cecos: this.ItCcosto, sociedades:this.ItSociedad},
    });

    dialogRefCentroCostos.afterClosed().subscribe(result => {
      this.ItCcosto = result;
    });
  }

  openDialogCrearUsuario() {
    this.ItSociedad = [];
    this.ItCcosto = [];
    this.disabledBtnCeco = true;
    return this.dialog.open(this.dialogTemplateCrearUsuario, this.config);
  }

  openDialogModificarUsuario(id:number,usuario:string) {
    this.ItSociedad = [];
    this.ItCcosto = [];
    this.checked= false;
    this.segundoAprobadorDisabled = true;
    this.idUsuarioSeleccionado = id;
    this.usuarioSeleccionado = usuario;
    let req_json_sap = {
      IsAccion: "L",
      IsAprobador1: "",
      IsAprobador2: "",
      IsCreador: usuario,
      ItCcosto: [],
      ItSociedad: []
    }
    this._usuariosS.postAprobadoresSAP(req_json_sap).subscribe(data=>{
      for (let i = 0; i < data.etCcostoField.length; i++) {
        this.disabledBtnCeco = false;
        this.ItCcosto.push({
          item: data.etCcostoField[i].itemField
        })
      }

      for (let i = 0; i < data.etSociedadField.length; i++) {
        this.ItSociedad.push({
          item: data.etSociedadField[i].itemField
        })
      }

      if(data.esSolpeUsersField.aprobador2Field != ""){
        this.segundoAprobadorDisabled = false;
        this.checked= true;
      }else {
        this.checked= false;
      }
      this.modificarUsuarioForm.controls['isPrimerAprobador'].setValue(data.esSolpeUsersField.aprobador1Field);
      this.modificarUsuarioForm.controls['isSegundoAprobador'].setValue(data.esSolpeUsersField.aprobador2Field);
    });
    this._usuariosS.getUsuarioById(id).subscribe(data=>{
      if(data.status == 1){
        this.modificarUsuarioForm.controls['nombres'].setValue(data.body[0].nombres);
        this.modificarUsuarioForm.controls['ape_pat'].setValue(data.body[0].ape_pat);
        this.modificarUsuarioForm.controls['ape_mat'].setValue(data.body[0].ape_mat);
        this.modificarUsuarioForm.controls['correo'].setValue(data.body[0].correo.trim());
        this.modificarUsuarioForm.controls['telefono'].setValue(data.body[0].telefono.trim());
        this.modificarUsuarioForm.controls['cargo'].setValue(data.body[0].cargo);
      }
     
      return this.dialog.open(this.dialogTemplateModificarUsuario, this.config);
    });
  }

  openDialogModificarRolUsuario(id:number) {
    this.idUsuarioSeleccionado = id;
    this._usuariosS.getUsuarioById(id).subscribe(data=>{
      this.modificarRolUsuarioForm.controls['id_rol'].setValue(data.body[0].id_rol);
      return this.dialog.open(this.dialogTemplateModificarRolUsuario, this.config);
    });
  }

  openDialogModificarClaveUsuario(id:number) {
    this.idUsuarioSeleccionado = id;
    return this.dialog.open(this.dialogTemplateModificarClaveUsuario, this.config);
  }

  openDialogEliminarUsuario(id:number) {
    this.idUsuarioSeleccionado = id;
    return this.dialog.open(this.dialogTemplateEliminarUsuario, this.config);
  }

  listarUsuarios(){
    this._usuariosS.getUsuarios().subscribe(data=>{
      this.dataSourceUsuarios.paginator = this.paginator;
      this.dataSourceUsuarios.data = data.body;
    })
  }

  listarRoles() {
    this._rolesS.getRoles().subscribe(data=>{
      this.listaRoles = data.body;
    });
  }

  crearUsuario(req:any) {
    let req_json_sap = {
      IsAccion: "C",
      IsAprobador1: req.isPrimerAprobador,
      IsAprobador2: req.isSegundoAprobador,
      IsCreador: req.usuario,
      ItCcosto: this.ItCcosto,
      ItSociedad: this.ItSociedad
    }
    this._usuariosS.postAprobadoresSAP(req_json_sap).subscribe(data=>{
      if(
          data.etMsgReturnField[0].successField == "X" &&
          data.etMsgReturnField[1].successField == "X" &&
          data.etMsgReturnField[2].successField == "X"
        ){
          this._usuariosS.postCrearUsuario(req).subscribe(data=>{
            if(data.status == 1){
              this.listarUsuarios();
              this.crearUsuarioForm.reset();
              this.dialog.closeAll();
            }
            this._snackBar.open(data.message, 'cerrar',{
              duration:5*1000,
              panelClass:['background-snackbar']
            });
          });
        }else{
          this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
            duration:5*1000,
            panelClass:['background-snackbar']
          });
          this._snackBar.open(data.etMsgReturnField[1].messageField, 'cerrar',{
            duration:5*1000,
            panelClass:['background-snackbar']
          });
          this._snackBar.open(data.etMsgReturnField[2].messageField, 'cerrar',{
            duration:5*1000,
            panelClass:['background-snackbar']
          });
        }
    });

  }

  modificarUsuario(req:modificarUsuarioI) {
    let req_json_sap = {
      IsAccion: "M",
      IsAprobador1: "",
      IsAprobador2: "",
      IsCreador: this.usuarioSeleccionado,
      ItCcosto: this.ItCcosto,
      ItSociedad: this.ItSociedad
    }
    if(this.segundoAprobadorDisabled == false){
      req_json_sap.IsAprobador1 = req.isPrimerAprobador;
      req_json_sap.IsAprobador2 = req.isSegundoAprobador;
    } else{
      req_json_sap.IsAprobador1 = req.isPrimerAprobador;
      req_json_sap.IsAprobador2 = "";
    }

    this._usuariosS.postAprobadoresSAP(req_json_sap).subscribe(data=>{
      if(
        data.etMsgReturnField[0].successField == "X" &&
        data.etMsgReturnField[1].successField == "X" &&
        data.etMsgReturnField[2].successField == "X"
      ){
        this._usuariosS.putModificarUsuario(this.idUsuarioSeleccionado,req).subscribe(data=>{
          if(data.status == 1){
            this.listarUsuarios();
            this.modificarUsuarioForm.reset();
            this.dialog.closeAll();
          }
          this._snackBar.open(data.message, 'cerrar',{
            duration:5*1000,
            panelClass:['background-snackbar']
          });
        })
      }else{
        this._snackBar.open(data.etMsgReturnField[0].messageField, 'cerrar',{
          duration:5*1000,
          panelClass:['background-snackbar']
        });
        this._snackBar.open(data.etMsgReturnField[1].messageField, 'cerrar',{
          duration:5*1000,
          panelClass:['background-snackbar']
        });
        this._snackBar.open(data.etMsgReturnField[2].messageField, 'cerrar',{
          duration:5*1000,
          panelClass:['background-snackbar']
        });
      }
    });
    
  }

  modificarRolUsuario(req:modificarRolUsuarioI) {
    this._usuariosS.putModificarRolUsuario(this.idUsuarioSeleccionado,req).subscribe(data=>{
      this.modificarRolUsuarioForm.reset();
      this.dialog.closeAll();
      this._snackBar.open(data.message, 'cerrar',{
        duration:5*1000,
        panelClass:['background-snackbar']
      });
    })
  }

  modificarEstadoUsuario(id:number,e:MatSlideToggleChange) {
    let request = {
      estado: e.checked == true ? 1 : 0
    }
    this._usuariosS.putModificarEstadoUsuario(id,request).subscribe(data=>{
      this._snackBar.open(data.message, 'cerrar',{
        duration:5*1000,
        panelClass:['background-snackbar']
      });
    })
  }

  modificarClaveUsuario(req:any) {
    this._usuariosS.putModificarClaveUsuario(this.idUsuarioSeleccionado,req).subscribe(data=>{

      if(data.status == 1) {
        this.modificarClaveUsuarioForm.reset();
        this.dialog.closeAll();
      }
      
      this._snackBar.open(data.message, 'cerrar',{
        duration:5*1000,
        panelClass:['background-snackbar']
      });
    })
  }

  eliminarUsuario() {
    this._usuariosS.deleteEliminarUsuario(this.idUsuarioSeleccionado).subscribe(data=>{
      this.listarUsuarios();
      this.dialog.closeAll();
      this._snackBar.open(data.message, 'cerrar',{
        duration:5*1000,
        panelClass:['background-snackbar']
      });
    })
  }

  habilitarSegundoAprobador(e:MatSlideToggleChange){
    if(e.checked){
      this.segundoAprobadorDisabled = false;
    }else{
      this.segundoAprobadorDisabled = true;
    }
    
  }

}
