"use client";

import LoginForm from "@/components/auth/login-form";
import { authClient } from "@/lib/auth/client";
import { LoginFormData } from "@/lib/auth/schema";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (
    data: LoginFormData,
    setError: (
      name: keyof LoginFormData,
      error: { message: string },
    ) => void,
  ) => {
    try {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Invalid email or password. Please try again.";

      setError("email", { message });
      setError("password", { message });
    }
  };

  return (
    <main className="min-h-svh w-full">
      <LoginForm onSubmit={handleLogin} />
    </main>
  );
}