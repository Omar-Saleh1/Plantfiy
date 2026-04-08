"use server";

import { getUserToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export interface IOrder {
  _id: string;
  orderNumber: string;
  items: Array<{
    product: {
      _id: string;
      name: string;
      imageUrl: string;
    };
    variant?: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  shippingDetails: {
    address: string;
    city: string;
    postalCode: string;
    phone?: string;
    state?: string;
    country?: string;
  };
  status: 'placed' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export async function createOrder(payload: any) {
  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => {
    throw new Error("Invalid response from orders API.");
  });

  if (!res.ok) {
    const msg = data?.message ?? "Failed to create order";
    throw new Error(msg);
  }

  // usually clear cart or revalidate after creating order
  revalidatePath("/cart");
  revalidatePath("/order");

  return data as { success: boolean; data: IOrder };
}

export async function getMyOrders() {
  const token = await getUserToken();
  if (!token) throw new Error("User not logged in.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.data as IOrder[];
}

export async function getOrderById(id: string): Promise<IOrder | null> {
  const token = await getUserToken();
  if (!token) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/orders/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.data as IOrder;
  } catch (error) {
    return null;
  }
}
