"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from "@/lib/zodSchema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useState, useTransition } from "react";
import { login } from "@/actions/login";
import { TriangleAlert } from "lucide-react";

const LoginForm = () => {
  // const [lastResult, action] = useActionState(createInvoice, undefined);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // "use server"
    // console.info(formData);
    setError("");
    startTransition(() => {
      console.info(values);
      login(values).then((result) => {
        setError(result?.error || "");
      })
    })
  }
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name='username'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder='Your Username'
                        // type='email' 
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder='password'
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            {error && (
              <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive">
                <TriangleAlert className="w-4 h-4"/>
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default LoginForm;