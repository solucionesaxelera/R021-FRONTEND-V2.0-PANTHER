import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

// MATERIALS
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccesoComponent } from './pages/acceso/acceso.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { UsuariosComponent } from './pages/administrador/usuarios/usuarios.component';
import { RolesComponent } from './pages/administrador/roles/roles.component';

import { TokenInterceptor } from './auth/token.interceptor';
import { CrearSolpeComponent } from './pages/crear-solpe/crear-solpe.component';
import { ModificarSolpeComponent } from './pages/modificar-solpe/modificar-solpe.component';
import { ListarSolpeComponent } from './pages/listar-solpe/listar-solpe.component';
import { ConfiguracionComponent } from './pages/administrador/configuracion/configuracion.component';
import { LiberarSolpeComponent } from './pages/liberar-solpe/liberar-solpe.component';
import { AuditoriaComponent } from './pages/auditoria/auditoria.component';
import { MatchcodeComponent } from './components/matchcode/matchcode.component';
import { DialogSociedadesComponent } from './pages/administrador/dialog-sociedades/dialog-sociedades.component';
import { DialogCentrocostosComponent } from './pages/administrador/dialog-centrocostos/dialog-centrocostos.component';
import { RxTranslateModule } from '@rxweb/translate';
import { DetalleSolpeComponent } from './pages/liberar-solpe/detalle-solpe/detalle-solpe.component';

@NgModule({
  declarations: [
    AppComponent,
    AccesoComponent,
    DashboardComponent,
    LayoutComponent,
    SnackbarComponent,
    UsuariosComponent,
    RolesComponent,
    CrearSolpeComponent,
    ModificarSolpeComponent,
    ListarSolpeComponent,
    ConfiguracionComponent,
    LiberarSolpeComponent,
    AuditoriaComponent,
    MatchcodeComponent,
    DialogSociedadesComponent,
    DialogCentrocostosComponent,
    DetalleSolpeComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatGridListModule,
    MatListModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSortModule,
    MatProgressSpinnerModule,
    RxTranslateModule.forRoot({
      cacheLanguageWiseObject: true,
      globalFilePath: "assets/i18n/{{language-code}}/global.{{language-code}}.json",
      filePath: "assets/i18n/{{language-code}}/{{translation-name}}.{{language-code}}.json"
    })
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent],
  exports:[
    RxTranslateModule
  ]
})
export class AppModule { }
