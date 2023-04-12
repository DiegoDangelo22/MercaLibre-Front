import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/model/categoria';
import { Color } from 'src/app/model/color';
import { ImagenColor } from 'src/app/model/imagen-color';
import { Ropa } from 'src/app/model/ropa';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ColorService } from 'src/app/services/color.service';
import { ImageService } from 'src/app/services/image.service';
import { RopaService } from 'src/app/services/ropa.service';
import { environment } from 'src/environments/environment';

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
  imagen!: ImagenColor[];
  precio: number = 0;
  colorNombre: any;
  categoriaNombre: any;
  colorSeleccionado: any;
  categoriaSeleccionada: any;
  productoSeleccionado: any;
  ropaId: any;

  constructor(private ropaService: RopaService, private categoriaService: CategoriaService, private colorService: ColorService, public imgServ: ImageService, public activatedRoute: ActivatedRoute, public http: HttpClient) {}

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
    // Primero, subes la imagen al servidor y obtienes su URL
    this.imgServ.onUpload().then((url: string) => {
      this.http.get(environment.URL + "ropa/autoincrement").subscribe(data => {
        this.ropaId = data;
      
      // Luego, creas un objeto de tipo ImagenColor con la URL de la imagen y el color seleccionado
      const imagenColor = {
        nombre: url,
        color: {id: Number(this.colorSeleccionado)} as Color,
        ropas: {id: this.ropaId} as Ropa
      };
    
      // Finalmente, creas un objeto de tipo Ropa con la información del formulario y el objeto imagenColor que acabas de crear
      const ropa = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        colores: [{id: Number(this.colorSeleccionado)}],
        precio: this.precio,
        categoria: { id: Number(this.categoriaSeleccionada) } as Categoria,
        imagenesColor: [imagenColor] as unknown as ImagenColor
      } as unknown as Ropa;
    
      // Guardas la ropa en el servidor
      this.ropaService.save(ropa).subscribe(data => {
        console.log(ropa);
        console.log("Ropa guardada correctamente");
        let modal: any = document.querySelector(".modal-container");
        modal.style.display = "none";
      }, err => {
        alert(err.error.mensaje);
      });
    })
  }).catch((error) => {
      console.error("Error al subir la imagen: ", error);
    });
  
  }
  

  // createColor(): void {
  //   let colorValue: any = document.querySelector(".color");
  //   console.log(colorValue.value);
  //   const color = new Color(this.colorNombre, colorValue.value);
  //   this.colorService.save(color).subscribe(data => {
  //     console.log("Color guardado correctamente");
  //   }, err => {
  //     alert(err.error.mensaje);
  //   });
  // }

  createCategoria(): void {
    const categoria = new Categoria(this.categoriaNombre);
    this.categoriaService.save(categoria).subscribe(data => {
      console.log("Categoría guardada correctamente");
    }, err => {
      alert(err.error.mensaje);
    });
  }
}