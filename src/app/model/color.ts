import { ImagenColor } from "./imagen-color";

export class Color {
    id?: number;
    nombre: string;
    hexadecimal: string;
    imagenesColor: ImagenColor[];

    constructor(nombre: string, hexadecimal: string, imagenesColor: ImagenColor[]) {
        this.nombre = nombre;
        this.hexadecimal = hexadecimal;
        this.imagenesColor = imagenesColor;
    }
}