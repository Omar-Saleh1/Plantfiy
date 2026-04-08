export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isPlant: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ICartItem {
  product: IProduct;
  quantity: number;
  variant?: string;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ICartResponse {
  success: boolean;
  message: string;
  data: ICart;
}