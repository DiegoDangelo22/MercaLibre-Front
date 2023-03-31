import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Ropa } from 'src/app/model/ropa';
import { RopaService } from 'src/app/services/ropa.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  terminoBusqueda: string = '';
  constructor(private router: Router, private ropaService: RopaService) {}

  buscar() {


        this.router.navigate(['/search', this.terminoBusqueda]);
        console.log(this.terminoBusqueda)
    }
    
  
  
}