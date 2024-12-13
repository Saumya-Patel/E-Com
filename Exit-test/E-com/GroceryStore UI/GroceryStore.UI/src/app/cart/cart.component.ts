import { Component, OnInit } from '@angular/core';
import { UserCartItem } from '../models/cartItem.model';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: UserCartItem[] = [];

  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userService.setCurrentUser(currentUser);

    if (currentUser) {
      this.cartService.getCartItems(currentUser.id).subscribe({
        next: (items) => {
          this.cartItems = items;
          console.log("Fetched");
        },
        error: (err) => {
          console.error('Failed to fetch cart items', err);
          // Handle error scenarios or show an error message to the user
        }
      });
    }
  }

  placeOrder(): void {
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userService.setCurrentUser(currentUser);

    this.cartService.placeOrder(currentUser.id).subscribe(
      (response) => {
        console.log('Order placed successfully', response);

        // Clear the cart items
        this.cartItems = [];
      },
      (error) => {
        // Handle the error response
        console.error('Failed to place the order', error);
      }
    );
  }

  incrementQnty(item: UserCartItem) {
    const price = item.total / item.quantity;
    this.cartService.incrementCartItemQuantity(item.productId).subscribe({
      next: (request) => {
        console.log('Product added to cart successfully', request);
        item.quantity++;
        item.total += price;
        // Perform any additional actions or show a success message to the user
      },
      error: (err) => {
        console.error('Failed to add product to cart', err);
        // Handle error scenarios or show an error message to the user
      }
    });
  }

  decrementQnty(item: UserCartItem) {
    const price = item.total / item.quantity;
    this.cartService.decrementCartItemQuantity(item.productId).subscribe({
      next: (request) => {
        console.log('Product removed from cart successfully', request);
        item.quantity--;
        item.total -= price;
        // Perform any additional actions or show a success message to the user
      },
      error: (err) => {
        console.error('Failed to remove product from cart', err);
        // Handle error scenarios or show an error message to the user
      }
    });
  }
}
