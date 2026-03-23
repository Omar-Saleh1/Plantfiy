'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail } from 'lucide-react';
import Link from 'next/link';

import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().nonempty("Email required").email("Enter valid email"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function handleForgetPassword(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/forgot-password`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Reset link sent!");
      } else {
        toast.error(data?.message || "Failed to send reset link.");
      }
    } catch {
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center px-4 min-h-screen bg-[#fafbfa] font-sans relative overflow-hidden">
      
      {/* Background Decorative Plants */}
      <div className="absolute left-0 bottom-0 top-0 w-1/3 max-w-[380px] pointer-events-none hidden lg:flex items-end justify-start z-0 pl-6 pb-2">
        <img 
          src="/plant-1.jpeg" 
          alt="Decorative Plant Left" 
          className="object-contain max-h-[60%] mix-blend-multiply opacity-95"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <div className="absolute right-0 bottom-0 top-0 w-1/3 max-w-[380px] pointer-events-none hidden lg:flex items-end justify-end z-0 pr-6 pb-2">
        <img 
          src="/plant-2.jpeg" 
          alt="Decorative Plant Right" 
          className="object-contain max-h-[60%] mix-blend-multiply opacity-95"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      </div>

      <Card className="w-full max-w-[440px] rounded-[1.2rem] shadow-[0_12px_40px_rgb(0,0,0,0.06)] bg-white border border-gray-100 overflow-hidden relative z-10 p-0">
        
        {/* Header containing Logo with a bottom border */}
        <div className="flex items-center gap-2 px-8 py-5 border-b border-gray-100 bg-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C12 21 5 15.5 5 9.5C5 6.5 7.5 4 12 4C16.5 4 19 6.5 19 9.5C19 15.5 12 21 12 21Z" fill="#386A45"/>
            <path d="M12 21V10" stroke="#1e3f20" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 10C12 10 9 7 9 5" stroke="#1e3f20" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="font-bold text-[20px] text-[#1e3f20] tracking-tight">Plantify</span>
        </div>

        <CardContent className="px-8 pt-8 pb-10">
          
          <div className="text-center pb-8 flex flex-col items-center">
            <h1 className="text-[28px] font-bold text-[#1e3f20] mb-2">Forgot Password?</h1>
            <p className="text-[15px] text-gray-600">Enter your email to reset your password</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleForgetPassword)} className="flex flex-col gap-6">

              {/* Email Input */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[22px] h-[22px] text-gray-400 stroke-[1.5]" />
                        <Input 
                          {...field} 
                          placeholder="name@example.com" 
                          className="pl-12 pr-4 h-[56px] rounded-[0.85rem] border border-gray-200 text-gray-700 bg-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#386A45] text-[16px] shadow-[0_2px_8px_rgb(0,0,0,0.02)] transition-all" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="pt-1.5" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-[54px] rounded-[0.85rem] bg-[#386A45] hover:bg-[#2A5C38] text-white text-[16px] font-semibold shadow-md transition-all border-0 mt-1" 
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

            </form>
          </Form>

          {/* Links Section */}
          <div className="mt-8 flex flex-col items-center justify-center gap-5">
            <div className="text-[15px] text-gray-500">
               Remembered your password? <Link href="/login" className="font-bold text-[#1e3f20] hover:underline transition-all">Log in</Link>
            </div>
            
            {/* Dots Separator */}
            <div className="flex gap-[6px]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-[3.5px] h-[3.5px] rounded-full bg-gray-300"></div>
              ))}
            </div>

            <Link href="/login" className="font-semibold text-[15px] text-gray-600 hover:text-[#1e3f20] transition-colors mt-1">
              Back to Log In
            </Link>
          </div>

        </CardContent>
        
      </Card>
      
    </div>
  );
}