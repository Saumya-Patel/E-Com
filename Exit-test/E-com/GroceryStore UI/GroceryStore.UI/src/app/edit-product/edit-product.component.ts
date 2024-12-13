import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  productDetails: Product = {
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
  
  constructor(private route: ActivatedRoute,
    private productService: ProductsService,
    private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = parseInt(params.get('id') || '0', 10);

        if(id) {
          this.productService.getProduct(id)
          .subscribe({
            next: (response) => {
              this.productDetails = response;
            }
          });
        }
      }
    })
  }

  updateProduct() {
    this.productService.updateProduct(this.productDetails.id, this.productDetails)
    .subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      }
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id)
    .subscribe({
      next: (response) => {
        this.router.navigate(['/']);
      }
    });
  }
}

