import { notFound } from "next/navigation";
import { getOrderById, IOrder } from "@/app/orderFunctionAction/actions";
import { Check, CheckCircle2, ChevronRight, Package, Truck, MapPin, ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderSuccessPage({ params }: OrderPageProps) {
  // Fetch actual data securely via SSR using the session (SSN) token
  const orderData = await getOrderById(params.id);

  // If order details are not found in the backend, return a 404
  if (!orderData) {
     notFound();
  }

  return (
    <div className="bg-[#f0f3f1] min-h-screen py-16 px-6 font-sans flex flex-col items-center">
      
      {/* Top Success Message */}
      <div className="text-center mb-12 flex flex-col items-center max-w-[600px] mt-8">
        <div className="w-16 h-16 bg-[#cbe8d5] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <div className="w-8 h-8 bg-[#0d2a1a] rounded-full flex items-center justify-center">
             <Check className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
        </div>
        <h1 className="text-[2.75rem] font-extrabold text-[#0d2a1a] mb-3 tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-[#56645a] text-[17px] font-medium">
          Your plants are on their way. Order #{orderData.orderNumber}
        </p>
      </div>

      <div className="max-w-[1000px] w-full flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column (Tracking + Info + Care Box) */}
        <div className="flex-1 w-full flex flex-col gap-6">
          
          {/* Tracking Info Card */}
          <div className="bg-white rounded-[20px] p-8 shadow-sm">
            <h2 className="text-[20px] font-bold text-[#0d2a1a] mb-8">Tracking Info</h2>
            
            {/* Stepper Logic */}
            <div className="relative flex justify-between items-center mb-6">
              {/* Line background */}
              <div className="absolute top-6 left-8 right-8 h-1 bg-[#e9ece9] -z-10 rounded-full"></div>
              {/* Active Line */}
              <div className="absolute top-6 left-8 w-[35%] h-1 bg-[#0d2a1a] -z-10 rounded-full"></div>
              
              {/* Steps (Hardcoded tracking simulation) */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0d2a1a] flex items-center justify-center text-white border-4 border-white shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-[#0d2a1a]">Order Placed</p>
                  <p className="text-[11px] text-[#718076]">Oct 24, 10:30 AM</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#0d2a1a] flex items-center justify-center text-white border-4 border-white shadow-sm">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-[#0d2a1a]">Processing</p>
                  <p className="text-[11px] text-[#718076]">Oct 24, 2:15 PM</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#9db1a3] border-[3px] border-[#e9ece9] shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-[#9db1a3]">Shipped</p>
                  <p className="text-[11px] text-[#9db1a3] italic">Expected Oct 26</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#f8f9f8] flex items-center justify-center text-[#c2d1c7] border-4 border-white shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold text-[#a0b3a7]">Delivered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Shipping Address */}
            <div className="bg-[#eef1ef] rounded-[20px] p-6 shadow-none">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-[#0d2a1a]" strokeWidth={2.5}/>
                <h3 className="text-[16px] font-bold text-[#0d2a1a]">Shipping Address</h3>
              </div>
              <div className="text-[#56645a] text-[15px] space-y-1.5 font-medium">
                <p>{orderData.shippingDetails?.address}</p>
                <p>Suite 400, {orderData.shippingDetails?.city}</p>
                <p>{orderData.shippingDetails?.state || ""} {orderData.shippingDetails?.postalCode}, {orderData.shippingDetails?.country || ""}</p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-[#eef1ef] rounded-[20px] p-6 shadow-none flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                 <Calendar className="w-5 h-5 text-[#0d2a1a]" strokeWidth={2.5} />
                <h3 className="text-[16px] font-bold text-[#0d2a1a]">Estimated Delivery</h3>
              </div>
              <p className="text-[22px] font-extrabold text-[#0d2a1a] mb-1">
                {orderData.estimatedDelivery}
              </p>
              <p className="text-[#56645a] text-[13px] font-medium">
                Delivery Window: 9:00 AM - 5:00 PM
              </p>
            </div>
          </div>

          {/* Plant Care Box */}
          <div className="bg-[#1a3826] rounded-[24px] p-10 flex flex-col justify-center relative overflow-hidden mt-6 mb-12 sm:mb-0">
            <div className="relative z-10 w-full sm:w-[70%]">
              <h3 className="text-white text-[22px] font-bold mb-3 tracking-wide">Need plant care advice while you wait?</h3>
              <p className="text-[#8eab9a] text-[15px] mb-8 font-medium leading-relaxed">
                Our botanical experts have prepared specific guides for your new green companions to ensure they thrive in their new home.
              </p>
              <Link href="/guides" className="inline-flex items-center gap-2 text-white font-semibold text-[15px] border-b border-[#4f7861] pb-1 hover:border-white transition-colors">
                Read Care Guides
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
             {/* Leaf Decoration */}
             <div className="absolute right-[-40px] bottom-[-40px] opacity-[0.06] text-white rotate-12 pointer-events-none">
                 <svg width="280" height="280" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                     <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                 </svg>
             </div>
          </div>

        </div>

        {/* Right Column (Order Summary) */}
        <div className="w-full lg:w-[360px] flex-shrink-0 bg-white rounded-[24px] p-8 shadow-sm h-fit">
           <h2 className="text-[20px] font-bold text-[#0d2a1a] tracking-tight mb-8">
              Order Summary
           </h2>

           <div className="flex flex-col gap-6 mb-8">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-16 h-16 rounded-[12px] bg-[#f8f9f8] flex-shrink-0 overflow-hidden">
                    <img src={item.product.imageUrl || "/placeholder.jpg"} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-center w-full">
                    <p className="text-[15px] font-bold text-[#0d2a1a] mb-0.5">{item.product.name}</p>
                    <p className="text-[13px] text-[#718076] font-medium mb-1">Size: {item.variant || "Standard"}</p>
                    <p className="text-[15px] font-bold text-[#0d2a1a]">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
           </div>

           <div className="border-t border-[#f0f3f1] pt-6 mb-8 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[#56645a] text-[15px] font-medium">
                  <span>Subtotal</span>
                  <span>${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-[#56645a] text-[15px] font-medium">
                  <span>Shipping</span>
                  <span className="font-bold text-[#0d2a1a]">{orderData.shipping === 0 ? "Free" : `$${orderData.shipping.toFixed(2)}`}</span>
              </div>
           </div>
           
           <div className="flex justify-between items-center mb-8">
               <span className="text-[18px] font-bold text-[#0d2a1a]">Total</span>
               <span className="text-[24px] font-extrabold text-[#0d2a1a]">${orderData.total.toFixed(2)}</span>
           </div>

           <div className="flex flex-col gap-4">
              <Link href="/orders" className="w-full bg-[#0d2a1a] text-white py-3.5 rounded-full text-[15px] font-bold text-center hover:bg-[#1a3826] transition-colors shadow-sm">
                View My Orders
              </Link>
              <Link href="/shop" className="w-full border border-[#d2dbd6] text-[#0d2a1a] py-3.5 rounded-full text-[15px] font-bold text-center hover:bg-[#f8f9f8] transition-colors">
                Return to Shop
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
