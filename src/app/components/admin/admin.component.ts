import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/model/categoria';
import { Color } from 'src/app/model/color';
import { Ropa } from 'src/app/model/ropa';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ColorService } from 'src/app/services/color.service';
import { ImageService } from 'src/app/services/image.service';
import { RopaService } from 'src/app/services/ropa.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  categorias: Categoria[] = [];
  colores: Color[] = [];
  nombre: string = '';
  descripcion: string = '';
  imagen: string = '';
  precio: number = 0;
  colorNombre: any;
  categoriaNombre: any;
  colorSeleccionado: any;
  categoriaSeleccionada: any;
  productoSeleccionado: any;

  constructor(private ropaService: RopaService, private categoriaService: CategoriaService, private colorService: ColorService, public imgServ: ImageService) {}

  ngOnInit(): void {
    this.categoriaService.lista().subscribe(data => {
      this.categorias = data;
    })

    this.colorService.lista().subscribe(data => {
      this.colores = data;
    })

    let createProductModal: any = document.querySelector("#create-product-modal");
    let createCategoriaModal: any = document.querySelector("#create-categoria-modal");
    let createColorModal: any = document.querySelector("#create-color-modal");
    let addProductBtn: any = document.querySelector(".add-product");
    let addCategoriaBtn: any = document.querySelector(".add-categoria");
    let addColorBtn: any = document.querySelector(".add-color");

    addProductBtn.addEventListener("click", ()=> {
      createProductModal.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == createProductModal) {
          createProductModal.style.display = "none";
        }
      }
    });

    addCategoriaBtn.addEventListener("click", ()=> {
      createCategoriaModal.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == createCategoriaModal) {
          createCategoriaModal.style.display = "none";
        }
      }
    });

    addColorBtn.addEventListener("click", ()=> {
      createColorModal.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == createColorModal) {
          createColorModal.style.display = "none";
        }
      }
    });
  }

  createRopa(): void {
    this.imgServ.onUpload().then((url: string) => {
      this.imagen = url;
      // const product = new Ropa(this.nombre, this.descripcion, this.imagen, {id: this.colorSeleccionado} as Color, this.precio, {id: this.categoriaSeleccionada} as Categoria);
      // this.ropaService.save(product).subscribe(data => {
        console.log("Ropa guardada correctamente");
        let modal: any = document.querySelector(".modal-container");
        modal.style.display = "none";
      }, err => {
        alert(err.error.mensaje);
      });
    // }).catch((error) => {
      // console.error("Error al subir la imagen: ", error);
    // });
  }

  createColor(): void {
    let colorValue: any = document.querySelector(".color");
    console.log(colorValue.value);
    const color = new Color(this.colorNombre, colorValue.value);
    this.colorService.save(color).subscribe(data => {
      console.log("Color guardado correctamente");
    }, err => {
      alert(err.error.mensaje);
    });
  }

  createCategoria(): void {
    const categoria = new Categoria(this.categoriaNombre);
    this.categoriaService.save(categoria).subscribe(data => {
      console.log("Categoría guardada correctamente");
    }, err => {
      alert(err.error.mensaje);
    });
  }
}