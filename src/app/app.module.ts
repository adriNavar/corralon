import { ConfiguracionGuard } from './guardianes/configuracion.guard';
import { ConfiguracionServicio } from './servicios/configuracion.service';
import { AuthGuard } from './guardianes/auth.guard';
import { LoginService } from './servicios/login-service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import {AngularFireModule } from '@angular/fire/compat';
import {AngularFirestoreModule,Settings} from '@angular/fire/compat/firestore';
import { AngularFireAuthModule, SETTINGS } from '@angular/fire/compat/auth';
import { FlashMessage } from 'angular2-flash-messages/module/flash-message';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CabeceroComponent } from './componentes/cabecero/cabecero.component';
import { TableroComponent } from './componentes/tablero/tablero.component';


import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { ConfiguracionComponent } from './componentes/configuracion/configuracion.component';
import { NoEncontradoComponent } from './componentes/no-encontrado/no-encontrado.component';
import { PiePaginaComponent } from './componentes/pie-pagina/pie-pagina.component';

import { ProductosComponent } from './componentes/productos/productos.component';
import { EditarProductoComponent } from './componentes/editar-producto/editar-producto.component';
import { ProductoServicio } from './servicios/producto.service';
import { LoaderService } from './servicios/loader.service';
import { LoaderComponent } from './componentes/loader/loader.component';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { EditarCategoriaComponent } from './componentes/editar-categoria/editar-categoria.component';
import { CategoriaServicio } from './servicios/categoria.service';
import { AppSidebarComponent } from './componentes/app-sidebar/app-sidebar.component';
import { SidebarService } from './servicios/sidebar.service';
import { AumentoComponent } from './aumento/aumento.component';

@NgModule({
  declarations: [
    AppComponent,
    CabeceroComponent,
    TableroComponent,
    ProductosComponent, // Agrega el componente de productos
    EditarProductoComponent, // Agrega el componente de editar producto
    LoginComponent,
    RegistroComponent,
    ConfiguracionComponent,
    NoEncontradoComponent,
    PiePaginaComponent,
    ProductosComponent,
    EditarProductoComponent,
    LoaderComponent,
    CategoriasComponent,
    EditarCategoriaComponent,
    AppSidebarComponent,
    AumentoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firestore,'corralon'),// Aca se hace la conexion con la db
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    FlashMessagesModule.forRoot(),
    BrowserAnimationsModule,
  ],
  providers: [ProductoServicio,
    LoaderService,
    LoginService,
    AuthGuard,
    ConfiguracionServicio,
    ConfiguracionGuard,
    CategoriaServicio,
    SidebarService,
    {provide:SETTINGS,useValue:{}}],
  bootstrap: [AppComponent]
})
export class AppModule { }
