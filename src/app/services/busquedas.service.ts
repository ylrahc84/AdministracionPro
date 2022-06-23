import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { delay, map } from 'rxjs/operators';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios( resultados: any[] ): Usuario[] {

    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid )  
    );
  }


  Buscar( tipo:'usuario', termino:string = '' ){

    const url = `${base_url}/${tipo}/${termino}`;
    
    return this.http.get<any[]>( url, this.headers )
            .pipe(
              delay(500),
              map( (resp:any) => resp.resultados )
            );


  }



}
