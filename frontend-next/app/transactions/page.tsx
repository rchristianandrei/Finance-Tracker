import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { Transactions } from "./transactions"
import { ManageTransactionsProvider } from "./manage-transactions-provider"

export const metadata = {
  title: "Transactions",
}

export default function TransactionsPage() {
  return (
    <PrivateRoute>
      <RootLayout>
        <ManageTransactionsProvider>
          <Transactions />
        </ManageTransactionsProvider>
      </RootLayout>
    </PrivateRoute>
  )
}
