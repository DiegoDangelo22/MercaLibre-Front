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

  constructor(private ropaService: RopaService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public imageService: ImageService, private tokenServ: TokenService, private colorServ: ColorService, private talleServ: TalleService) {}

  ngOnInit(): void {
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

    this.cargarProducto();
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