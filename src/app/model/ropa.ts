import { Categoria } from "./categoria";
import { Color } from "./color";

export class Ropa {
    id?: number;
    nombre: string;
    descripcion: string;
    imagen: string;
    colores: Color[];
    precio: number;
    categoria: Categoria;

    constructor(nombre: string, descripcion: string, imagen: string, colores: Color[], precio: number, categoria: Categoria) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.colores = colores;
        this.precio = precio;
        this.categoria = categoria;
    }
}