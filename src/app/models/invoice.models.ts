export class Invoice{

    constructor(

        public PPV00_TipoDocu           :string,
        public PPV00_NumDocu            :string,
        public PPV15_NumeroConsecutivo  :string,
        public PPV00_RucCliente         :string,
        public PPV00_NomCliente         :string,
        public PPV00_FechaDocu          :string,
        public PPV00_SubTotal           :number,
        public PPV00_Descuento          :number,
        public PPV00_Neto               :number,
        public PPV00_Impuesto           :number,
        public PPV00_Exonerado          :number,
        public PPV00_TotalDocu          :number,
        public PPV00_Moneda             :string,
        public PPV00_EstDocu            :string,
        public FRMPAGO                  :string,
        public PPV00_Operador           :string,
        public PPV00_Habitacion         :string,
        public PPV00_CodReserva         :string,
        public PPV00_Propinas           :number,
        public PPV00_NumPax             :string,
        public NC                       :string,
        public PPV15_xml_Respuesta      :string,
        public PPV00_CodCliente         :string,
        public PPV00_TCambio            :number,
        public PPV15_Clave              :string,
        public PPV15_TDocFE             :string,
        public PPV00_PntVenta           :string,

    ){

    }

}