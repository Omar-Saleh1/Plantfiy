'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from 'lucide-react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export default function UpdatePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
     newPassword: z.string()
         .nonempty("Password required")
         .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
           "Password must contain at least 8 chars, uppercase, lowercase, number and special char"),
  }); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
    },
  });

  async function handleUpdatePassword(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const token = searchParams?.get("token");
      if (!token) {
        throw new Error("Missing reset token in URL");
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/reset-password/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password updated successfully");
        router.push("/login");
      } else {
        toast.error(data?.message || "Failed to update password");
      }
    } catch (err: any) {
      toast.error(err.message || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#fcfdfc] p-4 font-sans relative overflow-hidden">
      {/* Decorative watercolor background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-[#e3ece5] rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[0%] right-[0%] w-[50%] h-[50%] bg-[#ebe4d8] rounded-full blur-[120px] opacity-70"></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        <Card className="w-full rounded-[1.8rem] shadow-[0_10px_40px_rgb(0,0,0,0.06)] bg-white border border-white/40 overflow-hidden relative z-20 pb-2">
          
          <div className="flex flex-col px-6 pt-8 pb-6 z-20 bg-white">
            {/* Top Logo Header Centered */}
            <div className="flex flex-col items-center justify-center gap-2 pb-2">
              <div className="flex items-center gap-2">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C12 21 5 15.5 5 9.5C5 6.5 7.5 4 12 4C16.5 4 19 6.5 19 9.5C19 15.5 12 21 12 21Z" fill="#386A45"/>
                  <path d="M12 21V10" stroke="#1e3f20" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 10C12 10 9 7 9 5" stroke="#1e3f20" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="font-bold text-[22px] text-[#1e3f20] tracking-tight">Plantify</span>
              </div>
            </div>

            <CardHeader className="text-center pt-2 pb-8 px-0">
              <CardTitle className="text-[26px] font-bold text-[#1e3f20]">Update Password</CardTitle>
            </CardHeader>

            <CardContent className="px-0 pb-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="flex flex-col gap-5">

                  {/* Password Input */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="flex items-center gap-2 text-[#4a5f50] font-semibold text-[14px]">
                          <Lock className="w-4 h-4 text-[#6e8574] mb-[1px]" /> New Password
                        </FormLabel>
                        
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••" 
                              className="px-4 h-[46px] rounded-[10px] border border-gray-200 text-gray-700 text-lg tracking-[0.2em] placeholder:tracking-normal focus-visible:ring-1 focus-visible:ring-[#386A45] transition-all bg-white" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#386A45] transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="text-[12px] text-[#5e7163] leading-[1.5] pt-1 pb-1">
                    <span className="font-bold text-[#386A45]">Tip:</span> Use at least 8 characters with a mix of letters, numbers, and symbols.
                  </div>

                  <div className="pt-2 pb-4">
                    <Button 
                      type="submit" 
                      className="w-full h-[48px] rounded-[10px] bg-gradient-to-r from-[#386A45] to-[#285033] hover:from-[#2e5939] hover:to-[#1e3f26] text-white text-[15.5px] font-medium shadow-md transition-all border-0" 
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>

                </form>
              </Form>
            </CardContent>
          </div>
        </Card>

      
      </div>
    </div>
  );
}