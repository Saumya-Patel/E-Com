import { Product } from "./product.model";

export interface ProductRequest {
    product: Product;
    cartItemCount: number;
}