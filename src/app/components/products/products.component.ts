import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/model/categoria';
import { Color } from 'src/app/model/color';
import { ImagenColor } from 'src/app/model/imagen-color';
import { Ropa } from 'src/app/model/ropa';
import { Talle } from 'src/app/model/talle';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ColorService } from 'src/app/services/color.service';
import { ImageService } from 'src/app/services/image.service';
import { RopaService } from 'src/app/services/ropa.service';
import { TokenService } from 'src/app/services/security/token.service';
import { TalleService } from 'src/app/services/talle.service';
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
  talles: Talle[] = [];
  ropaId: any;
  nombre: string = '';
  descripcion: string = '';
  colorSeleccionado: any;
  talleSeleccionado: any;
  talleNombre: any;
  colorNombre: any;
  precio: number = 0;
  categoriaSeleccionada: any;
  categoriaNombre: any;
  minPrice!: number;
  maxPrice!: number;
  isLogged = false;
  isAdmin = false;
  currentPage: number = 0;
  pageSize: number = 10;
  brightTheme!: boolean;
  darkTheme!: boolean;
  warningText: string = "";

  constructor(private ropaService: RopaService, private categoriaService: CategoriaService, private colorService: ColorService, public talleService: TalleService, public imgServ: ImageService, public activatedRoute: ActivatedRoute, public http: HttpClient, private tokenServ: TokenService) {}

  ngOnInit(): void {
    if(localStorage.getItem('theme') === "bright") {
      this.brightTheme = true;
      this.darkTheme = false;
    } else if(localStorage.getItem('theme') === "dark") {
      this.darkTheme = true;
      this.brightTheme = false;
    }
    if(this.tokenServ.getToken()) {
      this.isLogged = true;
      this.isAdmin = true;
    } else {
      this.isLogged = false;
      this.isAdmin = false;
    }

    this.cargarRopa2();

    this.categoriaService.lista().subscribe(data => {
      this.categorias = data;
    })

    this.colorService.lista().subscribe(data => {
      this.colores = data;
    })

    this.talleService.lista().subscribe(data => {
      this.talles = data;
    })

    let container: any = document.querySelector(".container");
    if(this.isAdmin === false) {
      container.style.display = 'none';
    }
    
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  @ViewChild('addProductBtn', {static: true}) addProductBtn!: ElementRef;
  @ViewChild('addCategoriaBtn', {static: true}) addCategoriaBtn!: ElementRef;
  @ViewChild('addColorBtn', {static: true}) addColorBtn!: ElementRef;
  @ViewChild('addTalleBtn', {static: true}) addTalleBtn!: ElementRef;
  @ViewChild('filtersBtn', {static: true}) filtersBtn!: ElementRef;
  ngAfterViewInit(): void {
    let createProductModal: any = document.querySelector("#create-product-modal");
    let createCategoriaModal: any = document.querySelector("#create-categoria-modal");
    let createColorModal: any = document.querySelector("#create-color-modal");
    let createTalleModal: any = document.querySelector("#create-talle-modal");
    let filters: any = document.querySelector(".category");

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

    this.addTalleBtn.nativeElement.addEventListener("click", ()=> {
      createTalleModal.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == createTalleModal) {
          createTalleModal.style.display = "none";
        }
      }
    })

    this.filtersBtn.nativeElement.addEventListener("click", ()=> {
      if(filters.style.display == "flex") {
          filters.classList.remove("smooth-sliding");
          filters.classList.add("smooth-sliding-close");
          setTimeout(() => {
            filters.style.display = "none"
          }, 500);
      } else {
          filters.style.display = "flex";
          setTimeout(() => {
            filters.classList.add("smooth-sliding");
            filters.classList.remove("smooth-sliding-close")
          }, 10);
      }
    })
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

  filtrarRopaPorTalle(id: number) {
    this.ropaService.filtrarRopaPorTalle(id).subscribe(ropas => {
      this.products = ropas;
    })
  }

  searchProductsByPriceRange(): void {
    this.ropaService.searchProductsByPriceRange(this.minPrice, this.maxPrice).subscribe(ropas => {
      this.products = ropas;
    })
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
        ropas: {id: this.ropaId} as Ropa,
        talle: {id: Number(this.talleSeleccionado)} as Talle
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
        console.log(ropa)
        console.log("Ropa guardada correctamente");
        this.cargarRopa2();
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
  
  createTalle(): void {
    const talle = new Talle(this.talleNombre);
    this.talleService.save(talle).subscribe(data => {
      console.log("Talle guardado correctamente");
      this.cargarTalle();
      let modal: any = document.querySelector("#create-talle-modal");
      modal.style.display = "none";
    }, err => {
      alert(err.error.mensaje);
    });
  }

  createColor(): void {
    let colorValue: any = document.querySelector(".color");
    console.log(colorValue.value);
    const color = new Color(this.colorNombre, colorValue.value);
    this.colorService.save(color).subscribe(data => {
      console.log("Color guardado correctamente");
      this.cargarColor();
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
      this.cargarCategoria();
      let modal: any = document.querySelector("#create-categoria-modal");
      modal.style.display = "none";
    }, err => {
      alert(err.error.mensaje);
    });
  }

  onScroll(): void {
    const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
  
    if (windowBottom >= docHeight) {
      this.cargarRopa();
    }
  }

  cargarRopa(): void {
    this.currentPage++;
    this.ropaService.lista(this.currentPage, this.pageSize).subscribe((data:any) => {
      data.content.forEach((e:any) => {
        this.products.push(e)
      })});
  }

  cargarRopa2(): void {
    this.ropaService.lista(this.currentPage, this.pageSize).subscribe((data:any) => {
      this.products = data.content;
    })
  }

  cargarCategoria(): void {
    this.categoriaService.lista().subscribe(data => {this.categorias = data});
  }

  cargarColor(): void {
    this.colorService.lista().subscribe(data => {this.colores = data});
  }

  cargarTalle(): void {
    this.talleService.lista().subscribe(data => {this.talles = data});
  }

  deleteRopa(id: number): void {
    if(id != undefined) {
      this.ropaService.delete(id).subscribe({next: ()=> {
        this.cargarRopa2();
      }, complete: ()=> {
        console.log("Producto eliminado");
      }})
    }
  }

  @ViewChild('warningYes', {static: true}) warningYes!: ElementRef;
  @ViewChild('warningNo', {static: true}) warningNo!: ElementRef;
  deleteCategoria(id: number): void {
    this.warningText = "Esta acción eliminará la categoría y los productos asociados.";
    let modal:any = document.querySelector("#delete-warning-modal");
    modal.style.display = "flex";
    
    const promise = new Promise<void>((resolve, reject)=> {
      this.warningYes.nativeElement.addEventListener("click", ()=> {
        resolve();
      })
      this.warningNo.nativeElement.addEventListener("click", ()=> {
        reject();
      })
    })
    promise.then(()=> {
      if(id != undefined) {
        this.categoriaService.delete(id).subscribe({next: ()=> {
          this.cargarCategoria();
          this.cargarRopa2();
        }, complete: ()=> {
          console.log("Categoría eliminada")
          modal.style.display = "none";
        }})
      }
    }).catch(()=> {
      console.log("Modal de eliminación de categoría cerrado");
      modal.style.display = "none";
    })
  }

  deleteColor(id: number): void {
    this.warningText = "Esta acción eliminará el color y las imagenes que pertenezcan al mismo, de los productos que lo utilicen.";
    let modal:any = document.querySelector("#delete-warning-modal");
    modal.style.display = "flex";
    
    const promise = new Promise<void>((resolve, reject)=> {
      this.warningYes.nativeElement.addEventListener("click", ()=> {
        resolve();
      })
      this.warningNo.nativeElement.addEventListener("click", ()=> {
        reject();
      })
    })
    promise.then(()=> {
      if(id != undefined) {
        this.colorService.delete(id).subscribe({next: ()=> {
          this.cargarColor();
          this.cargarRopa2();
        }, complete: ()=> {
          console.log("Color eliminado")
          modal.style.display = "none";
        }, error: ()=> {
          console.log("Error al eliminar el color")
        }})
      }
    }).catch(()=> {
      console.log("Modal de eliminación de color cerrado");
      modal.style.display = "none";
    })
  }

  deleteTalle(id: number): void {
    this.warningText = "Esta acción eliminará el talle de los productos que lo utilicen.";
    let modal:any = document.querySelector("#delete-warning-modal");
    modal.style.display = "flex";
    
    const promise = new Promise<void>((resolve, reject)=> {
      this.warningYes.nativeElement.addEventListener("click", ()=> {
        resolve();
      })
      this.warningNo.nativeElement.addEventListener("click", ()=> {
        reject();
      })
    })
    promise.then(()=> {
      if(id != undefined) {
        this.talleService.delete(id).subscribe({next: ()=> {
          this.cargarTalle();
          this.cargarRopa2();
        }, complete: ()=> {
          console.log("Talle eliminado")
          modal.style.display = "none";
        }, error: ()=> {
          console.log("Error al eliminar el talle")
        }})
      }
    }).catch(()=> {
      console.log("Modal de eliminación de talle cerrado");
      modal.style.display = "none";
    })
  }
}