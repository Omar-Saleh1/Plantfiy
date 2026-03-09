'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from 'lucide-react';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
    birthYear: z.number().min(1900),
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/register`, {
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
    } catch (err) {
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#1c1c2c]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register your account</CardTitle>
          <CardDescription>Fill the fields below to create an account</CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => router.push("/login")}>
              Already have an account? Login
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegister)} className="flex flex-col gap-6">
              
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
                        <Input
                          placeholder="Enter full name"
                          {...field}
                          className="pl-10 rounded-lg bg-[#2c2c3c] text-white border-gray-600 w-full"
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
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@email.com"
                        {...field}
                        className="rounded-lg bg-[#2c2c3c] text-white border-gray-600 w-full"
                      />
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
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                        className="rounded-lg bg-[#2c2c3c] text-white border-gray-600 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Month */}
              <FormField
                control={form.control}
                name="birthMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Month</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-lg bg-[#2c2c3c] text-white border-gray-600 w-full"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Birth Year */}
              <FormField
                control={form.control}
                name="birthYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="rounded-lg bg-[#2c2c3c] text-white border-gray-600 w-full"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <select {...field} className="rounded-lg bg-[#2c2c3c] text-white border-gray-600 w-full p-2">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}