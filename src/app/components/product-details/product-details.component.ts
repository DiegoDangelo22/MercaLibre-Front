import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ropa } from 'src/app/model/ropa';
import { RopaService } from 'src/app/services/ropa.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  products: Ropa|null = null;

  constructor(private ropaService: RopaService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id'];
    this.ropaService.detail(id).subscribe(data => {
      this.products = data;
    }, err => {
      alert(err.message);
    })
    setTimeout(() => {
      this.zoomer();
    }, 2000);
  }

  zoomer(): void {
    const imageContainer:any = document.querySelector(".img");
    const image = imageContainer.querySelector("img");
    
    // Mantén el valor actual de la escala en una variable
    let currentScale = 1;
  
    imageContainer.addEventListener("mousemove", (e:any) => {
      // Calcula la posición del mouse dentro del contenedor de la imagen
      const x = e.clientX - imageContainer.offsetLeft;
      const y = e.clientY - imageContainer.offsetTop;
  
      // Aplica la transformación CSS en la imagen para hacer zoom y moverla
      image.style.transform = `translate(-${x * (currentScale - 1)}px, -${y * (currentScale - 1)}px) scale(${currentScale})`;
    });
  
    imageContainer.addEventListener("mouseleave", () => {
      // Reinicia la transformación CSS cuando el mouse sale del contenedor de la imagen
      image.style.transform = "translate(0, 0) scale(1)";
    });
  
    const maxScale = Math.max(image.naturalWidth / imageContainer.clientWidth, image.naturalHeight / imageContainer.clientHeight);
  
    function zoomIn() {
      currentScale += 0.1;
      if (currentScale > maxScale) currentScale = maxScale;
      image.style.transform = `scale(${currentScale})`;
      image.updateTransform();
    }
    
    function zoomOut() {
      currentScale -= 0.1;
      if (currentScale < 1) currentScale = 1;
      image.style.transform = `scale(${currentScale})`;
      image.updateTransform();
    }
    
  
    let lastScrollPosition = 0;
  
    function handleScroll(event: WheelEvent) {
      const currentScrollPosition = event.deltaY > 0 ? 1 : -1;
      if (currentScrollPosition !== lastScrollPosition) {
        if (currentScrollPosition > 0) {
          zoomOut();
        } else {
          zoomIn();
        }
        lastScrollPosition = currentScrollPosition;
      }
    }

    function updateTransform(x: number, y: number, scale: number) {
      const transform = `translate(-${x * (scale - 1)}px, -${y * (scale - 1)}px) scale(${scale})`;
      image.style.transform = transform;
    }
    
  
    document.addEventListener('wheel', handleScroll);
  }
  
}