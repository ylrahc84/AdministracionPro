import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuariosService } from 'src/app/services/usuario.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit {

  public usuario: Usuario[] = [];
  public usuarioTemp: Usuario[] = [];
  public totalUsuarios:number =0;
  public desde: number =0;
  public cargando:boolean = true;

  constructor( private usuarioService: UsuariosService,
               private busquedasServices: BusquedasService ) { }

  ngOnInit(): void {

    this.cargarUsuarios();

  }

  cargarUsuarios(){
    this.cargando = true;

    this.usuarioService.cargarUsuarios( this.desde )
        .subscribe( ({ total, usuarios }) =>{
          this.usuarioTemp = usuarios;
          this.totalUsuarios = total;
          this.usuario = usuarios;
          this.cargando = false;
        })
  }

  cambiarPagina( valor:number ){
    this.desde += valor;

    if(this.desde < 0){
      this.desde = 0;
    }else if(this.desde > this.totalUsuarios){
      this.desde -= valor; 
    }

  }

  eliminarUsuario(usuario:Usuario)
  {

    if(usuario.MA01_Usuario === this.usuarioService.uid)
    {
      Swal.fire(
        'Error',
        'No pude borrarse a si mismo',
        'error'
      );

      return;

    }

    Swal.fire({
      title: 'Borrar Usuario?',
      text:`Esta a punto de borrar a ${usuario.MA01_Usuario}`,
      icon:'question',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si, borrar!'

    }).then((result)=>{
      if(result.value){

        this.usuarioService.eliminarUsuario(usuario)
            .subscribe(resp=>{
              this.cargarUsuarios();
              Swal.fire(
                'Usuario borrado',
                `${usuario.MA01_Usuario} fue eliminado correctamente`,
                'success'
              );
              
            })       
      }
    });

  }

  buscar( termino:string ){

    if( termino.length === 0)
    {
      this.usuario = this.usuarioTemp;
    }
    else{
      this.busquedasServices.Buscar ('usuario', termino)
      .subscribe( resultados => {

        this.usuario = resultados;

      } )
    }
 

  }

}
