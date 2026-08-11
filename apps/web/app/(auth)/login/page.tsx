'use client'

import LoginForm from "@/components/auth/login-form"
import { authClient } from "@/lib/auth/client"
import { LoginFormData } from "@/lib/auth/schema"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (
    data: LoginFormData,
    setError: (name: keyof LoginFormData, error: { message: string }) => void,
  ) => {
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      router.push("/dashboard")
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Invalid email or password. Please try again."

      setError("email", { message })
      setError("password", { message })
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm onSubmit={handleLogin}/>
      </div>
    </div>
  )
}
