import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { Transactions } from "./components/transactions"
import { ManageTransactionsProvider } from "./providers/manage-transactions-provider"
import { TransactionFilterProvider } from "./providers/transaction-filter-provider"

export const metadata = {
  title: "Transactions",
}

export const dynamic = "force-dynamic"

export default function TransactionsPage() {
  return (
    <PrivateRoute>
      <RootLayout>
        <TransactionFilterProvider>
          <ManageTransactionsProvider>
            <Transactions />
          </ManageTransactionsProvider>
        </TransactionFilterProvider>
      </RootLayout>
    </PrivateRoute>
  )
}
