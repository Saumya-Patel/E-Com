import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  categories: string[] = [];

  currentPage = 1;
  itemsPerPage = 4;
  sortKey: string = 'price';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private productsService: ProductsService, private userService: UserService) { }

  ngOnInit(): void {
    this.productsService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
        this.categories = this.getUniqueCategories();
        this.sortProducts();
      },
      error: (response) => {
        console.log(response);
      }
    });

    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userService.setCurrentUser(currentUser);
  }

  get currentUser() {
    return this.userService.getCurrentUser();
  }

  getPaginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  getPaginationArray(): number[] {
    const totalPages = this.getTotalPages();
    return Array(totalPages)
      .fill(0)
      .map((_, index) => index + 1);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  search() {
    if (this.searchTerm.trim() !== '') {
      this.filteredProducts = this.products.filter(product =>
        product.productName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredProducts = this.products;
    }
    this.sortProducts();
    this.currentPage = 1;
  }

  onCategoryChange(event: any) {
    const selectedCategory = event.target.value;
    this.filteredProducts = this.filterProductsByCategory(selectedCategory);
    this.sortProducts();
    this.currentPage = 1;
  }

  filterProductsByCategory(category: string): Product[] {
    if (category === '') {
      return this.products;
    } else {
      return this.products.filter(product => product.category === category);
    }
  }

  getUniqueCategories(): string[] {
    return Array.from(new Set(this.products.map(product => product.category)));
  }

  sortProducts() {
    this.filteredProducts.sort((a, b) => {
      const valueA = this.getSortValue(a);
      const valueB = this.getSortValue(b);

      if (valueA === valueB) {
        return 0;
      }

      if (this.sortDirection === 'asc') {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
  }

  getSortValue(product: Product): any {
    switch (this.sortKey) {
      case 'price':
        return product.price;
      case 'name':
        return product.productName.toLowerCase();
      // Add more cases for additional sorting options
      default:
        return product.price;
    }
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortProducts();
  }
}
