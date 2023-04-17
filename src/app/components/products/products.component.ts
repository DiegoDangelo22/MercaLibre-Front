import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/model/categoria';
import { Color } from 'src/app/model/color';
import { ImagenColor } from 'src/app/model/imagen-color';
import { Ropa } from 'src/app/model/ropa';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ColorService } from 'src/app/services/color.service';
import { ImageService } from 'src/app/services/image.service';
import { RopaService } from 'src/app/services/ropa.service';
import { TokenService } from 'src/app/services/security/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: Ropa[] = [];
  categorias: Categoria[] = [];
  colores: Color[] = [];
  ropaId: any;
  nombre: string = '';
  descripcion: string = '';
  colorSeleccionado: any;
  colorNombre: any;
  precio: number = 0;
  categoriaSeleccionada: any;
  categoriaNombre: any;
  isLogged = false;
  isAdmin = false;

  constructor(private ropaService: RopaService, private categoriaService: CategoriaService, private colorService: ColorService, public imgServ: ImageService, public activatedRoute: ActivatedRoute, public http: HttpClient, private tokenServ: TokenService) {}

  ngOnInit(): void {
    if(this.tokenServ.getToken()) {
      this.isLogged = true;
      this.isAdmin = true;
    } else {
      this.isLogged = false;
      this.isAdmin = false;
    }

    this.ropaService.lista().subscribe(data => {
      this.products = data;
    })

    this.categoriaService.lista().subscribe(data => {
      this.categorias = data;
    })

    this.colorService.lista().subscribe(data => {
      this.colores = data;
    })

    let container: any = document.querySelector(".container");
    if(this.isAdmin === false) {
      container.style.display = 'none';
    }
  }

  @ViewChild('addProductBtn', {static: true}) addProductBtn!: ElementRef;
  @ViewChild('addCategoriaBtn', {static: true}) addCategoriaBtn!: ElementRef;
  @ViewChild('addColorBtn', {static: true}) addColorBtn!: ElementRef;
  ngAfterViewInit(): void {
    let createProductModal: any = document.querySelector("#create-product-modal");
    let createCategoriaModal: any = document.querySelector("#create-categoria-modal");
    let createColorModal: any = document.querySelector("#create-color-modal");

    this.addProductBtn.nativeElement.addEventListener("click", ()=> {
      createProductModal.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == createProductModal) {
          createProductModal.style.display = "none";
        }
      }
    });

    this.addCategoriaBtn.nativeElement.addEventListener("click", ()=> {
      createCategoriaModal.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == createCategoriaModal) {
          createCategoriaModal.style.display = "none";
        }
      }
    });

    this.addColorBtn.nativeElement.addEventListener("click", ()=> {
      createColorModal.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == createColorModal) {
          createColorModal.style.display = "none";
        }
      }
    });
  }

  filtrarRopaPorCategoria(id: number) {
    this.ropaService.filtrarRopaPorCategoria(id).subscribe(ropas => {
      this.products = ropas;
    });
  }

  filtrarRopaPorColor(id: number) {
    this.ropaService.filtrarRopaPorColor(id).subscribe(ropas => {
      this.products = ropas;
    });
  }

  getImagenRopaNombre(ropa: any[], ropaId: number) {
    const imagen = ropa.find(item => item.imagenesColor.find((imagen:any) => imagen.ropa === ropaId));
    return imagen ? imagen.imagenesColor[0].nombre : 'no source';
  }
  
  // Modales funciones

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
      this.ropaService.save(ropa).subscribe({next: data => {
        console.log(ropa);
        console.log("Ropa guardada correctamente");
        this.products.push(ropa);
        let modal: any = document.querySelector("#create-product-modal");
        modal.style.display = "none";
      },
        error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log("Completado");
        }});
    })
  }).catch((error) => {
      console.error("Error al subir la imagen: ", error);
    });
  }
  

  createColor(): void {
    let colorValue: any = document.querySelector(".color");
    console.log(colorValue.value);
    const color = new Color(this.colorNombre, colorValue.value);
    this.colorService.save(color).subscribe(data => {
      console.log("Color guardado correctamente");
      this.colores.push(color);
      let modal: any = document.querySelector("#create-color-modal");
      modal.style.display = "none";
    }, err => {
      alert(err.error.mensaje);
    });
  }

  createCategoria(): void {
    const categoria = new Categoria(this.categoriaNombre);
    this.categoriaService.save(categoria).subscribe(data => {
      console.log("Categoría guardada correctamente");
      this.categorias.push(categoria);
      let modal: any = document.querySelector("#create-categoria-modal");
      modal.style.display = "none";
    }, err => {
      alert(err.error.mensaje);
    });
  }

  cargarRopa(): void {
    this.ropaService.lista().subscribe(data => {this.products = data});
  }

  delete(id: number): void {
    if(id != undefined) {
      this.ropaService.delete(id).subscribe({next: ()=> {
        this.cargarRopa();
      }, complete: ()=> {
        console.log("Eliminación correcta");
      }})
    }
  }
}