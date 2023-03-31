import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/model/categoria';
import { Color } from 'src/app/model/color';
import { Ropa } from 'src/app/model/ropa';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ColorService } from 'src/app/services/color.service';
import { RopaService } from 'src/app/services/ropa.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Ropa[] = [];
  categorias: Categoria[] = [];
  colores: Color[] = [];

  constructor(private ropaService: RopaService, private categoriaService: CategoriaService, private colorService: ColorService) {}

  ngOnInit(): void {
    this.ropaService.lista().subscribe(data => {
      this.products = data;
    })

    this.categoriaService.lista().subscribe(data => {
      this.categorias = data;
    })

    this.colorService.lista().subscribe(data => {
      this.colores = data;
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
}