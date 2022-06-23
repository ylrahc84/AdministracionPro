import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap,map, catchError, delay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

 
import { LoginForm } from '../interfaces/login-form.interface';


import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';

import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public usuario: Usuario | undefined;


  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) { }


  logout(){

    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
    
  }

  get token():string{

    return localStorage.getItem('token') || '';

  }

  get uid():string{

    return this.usuario?.MA01_Usuario || '';

  }

  get headers(){
    return {

      headers:{
        'x-token': this.token
      }

    }
  }

  validarToken():Observable<boolean>
  {
 
    return this.http.get(`${base_url}/renew`, {
      headers:{
        'x-token': this.token
      }
    }).pipe(
      map( (resp:any) =>{
        
        const {
          MA01_Clave,
          MA01_CodDepa, 
          MA01_Correo,
          MA01_NomPersonal, 
          MA01_Operador, 
          MA01_Telefono,
          MA01_Usuario, 

        } = resp.usuario[0];

        this.usuario = new Usuario(MA01_Usuario, MA01_NomPersonal, MA01_CodDepa, MA01_Telefono, MA01_Correo, '', MA01_Operador )

        localStorage.setItem('token', resp.token );
        return true;
      }),
      catchError (  error => of(false) )
    );

  }

  login(  formData: LoginForm ){

    return this.http.post(`${base_url}/login`, formData )
            .pipe(
              tap( (resp:any) => {
                localStorage.setItem('token', resp.token )
              })
            );

  }

  cargarUsuarios( desde:number ){

    const url = `${base_url}/usuarios`;
    
    return this.http.get< CargarUsuario >( url, this.headers )
            .pipe(
              delay(500)
            );


  }

  crearUsuario(  formData: RegisterForm ){

    return this.http.post(`${base_url}/usuario`, formData )
            .pipe(
              tap( (resp:any) => {
                localStorage.setItem('token', resp.token )
              })
            );

  }

  actualizarPerfil( data: { Correo:string, Usuario:string, CodDepa:string }  )
  { 
    
    data={
      ...data,
      CodDepa: this.usuario?.MA01_CodDepa || '01'
    };

    return this.http.put( `${base_url}/usuario/${ this.uid }`, data,{
      headers:{
        'x-token': this.token
      }
    });
    
  }

  eliminarUsuario( usuario:Usuario ){

    const url = `${base_url}/usuario/${usuario.MA01_Usuario}`;
    
    return this.http.delete( url, this.headers );

  }

}
