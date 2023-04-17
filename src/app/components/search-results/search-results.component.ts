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

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnChanges {
  resultados: Ropa[] = [];
  categorias: Categoria[] = [];
  colores: Color[] = [];
  isLogged = false;
  isAdmin = false;
  terminoBusqueda: string = this.router.url.substr(8);
  
  constructor(private ropaService: RopaService, public header: HeaderComponent, public router: Router, public actRoute: ActivatedRoute, public tokenServ: TokenService, public categoriaService: CategoriaService, public colorService: ColorService) {
    this.actRoute.params.subscribe(params => {
      const termino = params['termino'];
      this.ropaService.buscarRopa(termino).subscribe(data => {
        this.resultados = data;
      })
    });
  }

  ngOnInit(): void {
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

  cargarRopa(): void {
    this.ropaService.lista().subscribe(data => {this.resultados = data});
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