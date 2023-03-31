import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ropa } from 'src/app/model/ropa';
import { RopaService } from 'src/app/services/ropa.service';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnChanges {
  resultados: Ropa[] = [];
  terminoBusqueda: string = this.router.url.substr(8);
  
  constructor(private ropaService: RopaService, public header: HeaderComponent, public router: Router, public ru: ActivatedRoute) {
    this.ru.params.subscribe(params => {
      const termino = params['termino'];
      this.ropaService.buscarRopa(termino).subscribe(dota => {
        this.resultados = dota;
      })
    });
  }

  ngOnInit(): void {
     this.buscar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.buscar();
  }
  buscar() {
    this.ropaService.buscarRopas(this.terminoBusqueda).subscribe(data => {
      if (this.terminoBusqueda) {
        console.log(this.terminoBusqueda)
        this.ropaService.buscarRopa(this.terminoBusqueda).subscribe(dota => {
          this.resultados = dota;
        }
    )}
    
    })
  }
}