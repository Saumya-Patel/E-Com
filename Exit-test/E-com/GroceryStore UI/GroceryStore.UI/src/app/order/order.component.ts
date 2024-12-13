import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order.model';
import { CartService } from '../services/cart.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUserString = localStorage.getItem('currentUser');
    const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
    this.userService.setCurrentUser(currentUser);

    if (currentUser) {
      this.cartService.getMyOrders(currentUser.id).subscribe({
        next: (orders) => {
          this.orders = orders;
          this.orders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          console.log(orders);
        },
        error: (err) => {
          console.error('Failed to fetch my orders', err);
          // Handle error scenarios or show an error message to the user
        }
      });
    }
  }

  viewOrder(id: number): void {
    // console.log(id);
    this.router.navigate(['/order-details', id]);
  }
}
