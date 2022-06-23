import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

import Swal from 'sweetalert2';
import * as moment from 'moment';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
 
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Router } from '@angular/router';
import { ReservaService } from '../../../services/reserva.service';
import { Reserva } from '../../../models/reserva.models';
import { ReservaReporte } from '../../../models/reservaReporte.models';
import { DetalleServicioReservas } from '../../../models/detalle-srv-reserva-models';
import { ReservasSrvDetalleService } from '../../../services/reservas-srv-detalle.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styles: [
  ]
})
export class ReservasComponent implements OnInit {

  myDpOptionsFI: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
    // other options are here...
  };

  myDpOptionsFF: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
    // other options are here...
  };
  
  model: IMyDateModel = null;
  model2: IMyDateModel = null;
 
  public cargando: boolean = true;
  public formPosteado = false;

  public listaReservas: Reserva[] = [];
  public listaReservasTmp: Reserva[] = [];
  public reporteReservas : ReservaReporte[] = [];

  public detalleArray: DetalleServicioReservas[] = [];

  public FechaInicio:string;
  public FechaFinal:string;
  public fechaFin:Date = new Date();

  public FechaCracionReserva:any = formatDate( new Date(),'dd/MM/yyyy', 'en' );
  
  public reservaForm = this.fb.group({

    Proceso         :[''],
    CodReseva       :[''],
    CodAgencia      :[''],
    CodTarifa       :[''],
    CodPlan         :[''],
    FechaIngreso    :[''],
    FechaSalida     :[''],
    FechaCreacion   :['25/03/2022'],
    FechaConfirma   :['25/03/2022'],
    FechaPrepago    :['25/03/2022'],
    FechaAnulado    :['25/03/2022'],
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


  constructor( private fb: FormBuilder,
               private router: Router,
               private reserva: ReservaService,
               private detalleReserva: ReservasSrvDetalleService ) { }

  ngOnInit(): void {

    this.fechaFin = this.obtenerFechaFinDeMes();

    this.model = {isRange: false, singleDate: {jsDate: new Date()}};
    this.model2 = {isRange: false, singleDate: {jsDate: this.fechaFin }};
 
    this.FechaInicio = moment( new Date() ,"DD/MM/YYYY" ).toString();
    this.FechaFinal = moment( this.fechaFin ,"DD/MM/YYYY" ).toString();

  }


  crearDemo(){

    var externalDataRetrievedFromServer = [


      { name: 'Bartek', age: 34 },
      { name: 'John', age: 27 },
      { name: 'Elizabeth', age: 30 },


    ];
    
    function buildTableBody(data, columns) {
        var body = [];
    
        body.push(columns);
    
        data.forEach(function(row) {
            var dataRow = [];
    
            columns.forEach(function(column) {
                dataRow.push(row[column].toString());
            })
    
            body.push(dataRow);
        });
    
        return body;
    }
    
    function table(data, columns) {
        return {
            table: {
                headerRows: 1,
                body: buildTableBody(data, columns)
            }
        };
    }
    
    var dd = {
        content: [
            { text: 'Dynamic parts', style: 'header' },
            table(externalDataRetrievedFromServer, ['name', 'age'])
        ]
    }
    
    const pdf = pdfMake.createPdf(dd);
    pdf.open();

  }

  createConfirmacionReservaPDF(reserva: Reserva){
      
    const pdfDefinition: any = {

      content: [

        {
          text: 'BOOKING CONFIRMATION',
          fontSize: 15,
          alignment: 'center',
          color: '#047886'
        },
        {
          text: 'WAKAYA TOURS COSTA RICA',
          fontSize: 18,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: 'skyblue'
        },
        {
          text: 'info@wakayatours.com',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#047886'
        },
        {
          text: 'phone:(+506)8673-7470',
          fontSize: 10,
          bold: true,
          alignment: 'center',
          decoration: 'underline',
          color: '#047886'
        },
        {
          text: 'Customer Details',
          style: 'sectionHeader'
        },
        {
          columns: [
            [
              {
                text: reserva.PRV01_Descripcion,
                bold:true
              }
             // { text: "Direccion de cliente" },
             // { text: "Direccion de correo" },
             // { text: "Nombre de cliente" }
            ],
            [
              {
                text: `Date: ${ moment(reserva.PRV01_FecIngresa).format("D MMMM YYYY")  } `,
                alignment: 'right'
              },
              { 
                text: `Book No : ${ reserva.PRV01_CodReserva } `,
                alignment: 'right'
              }
            ]
          ]
        },
        {
          text: 'Order Details',
          style: 'sectionHeader'
        },

        {
          layout: 'lightHorizontalLines', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [ 'auto', 'auto', 70, 'auto', 'auto', 'auto', 'auto' ],

            body: [
              [ 'CODE', 'ACTIVITY', 'AMOUNT', 'PRICE','TOTAL', 'DATE', 'HOUR' ],
              ...this.detalleArray.map(
                p => {
                    return (
                      [
                        p.CodSrv, p.Descripcion, p.Cantidad, p.Precio, p.Total, p.FechaTour, p.HoraTour
                      ]
                    )
                }
              ),

              [ { text: 'TOTAL', bold: true }, '', '', '', reserva.PRV01_TotalRsv, '','' ]
            ]
          }
        },
        {
          text: 'Additional Details',
          style: 'sectionHeader'
        },
        {
            text: reserva.PRV01_Observacion,
            margin: [0, 0 ,0, 15]          
        },
        {
          columns: [
            [{ qr: `nombre de cliente`, fit: '50' }],
            [{ text: 'Signature', alignment: 'right', italics: true}],
          ]
        },
        {
          text: 'Terms and Conditions',
          style: 'sectionHeader'
        },
        {
            ul: [
              'Side by Side tours require a minimum number of travelers. If canceled because the minimum isn’t met, additional charges will apply if you cannot rebook for a different date/experience.',
              'Your minimum deposit to reserve is non-refundable. You can cancel up to 24 hours in advance of the experience’s start time – but the minimum refund amount will not be returned.',
              'Any changes made less than 24 hours before the experience’s start time will not be accepted. Cut-off times are based on the experience’s local time.',
              'Tours operate rain or shine.',
              'Contact us for more details about cancellation adventures@wakayatours.com'

            ],
        }
      ],
    
      styles: {
        header: {
          fontSize: 22,
          bold: true
        },
        sectionHeader: {
          bold: true,
          decoration: 'underline',
          fontSize: 14,
          margin: [0, 15,0, 15]          
        },
        anotherStyle: {
          fontsize: 15,
          italics: true,
          alignment: 'right'
        }
      }
    }
 
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
 
  }


  ReporteReservas(){
    
    var codigo:string = '';
    var codigo2:string = '';

    var CodReserva:string =''; 
    var CodReserva2:string ='';  

    const pdfDefinition: any = {
 

      pageSize: 'A4',
      pageOrientation: 'portrait',
      footer: function(currentPage, pageCount) { return currentPage.toString() + ' of ' + pageCount; },
      header: function(currentPage, pageCount, pageSize) {
        // you can apply any logic and return any valid pdfmake element
        return [
          { text: 'Lista de Reservas', alignment: (currentPage % 2) ? 'left' : 'right' },
          {
            text: 'WAKAYA TOURS COSTA RICA',
            fontSize: 15,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: 'skyblue'
          },
          {
            text: 'info@wakayatours.com',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: '#047886'
          },
          {
            text: 'phone:(+506)8673-7470',
            fontSize: 10,
            bold: true,
            alignment: 'center',
            decoration: 'underline',
            color: '#047886'
          },
          { canvas: [ { type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 } ] }
        ]
      },
      content: [
        
        this.reporteReservas.map((i, index) => {

          codigo = i.PRV04_CodReserva.trim();
          CodReserva =  i.PRV04_CodReserva.trim();

          if( CodReserva != CodReserva2){

            CodReserva2 = CodReserva;
            //added this array
            const tableBody = [
              [
                { text: 'Codigo', bold: true },
                { text: 'Actividad', bold: true },
                { text: 'Cantidad', bold: true },
                { text: 'Precio', bold: true },
                { text: 'Total', bold: true },
                { text: 'Fecha', bold: true },
                { text: 'Hora', bold: true }
              ]
            ];

            //appended to array
            this.reporteReservas.forEach(item => {
            
              codigo2 = item.PRV04_CodReserva.trim();

              if( codigo == codigo2)
              {

                tableBody.push( <any> [
                  item.PRV04_CodSrv,
                  item.PRV04_Descripcion,
                  item.PRV04_Cantidad,
                  item.PRV04_Precio,
                  item.PRV04_Total,
                  item.PRV04_FechaTour,
                  item.PRV04_Hora,
                ] );

              }
            });
    
            return [
              {

                margin: [0, 10, 0, 0],
                columns: [
                  {
                    stack: [

                      { text: `Code: ${i.PRV04_CodReserva}` },
                      { text: `${i.PRV01_Descripcion}`},
                      { text: `${i.PRV01_Observacion}` }
                    ]
                  },
                  {
                    stack: [

                      { text: `Total: ${i.PRV01_TotalRsv}` },
                      { text: `Fecha:  ${ moment(i.PRV01_FecCreacion).format("D MMMM YYYY")  } ` }

                    ],
                    alignment: 'right'
                  }
                ]

              },
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
                ],
                margin: [0, 10, 0, 0]
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                  //referenced array here
                  body: tableBody
                },
                layout: 'headerLineOnly'
              }
            ];

          }

        })
      ]
    }
 
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
 
  }
 
  crearReporteConfirmacion( id: number,  reserva: Reserva ){
 
    this.detalleArray = [];
 
    this.detalleForm.controls['Proceso'].setValue(99);
    this.detalleForm.controls['Descripcion'].setValue(reserva.PRV01_CodReserva)
    this.detalleForm.controls['FechaTour'].setValue('01/01/2021')

    this.detalleReserva.cargarDetalle( this.detalleForm.value )
        .subscribe( ({ ok, detalleServicios })=>{

          this.detalleArray = detalleServicios;

          this.createConfirmacionReservaPDF(reserva); 
  
        }, error=>{
          console.log(error);
        } )

  }
  
  obtenerFechaFinDeMes = () => {
    const fechaFin = new Date();
    // Iniciar en este año, el siguiente mes, en el día 0 (así que así nos regresamos un día)
    return new Date(fechaFin.getFullYear(), fechaFin.getMonth() + 1, 0);
  };

  cargarResumenReservas(){

    this.cargando = true;
    this.reservaForm.controls['Proceso'].setValue(95);
    
    this.reservaForm.controls['FechaIngreso'].setValue( this.FechaInicio );
    this.reservaForm.controls['FechaSalida'].setValue( this.FechaFinal );
     
    this.reserva.mostrarReservas( this.reservaForm.value )
        .subscribe( ({ok, reserva }) =>{
          
          this.reporteReservas = reserva;

          this.ReporteReservas();
 
        }, error =>{

          console.log(error);
          
        });
  }

  cargarReservas(){

    this.cargando = true;
    this.reservaForm.controls['Proceso'].setValue(90);
    
    this.reservaForm.controls['FechaIngreso'].setValue( this.FechaInicio );
    this.reservaForm.controls['FechaSalida'].setValue( this.FechaFinal );
    
    //console.log ( this.reservaForm.value );

    this.reserva.mostrarReservas( this.reservaForm.value )
        .subscribe( ({ok, reserva }) =>{

          this.cargando = false;

          this.listaReservas = reserva;
          this.listaReservasTmp = reserva;

        }, error =>{

          console.log(error);
          
        });

  }

  eliminarReserva( reserva: Reserva ){


    if(reserva.PRV01_Estado =='ANU'){
      Swal.fire(
        'Reserva ya se encuentra anulada ',
        `${ reserva.PRV01_CodReserva } fue anulado correctamente `,
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Anular reserva',
      text:`Esta a punto de anular la Reserva ${ reserva.PRV01_CodReserva } `,
      icon:'question',
      showCancelButton:true,
      confirmButtonColor:'#3085d6',
      cancelButtonColor:'#d33',
      confirmButtonText:'Si, anular!'

    }).then( (result) =>{

      if (result.value ){

        this.cargando = true;
        this.reservaForm.controls['Proceso'].setValue(3);
        this.reservaForm.controls['CodReseva'].setValue( reserva.PRV01_CodReserva );
        
        this.reserva.eliminarReserva( this.reservaForm.value )
          .subscribe( resp =>{
            this.cargarReservas();
            Swal.fire(
              'Reserva anulada ',
              `${ reserva.PRV01_CodReserva } fue anulado correctamente `,
              'success'
            );
          });

      }
    });
 
  }


  // optional date changed callback
  onDateChangedFI(event: IMyDateModel): void {
    // date selected
    this.FechaInicio = event.singleDate.formatted;
  }
  // optional date changed callback
  onDateChangedFF(event: IMyDateModel): void {
    // date selected
    this.FechaFinal = event.singleDate.formatted;
  }


}
