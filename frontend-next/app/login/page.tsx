import { PublicRoute } from "@/components/guards/PublicRoute"
import LoginForm from "./loginForm"

export const metadata = {
  title: "Login",
}

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  )
}
