import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2'
import { ActivatedRoute, Router } from '@angular/router';
import { AgenciaService } from 'src/app/services/agencia.service';
import { Agencia } from 'src/app/models/agencia.models';



@Component({
  selector: 'app-agencia',
  templateUrl: './agencia.component.html',
  styles: [
  ]
})
export class AgenciaComponent implements OnInit {

  public formPosteado:boolean = false;
  public agenciaActiva:Agencia | undefined;
  public codAgencia:string = "";

  public agenciaForm = this.fb.group({

    Proceso   :[90],
    Codigo    :[''],
    Ruc       :[''],
    Nombre    :[''],
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
    CodHabita :['NN'],
    NumHabita :[1],
    CodReserva:['NN'],
    NumReserva:['1'],
    Descuento :[1.0],
    Activo    :[1],
    Operador  :['CHARLY']

  });

  constructor( private fb: FormBuilder,
               private router: Router,
               private agenciaService: AgenciaService,
               private activateRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activateRoute.params.subscribe ( ({ id }) =>{

      if(id != "nuevo"){
      
        this.cargarAgenciaxID ( id );
        this.formPosteado = true;
      }
      else{
        this.formPosteado = false;
      }

    })
    
    this.agenciaForm;
  }

  cargarAgenciaxID( id:string )
  {
    this.agenciaForm.controls['Proceso'].setValue(90);
    this.agenciaForm.controls['Codigo'].setValue(id);
    this.agenciaService.cargarAgencias( this.agenciaForm.value)
        .subscribe( agencias =>{
           
          const { MR01_Ciudad, MR01_CodAgencia, MR01_Contacto,  MR01_Direccion, MR01_Email, MR01_Fax1,
            MR01_Mercado, MR01_NomAgencia, MR01_Pais, MR01_Ruc, MR01_Telefono1, MR01_Telefono2  } 
          = agencias.agencias[0];

          this.agenciaActiva = agencias.agencias[0];
          
          this.codAgencia = MR01_CodAgencia;
          this.agenciaForm.controls['Ruc'].setValue(MR01_Ruc);
          this.agenciaForm.controls['Nombre'].setValue(MR01_NomAgencia);
          this.agenciaForm.controls['Pais'].setValue(MR01_Pais);
          this.agenciaForm.controls['Direccion'].setValue(MR01_Direccion);
          this.agenciaForm.controls['Ciudad'].setValue(MR01_Ciudad);
          this.agenciaForm.controls['Contacto'].setValue(MR01_Contacto);
          this.agenciaForm.controls['Telefono'].setValue(MR01_Telefono1);
          this.agenciaForm.controls['Telefono2'].setValue(MR01_Telefono2);
          this.agenciaForm.controls['Fax'].setValue(MR01_Fax1);
          this.agenciaForm.controls['Email'].setValue(MR01_Email);
   
        })
  }

  crearAgencia(){

    if( this.formPosteado )
    {
 
      if(this.agenciaForm.invalid){
        return;
      }
  
      Swal.fire({
        title: 'Actualizar Agencia?',
        text:'Actualizar informacion de agencia',
        icon:'question',
        showCancelButton:true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si, actualizar!'
      }).then( (result)=>{
  
        if(result.value)
        {
  
          this.agenciaForm.controls['Proceso'].setValue(2);
          this.agenciaForm.controls['Codigo'].setValue(this.codAgencia);
           
          //Realizar el Posteo
          this.agenciaService.crearAgencia ( this.agenciaForm.value )
                    .subscribe( resp=>{
                      //Navegar a la venta de Agencias
                      this.router.navigateByUrl('/dashboard/agencias');
                      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
                    }, (err) =>{
  
                      //si sucede un error
                      Swal.fire('Error', err.error.msg, 'error');
                    });
                
        }
  
      });

    }else{
 
      if(this.agenciaForm.invalid){
        return;
      }
  
      Swal.fire({
        title: 'Guardar Agencia?',
        text:'Guardar informacion de agencia',
        icon:'question',
        showCancelButton:true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si, guardar!'
      }).then( (result)=>{
  
        if(result.value)
        {
  
          this.agenciaForm.controls['Proceso'].setValue(1);
   
          //Realizar el Posteo
          this.agenciaService.crearAgencia ( this.agenciaForm.value )
                    .subscribe( resp=>{
                      //Navegar a la venta de Agencias
                      this.router.navigateByUrl('/dashboard/agencias');
                      Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
                    }, (err) =>{
  
                      //si sucede un error
                      Swal.fire('Error', err.error.msg, 'error');
                    });
                
        }
  
      });

    }
  }

}
