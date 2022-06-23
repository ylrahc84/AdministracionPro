import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Agencia } from 'src/app/models/agencia.models';

import { Usuario } from 'src/app/models/usuario.model';
import { AgenciaService } from 'src/app/services/agencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agencias',
  templateUrl: './agencias.component.html',
  styles: [
  ]
})

export class AgenciasComponent implements OnInit {

  public agencias: Agencia[] = [];

  public agenciaTemp: Agencia[] = [];

  public cargando: boolean = true;

  public formPosteado = false;

  public usuario: Usuario | undefined;

  public agenciaForm = this.fb.group({

    Proceso   :[90],
    Codigo    :[''],
    Ruc       :['', Validators.required],
    Nombre    :['', Validators.required],
    Direccion :[''],
    Ciudad    :[''],
    Pais      :[''],
    Primario  :[1],
    Mercado   :[''],
    Contacto  :[''],
    Telefono  :[''],
    Telefono2 :[''],
    Fax       :[''],
    Email     :[''],
    CodHabita :[''],
    NumHabita :[1],
    CodReserva:[''],
    NumReserva:[''],
    Descuento :[1.0],
    Activo    :[1],
    Operador  :['CHARLY']

  });

  constructor( private agenciaService: AgenciaService,
               private fb: FormBuilder,
               private router: Router  ) { }

  ngOnInit(): void {

    this.cargarAgencia();

  }

  cargarAgencia(){
    
    this.cargando = true;
    this.agenciaForm.controls['Proceso'].setValue(90);
    this.agenciaService.cargarAgencias( this.agenciaForm.value )
      .subscribe( ({ ok, total, agencias }) =>{
        this.cargando = false;

        this.agencias = agencias;
        this.agenciaTemp = agencias;

      },error=>{
        console.log(error);
      })

  }

  eliminarAgencia(agencia: Agencia)
  {

    Swal.fire({
      title: 'Borrar Agencia?',
      text:`Esta a punto de borrar a ${agencia.MR01_CodAgencia}`,
      icon:'question',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si, borrar!'

    }).then((result)=>{
      if(result.value){
  
        this.agenciaForm.controls['Proceso'].setValue(3);
        this.agenciaForm.controls['Codigo'].setValue(agencia.MR01_CodAgencia);

        console.log(this.agenciaForm.value);
        
        this.agenciaService.eliminarAgencia( this.agenciaForm.value )
            .subscribe(resp=>{
              this.cargarAgencia();
              Swal.fire(
                'Usuario borrado',
                `${agencia.MR01_CodAgencia} fue eliminado correctamente`,
                'success'
              );
              
            })       
      }
    });

  }

  buscar( termino:string ){

    if( termino.length === 0)
    {
      this.agencias = this.agenciaTemp;
    }
    else{

      this.agenciaService.cargarAgencias( this.agenciaForm.value )
      .subscribe( ({ ok, total, agencias }) =>{
        this.cargando = false;

        this.agencias = agencias;

      },error=>{
        console.log(error);
      })

    }
 

  }

}
