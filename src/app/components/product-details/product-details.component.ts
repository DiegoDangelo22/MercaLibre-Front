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
  }
}