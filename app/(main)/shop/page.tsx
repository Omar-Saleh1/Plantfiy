import { ShoppingCart, Truck } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isPlant: boolean;
}

async function getProducts():Promise<Product[]>{
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/products`, {
      cache: "no-store",
      method:"GET",
      headers:{
        "Content-Type":"application/json",
      }
    });
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    
    const responseData = await res.json();
    // The API wraps the response in a `data` object which contains a `products` array
    return responseData?.data?.products || [];
  } catch (error: any) {
    console.error("Error fetching products:", error);
    // @ts-ignore
    // toast.error(error.message)
    return [];
  }
}

export default async function Shop() {
  const products = await getProducts();

  return (
    <div className="bg-[#f0f3f1] min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-16">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-10">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 mb-6 font-sans">Filter by</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded-md border-zinc-300 text-[#1a3826] focus:ring-[#1a3826]" />
                <span className="text-sm font-medium text-zinc-600">Indoor Plants</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded-md border-zinc-300 text-[#1a3826] focus:ring-[#1a3826]" />
                <span className="text-sm font-medium text-zinc-600">Low Maintenance</span>
              </label>
              <label className="flex items-center gap-4 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded-md border-zinc-300 text-[#1a3826] focus:ring-[#1a3826]" />
                <span className="text-sm font-medium text-zinc-600">Pet Friendly</span>
              </label>
            </div>
          </div>

          {/* Member Perk Card */}
          <div className="bg-[#244533] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
            <h3 className="text-[10px] font-bold tracking-widest text-[#8eb89f] mb-3 uppercase">Member Perk</h3>
            <p className="text-xl font-bold mb-6 relative z-10 leading-tight">
              Free Shipping on your<br />first order
            </p>
            <button className="bg-white text-zinc-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors relative z-10 shadow-sm">
              Claim Now
            </button>
            <div className="absolute -bottom-4 -right-4 opacity-5 text-black">
              <Truck className="w-32 h-32" />
            </div>
          </div>
        </aside>

        {/* Main Content Grid */}
        <div className="flex-1 w-full">
          {/* Header area */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div className="max-w-xl">
              <h1 className="text-[2.75rem] leading-none font-extrabold text-[#112d1b] mb-3 tracking-tight">Shop Plants</h1>
              <p className="text-[#647167] font-medium text-lg">Curated greenery for every modern living space.</p>
            </div>
            <div className="mt-4 sm:mt-0 mb-2">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-zinc-200/50 text-sm font-semibold text-zinc-600">
                Showing {products.length} results
              </span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <div key={product._id || idx} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-zinc-100/50">
                
                {/* Product Image */}
                <div className="relative aspect-[4/5] w-full bg-[#f8f9f8] flex-shrink-0">
                  <img
                    src={product.imageUrl}
                    alt={product.name }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute right-4 top-4 bg-white px-3 py-1.5 rounded-full text-sm font-extrabold text-zinc-900 shadow-sm leading-none flex items-center justify-center">
                    ${product.price}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-[15px] text-[#717e74] leading-relaxed mb-6 font-medium flex-1">
                    {product.description}
                  </p>

                  <button className="w-full flex items-center justify-center gap-2 bg-[#0d2a1a] hover:bg-[#1a3826] text-white py-3.5 rounded-full text-sm font-bold transition-all mt-auto shadow-sm active:scale-[0.98]">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
