'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, Lock, Calendar, User2 } from 'lucide-react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formSchema = z.object({
    name: z.string().nonempty("Name required").min(3, "Min 3 chars").max(15, "Max 15 chars"),
    email: z.string().nonempty("Email required").email("Enter valid email"),
    password: z.string()
      .nonempty("Password required")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
        "Password must contain at least 8 chars, uppercase, lowercase, number and special char"),
    birthMonth: z.number().min(1).max(12),
    birthYear: z.number().min(1900).max(new Date().getFullYear()),
    gender: z.enum(["male", "female", "other"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      birthMonth: 1,
      birthYear: 2000,
      gender: "male",
    },
  });

  async function handleRegister(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/register`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-sm rounded-xl shadow-lg bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to your Plantify account</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="flex flex-col gap-4">

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input {...field} placeholder="Sarah Green" className="pl-10" />
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} placeholder="sarah@example.com" className="pl-3" />
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
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input {...field} type="password" placeholder="********" className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Month & Year */}
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="birthMonth"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Birth Month</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input {...field} type="number"  placeholder="Month" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthYear"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Birth Year</FormLabel>
                      <FormControl>
                        <Input {...field} type="number"   placeholder="Year" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full border rounded-lg p-2">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Registering..." : "Log Up"}
              </Button>

              <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2">
                <img src="/google-icon.svg" className="w-5 h-5" /> Continue with Google
              </Button>

              <Button variant="outline" className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
                <img src="/facebook-icon.svg" className="w-5 h-5" /> Continue with Facebook
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-center text-sm text-gray-500">
          By signing up, you agree to the <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span> <br />
          Already have an account? <Button variant="link" className="p-0" onClick={() => router.push("/login")}>Log in →</Button>
        </CardFooter>
      </Card>
    </div>
  );
}