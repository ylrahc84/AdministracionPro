import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';


import { tap,map, catchError, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Usuario } from '../models/usuario.model';
import { AgenciaForm } from '../interfaces/agencia-form.interface';
  
const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})

export class AgenciaService {

  public usuario: Usuario | undefined;

  constructor(private http: HttpClient,
              private router: Router) { }


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

  eliminarAgencia( formData: AgenciaForm ){

    const url = `${base_url}/agencias`;
    
    return this.http.post( url, formData, {
            headers:{
           'x-token': this.token
          }
        } )
       .pipe( 
         tap(  (resp:any)=>{
            return resp;
         } ),
          delay(500)
        );

  }

  cargarAgencias( formData: AgenciaForm ){

    const url = `${base_url}/agencias`;
    
    return this.http.post( url, formData, {
            headers:{
           'x-token': this.token
          }
        } )
       .pipe( 
         tap(  (resp:any)=>{
            return resp;
         } ),
          delay(500)
        );

  }

  crearAgencia( formData: AgenciaForm ){

    const url = `${ base_url }/agencias`;

    return this.http.post( url, formData, {
          headers:{
        'x-token': this.token
        }
      } )
    .pipe( 
      tap(  (resp:any)=>{
          return resp;
      } ),
        delay(500)
      );

  }
 

}
