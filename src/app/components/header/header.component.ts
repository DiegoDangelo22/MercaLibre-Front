import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/services/security/token.service';
import { ProductsComponent } from '../products/products.component';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { ContactComponent } from '../contact/contact.component';
import { LoginComponent } from '../login/login.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { RopaService } from 'src/app/services/ropa.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  terminoBusqueda: string = '';
  isAdmin = false;
  isLogged = false;
  cartProducts!:any[];
  constructor(private router: Router, private tokenServ: TokenService, private products: ProductsComponent, private searchResults: SearchResultsComponent, private contact: ContactComponent, private login: LoginComponent, private productDetails: ProductDetailsComponent)
  {
    let cartProductsStringified:any = localStorage.getItem('cart-products');
    this.cartProducts = JSON.parse(cartProductsStringified);
  }

  ngOnInit(): void {
    if(this.tokenServ.getToken()) {
      this.isLogged = true;
      this.isAdmin = true;
    } else {
      this.isLogged = false;
      this.isAdmin = false;
    }

    let brightBtn = document.querySelector("#bright-theme-btn");
    let darkBtn = document.querySelector("#dark-theme-btn");
    let brightBtnMblVw = document.querySelector("#bright-theme-btn-mblvw");
    let darkBtnMblVw = document.querySelector("#dark-theme-btn-mblvw");

    brightBtn?.addEventListener("click", ()=> {
      localStorage.setItem('theme', 'bright');
      this.products.brightTheme = true;
      this.searchResults.brightTheme = true;
      this.contact.brightTheme = true;
      this.login.brightTheme = true;
      this.productDetails.brightTheme = true;
      this.products.darkTheme = false;
      this.searchResults.darkTheme = false;
      this.contact.darkTheme = false;
      this.login.darkTheme = false;
      this.productDetails.darkTheme = false;
    })
    brightBtnMblVw?.addEventListener("click", ()=> {
      localStorage.setItem('theme', 'bright');
      this.products.brightTheme = true;
      this.searchResults.brightTheme = true;
      this.contact.brightTheme = true;
      this.login.brightTheme = true;
      this.productDetails.brightTheme = true;
      this.products.darkTheme = false;
      this.searchResults.darkTheme = false;
      this.contact.darkTheme = false;
      this.login.darkTheme = false;
      this.productDetails.darkTheme = false;
    })
    darkBtn?.addEventListener("click", ()=> {
      localStorage.setItem('theme', 'dark');
      this.products.darkTheme = true;
      this.searchResults.darkTheme = true;
      this.contact.darkTheme = true;
      this.login.darkTheme = true;
      this.productDetails.darkTheme = true;
      this.products.brightTheme = false;
      this.searchResults.brightTheme = false;
      this.contact.brightTheme = false;
      this.login.brightTheme = false;
      this.productDetails.brightTheme = false;
    })
    darkBtnMblVw?.addEventListener("click", ()=> {
      localStorage.setItem('theme', 'dark');
      this.products.darkTheme = true;
      this.searchResults.darkTheme = true;
      this.contact.darkTheme = true;
      this.login.darkTheme = true;
      this.productDetails.darkTheme = true;
      this.products.brightTheme = false;
      this.searchResults.brightTheme = false;
      this.contact.brightTheme = false;
      this.login.brightTheme = false;
      this.productDetails.brightTheme = false;
    })

    let cartButton = document.querySelector("#cart-button");
    let flechita:any = document.querySelector(".flechita");
    let cartModal:any = document.querySelector(".cart-modal");

    cartButton?.addEventListener("click", ()=> {
      if(cartModal.style.display === "block") {
        flechita.style.display = "none";
        cartModal.style.display = "none";
      } else {
        flechita.style.display = "block";
        cartModal.style.display = "block";
      }
    })
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