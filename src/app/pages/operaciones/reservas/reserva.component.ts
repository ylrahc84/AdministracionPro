import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { FormBuilder, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';

import Swal from 'sweetalert2'
import { Router, ActivatedRoute } from '@angular/router';

import { DetalleServicioReservas } from 'src/app/models/detalle-srv-reserva-models';
import { ReservasSrvDetalleService } from '../../../services/reservas-srv-detalle.service';
import { ReservaService } from '../../../services/reserva.service';

import { ServiciosService } from '../../../services/servicios.service';
import { Servicios } from '../../../models/servicios.models';

import { AgenciaService } from 'src/app/services/agencia.service';
import { Agencia } from 'src/app/models/agencia.models';
import * as moment from 'moment';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styles: [
    
  ]
})

export class ReservaComponent implements OnInit { 

  myDpOptionsRsv: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    // other options are here...
  };

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    // other options are here...
  };
 
  model: IMyDateModel = null;
  model2: IMyDateModel = null;

  public datePipe = new DatePipe('en-US');

  public todayWithPipe:any;

  public today:Date = new Date();

  public CodReserva = "";
  public formPosteado = false;
  public cargando: boolean = true;

  public reservaActiva: boolean = true;

  public detalleServicio: DetalleServicioReservas | undefined;
  public detalleArray: DetalleServicioReservas[] = [];
  public detalleArrayTmp: DetalleServicioReservas[] = [];
  public listaServicios: Servicios[] = [];
  public listaServiciosTmp: Servicios[] = [];
  public agencias: Agencia[] = [];
  public agenciaTemp: Agencia[] = [];
  public FechaActividad:string;
  public FechaReserva:string;
  public CodigoAgencia:string;
  public NombreAgencia:string = "Nombre de Agencia";
  public CodigoServicio:string;
  public NombreServicio:string;
  public PrecioServicio:number;
  public FechaCracionReserva:any = formatDate( new Date(),'dd/MM/yyyy', 'en' );
  
  public reservaForm = this.fb.group({

    Proceso         :[''],
    CodReseva       :[''],
    CodAgencia      :['', Validators.required],
    CodTarifa       :['', Validators.required],
    CodPlan         :['', Validators.required],
    FechaIngreso    :['', Validators.required],
    FechaSalida     :['', Validators.required],
    FechaCreacion   :['', Validators.required],
    FechaConfirma   :['', Validators.required],
    FechaPrepago    :['', Validators.required],
    FechaAnulado    :['', Validators.required],
    TotalNoches     :[1],
    TotalDias       :[1],
    Descripcion     :[''],
    TCambio         :[560],
    Folio           :[''],
    Estado          :[''],
    Moneda          :['USD'],
    Totalrsv        :[0],
    Observaciones   :[''],
    Procesa         :[0],
    Directo         :['1'],
    Operador        :['POSTMAN'],

  });

  public detalleForm = this.fb.group({

    Proceso     :[90],
    Codigo      :['', [Validators.required, Validators.minLength(5) ]],
    Descripcion :['', Validators.required],
    Moneda      :['USD', Validators.required],
    Cantidad    :[1,Validators.min(1)],
    TipPax      :['PX', Validators.required],
    Precio      :[0.00],
    Total       :[0.00],
    Impuesto    :[1],
    FechaTour   :['', [Validators.required]],
    Hora        :['', Validators.required],
    CCosto      :['TOURS', Validators.required],
    Operador    :['POSTMAN']

  });

  public serviciosForm = this.fb.group({

    Proceso     :[90],
    Codigo      :[''],
    Descripcion :[''],
    CCosto      :[''],
    Precio      :[0],
    ImpInclu    :[0],
    Moneda      :[''],
    Orden       :[1],
    Operador    :[''],

  })

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
    CodHabita :[''],
    NumHabita :[1],
    CodReserva:[''],
    NumReserva:[''],
    Descuento :[1.0],
    Activo    :[1],
    Operador  :['CHARLY']

  });

  constructor(private fb: FormBuilder,
              private router: Router,
              private detalleReserva: ReservasSrvDetalleService,
              private reserva: ReservaService,
              private servicios :ServiciosService,
              private agenciaService: AgenciaService,
              private activateRoute: ActivatedRoute
              ) { 
              }

  ngOnInit(): void {
 
    this.cargarListaServicios();
    this.cargarAgencia();
    this.crearTemporalDetalle();
    //this.model = {isRange: false, singleDate: {jsDate: new Date()}};
    //this.model2 = {isRange: false, singleDate: {jsDate: new Date()}};
    
    // this.FechaActividad = this.FechaCracionReserva;
    // this.FechaReserva = this.FechaCracionReserva;
 
    this.activateRoute.params.subscribe( ({id}) =>{

      if(id != "nuevo"){
 
        
        this.cargarReservaxID ( id );

        this.CodReserva = id;
        this.reservaActiva = true;

      }
      else{
 
        this.cargarDetalleReserva('9', '');
        this.cargarDetalleReserva('90', '');

        this.reservaActiva = false;

      }
    })

  }

  cargarAgenciaxID( id:string )
  {
    this.agenciaForm.controls['Proceso'].setValue(90);
    this.agenciaForm.controls['Codigo'].setValue(id);
    this.agenciaService.cargarAgencias( this.agenciaForm.value)
        .subscribe( agencia =>{
           
          const { MR01_NomAgencia }  = agencia.agencias[0];
          
          this.NombreAgencia = MR01_NomAgencia;
   
        })
  }

  cargarReservaxID( id:string )
  {

    this.reservaForm.controls['Proceso'].setValue(99);
    this.reservaForm.controls['CodReseva'].setValue(id);
    this.reserva.mostrarReservas( this.reservaForm.value )
        .subscribe( ({ok, reserva}) =>{
          
          const {
            PRV01_CodReserva, PRV01_CodAgencia, PRV01_CodTarifa, PRV01_CodPlan,
            PRV01_FecIngresa, PRV01_FecSalida, PRV01_FecCreacion, PRV01_FecConfirma, PRV01_FecPrepago, PRV01_FecAnulada,
            PRV01_TotNoches, PRV01_TotDias, PRV01_Descripcion, PRV01_TCambio, PRV01_Folio, PRV01_Estado, PRV01_Moneda,
            PRV01_TotalRsv, PRV01_Observacion, PRV01_Procesado, PRV01_Directo, PRV01_Operador
          } = reserva[0];

         // this.reservaActiva = reserva[0];

         this.reservaForm.controls['CodReseva'].setValue(PRV01_CodReserva);
         this.reservaForm.controls['CodAgencia'].setValue(PRV01_CodAgencia);
         this.reservaForm.controls['CodTarifa'].setValue(PRV01_CodTarifa);
         this.reservaForm.controls['CodPlan'].setValue(PRV01_CodPlan);
         this.reservaForm.controls['FechaIngreso'].setValue(PRV01_FecIngresa);
         this.reservaForm.controls['FechaSalida'].setValue(PRV01_FecSalida);
         this.reservaForm.controls['FechaCreacion'].setValue(PRV01_FecCreacion);
         this.reservaForm.controls['FechaConfirma'].setValue(PRV01_FecConfirma);
         this.reservaForm.controls['FechaPrepago'].setValue(PRV01_FecPrepago);
         this.reservaForm.controls['FechaAnulado'].setValue(PRV01_FecAnulada);
         this.reservaForm.controls['Descripcion'].setValue(PRV01_Descripcion);
         this.reservaForm.controls['Observaciones'].setValue(PRV01_Observacion);

         this.cargarAgenciaxID(PRV01_CodAgencia);
  
         this.today = moment(PRV01_FecIngresa ,"DD/MM/YYYY" ).toDate();
         this.model = {isRange: false, singleDate: {jsDate: this.today }};
         this.FechaReserva = PRV01_FecIngresa;

         this.cargarDetalleReserva('99', PRV01_CodReserva);
         
        } );
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

  cargarListaServicios(){

    this.serviciosForm.controls['Proceso'].setValue(90);
    this.servicios.cargarServicios( this.serviciosForm.value )
        .subscribe( ({ ok, servicio }) =>{

          this.listaServicios = servicio;
          this.listaServiciosTmp = servicio;

        }, error=>{

          console.log(error);

        } )

  }

  crearTemporalDetalle(){

    this.serviciosForm.controls['Proceso'].setValue(20);
    this.serviciosForm.controls['Operador'].setValue('POSTMAN');

    this.detalleReserva.crearTemporalDetalle( this.detalleForm.value )
      .subscribe( resp=>{

        this.cargarDetalleReserva('90', '');

      }, (err)=>{
          //si sucede un error
          Swal.fire('Error', err.error.msg, 'error');
      } );

  }

  cargarDetalleReserva( Id: string, CodReserva: string ){

    this.detalleForm.controls['Proceso'].setValue(Id);
    this.detalleForm.controls['Descripcion'].setValue(CodReserva)
    this.detalleForm.controls['FechaTour'].setValue('01/01/2021')

    this.detalleReserva.cargarDetalle( this.detalleForm.value )
        .subscribe( ({ ok, detalleServicios })=>{

          this.detalleArray = detalleServicios;
          this.detalleArrayTmp = detalleServicios;
 
        }, error=>{
          console.log(error);
        } )

  }

  guardarItemDetalle(){

    if( this.detalleForm.controls['Codigo'].value =='' ){

      Swal.fire('Error', 'Seleccione una actividad ', 'warning');
      return;
    }
    if( this.detalleForm.controls['Precio'].value == '' || this.detalleForm.controls['Precio'].value < 0 ){

      Swal.fire('Error', 'Ingrese un precio valido ', 'warning');
      return;
    }

    if( this.detalleForm.controls['Cantidad'].value <= 0 ){

      Swal.fire('Error', 'Ingrese una cantidad valida ', 'warning');
      return;
    }

    if ( this.detalleForm.controls['FechaTour'].value <= this.FechaReserva ){

      Swal.fire('Error', 'Seleccione una fecha para la actividad', 'warning' );
      return;
    }

    if( this.detalleForm.controls['Hora'].value == '' ){
      Swal.fire('Error', 'Ingrese una Hora correcta','warning');
      return;
    }

    Swal.fire({
      title: 'Guardar Servicio?',
      text:'Actualizar detalle de reserva',
      icon:'question',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si, añadir!'
    }).then( (result)=>{

      if(result.value)
      {

        this.detalleForm.controls['Proceso'].setValue(1);
        this.detalleForm.controls['FechaTour'].setValue(this.FechaActividad);
         
       // console.log(this.detalleForm.value);

        //Realizar el Posteo
        this.detalleReserva.agregarDetalleServicioReserva( this.detalleForm.value )
            .subscribe( resp=>{

              this.cargarDetalleReserva('90', '');

            }, (err)=>{
                //si sucede un error
                Swal.fire('Error', err.error.msg, 'error');
            } );
      }
    });
  }

  eliminarItemDetalle( detalleItem: DetalleServicioReservas )  {

    Swal.fire({
      title: 'Borrar Servicio?',
      text:`Esta a punto de borrar a ${detalleItem.CodSrv}`,
      icon:'question',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si, borrar!'

    }).then((result)=>{
      if(result.value){
  
        this.detalleForm.controls['Proceso'].setValue(3);
        this.detalleForm.controls['Codigo'].setValue(detalleItem.CodSrv);

        this.detalleReserva.eliminarDetalleServicioReserva( this.detalleForm.value )
            .subscribe(resp=>{

              

              Swal.fire(
                'Servicio borrado',
                `${detalleItem.CodSrv} fue eliminado correctamente`,
                'success'
              );

              this.cargarDetalleReserva('90', '');
              
            })       
      }
    });
  }

  guardarReserva (){

    if( this.reservaForm.controls['CodAgencia'].value == '' )
    {
      Swal.fire ( 'Error', 'Debe seleccionar un agencia', 'warning' );
      return;
    }

    if( this.reservaForm.controls['FechaIngreso'].value < 0 ){
      Swal.fire ( 'Error', 'Debe seleccinonar una fecha de reserva', 'warning' );
      return;
    }

    if( this.detalleArray.length <= 0 ){
      Swal.fire ('Error', 'Debe ingresar al menos un detalle para reservas', 'warning');
      return;
    }
 
    if(this.reservaActiva){


      this.formPosteado = true;

    //  if(this.reservaForm.invalid){
     //   return;
     // }
 
      Swal.fire({
        title: 'Actualizar Reserva?',
        text:'Actualizar informacion de reserva',
        icon:'question',
        showCancelButton:true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si, actualizar!'
      }).then( (result)=>{
  
        if(result.value)
        {
   
          this.reservaForm.controls['Proceso'].setValue(2);
          this.reservaForm.controls['CodReseva'].setValue(this.CodReserva);
  
          this.reservaForm.controls['CodTarifa'].setValue('GRUPO');
          this.reservaForm.controls['CodPlan'].setValue('SPL');
          
          this.reservaForm.controls['FechaIngreso'].setValue(this.FechaReserva);
          this.reservaForm.controls['FechaSalida'].setValue(this.FechaReserva);
          this.reservaForm.controls['FechaCreacion'].setValue(this.FechaCracionReserva.toString());
          this.reservaForm.controls['FechaConfirma'].setValue(this.FechaCracionReserva.toString());
          this.reservaForm.controls['FechaPrepago'].setValue(this.FechaCracionReserva.toString());
          this.reservaForm.controls['FechaAnulado'].setValue(this.FechaCracionReserva.toString());
  
          this.reservaForm.controls['Estado'].setValue('ABI');
          
          //Realizar el Posteo
          this.reserva.crearReserva( this.reservaForm.value )
              .subscribe( resp=>{
  
                 //Navegar a la venta de Agencias
                 this.router.navigateByUrl('/dashboard/reservas');
                 Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
  
              }, (err)=>{
                  //si sucede un error
                  Swal.fire('Error', err.error.msg, 'error');
              } );
        }
      });

    }else{
 
      this.formPosteado = true;

    //  if(this.reservaForm.invalid){
     //   return;
    //  }

      Swal.fire({
        title: 'Guardar Reserva?',
        text:'Registrar informacion de reserva',
        icon:'question',
        showCancelButton:true,
        confirmButtonColor:'#3085d6',
        cancelButtonColor:'#d33',
        confirmButtonText:'Si, guardar!'
      }).then( (result)=>{

        if(result.value)
        {
  
          this.reservaForm.controls['Proceso'].setValue(1);
          this.reservaForm.controls['CodReseva'].setValue('NUEVO');

          this.reservaForm.controls['CodTarifa'].setValue('GRUPO');
          this.reservaForm.controls['CodPlan'].setValue('SPL');
          
          this.reservaForm.controls['FechaIngreso'].setValue(this.FechaReserva);
          this.reservaForm.controls['FechaSalida'].setValue(this.FechaReserva);
          this.reservaForm.controls['FechaCreacion'].setValue(this.FechaCracionReserva.toString() );
          this.reservaForm.controls['FechaConfirma'].setValue(this.FechaCracionReserva.toString());
          this.reservaForm.controls['FechaPrepago'].setValue(this.FechaCracionReserva.toString());
          this.reservaForm.controls['FechaAnulado'].setValue(this.FechaCracionReserva.toString());

          this.reservaForm.controls['Estado'].setValue('ABI');
          
          //Realizar el Posteo
          this.reserva.crearReserva( this.reservaForm.value )
              .subscribe( resp=>{

                //Navegar a la venta de Agencias
                this.router.navigateByUrl('/dashboard/reservas');
                Swal.fire('Guardado', 'Cambios fueron guardados', 'success');

              }, (err)=>{
                  //si sucede un error
                  Swal.fire('Error', err.error.msg, 'error');
              } );
        }
      });
    }
 
  }

  seleccionarAgencia(itemAgencia: Agencia){

    this.CodigoAgencia = itemAgencia.MR01_CodAgencia;
    this.NombreAgencia = itemAgencia.MR01_NomAgencia;

    this.reservaForm.controls['CodAgencia'].setValue(itemAgencia.MR01_CodAgencia);

  }

  seleccionarServicio( itemServicio: Servicios ){

    this.CodigoServicio = itemServicio.MR07_CodTarAli ;
    this.NombreServicio = itemServicio.MR07_Descripcion;
    this.PrecioServicio = itemServicio.MR07_Precio;

    this.detalleForm.controls['Codigo'].setValue( itemServicio.MR07_CodTarAli);
    this.detalleForm.controls['Descripcion'].setValue( itemServicio.MR07_Descripcion);
    this.detalleForm.controls['Precio'].setValue( itemServicio.MR07_Precio);
  }

  // optional date changed callback
  onDateChanged(event: IMyDateModel): void {
    // date selected
    this.FechaActividad = event.singleDate.formatted;
  }

  onDateChangedReserva(event: IMyDateModel): void {
    // date selected
    this.FechaReserva = event.singleDate.formatted;
  }

}
