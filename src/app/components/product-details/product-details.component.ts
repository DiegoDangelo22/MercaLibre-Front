import { ViewChild, ElementRef, AfterViewInit, Component, OnInit, AfterContentInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Color } from 'src/app/model/color';
import { ImagenColor } from 'src/app/model/imagen-color';
import { Ropa } from 'src/app/model/ropa';
import { Talle } from 'src/app/model/talle';
import { ColorService } from 'src/app/services/color.service';
import { ImageService } from 'src/app/services/image.service';
import { ImagenColorService } from 'src/app/services/imagen-color.service';
import { RopaService } from 'src/app/services/ropa.service';
import { TokenService } from 'src/app/services/security/token.service';
import { TalleService } from 'src/app/services/talle.service';
import { HeaderComponent } from '../header/header.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  products: any
  coloresDelItem: any[] = [];
  coloresGenerales: any[] = [];
  imagenes: any[] = [];
  colorForm!: FormGroup;
  color: any = {};
  colorSeleccionado: any;
  talleSeleccionado: any;
  talles: any[] = [];
  tallesDelItem: any[] = [];
  imagenFiltrada: any[] = [];
  imagenPorDefecto: any;
  isLogged = false;
  isAdmin = false;
  brightTheme!: boolean;
  darkTheme!: boolean;
  i: number = 0;
  arrayPrecio: any[] = [];
  arrayCantidad: any[] = [];
  HTMLObjectPrecioFiltrado: any;
  HTMLObjectCantidadFiltrado: any;
  productRepetido:any;

  constructor(private ropaService: RopaService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public imageService: ImageService, private tokenServ: TokenService, private colorServ: ColorService, private talleServ: TalleService) {  }

  ngOnInit(): void {
    this.cargarProducto();
    if(localStorage.getItem('theme') === "bright") {
      this.brightTheme = true;
      this.darkTheme = false;
    } else if(localStorage.getItem('theme') === "dark") {
      this.darkTheme = true;
      this.brightTheme = false;
    }
    this.colorForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      hexadecimal: ['', Validators.required],
      imagen: ['', Validators.required]
    });

    if(this.tokenServ.getToken()) {
      this.isLogged = true;
      this.isAdmin = true;
    } else {
      this.isLogged = false;
      this.isAdmin = false;
    }

    this.colorServ.lista().subscribe(data => {
      this.coloresGenerales = data;
    })

    this.talleServ.lista().subscribe(data => {
      this.talles = data;
    })
  }

@ViewChild('addColorBtn', {static: true}) addColorBtn!: ElementRef;
ngAfterViewInit(): void {
    this.addColorBtn.nativeElement.addEventListener('click', () => {
      const modal: any = document.querySelector('#add-color-form');
      modal.style.display = 'flex';
      window.onclick = (event: any) => {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
    });
}

addProductToCart() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ropaService.detail(id).subscribe(data => {
      this.cargarProducto();
      if (localStorage.getItem('cart-products')) {
        this.handleCartWithProducts(data);
      } else {
        this.handleCartWithoutProducts(data);
      }
    })
}

handleCartWithProducts(data: any) {
    let productsStringified: any = localStorage.getItem('cart-products');
    let products = JSON.parse(productsStringified);
    this.productRepetido = products.find((e: any)=> e.img === this.imagenPorDefecto.nombre);
            if(this.productRepetido) {
              this.handleRepeatedProduct(this.productRepetido, products, data);
            } else if(this.imagenPorDefecto.stock==0) {
              alert("No hay stock de esa variante");
            } else {
              let cart = document.querySelectorAll('.cart-modal-product-list');
              cart.forEach((e) => {
                let container = document.createElement('div');
                let img = document.createElement('img');
                let p1 = document.createElement('p');
                let p2 = document.createElement('p');
                let p3 = document.createElement('p');
                p2.classList.add('precio');
                p3.classList.add('cantidad');
                img.src = this.imagenPorDefecto.nombre;
                img.style.width = '50px';
                p1.append(data.nombre);
                p2.append(`Precio: ${data.precio.toString()}`);
                p3.append('Cantidad: 1');
                container.appendChild(img);
                container.appendChild(p1);
                container.appendChild(p2);
                container.appendChild(p3);
                e.appendChild(container);
              });
              products.push({id: data.id, nombre: data.nombre, precio: data.precio, img: this.imagenPorDefecto.nombre, cantidad: 1, stock: this.imagenPorDefecto.stock})
              localStorage.setItem('cart-products', JSON.stringify(products));
          }
  }

handleRepeatedProduct(productRepetido:any, products:any, data:any) {
              let precioText:any = document.querySelectorAll(".precio");
              let cantidadText:any = document.querySelectorAll(".cantidad");
              let HTMLObjectPrecio:any[] = [];
              let HTMLObjectCantidad:any[] = [];
              while(this.i<1) {
              precioText.forEach((e:any) => {
                this.arrayPrecio.push([e.textContent, e.parentNode.childNodes[1].innerHTML]);
                HTMLObjectPrecio.push(e);
              });
              cantidadText.forEach((e:any) => {
                this.arrayCantidad.push([e.textContent, e.parentNode.childNodes[1].innerHTML]);
                HTMLObjectCantidad.push(e);
              });
              
              this.HTMLObjectPrecioFiltrado = HTMLObjectPrecio.filter((e:any)=>e.textContent == `Precio: ${productRepetido.precio}` && e.parentNode.childNodes[1].innerHTML == data.nombre)
              this.HTMLObjectCantidadFiltrado = HTMLObjectCantidad.filter((e:any)=>e.textContent == `Cantidad: ${productRepetido.cantidad}` && e.parentNode.childNodes[1].innerHTML == data.nombre)
              this.i++
              }
              if(this.imagenPorDefecto.stock <= productRepetido.cantidad) {
                return;
              } else {
                productRepetido.precio += data.precio;
                productRepetido.cantidad += 1;
                this.HTMLObjectPrecioFiltrado.forEach((e:any) => {
                  e.textContent = `Precio: ${productRepetido.precio}`;
                });
                this.HTMLObjectCantidadFiltrado.forEach((e:any) => {
                  e.textContent = `Cantidad: ${productRepetido.cantidad}`;
                });
              }
            localStorage.setItem('cart-products', JSON.stringify(products));
}

