import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseApiUrl + 'api/');
  }

  getProduct(id: number): Observable<Product> {
    const currentUser = localStorage.getItem('currentUser');
    const userId = currentUser ? JSON.parse(currentUser).id : 0;

    return this.http.get<Product>(this.baseApiUrl + 'api/product-details/' + userId + '/' + id);
  }

  addProduct(addProductRequest: Product): Observable<Product> {
    return this.http.post<Product>(this.baseApiUrl + 'api/', addProductRequest);
  }

  updateProduct(id: number, updateProductRequest: Product): Observable<Product> {
    return this.http.put<Product>(this.baseApiUrl + 'api/product-details/' + id, updateProductRequest);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(this.baseApiUrl + 'api/product-details/' + id);
  }

  postComment(comment: Comment): Observable<any> {
    return this.http.post(this.baseApiUrl + 'api/comments/', comment);
  }

  getProductComments(productId: number): Observable<any> {
    return this.http.get(this.baseApiUrl + 'api/comments/' + productId);
  }
}
