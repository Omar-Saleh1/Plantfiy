'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Lock, Mail, XCircle, ArrowRight, Eye, EyeOff, Calendar } from 'lucide-react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';


export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    name: z.string().nonempty("Name required").min(3, "Min 3 chars").max(15, "Max 15 chars"),
    email: z.string().nonempty("Email required").email("Enter valid email"),
    password: z.string()
      .nonempty("Password required")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
        "Password must contain at least 8 chars, uppercase, lowercase, number and special char"),
    birthMonth: z.string().regex(/^(0?[1-9]|1[012])$/, "1-12"),
    birthYear: z.string().regex(/^(19\d\d|20\d\d)$/, "Invalid year"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthMonth: "",
      birthYear: "",
    },
  });

  async function handleRegister(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
     
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/register`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Registered successfully!");
        router.push("/login");
      } else {
        toast.error(data?.message || "Registration failed.");
      }
    } catch {
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8f9fa] p-4 font-sans">
      <Card className="w-full max-w-[420px] rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white border-0 overflow-hidden">
        
        {/* Top Logo Header */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 mb-2">
          {/* <PlantifyLogo /> */}
          <span className="font-bold text-xl text-[#1e3f20] tracking-tight">Plantify</span>
        </div>

        <CardHeader className="text-center pt-6 pb-6">
          <CardTitle className="text-[26px] font-semibold text-[#1a1a1a]">Welcome Back!</CardTitle>
          <CardDescription className="text-gray-500 text-base mt-2">Log in to your Plantify account</CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="flex flex-col gap-5">

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="flex items-center gap-2 text-gray-600 font-medium text-[13px]">
                      <User className="w-4 h-4 text-gray-500" /> Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                        <Input 
                          {...field} 
                          placeholder="Sarah Green" 
                          className="pl-10 h-12 rounded-xl border-gray-200 text-gray-700 focus-visible:ring-[#2A5C38]" 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <FormLabel className="flex items-center gap-2 text-gray-600 font-medium text-[13px]">
                        <Mail className="w-4 h-4 text-gray-500" /> Email
                      </FormLabel>
                      <button type="button" className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors">
                        Forgot password?
                      </button>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                        <Input 
                          {...field} 
                          placeholder="sarah@example.com" 
                          className="pl-10 pr-10 h-12 rounded-xl border-gray-200 text-gray-700 focus-visible:ring-[#2A5C38]" 
                        />
                        {field.value && (
                          <button 
                            type="button" 
                            onClick={() => field.onChange('')} 
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <XCircle className="w-[18px] h-[18px]" />
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="flex items-center gap-2 text-gray-600 font-medium text-[13px]">
                      <Lock className="w-4 h-4 text-gray-500" /> Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                        <Input 
                          {...field} 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••••" 
                          className="pl-10 pr-10 h-12 rounded-xl border-gray-200 text-gray-700 text-lg tracking-widest placeholder:tracking-normal focus-visible:ring-[#2A5C38]" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <div className="w-[18px] h-[18px] flex items-center justify-center font-bold text-xl">+</div>}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Date */}
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="birthMonth"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 flex-1">
                      <FormLabel className="flex items-center gap-2 text-gray-600 font-medium text-[13px]">
                        <Calendar className="w-4 h-4 text-gray-500" /> Month
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="MM" 
                          min={1}
                          max={12}
                          className="h-12 rounded-xl border-gray-200 text-gray-700 px-3 focus-visible:ring-[#2A5C38]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthYear"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5 flex-1">
                      <FormLabel className="flex items-center gap-2 text-gray-600 font-medium text-[13px]">
                        <Calendar className="w-4 h-4 text-gray-500" /> Year
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="number"
                          placeholder="YYYY" 
                          min={1900}
                          max={new Date().getFullYear()}
                          className="h-12 rounded-xl border-gray-200 text-gray-700 px-3 focus-visible:ring-[#2A5C38]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full h-[52px] rounded-xl bg-[#2b5a3f] hover:bg-[#1e432c] text-white text-[15px] font-semibold transition-colors" 
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>

                
              </div>

            </form>
          </Form>
        </CardContent>

        <div className="px-8 pb-8 pt-2">
          <p className="text-center text-[13px] text-gray-600 leading-relaxed mb-6">
            By signing up, you agree to the <br/>
            <span className="font-semibold text-gray-800 cursor-pointer hover:underline">Terms of Service</span> and <span className="font-semibold text-gray-800 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
          
          <div className="border-t border-gray-100 pt-6 flex justify-center items-center gap-2 text-[14px]">
            <span className="text-gray-600">Already have an account?</span>
            <button 
              type="button"
              onClick={() => router.push("/login")} 
              className="font-bold text-gray-900 flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              Log in <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
        
      </Card>
    </div>
  );
}