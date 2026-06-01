"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { LoginFormValues, loginSchema } from "@/lib/validations/login"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { CredentialResponse } from "@react-oauth/google"
import GoogleSignIn from "@/components/GoogleSignIn"
import { useAuth } from "@/providers/AuthProvider"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export default function LoginForm() {
  const { googleLogin } = useAuth()

  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const [errorMessage, setErrorMessage] = useState<string>("")

  function onSubmit(values: LoginFormValues) {
    if (isLoggingIn) return
  }

  async function onGoogleLoginSuccess(credentialResponse: CredentialResponse) {
    if (isLoggingIn) return
    setIsLoggingIn(true)

    try {
      const data = await googleLogin(credentialResponse.credential!)

      switch (data.status) {
        case 1:
          setErrorMessage(data.message)
          break
        case 2:
          break
      }

      toast.success("Logged in successfully!")
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>

          <CardDescription>Enter your username and password</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset disabled={isLoggingIn} className="space-y-4">
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
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
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {errorMessage && (
                <FieldError className="text-center">{errorMessage}</FieldError>
              )}

              <Button type="submit" className="w-full">
                {isLoggingIn ? <Spinner /> : "Login"}
              </Button>

              {!isLoggingIn && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>

                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
              )}

              {!isLoggingIn && (
                <div className="flex w-full items-center justify-center">
                  <GoogleSignIn onSuccess={onGoogleLoginSuccess} />
                </div>
              )}
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
