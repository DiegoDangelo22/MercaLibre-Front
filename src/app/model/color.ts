export class Color {
    id?: number;
    nombre: string;
    hexadecimal: string;

    constructor(nombre: string, hexadecimal: string) {
        this.nombre = nombre;
        this.hexadecimal = hexadecimal;
    }
}