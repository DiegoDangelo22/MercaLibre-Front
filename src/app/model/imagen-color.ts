import { Color } from "./color";
import { Ropa } from "./ropa";

export class ImagenColor {
    id?: number;
    nombre: string;
    color: Color;
    ropa: Ropa;

    constructor(nombre: string, color: Color, ropa: Ropa) {
        this.nombre = nombre;
        this.color = color;
        this.ropa = ropa;
    }
}