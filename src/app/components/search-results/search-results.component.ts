import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
  terminoBusqueda: string = this.router.url.substr(8);
  brightTheme!: boolean;
  darkTheme!: boolean;
  
  constructor(private ropaService: RopaService, public router: Router, public actRoute: ActivatedRoute, public tokenServ: TokenService, public categoriaService: CategoriaService, public colorService: ColorService, public talleService: TalleService) {
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

    this.categoriaService.lista().subscribe(data => {
      this.categorias = data;
    })

    this.colorService.lista().subscribe(data => {
      this.colores = data;
    })

    this.talleService.lista().subscribe(data => {
      this.talles = data;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buscar();
  }
  
  buscar() {
    this.ropaService.buscarRopas(this.terminoBusqueda).subscribe(data => {
      if (this.terminoBusqueda) {
        // console.log(this.terminoBusqueda)
        this.ropaService.buscarRopa(this.terminoBusqueda).subscribe(data => {
          this.resultados = data;
          // console.log(this.resultados)
          // for (let i = 0; i < this.resultados.length; i++) {
          //   this.colores.push(this.resultados[i].colores[0] as unknown as Color);
          // }
          // console.log(this.colores)
        }
      )}
    })
  }

  // cargarRopa(): void {
  //   this.ropaService.lista().subscribe(data => {this.resultados = data});
  // }

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

  // deleteRopa(id: number): void {
  //   if(id != undefined) {
  //     this.ropaService.delete(id).subscribe({next: ()=> {
  //       this.cargarRopa();
  //     }, complete: ()=> {
  //       console.log("Eliminación correcta");
  //     }})
  //   }
  // }

  deleteCategoria(id: number): void {
    if(id != undefined) {
      this.categoriaService.delete(id).subscribe({next: ()=> {
        this.cargarCategoria();
      }, complete: ()=> {
        console.log("Categoría eliminada")
      }})
    }
  }

  deleteColor(id: number): void {
    if(id != undefined) {
      this.colorService.delete(id).subscribe({next: ()=> {
        this.cargarColor();
      }, complete: ()=> {
        console.log("Color eliminado")
      }, error: ()=> {
        console.log("Error al eliminar el color")
      }})
    }
  }

  // deleteTalle(id: number): void {
  //   if(id != undefined) {
  //     this.talleService.delete(id).subscribe({next: ()=> {
  //       this.cargarTalle();
  //       this.cargarRopa();
  //     }, complete: ()=> {
  //       console.log("Talle eliminado")
  //     }, error: ()=> {
  //       console.log("Error al eliminar el talle")
  //     }})
  //   }
  // }
}