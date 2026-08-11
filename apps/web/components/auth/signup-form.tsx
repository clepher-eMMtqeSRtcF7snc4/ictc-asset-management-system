'use client'

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupFormData, signupSchema } from "@/lib/auth/schema";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
}

export default function SignupForm({onSubmit}: SignupFormProps){
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  const handleSubmit = async (data: SignupFormData) => {
    const result = signupSchema.safeParse(data);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignupFormData;

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
      await onSubmit(result.data);
    } catch(error) {
      console.error("Signup error:", error);
    } finally{
      setIsSubmitting(false);
    }
  }

  return (
    
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent >
        <FormProvider {...form}>
          <form id="signup-form" onSubmit={form.handleSubmit(handleSubmit)}>
              <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-signup-form-name">
                      Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="auth-signup-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your name."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-signup-form-email">
                      Email
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      id="auth-signup-form-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email address."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-signup-form-password">
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      id="auth-signup-form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-signup-form-confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      id="auth-signup-form-confirm-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm your password."
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="mt-6">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </form>
         </FormProvider>
      </CardContent>
      </Card>
   
  )
}