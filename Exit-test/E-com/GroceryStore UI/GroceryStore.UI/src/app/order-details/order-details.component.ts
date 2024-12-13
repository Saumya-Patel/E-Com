import { Component, OnInit } from '@angular/core';
import { UserCartItem } from '../models/cartItem.model';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})

export class OrderDetailsComponent implements OnInit {
  cartItems: UserCartItem[] = [];
  orderId!: number;

  constructor(
    private cartService: CartService,
    // private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
    });

    this.cartService.getCartItemsFromOrder(this.orderId).subscribe({
      next: (items) => {
        this.cartItems = items;
        console.log(items);
      },
      error: (err) => {
        console.error('Failed to fetch cart items', err);
        // Handle error scenarios or show an error message to the user
      }
    });
  }
}
