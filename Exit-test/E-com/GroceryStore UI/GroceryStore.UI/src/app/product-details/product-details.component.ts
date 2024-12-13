import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { CartService } from '../services/cart.service';
import { Comment } from '../models/comment.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  userComment: string = '';
  comments: any[] = [];
  productDetails: any = {
    id: 0,
    productName: '',
    description: '',
    category: '',
    price: 0,
    discount: 0,
    imageUrl: '',
    inStock: 0,
    specification: '',
    itemsAdded: 0
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductsService,
    private userService: UserService,
    private cartService: CartService) {}

    incrementQnty() {
      this.cartService.incrementCartItemQuantity(this.productDetails.id).subscribe({
        next: (request) => {
          console.log('Product added to cart successfully', request);
          this.productDetails.itemsAdded++;
          // Perform any additional actions or show a success message to the user
        },
        error: (err) => {
          console.error('Failed to add product to cart', err);
          // Handle error scenarios or show an error message to the user
        }
      });
    }

    decrementQnty() {
      this.cartService.decrementCartItemQuantity(this.productDetails.id).subscribe({
        next: (request) => {
          console.log('Product removed from cart successfully', request);
          this.productDetails.itemsAdded--;
          // Perform any additional actions or show a success message to the user
        },
        error: (err) => {
          console.error('Failed to remove product from cart', err);
          // Handle error scenarios or show an error message to the user
        }
      });
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = parseInt(params.get('id') || '0', 10);

        if (id) {
          this.productService.getProduct(id)
          .subscribe({
            next: (response) => {
              this.productDetails = response;
              this.getProductComments(this.productDetails.id);
            }
          });
        }
      }
    })

    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userService.setCurrentUser(currentUser);    
  }

  get currentUser() {
    return this.userService.getCurrentUser();
  }

  getProductComments(id: number): void {
    this.productService.getProductComments(id).subscribe(
      (response: any[]) => {
        this.comments = response.map(comment => ({
          productId: comment.productId,
          userName: comment.userName,
          comment: comment.comment
        }));
        console.log('Product Comments:', id);
      },
      (error) => {
        console.error('Failed to fetch product comments', error);
      }
    );
  }

  postComment(): void {
    if (!this.userComment){
      return;
    }

    const newComment: Comment = {
      productId: this.productDetails.id,
      userId: this.currentUser.id,
      comment: this.userComment
    };

    this.productService.postComment(newComment).subscribe(
      (response) => {
        console.log('Comment posted successfully', response);
        // Clear the comment box after successful posting
        this.userComment = '';
        // Fetch updated comments
        this.getProductComments(this.productDetails.id);
      },
      (error) => {
        console.error('Failed to post the comment', error);
        // Handle the error response (e.g., show an error message)
      }
    );
  }
}
