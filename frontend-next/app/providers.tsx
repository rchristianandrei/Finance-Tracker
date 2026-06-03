"use client"

import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AccountProvider } from "@/providers/account-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { CategoryProvider } from "@/providers/category-provider"
import { GoogleOAuthProvider } from "@react-oauth/google"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <TooltipProvider>
          <AuthProvider>
            <AccountProvider>
              <CategoryProvider>{children}</CategoryProvider>
            </AccountProvider>
          </AuthProvider>
        </TooltipProvider>
      </GoogleOAuthProvider>
      <Toaster position="top-center" richColors />
    </>
  )
}
