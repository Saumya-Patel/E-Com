import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserCartItem } from '../models/cartItem.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  incrementCartItemQuantity(productId: number): Observable<any> {
    const currentUser = localStorage.getItem('currentUser');
    const userId = currentUser ? JSON.parse(currentUser).id : null;

    const addToCartRequest = {
      userId: userId,
      productId: productId
    };
    
    return this.http.post<any>(this.baseApiUrl + 'api/Cart/add-to-cart', addToCartRequest);
  }

  public decrementCartItemQuantity(productId: number): Observable<any> {
    const currentUser = localStorage.getItem('currentUser');
    const userId = currentUser ? JSON.parse(currentUser).id : null;

    const removeFromCartRequest = {
      userId: userId,
      productId: productId
    };

    return this.http.post<any>(this.baseApiUrl + 'api/Cart/decrement-qnty', removeFromCartRequest);
  }  

  getCartItems(userId: number): Observable<UserCartItem[]> {
    return this.http.get<UserCartItem[]>(this.baseApiUrl + 'api/Cart/view-cart/' + userId);
  }

  placeOrder(userId: number): Observable<any> {
    console.log(userId);
    return this.http.post<any>(this.baseApiUrl + 'api/Cart/place-order/' + userId, null);
  }

  getMyOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseApiUrl + 'api/Cart/my-orders/' + userId);
  }

  getCartItemsFromOrder(cartId: number): Observable<UserCartItem[]> {
    return this.http.get<UserCartItem[]>(this.baseApiUrl + 'api/Cart/view-order/' + cartId);
  }
}
