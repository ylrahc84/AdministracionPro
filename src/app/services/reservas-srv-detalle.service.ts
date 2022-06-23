import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { ReservaSrvDetalleForm } from '../interfaces/reserva-detalle.interface';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';


const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ReservasSrvDetalleService {


  public usuario: Usuario;


  constructor( private http: HttpClient,
               private router: Router  ) {

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

  crearTemporalDetalle(dataForm: ReservaSrvDetalleForm){

    const url = `${base_url}/servicioDetalle`;

    return this.http.post( url, dataForm,{
      headers:{
        'x-token': this.token
       }
    } )
    .pipe(
      tap( (resp:any)=>{
        return resp;
      } )
    );

  }

  cargarDetalle( dataForm: ReservaSrvDetalleForm ){

    const url = `${base_url}/servicioDetalle`;

    return this.http.post( url, dataForm,{
      headers:{
        'x-token': this.token
       }
    } )
    .pipe(
      tap( (resp:any)=>{
        return resp;
      } )
    );
  }

  agregarDetalleServicioReserva(formData: ReservaSrvDetalleForm){
        
    const url = `${ base_url }/servicioDetalle`;

    return this.http.post(url, formData,{
        headers:{
            'x-token': this.token
        }
    })
    .pipe(
        tap( (resp:any)=>{
            return resp;
        })
    );
  } 

  eliminarDetalleServicioReserva( formData: ReservaSrvDetalleForm ){
    
    const url = `${ base_url }/servicioDetalle`;

    return this.http.post(url, formData,{
        headers:{
            'x-token': this.token
        }
    })
    .pipe(
        tap( (resp:any)=>{
            return resp;
        })
    );

  }


}