handleCartWithoutProducts(data: any) {
  if(this.imagenPorDefecto.stock==0) {
    alert("No hay stock de esa variante");
  } else {
    let cart = document.querySelectorAll('.cart-modal-product-list');
    cart.forEach((e)=> {
      let container = document.createElement('div');
      let img = document.createElement('img');
      let p1 = document.createElement('p');
      let p2 = document.createElement('p');
      let p3 = document.createElement('p');
      p2.classList.add('precio');
      p3.classList.add('cantidad');
      img.src = this.imagenPorDefecto.nombre;
      img.style.width = '50px';
      p1.append(data.nombre);
      p2.append(`Precio: ${data.precio.toString()}`);
      p3.append('Cantidad: 1');
      container.appendChild(img);
      container.appendChild(p1);
      container.appendChild(p2);
      container.appendChild(p3);
      e.appendChild(container);
    })
    localStorage.setItem('cart-products', JSON.stringify([{id: data.id, nombre: data.nombre, precio: data.precio, img: this.imagenPorDefecto.nombre, cantidad: 1, stock: this.imagenPorDefecto.stock}]));
  }
}

cargarProducto() {
  const id = this.activatedRoute.snapshot.params['id'];
  this.ropaService.detail(id).subscribe(data => {
    this.products = data;
    this.coloresDelItem = this.products.colores;
    this.imagenes = this.products.imagenesColor;
    this.imagenPorDefecto = this.imagenes.reduce((prev, current) => {
      return (prev.id < current.id) ? prev : current;
    });
  }, err => {
    alert(err.message);
  });
}

agregarColor() {
  const id = this.activatedRoute.snapshot.params['id'];
  this.imageService.onUpload().then((url: string) => {
    this.ropaService.detail(id).subscribe(data => {
      const color: Color = this.colorSeleccionado;
      const talle: Talle = this.talleSeleccionado;
      const imagenColor: ImagenColor = new ImagenColor(url, {id: color} as unknown as Color, {id: data.id} as unknown as Ropa, {id: talle} as unknown as Talle);
      this.ropaService.agregarColor(id, imagenColor).subscribe((response: any) => {
          const res = response as Ropa;
          this.cargarProducto();
          let modal: any = document.querySelector("#modal-container");
          modal.style.display = "none";
          console.log(res);
          console.log("La ropa se guardó correctamente");
        });
      });
    });
  };
  
  filtrarRopaPorColor(id: number) {
    const ropaId = this.activatedRoute.snapshot.params['id'];
    // this.ropaService.filtrarRopaPorColor(id).subscribe(ropas => {
    //   for (let i = 0; i < ropas.length; i++) {
    //     // ropas[i].imagenesColor.filter(imagen => imagen.color === id as any);
    //     console.log(ropas)
    //     this.imagenFiltrada = ropas[i].imagenesColor.filter(imagen => imagen.color === id as unknown as Color && imagen.ropa === ropaId as any)
    //   }
    //   // console.log(this.imagenFiltrada)
    //   this.imagenPorDefecto = this.imagenFiltrada[0];
    // });
    this.ropaService.detail(ropaId).subscribe(data => {
      for (let i = 0; i < data.imagenesColor.length; i++) {
        this.imagenFiltrada = data.imagenesColor.filter(imagen => imagen.color === id as any)
      }
      // console.log(this.imagenPorDefecto)
      this.imagenPorDefecto = this.imagenFiltrada[0];
      
    })
  }

  zoomer(): void {
    const imageContainer: any = document.querySelector(".img_container");
    const closeBtn: any = document.querySelector(".close-btn");
    const fullscreenImageContainer: any = document.querySelector(".img_container_fs");
    const footer: any = document.querySelector("app-footer");
    // const fsic: any = document.querySelector(".fs-img-container");

    
    if(window.innerWidth >= 800) {
    imageContainer.addEventListener('click', ()=> {
      fullscreenImageContainer.style.display = "flex";
      closeBtn.style.display = "flex";
      footer.style.display = "none";
      window.onclick = function(event) {
        if(event.target == fullscreenImageContainer) {
          fullscreenImageContainer.style.display = "none";
          footer.style.display = "block";
        }
      }
    })
    }

    closeBtn.addEventListener('click', ()=> {
      fullscreenImageContainer.style.display = "none";
      closeBtn.style.display = "none";
      footer.style.display = "block";
    })

  //   fsic.addEventListener("mousedown", (e: any) => {
  //     if (e.button === 0) {
  //         e.preventDefault();
  //         const startX = e.clientX;
  //         const startY = e.clientY;
  //         const startScrollX = fsic.scrollLeft;
  //         const startScrollY = fsic.scrollTop;
  //         fsic.style.cursor = 'grabbing';
  
  //         fsic.addEventListener("mousemove", move);
  //         fsic.addEventListener("mouseup", () => {
  //             fsic.removeEventListener("mousemove", move);
  //             fsic.style.cursor = 'grab';
  //         });
  
  //         function move(e: any) {
  //             const diffX = e.clientX - startX;
  //             const diffY = e.clientY - startY;
  //             fsic.scrollLeft = startScrollX - diffX;
  //             fsic.scrollTop = startScrollY - diffY;
  //         }
  //     }
  // })
}}