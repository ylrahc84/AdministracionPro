export class Reserva {

    
    constructor( 

        public PRV01_CodReserva     :string,
        public PRV01_CodAgencia     :string,
        public PRV01_CodTarifa      :string,
        public PRV01_CodPlan        :string,
        public PRV01_FecIngresa     :string,
        public PRV01_FecSalida      :string,
        public PRV01_FecCreacion    :string,
        public PRV01_FecConfirma    :string,
        public PRV01_FecPrepago     :string,
        public PRV01_FecAnulada     :string,
        public PRV01_TotNoches      :number,
        public PRV01_TotDias        :number,
        public PRV01_Descripcion    :string,
        public PRV01_TCambio        :number,
        public PRV01_Folio          :string,
        public PRV01_Estado         :string,
        public PRV01_Moneda         :string,
        public PRV01_TotalRsv       :number,
        public PRV01_Observacion    :string,
        public PRV01_Procesado      :number,
        public PRV01_Directo        :string,
        public PRV01_Operador       :string,
        public PREPAGO              :string,
        public MR01_NomAgencia      :string,
        public NHAB                 :string,
        public NPax                 :string,
        public NChild               :string,
 
     ){

    }

}