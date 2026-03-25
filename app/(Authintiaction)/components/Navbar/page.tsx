import { ChevronDown, Leaf, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function Nav() {
  return (
    <nav className="max-w-6xl mx-auto flex items-center justify-between py-6 px-6 relative z-50">
          {/* Logo */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-[#1a3826]">
              <Leaf className="w-8 h-8 text-[#2d5f3f] fill-current" />
              Plantify
            </Link>
          </div>

          {/* Nav links */}
          <ul className="flex-1 flex items-center justify-center gap-8">
            <li>
              <Link href="/" className="text-sm font-semibold text-zinc-800 hover:text-[#2d5f3f]">
                Home
              </Link>
            </li>
            <li>
              <button className="flex items-center gap-1 text-sm font-semibold text-zinc-600 hover:text-[#2d5f3f]">
                <Link href="/shop">Shop</Link> <ChevronDown className="w-4 h-4" />
              </button>
            </li>
            <li>
              <button className="flex items-center gap-1 text-sm font-medium text-zinc-600 hover:text-[#2d5f3f]">
                Articles <ChevronDown className="w-4 h-4" />
              </button>
            </li>
            <li>
              <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-[#2d5f3f]">
                Help
              </Link>
            </li>
          </ul>

          {/* Auth Actions */}
          <div className="flex-1 flex justify-end">
            <div className="relative group">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-[#2d5f3f] transition-colors focus:outline-none">
                <User className="w-5 h-5" />
              </button>

              {/* Dropdown Menu - appears on hover */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60]">
                <div className="py-2 flex flex-col">
                  <Link href="/login" className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#2d5f3f] font-medium transition-colors">
                    Login
                  </Link>
                  <Link href="/register" className="px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-[#2d5f3f] font-medium transition-colors">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
  )
}
