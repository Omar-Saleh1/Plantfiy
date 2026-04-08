"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Trash2, ArrowRight, Minus, Plus, CreditCard, Banknote, Wallet } from "lucide-react";
import { clearCart, getCart, removeCartItem, updateCartItemQuantity } from "@/app/cartFuncationAction/actions";
import { createOrder } from "@/app/orderFunctionAction/actions";
import { useRouter } from "next/navigation";
import { ICartItem } from "@/types/cart";
import { toast } from "sonner";

export default function CartPage() {
    const [cartItems, setCartItems] = useState<ICartItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [phone, setPhone] = useState("");

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const cart = await getCart();
                if (!cancelled) {
                    setCartItems(cart?.items?.filter((item: ICartItem) => item && item.product) ?? []);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        startTransition(async () => {
            try {
                await updateCartItemQuantity(productId, newQuantity);
                setCartItems(prev => prev.map(item => 
                    item.product._id === productId 
                        ? { ...item, quantity: newQuantity } 
                        : item
                ));
            } catch (error) {
                console.error("Failed to update quantity");
            }
        });
    };

    const handleRemoveItem = (productId: string) => {
        startTransition(async () => {
            try {
                await removeCartItem(productId);
                setCartItems(prev => prev.filter(item => item.product._id !== productId));
            } catch (error) {
                console.error("Failed to remove item");
            }
        });
    };

    const handleClearCart = () => {
        startTransition(async () => {
            try {
                await clearCart();
                toast.success("Cart cleared successfully")
                setCartItems([]);
            } catch (error) {
                console.error("Failed to clear cart");
                toast.error("Failed to clear cart")
            }})}

    const handleCheckout = () => {
        if (!address || !city || !postalCode || !phone) {
            toast.error("Please fill in all shipping details");
            return;
        }

        startTransition(async () => {
            try {
                const payload = {
                    shippingDetails: {
                        address,
                        city,
                        postalCode,
                        phone,
                        country: "Egypt" // Default in your backend
                    },
                    orderItems: cartItems.map(item => ({
                        product: item.product._id,
                        quantity: item.quantity,
                        priceAtPurchase: item.product.price,
                    })),
                    totalAmount: total,
                    paymentDetails: {
                        paymentMethod: "cash", // Default in your backend
                        amount: total,
                    }
                };
                
                const response = await createOrder(payload);
                if (response?.data?._id || response?.data?.orderNumber) {
                    toast.success("Order created successfully!");
                    setCartItems([]);
                    router.push(`/order/${response.data._id || response.data.orderNumber}`);
                } else {
                    throw new Error("Failed to create order");
                }
            } catch (error: any) {
                console.error("Checkout failed:", error);
                toast.error(error.message || "Checkout failed");
            }
        });
    };

    const subtotal = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
    const total = subtotal; // Shipping is free according to UI

    return (
        <div className="bg-[#f0f3f1] min-h-screen py-16 px-6 font-sans">
            <div className="max-w-[1100px] mx-auto">

                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-[3rem] font-extrabold text-[#112d1b] leading-tight tracking-tight mb-2">
                        Your Garden
                    </h1>
                    <p className="text-[#56645a] text-lg font-medium">
                        Review your botanical selections before we prepare them for their new home.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Main Content (Cart Items) */}
                    <div className="flex-1 flex flex-col gap-6">

                        {loading && (
                            <div className="bg-white rounded-[24px] p-12 text-center shadow-sm text-[#56645a]">
                                Loading your cart…
                            </div>
                        )}

                        {!loading && cartItems.map((item, idx) => (
                            <div key={item.product?._id ?? idx} className="bg-white rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row gap-6 border border-zinc-100/50">
                                {/* Product Image */}
                                <div className="w-full sm:w-[160px] aspect-square rounded-[20px] bg-[#f8f9f8] overflow-hidden flex-shrink-0">
                                    <img
                                        src={item.product.imageUrl || "/placeholder.jpg"}
                                        alt={item.product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="flex flex-col justify-between flex-1 py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-[22px] font-bold text-[#112d1b] tracking-tight mb-1">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-[#647167] text-[15px] font-medium">
                                                {item.product.description} &bull; {item.variant || "Standard"}
                                            </p>
                                        </div>
                                        <div className="text-[26px] font-extrabold text-[#112d1b]">
                                            ${item.product.price.toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-6 mt-6 sm:mt-0">
                                        {/* Quantity Control */}
                                        <div className="flex items-center bg-[#f0f3f1] rounded-full px-4 py-2 gap-4">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                                                disabled={isPending || item.quantity <= 1}
                                                className="text-[#56645a] hover:text-[#112d1b] transition-colors disabled:opacity-50"
                                            >
                                                <Minus className="w-4 h-4" strokeWidth={3} />
                                            </button>
                                            <span className="font-bold text-[#112d1b] w-4 text-center select-none">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                                                disabled={isPending}
                                                className="text-[#56645a] hover:text-[#112d1b] transition-colors disabled:opacity-50"
                                            >
                                                <Plus className="w-4 h-4" strokeWidth={3} />
                                            </button>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                              onClick={() => handleRemoveItem(item.product._id)}
                                            disabled={isPending}
                                            className="flex items-center gap-1.5 text-[#cc3a3a] hover:text-[#a02c2c] text-sm font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {!loading && cartItems.length === 0 && (
                            <div className="bg-white rounded-[24px] p-12 text-center shadow-sm">
                                <p className="text-[#56645a] text-xl font-medium mb-6">Your garden is currently empty.</p>
                                <Link href="/shop" className="inline-block bg-[#0d2a1a] text-white px-8 py-3.5 rounded-full font-bold">
                                    Explore Plants
                                </Link>
                            </div>
                        )}
                        {cartItems.length > 0 && (
                            <div className="flex justify-end mt-2 mb-4">
                                <button 
                                    onClick={handleClearCart} 
                                    disabled={isPending}
                                    className="group flex items-center gap-2 px-6 py-3 rounded-full text-[14px] font-bold tracking-wide text-[#cc3a3a] bg-white hover:bg-[#fbf1f1] transition-all duration-300 border border-[#f5ecec] hover:border-[#f5d2d2] shadow-sm active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Trash2 className="w-[18px] h-[18px] group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                                    Clear Entire Cart
                                </button>
                            </div>
                        )}
                        {/* Botanical Note */}
                        <div className="bg-[#e4ece7] rounded-[24px] p-8 mt-2 relative overflow-hidden">
                             
                            <div className="relative z-10 max-w-[80%]">
                                <h4 className="text-[#112d1b] text-lg font-bold mb-3 tracking-tight">Botanical Note</h4>
                                <p className="text-[#4b5950] font-medium leading-relaxed">
                                    Your selections are carbon-neutral shipped. We include a<br />
                                    complimentary hydration guide and a small bag of organic fertilizer<br />
                                    with every order.
                                </p>
                            </div>
                            {/* Leaf Watermark Decoration */}
                            <div className="absolute -bottom-16 -right-10 w-64 h-64 bg-white/20 rounded-full blur-3xl rounded-tr-none rotate-45 pointer-events-none" />
                            <div className="absolute -bottom-8 -right-8 opacity-40 text-black">
                                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#b1c7ba]">
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Order Summary */}
                    <div className="w-full lg:w-[380px] flex-shrink-0">
                        <div className="bg-[#e9ece9] rounded-[24px] p-8 sticky top-8">
                            <h2 className="text-[26px] font-extrabold text-[#112d1b] tracking-tight mb-6">
                                Order Summary
                            </h2>

                            {/* Shipping Details Form */}
                            <div className="flex flex-col gap-3 mb-6">
                                <h3 className="font-bold text-[#112d1b] text-sm uppercase tracking-wide">Shipping Details</h3>
                                <input placeholder="Street Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 rounded-[12px] border-none outline-none focus:ring-2 focus:ring-[#0d2a1a] shadow-sm text-[14px]" />
                                <div className="flex gap-3">
                                    <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="w-[60%] px-4 py-3 rounded-[12px] border-none outline-none focus:ring-2 focus:ring-[#0d2a1a] shadow-sm text-[14px]" />
                                    <input placeholder="Zip Code" value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-[40%] px-4 py-3 rounded-[12px] border-none outline-none focus:ring-2 focus:ring-[#0d2a1a] shadow-sm text-[14px]" />
                                </div>
                                <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-[12px] border-none outline-none focus:ring-2 focus:ring-[#0d2a1a] shadow-sm text-[14px]" />
                            </div>

                            <div className="h-px w-full bg-[#d0d6d2] mb-6" />

                            <div className="flex flex-col gap-5 mb-8">
                                <div className="flex justify-between items-center text-[#56645a] font-medium text-[17px]">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-[#112d1b]">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#56645a] font-medium text-[17px]">
                                    <span>Shipping</span>
                                    <span className="bg-[#bbedcc] text-[#1e6137] px-3 py-1 rounded-md text-[13px] font-bold tracking-wide uppercase">
                                        Free
                                    </span>
                                </div>
                            </div>

                            <div className="h-px w-full bg-[#d0d6d2] mb-6" />

                            <div className="flex justify-between items-center mb-10 text-[20px]">
                                <span className="font-bold text-[#112d1b]">Total</span>
                                <span className="text-[32px] font-extrabold text-[#112d1b]">
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button 
                                    onClick={handleCheckout}
                                    disabled={isPending || cartItems.length === 0}
                                    className="w-full bg-[#0d2a1a] hover:bg-[#1a3826] text-white py-4 rounded-full text-[16px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isPending ? "Processing..." : "Proceed to Checkout"}
                                    {!isPending && <ArrowRight className="w-5 h-5" />}
                                </button>
                                <Link href="/shop" className="w-full border-2 border-[#cfd6d1] hover:border-[#0d2a1a] text-[#112d1b] py-4 rounded-full text-[16px] font-bold transition-all flex items-center justify-center">
                                    Continue Shopping
                                </Link>
                            </div>

                            <div className="flex justify-center gap-8 mt-10 text-[#a3b1a7]">
                                <CreditCard className="w-7 h-7" />
                                <Banknote className="w-7 h-7" />
                                <Wallet className="w-7 h-7" />
                            </div>
                          
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
