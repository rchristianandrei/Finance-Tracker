"use client"

import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/providers/AuthProvider"
import { GoogleOAuthProvider } from "@react-oauth/google"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <TooltipProvider>
        <AuthProvider>{children}</AuthProvider>
      </TooltipProvider>
    </GoogleOAuthProvider>
  )
}
