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
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, setShowSignupModal, login } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const success = await login(values.email, values.password)
      if (success) {
        setShowLoginModal(false)
      } else {
        form.setError("password", { 
          message: "Invalid email or password" 
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  function switchToSignup() {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Log in to BlenderDuo</DialogTitle>
        <DialogHeader>
          <DialogDescription>
            Continue your learning journey where you left off
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                Log in
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don&apos;t have an account?</span>{" "}
          <button 
            onClick={switchToSignup} 
            className="text-primary hover:underline focus:outline-none"
          >
            Sign up
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}