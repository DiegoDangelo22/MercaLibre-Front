import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Color } from 'src/app/model/color';
import { ImagenColor } from 'src/app/model/imagen-color';
import { Ropa } from 'src/app/model/ropa';
import { ImagenColorService } from 'src/app/services/imagen-color.service';
import { RopaService } from 'src/app/services/ropa.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  products: any
  colores: any[] = [];
  imagenes: any[] = [];

  constructor(private ropaService: RopaService, private imagenColorService: ImagenColorService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ropaService.detail(id).subscribe(data => {
      let ropaId:any = data.id;
      this.products = data;
      this.imagenColorService.lista(ropaId).subscribe(data => {
        let datas:any = data;
        for (let i = 0; i < datas.length; i++) {
          this.imagenes.push(datas[i]);
          this.colores.push(datas[i].color)
        }
      }, err => {
        alert(err.message);
      })
    }, err => {
      alert(err.message);
    });
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