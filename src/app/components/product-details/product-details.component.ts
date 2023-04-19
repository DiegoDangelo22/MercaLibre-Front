import { ViewChild, ElementRef, AfterViewInit, Component, OnInit, AfterContentInit, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Color } from 'src/app/model/color';
import { ImagenColor } from 'src/app/model/imagen-color';
import { Ropa } from 'src/app/model/ropa';
import { ImageService } from 'src/app/services/image.service';
import { ImagenColorService } from 'src/app/services/imagen-color.service';
import { RopaService } from 'src/app/services/ropa.service';
import { TokenService } from 'src/app/services/security/token.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit, AfterViewInit {
  products: any
  colores: any[] = [];
  imagenes: any[] = [];
  colorForm!: FormGroup;
  nombre: any;
  hexadecimal: any;
  color: any = {};
  imagenFiltrada: any[] = [];
  imagenPorDefecto: any;
  isLogged = false;
  isAdmin = false;

  constructor(private ropaService: RopaService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public imageService: ImageService, private tokenServ: TokenService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
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

    const id = this.activatedRoute.snapshot.params['id'];
    this.ropaService.detail(id).subscribe(data => {
      this.products = data;
      this.colores = this.products.colores;
      this.imagenes = this.products.imagenesColor;
      this.imagenPorDefecto = this.imagenes.reduce((prev, current) => {
        return (prev.id < current.id) ? prev : current;
      });
    }, err => {
      alert(err.message);
    });
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

agregarColor() {
  const id = this.activatedRoute.snapshot.params['id'];
  this.imageService.onUpload().then((url: string) => {
    this.ropaService.detail(id).subscribe(data => {
      const color: Color = new Color(this.color.nombre, this.color.hexadecimal);
      const imagenColor: ImagenColor = new ImagenColor(url, color as Color, {id: data.id} as unknown as Ropa);
      this.ropaService.agregarColor(id, imagenColor).subscribe((response: any) => {
          const res = response as Ropa;
          location.reload();
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
      this.imagenPorDefecto = this.imagenFiltrada[0];
    })
  }

  zoomer(): void {
    const imageContainer: any = document.querySelector(".img_container");
    const closeBtn: any = document.querySelector(".close-btn");
    const fullscreenImageContainer: any = document.querySelector(".img_container_fs");
    // const fsic: any = document.querySelector(".fs-img-container");

    imageContainer.addEventListener('click', ()=> {
      fullscreenImageContainer.style.display = "flex";
      closeBtn.style.display = "flex";
      window.onclick = function(event) {
        if(event.target == fullscreenImageContainer) {
          fullscreenImageContainer.style.display = "none";
        }
      }
    })

    closeBtn.addEventListener('click', ()=> {
      fullscreenImageContainer.style.display = "none";
      closeBtn.style.display = "none";
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