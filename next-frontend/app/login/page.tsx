import { PublicRoute } from "@/components/guards/PublicRoute"
import LoginForm from "./loginForm"

export default function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  )
}
