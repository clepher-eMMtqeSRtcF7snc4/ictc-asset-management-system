"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  Controller,
  FormProvider,
  useForm,
  UseFormSetError,
} from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { LoginFormData, loginSchema } from "@/lib/auth/schema";

interface LoginFormProps {
  onSubmit: (
    data: LoginFormData,
    setError: UseFormSetError<LoginFormData>,
  ) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginFormData;

        if (field) {
          form.setError(field, {
            message: issue.message,
          });
        }
      });

      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(result.data, form.setError);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-svh w-full overflow-hidden bg-background">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0">
        {/* Optional campus background */}
        <div
          className="
            absolute inset-0
            bg-[url('/img/msun-login-bg.jpg')]
            bg-cover
            bg-center
            bg-no-repeat
          "
        />

        {/* Light/Dark overlay */}
        <div
          className="
            absolute inset-0
            bg-background/75
            dark:bg-slate-950/90
          "
        />

        {/* Brand gradient */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-br
            from-background/80
            via-background/60
            to-primary/10
            dark:from-slate-950/90
            dark:via-slate-950/85
            dark:to-primary/10
          "
        />

        <div
        className="
          relative
          z-10
          flex
          min-h-svh
          w-full
          flex-col
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      />

        {/* Decorative circle */}
        <div
          className="
            absolute
            -left-40
            -bottom-48
            h-[520px]
            w-[520px]
            rounded-full
            border
            border-primary/20
            dark:border-primary/10
          "
        />

        <div
          className="
            absolute
            -left-32
            -bottom-40
            h-[420px]
            w-[420px]
            rounded-full
            border-2
            border-[#F4C400]/40
            dark:border-[#F4C400]/25
          "
        />

        {/* Decorative dots */}
        <div
          className="
            absolute
            right-8
            top-8
            h-32
            w-32
            opacity-20
            dark:opacity-10
            [background-image:radial-gradient(currentColor_1px,transparent_1px)]
            [background-size:12px_12px]
          "
        />

        {/* Decorative gold curve */}
        <div
          className="
            absolute
            -right-48
            -bottom-64
            h-[650px]
            w-[650px]
            rounded-full
            border-t-2
            border-[#F4C400]/40
            dark:border-[#F4C400]/25
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          px-4
          py-8
          sm:px-6
        "
      >
        {/* ===================================================
            TOP BRANDING
        ==================================================== */}

        <div
          className="
            mb-6
            flex
            w-full
            max-w-[920px]
            items-center
            gap-3
          "
        >
          <Image
            src="/img/msun-logo.png"
            alt="Mindanao State University at Naawan"
            width={58}
            height={58}
            priority
            className="
              h-12
              w-12
              object-contain
              sm:h-14
              sm:w-14
            "
          />

          <div>
            <p
              className="
                text-sm
                font-bold
                tracking-tight
                text-foreground
                sm:text-base
              "
            >
              MINDANAO STATE UNIVERSITY AT NAAWAN
            </p>

            <p className="text-xs text-muted-foreground">
              Naawan, Misamis Oriental
            </p>
          </div>
        </div>

        {/* ===================================================
            LOGIN CARD
        ==================================================== */}

        <Card
          className="
            w-full
            max-w-[920px]
            gap-0
            overflow-hidden
            rounded-2xl
            border-border/70
            bg-card
            p-0
            shadow-xl
          "
        >
          <CardContent className="
              grid
              min-h-0
              p-0
              md:grid-cols-[55%_45%]
            ">
            {/* =================================================
                LEFT LOGIN PANEL
            ================================================== */}

            <FormProvider {...form}>
              <form
                id="login-form"
                onSubmit={form.handleSubmit(handleSubmit)}
                className="
                  flex
                  min-h-[560px]
                  flex-col
                  justify-center
                  p-6
                  sm:p-8
                  lg:p-7
                "
              >
                <FieldGroup>
                  {/* Welcome */}
                  <div className="mb-2 flex flex-col gap-1.5">
                    <h1
                      className="
                        text-2xl
                        font-bold
                        tracking-tight
                        text-foreground
                        sm:text-3xl
                      "
                    >
                      Welcome back!
                    </h1>

                    <p className="text-sm text-muted-foreground">
                      Sign in to continue to your account
                    </p>
                  </div>

                  {/* Email */}
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="auth-login-form-email">
                          Email
                        </FieldLabel>

                        <div className="relative">
                          <Mail
                            className="
                              pointer-events-none
                              absolute
                              left-3
                              top-1/2
                              size-4
                              -translate-y-1/2
                              text-muted-foreground
                            "
                          />

                          <Input
                            {...field}
                            type="email"
                            id="auth-login-form-email"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter your email address"
                            autoComplete="email"
                            disabled={isSubmitting}
                            className="h-11 pl-10"
                          />
                        </div>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Password */}
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="auth-login-form-password">
                          Password
                        </FieldLabel>

                        <div className="relative">
                          <LockKeyhole
                            className="
                              pointer-events-none
                              absolute
                              left-3
                              top-1/2
                              size-4
                              -translate-y-1/2
                              text-muted-foreground
                            "
                          />

                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            id="auth-login-form-password"
                            aria-invalid={fieldState.invalid}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isSubmitting}
                            className="h-11 pl-10 pr-10"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword((previous) => !previous)
                            }
                            disabled={isSubmitting}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            className="
                              absolute
                              right-3
                              top-1/2
                              -translate-y-1/2
                              text-muted-foreground
                              transition-colors
                              hover:text-foreground
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-ring
                              focus-visible:ring-offset-2
                            "
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="
                        text-sm
                        font-medium
                        text-primary
                        underline-offset-4
                        hover:underline
                      "
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Sign In */}
                  <Field>
                    <Button
                      type="submit"
                      className="
                        h-11
                        w-full
                        bg-primary
                        font-semibold
                        shadow-sm
                        transition-all
                        hover:shadow-md
                      "
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </Field>

                  {/* Separator */}
                  <FieldSeparator className="my-1">
                    Or continue with
                  </FieldSeparator>

                  {/* Social login */}
                  <Field className="grid grid-cols-3 gap-3">
                    {/* Apple */}
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isSubmitting}
                      className="h-11"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5"
                      >
                        <path
                          d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                          fill="currentColor"
                        />
                      </svg>

                      <span className="sr-only">Login with Apple</span>
                    </Button>

                    {/* Google */}
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isSubmitting}
                      className="h-11"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>

                      <span className="sr-only">Login with Google</span>
                    </Button>

                    {/* Meta */}
                    <Button
                      variant="outline"
                      type="button"
                      disabled={isSubmitting}
                      className="h-11"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="size-5"
                      >
                        <path
                          d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                          fill="currentColor"
                        />
                      </svg>

                      <span className="sr-only">Login with Meta</span>
                    </Button>
                  </Field>

                  {/* Forgot account */}
                  <FieldDescription className="text-center">
                    You forgot your account?{" "}
                    <Link
                      href="/forgot-password"
                      className="
                        font-medium
                        text-primary
                        underline-offset-4
                        hover:underline
                      "
                    >
                      Forgot Password
                    </Link>
                  </FieldDescription>
                </FieldGroup>
              </form>
            </FormProvider>

            {/* =================================================
                RIGHT BRANDING PANEL
            ================================================== */}

            <div
              className="
                relative
                hidden
                h-full
                min-h-[560px]
                overflow-hidden
                bg-[#062B59]
                md:flex
                md:items-center
                md:justify-center
              "
            >
              {/* Background gradient */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-[#062B59]
                  via-[#07396E]
                  to-[#021A38]
                "
              />

              {/* Dotted pattern */}
              <div
                className="
                  absolute
                  right-6
                  top-6
                  h-40
                  w-40
                  opacity-20
                  [background-image:radial-gradient(#ffffff_1px,transparent_1px)]
                  [background-size:12px_12px]
                "
              />

              {/* Large translucent circle */}
              <div
                className="
                  absolute
                  -right-32
                  top-16
                  h-80
                  w-80
                  rounded-full
                  border
                  border-white/10
                "
              />

              <div
                className="
                  absolute
                  -right-24
                  top-24
                  h-64
                  w-64
                  rounded-full
                  border
                  border-white/5
                "
              />

              {/* Gold curve */}
              <div
                className="
                  absolute
                  -bottom-52
                  -left-24
                  h-[500px]
                  w-[650px]
                  rounded-[50%]
                  border-t-2
                  border-[#F4C400]/60
                "
              />

              {/* Logo glow */}
              <div
                className="
                 absolute
                -bottom-52
                -left-24
                h-[500px]
                w-[650px]
                rounded-[50%]
                border-t-2
                border-[#F4C400]/60
                "
              />

              {/* MSU Logo */}
              <div
                className="
                  relative
                  z-10
                  flex
                  flex-col
                  items-center
                  justify-center
                  gap-6
                  px-8
                "
              >
                <Image
                  src="/img/msun-logo.png"
                  alt="Mindanao State University at Naawan"
                  width={280}
                  height={280}
                  priority
                  className="
                    h-auto
                    w-52
                    object-contain
                    drop-shadow-2xl
                    lg:w-60
                  "
                />

                <div className="text-center text-white">
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/70">
                    Mindanao State University
                  </p>

                  <p className="mt-1 text-sm font-semibold">At Naawan</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===================================================
            SECURITY FOOTER
        ==================================================== */}

        <div
          className="
            mt-6
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
            text-xs
            text-muted-foreground
            sm:text-sm
          "
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />

            <span>Secured Login</span>
          </div>

          <span
            className="
              hidden
              h-4
              w-px
              bg-border
              sm:block
            "
          />

          <span className="text-center">
            Asset & Inventory Management System
          </span>
        </div>

        {/* Terms */}
        <FieldDescription className="mt-3 px-6 text-center">
          By clicking sign in, you agree to our{" "}
          <Link
            href="/terms"
            className="
              font-medium
              text-primary
              underline-offset-4
              hover:underline
            "
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="
              font-medium
              text-primary
              underline-offset-4
              hover:underline
            "
          >
            Privacy Policy
          </Link>
          .
        </FieldDescription>
      </div>
    </main>
  );
}
