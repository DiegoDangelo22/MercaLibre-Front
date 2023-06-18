import { Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ropa } from 'src/app/model/ropa';
import { RopaService } from 'src/app/services/ropa.service';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../header/header.component';
import { Color } from 'src/app/model/color';
import { TokenService } from 'src/app/services/security/token.service';
import { Categoria } from 'src/app/model/categoria';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ColorService } from 'src/app/services/color.service';
import { TalleService } from 'src/app/services/talle.service';
import { Talle } from 'src/app/model/talle';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnChanges {
  resultados: Ropa[] = [];
  categorias: Categoria[] = [];
  colores: Color[] = [];
  talles: Talle[] = [];
  minPrice!: number;
  maxPrice!: number;
  isLogged = false;
  isAdmin = false;
  currentPage: number = 0;
  pageSize: number = 10;
  terminoBusqueda: string = this.router.url.substr(8);
  brightTheme!: boolean;
  darkTheme!: boolean;
  warningText: string = "";
  
  constructor(private ropaService: RopaService, public router: Router, public actRoute: ActivatedRoute, public tokenServ: TokenService, public categoriaService: CategoriaService, public colorService: ColorService, public talleService: TalleService, public products: ProductsComponent) {
    this.actRoute.params.subscribe(params => {
      const termino = params['termino'];
      this.ropaService.buscarRopa(termino).subscribe(data => {
        this.resultados = data;
      })
    });
  }

  ngOnInit(): void {
    if(localStorage.getItem('theme') === "bright") {
      this.brightTheme = true;
      this.darkTheme = false;
    } else if(localStorage.getItem('theme') === "dark") {
      this.darkTheme = true;
      this.brightTheme = false;
    }
     this.buscar();

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
    window.addEventListener('scroll', this.onScroll.bind(this)); 
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buscar();
  }
  
  buscar() {
    this.ropaService.buscarRopas(this.terminoBusqueda).subscribe(data => {
      if (this.terminoBusqueda) {
        this.ropaService.buscarRopa(this.terminoBusqueda).subscribe(data => {
          this.resultados = data;
        })
      }
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

  filtrarRopaPorCategoria(id: number) {
    this.ropaService.filtrarRopaPorCategoria(id).subscribe(ropas => {
      this.resultados = ropas;
    });
  }

  filtrarRopaPorColor(id: number) {
    this.ropaService.filtrarRopaPorColor(id).subscribe(ropas => {
      this.resultados = ropas;
    });
  }

  filtrarRopaPorTalle(id: number) {
    this.ropaService.filtrarRopaPorTalle(id).subscribe(ropas => {
      this.resultados = ropas;
    });
  }

  searchProductsByPriceRange(): void {
    this.ropaService.searchProductsByPriceRange(this.minPrice, this.maxPrice).subscribe(ropas => {
      this.resultados = ropas;
    })
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
        this.resultados.push(e)
      })});
  }

  cargarRopa2(): void {
    this.ropaService.lista(this.currentPage, this.pageSize).subscribe((data:any) => {
      this.resultados = data.content;
    })
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

  deleteTalle(id:number): void {
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