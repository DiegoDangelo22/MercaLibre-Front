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
    const image = imageContainer.querySelector("img");
  
    // Mantén el valor actual de la escala en una variable
    let currentScale = 1.5;
    let x = 0;
    let y = 0;
  
    imageContainer.addEventListener("mousemove", (e: any) => {
      // Calcula la posición del mouse dentro del contenedor de la imagen
      x = e.clientX - imageContainer.offsetLeft;
      y = e.clientY - imageContainer.offsetTop;
  
      // Aplica la transformación CSS en la imagen para hacer zoom y moverla
      image.style.transform = `translate(-${x * (currentScale - 1)}px, -${y * (currentScale - 1)}px) scale(${currentScale})`;
    });
  
    imageContainer.addEventListener("mouseleave", () => {
      // Reinicia la transformación CSS cuando el mouse sale del contenedor de la imagen
      image.style.transform = "translate(0, 0) scale(1)";
    });
  
    const maxScale = Math.max(
      image.naturalWidth / imageContainer.clientWidth,
      image.naturalHeight / imageContainer.clientHeight
    );
  
    function zoomIn() {
      currentScale += 0.1;
      if (currentScale > maxScale) currentScale = maxScale;
      updateTransform(x, y, currentScale);
    }
  
    function zoomOut() {
      currentScale -= 0.1;
      if (currentScale < 1) currentScale = 1;
      updateTransform(x, y, currentScale);
    }
  
    function handleScroll(event: WheelEvent) {
      if (event.deltaY > 0) {
        zoomOut();
      } else {
        zoomIn();
      }
    }

    function updateTransform(x: number, y: number, scale: number) {
      const transform = `translate(-${x * (scale - 1)}px, -${y * (scale - 1)}px) scale(${scale})`;
      image.style.transform = transform;
    }

    imageContainer.addEventListener("wheel", handleScroll);
  }
}