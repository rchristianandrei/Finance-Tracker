import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { Transactions } from "./transactions"

export default function TransactionsPage() {
  return (
    <PrivateRoute>
      <RootLayout>
        <Transactions />
      </RootLayout>
    </PrivateRoute>
  )
}
