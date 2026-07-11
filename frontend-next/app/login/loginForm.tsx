"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldError } from "@/components/ui/field"
import { CredentialResponse } from "@react-oauth/google"
import GoogleSignIn from "@/components/GoogleSignIn"
import { useAuth } from "@/providers/auth-provider"
import { useState } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

export default function LoginForm() {
  const { googleLogin } = useAuth()

  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const [errorMessage, setErrorMessage] = useState<string>("")

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

          <CardDescription>Choose a login option</CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <FieldError className="text-center">{errorMessage}</FieldError>
          )}
          {isLoggingIn && (
            <Button type="submit" className="w-full" disabled>
              <Spinner />
            </Button>
          )}
          {!isLoggingIn && (
            <div className="flex w-full items-center justify-center">
              <GoogleSignIn onSuccess={onGoogleLoginSuccess} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
