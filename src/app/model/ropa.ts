import { Categoria } from "./categoria";
import { Color } from "./color";
import { ImagenColor } from "./imagen-color";

export class Ropa {
    id?: number;
    nombre: string;
    descripcion: string;
    imagenesColor: ImagenColor[];
    colores: Color[];
    precio: number;
    categoria: Categoria;

    constructor(nombre: string, descripcion: string, imagenesColor: ImagenColor[], colores: Color[], precio: number, categoria: Categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagenesColor = imagenesColor;
        this.colores = colores;
        this.precio = precio;
        this.categoria = categoria;
    }
}