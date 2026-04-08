"use client";

import { Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart, removeCartItem, updateCartItemQuantity } from "@/app/cartFuncationAction/actions";
import { useParams } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    if (!productId?.trim()) {
      toast.error("Product id is missing. Refresh the page.");
      return;
    }
    try {
      setLoading(true);
      await addToCart(productId, 1);
      toast.success("Product added to cart");
    } catch (error: any) {
      toast.error(error.message || "Error adding to cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || !productId?.trim()}
      className="w-full flex items-center justify-center gap-2 bg-[#0d2a1a] hover:bg-[#1a3826] text-white py-3.5 rounded-full text-sm font-bold transition-all mt-auto shadow-sm active:scale-[0.98] disabled:opacity-70"
    >
      <ShoppingCart className="w-4 h-4" />
      {loading ? "Adding..." : "Add to Cart"}
    </button>
  );
}

export function RemoveCartItem({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  if (!id?.trim()) {
    return null;
  }

  async function handleRemove() {
    try {
      setLoading(true)
      await removeCartItem(id)
      toast.success("Product removed from cart")
    } catch (error:any) {
      toast.error(error.message || "Error removing from cart")
    } finally {
      setLoading(false)
    }
   }
    return (
    <button
      onClick={handleRemove}
      disabled={loading || !id?.trim()}
      className="w-full flex items-center justify-center gap-2 bg-[#0d2a1a] hover:bg-[#1a3826] text-white py-3.5 rounded-full text-sm font-bold transition-all mt-auto shadow-sm active:scale-[0.98] disabled:opacity-70"
    >
      <Trash2 className="w-4 h-4" />
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}

export function UpdateCartItemQuantity({ id, quantity }: { id: string; quantity: number }) {
  const [loading, setLoading] = useState(false);

  if (!id?.trim()) {
    return null;
  }

  async function 
  handleUpdateQuantity(quantity: number) {
    try {
      setLoading(true)
      await updateCartItemQuantity(id, quantity)
      toast.success("Product quantity updated")
    } catch (error:any) {
      toast.error(error.message || "Error updating product quantity")
    } finally {
      setLoading(false)
    }
   }
    return (
    <button
      onClick={() => handleUpdateQuantity(quantity)}
      disabled={loading || !id?.trim()}
      className="w-full flex items-center justify-center gap-2 bg-[#0d2a1a] hover:bg-[#1a3826] text-white py-3.5 rounded-full text-sm font-bold transition-all mt-auto shadow-sm active:scale-[0.98] disabled:opacity-70"
    >
      <Plus className="w-4 h-4" />
      {loading ? "Updating..." : "Update"}
    </button>
)};
