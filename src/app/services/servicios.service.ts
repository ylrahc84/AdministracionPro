import { Injectable } from '@angular/core';


import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { ServiciosForm } from '../interfaces/servicio-form.interface';
import { tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {


  public usuario: Usuario| undefined;

  constructor( private http: HttpClient,
               private router: Router ) { }


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

    cargarServicios( formData: ServiciosForm ){

      const url = `${base_url}/servicio`;

      return this.http.post( url, formData,{
        headers:{
          'x-token': this.token
         }
      } )
      .pipe(
        tap( (resp:any) =>{
          return resp;
        } )
      );

    }

}
