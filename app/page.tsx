import { ChevronDown, Leaf, User } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="bg-white">
        
      </header>
      <main className="min-h-screen bg-[#fbfbfb] pb-20">
        <div className="max-w-6xl mx-auto px-6 pt-6">

          {/* Hero Section */}
          <section className="relative w-full h-[400px] sm:h-[450px] bg-[#427653] overflow-hidden rounded-bl-xl rounded-br-xl">
            {/* Background image fading on the right */}
            <div
              className="absolute inset-y-0 right-0 w-full sm:w-2/3 md:w-1/2 lg:w-[60%]"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1497250681558-44391c49aa16?auto=format&fit=crop&q=80&w=1200')`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Gradient to blend the solid color into the image smoothly */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#427653] via-[#427653]/80 to-transparent"></div>
              {/* Some extra shadow on the very right to soften edges if needed */}
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-14 lg:w-[65%] text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-sm">
                Welcome to Plantify
              </h1>
              <p className="text-lg md:text-2xl font-medium mb-10 tracking-wide drop-shadow-sm opacity-95">
                Grow, Learn & Shop for Plants
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="px-6 py-3 bg-[#113824] hover:bg-[#0a2316] text-white text-sm font-semibold rounded-lg shadow-md transition-colors">
                  Browse Plants
                </button>
                <button className="px-6 py-3 bg-[#f2efe8] hover:bg-[#e8e4db] text-[#113824] text-sm font-semibold rounded-lg shadow-md transition-colors">
                  Join the Community
                </button>
              </div>
            </div>
          </section>

          {/* Popular Plants Section */}
          <section className="mt-14">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xl font-bold text-zinc-800 whitespace-nowrap">Popular Plants</h2>
              <div className="h-px bg-zinc-200 flex-1 mt-1"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

              {/* Card 1 */}
              <div className="flex flex-col bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
                <div className="relative h-64 w-full bg-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1601370690183-1c7796eca561?auto=format&fit=crop&q=80&w=800"
                    alt="Fiddle Leaf Fig"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-4 text-center">
                  <h3 className="text-lg font-semibold text-zinc-800">Fiddle Leaf Fig</h3>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
                <div className="relative h-64 w-full bg-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1593482892290-f54926eba427?auto=format&fit=crop&q=80&w=800"
                    alt="Snake Plant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-4 text-center">
                  <h3 className="text-lg font-semibold text-zinc-800">Snake Plant</h3>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer">
                <div className="relative h-64 w-full bg-zinc-100">
                  <img
                    src="https://images.unsplash.com/photo-1599598425947-330026217462?auto=format&fit=crop&q=80&w=800"
                    alt="Peace Lily"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="py-4 text-center">
                  <h3 className="text-lg font-semibold text-zinc-800">Peace Lily</h3>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>
    </>


  );
}
