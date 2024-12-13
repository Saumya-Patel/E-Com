import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  addProductRequest: Product = {
    id: 0,
    productName: '',
    description: '',
    category: '',
    price: 0,
    discount: 0,
    imageUrl: '',
    inStock: 0,
    specification: ''
  };
  constructor(private productService: ProductsService, private router: Router) {}

  ngOnInit(): void {
    
  }

  addProduct() {
    this.productService.addProduct(this.addProductRequest)
    .subscribe({
      next: (product) => {
        console.log(product);
        this.router.navigate(['/']);
      }
    })
  }
}
