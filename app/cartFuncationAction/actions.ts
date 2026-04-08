"use server";

import { getUserToken } from "@/lib/auth";
import { ICart, ICartResponse } from "@/types/cart";
import { revalidatePath } from "next/cache";

export async function addToCart(productId: string, quantity: number) {
  const id = productId?.trim();
  if (!id) throw new Error("Missing product id. Cannot add to cart.");

  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId: id, quantity }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => {
    throw new Error("Invalid response from cart API.");
  });

  if (!res.ok) {
    const msg = data?.message ?? "Failed to add to cart";
    throw new Error(msg);
  }

  revalidatePath("/cart");

  return data as ICartResponse;
}

export async function getCart(): Promise<ICart | null> {
  const token = await getUserToken();
  if (!token ) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (data?.success === false) return null;

    if (data?.data?.items) return data.data as ICart;

    if (data?.items) return data as ICart;

    return null;
  } catch (err) {
    return null;
  }
}

export async function removeCartItem(productId: string) {
  const id = productId?.trim();
  if (!id) throw new Error("Missing product id. Cannot remove from cart.");

  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/cart/items/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId: id }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => {
    throw new Error("Invalid response from cart API.");
  });

  if (!res.ok) {
    const msg = data?.message ?? "Failed to remove from cart";
    throw new Error(msg);
  }

  revalidatePath("/cart");

  return data as ICartResponse;
}

export async function updateCartItemQuantity(productId: string, quantity: number) {
  const id = productId?.trim();
  if (!id) throw new Error("Missing product id. Cannot update cart.");

  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/cart/items`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: id, quantity }),
      cache: "no-store",
    });

    console.log("Response status:", res.status);
    
    let data;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Non-JSON response:", text);
      throw new Error(`Invalid response from cart API. Status: ${res.status}. Body: ${text}`);
    }

    if (!res.ok) {
      const msg = data?.message ?? "Failed to update cart";
      console.error("API returned error:", data);
      throw new Error(msg);
    }

    revalidatePath("/cart");

    return data as ICartResponse;
  } catch (error: any) {
    console.error("Error inside updateCartItemQuantity:", error.message || error);
    throw error;
  }
}

export async function clearCart() {
 const token =await getUserToken()
 if (!token) throw new Error("User not logged in. Token missing.")
  
 const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/cart`,{
  headers:{
     "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
  },
  method:"DELETE",
  cache:"no-store"
 })
 const data = await res.json().catch(()=>{
   throw new Error("Invalid response from cart API.")
    
 })
 
 if (!res.ok){
  const msg = data?.message ?? "Failed to clear cart"
  throw new Error(msg)
 }
 revalidatePath("/cart")
 return data as ICartResponse

}

