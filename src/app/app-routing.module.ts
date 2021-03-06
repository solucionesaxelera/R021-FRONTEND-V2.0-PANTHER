import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorizacionGuard } from './guards/autorizacion.guard';
import { AccesoComponent } from './pages/acceso/acceso.component';
import { ConfiguracionComponent } from './pages/administrador/configuracion/configuracion.component';
import { RolesComponent } from './pages/administrador/roles/roles.component';
import { UsuariosComponent } from './pages/administrador/usuarios/usuarios.component';
import { AuditoriaComponent } from './pages/auditoria/auditoria.component';
import { CrearSolpeComponent } from './pages/crear-solpe/crear-solpe.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LiberarSolpeComponent } from './pages/liberar-solpe/liberar-solpe.component';
import { ListarSolpeComponent } from './pages/listar-solpe/listar-solpe.component';
import { ModificarSolpeComponent } from './pages/modificar-solpe/modificar-solpe.component';

const routes: Routes = [
  { path:'', component:DashboardComponent,canActivate:[AutorizacionGuard] },
  { path:'acceso', component:AccesoComponent },
  { path:'inicio', component:DashboardComponent , canActivate:[AutorizacionGuard] },
  {
    path:'solpe', children:[
      { path:'crear-solpe', component:CrearSolpeComponent, canActivate:[AutorizacionGuard] },
      { path:'modificar-solpe', component:ModificarSolpeComponent, canActivate:[AutorizacionGuard] },
      { path:'listar-solpe', component:ListarSolpeComponent, canActivate:[AutorizacionGuard] },
      { path:'liberar-solpe', component:LiberarSolpeComponent, canActivate:[AutorizacionGuard] }
    ]
  },
  {
    path:'administracion', children:[
      { path:'usuarios', component:UsuariosComponent,canActivate:[AutorizacionGuard] },
      { path:'roles', component:RolesComponent,canActivate:[AutorizacionGuard] },
      { path:'configuracion', component:ConfiguracionComponent,canActivate:[AutorizacionGuard] },
      { path:'auditoria', component:AuditoriaComponent, canActivate:[AutorizacionGuard] }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
