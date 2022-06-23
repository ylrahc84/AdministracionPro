import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import {  IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../../services/invoice.service';
import { Invoice } from '../../../../models/invoice.models';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html'
})
export class InvoicesComponent implements OnInit {

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

  
  public FechaInicio:string;
  public FechaFinal:string;


  public cargando: boolean = true;
  public formPosteado = false;

  public listaInvoice: Invoice[]=[];
  public listaInvoiceTmp: Invoice[]=[];

  public invoiceForm = this.fb.group({

    Proceso         :[99],
    TipDocu         :[''],
    SerieDocu       :[''],
    NumDocu         :[''],
    CodReserva      :[''],
    FechaDocu       :[''],
    FechaPago       :[''],
    FechaVen        :[''],
    CodCliente      :[''],
    RucClie         :[''],
    NomClie         :[''],
    PntVenta        :['PF'],
    CodVendedor     :[''],
    Estado          :['A'],
    Moneda          :[''],
    TCambio         :[''],
    Operador        :[''],

  })

  constructor( private fb: FormBuilder,
               private router: Router,
               private invoice: InvoiceService
               ) { }

  ngOnInit(): void {

   //this.cargarInvoice();

  }

  cargarInvoice(){

    this.cargando = true;
    this.invoiceForm.controls['Proceso'].setValue(99);
    this.invoiceForm.controls['FechaDocu'].setValue(this.FechaInicio);
    this.invoiceForm.controls['FechaPago'].setValue(this.FechaFinal);      
    this.invoiceForm.controls['FechaVen'].setValue('31/01/2022');      
    this.invoiceForm.controls['PntVenta']  .setValue('PF');      
    
    this.invoice.mostrarInvoices( this.invoiceForm.value )
        .subscribe( ({ok, invoices})=>{
          
          this.cargando = false;
          this.listaInvoice = invoices;
          this.listaInvoiceTmp = invoices;

        }, error =>{

            console.log(error);

        } )
    
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
