import { Color } from "./color";
import { Ropa } from "./ropa";
import { Talle } from "./talle";

export class ImagenColor {
    id?: number;
    nombre: string;
    color: Color;
    ropa: Ropa;
    talle: Talle;

    constructor(nombre: string, color: Color, ropa: Ropa, talle: Talle) {
        this.nombre = nombre;
        this.color = color;
        this.ropa = ropa;
        this.talle = talle;
    }
}