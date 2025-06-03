"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAppStore } from "@/lib/store"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function SignupModal() {
  const { showSignupModal, setShowSignupModal, setShowLoginModal, signup } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const success = await signup(values.username, values.email, values.password)
      if (success) {
        setShowSignupModal(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  function switchToLogin() {
    setShowSignupModal(false)
    setShowLoginModal(true)
  }

  return (
    <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create your BlenderDuo account</DialogTitle>
        <DialogHeader>
          <DialogDescription>
            Join our community and track your learning progress
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="blenderwizard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                type="submit"
                className="w-full bg-duolingo-green hover:bg-duolingo-green/90"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign up
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account?</span>{" "}
          <button 
            onClick={switchToLogin}
            className="text-primary hover:underline focus:outline-none"
          >
            Log in
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}