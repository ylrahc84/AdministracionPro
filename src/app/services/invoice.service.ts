import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { Usuario } from '../models/usuario.model';

import { InvoiceForm } from '../interfaces/invoice-form.interface';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


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

  mostrarInvoices( formData: InvoiceForm )
  {

    const url =`${base_url}/invoice`;

    return this.http.post( url, formData,{
      headers:{
        'x-token': this.token
       }

    } )
    .pipe(
      tap( (resp:any)=>{
        return resp;
        
      } ),
      delay(500)
    );


  }
}


