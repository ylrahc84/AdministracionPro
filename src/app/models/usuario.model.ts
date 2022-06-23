import { environment } from '../../environments/environment';

const base_url = environment.base_url;

export class Usuario {

    constructor(
        public MA01_Usuario: string,
        public MA01_NomPersonal: string,
        public MA01_CodDepa: string,
        public MA01_Telefono: string,
        public MA01_Correo: string,
        public MA01_Clave: string,
        public MA01_Operador: string,
    ) {}

    //get imagenUrl() {
//
    //    if ( !this.img ) {
    //        return `${ base_url }/upload/usuarios/no-image`;
    //    } else if ( this.img.includes('https') ) {
    //        return this.img;
    //    } else if ( this.img ) {
    //        return `${ base_url }/upload/usuarios/${ this.img }`;
    //    } else {
    //        return `${ base_url }/upload/usuarios/no-image`;
    //    }
    //}
}

