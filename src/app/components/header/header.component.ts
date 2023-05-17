import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Ropa } from 'src/app/model/ropa';
import { RopaService } from 'src/app/services/ropa.service';
import { AuthService } from 'src/app/services/security/auth.service';
import { TokenService } from 'src/app/services/security/token.service';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  terminoBusqueda: string = '';
  isAdmin = false;
  isLogged = false;
  constructor(private router: Router, private tokenServ: TokenService, private ropaServ: RopaService, private products: ProductsComponent) {}

  ngOnInit(): void {
    if(this.tokenServ.getToken()) {
      this.isLogged = true;
      this.isAdmin = true;
    } else {
      this.isLogged = false;
      this.isAdmin = false;
    }

    let productosBtn = document.querySelector("#productos");
    productosBtn?.addEventListener("click", ()=> {
      this.cargarRopa();
    })
  }

  cargarRopa(): void {
    this.ropaServ.lista().subscribe(data => {this.products.products = data});
  }

  buscar() {
    this.router.navigate(['/search', this.terminoBusqueda]);
    console.log(this.terminoBusqueda)
  }

  logOut() {
    if(this.isLogged) {
      this.tokenServ.logOut();
      window.location.reload();
    }
  }
}