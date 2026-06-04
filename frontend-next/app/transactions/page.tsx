import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { Transactions } from "./transactions"
import { ManageTransactionsProvider } from "./providers/manage-transactions-provider"
import { TransactionFilterProvider } from "./providers/transaction-filter-provider"
import { DeleteTransactionDialog } from "./delete-transaction-dialog"
import { UpdateTransactionDialog } from "./update-transaction-dialog"

export const metadata = {
  title: "Transactions",
}

export default function TransactionsPage() {
  return (
    <PrivateRoute>
      <RootLayout>
        <TransactionFilterProvider>
          <ManageTransactionsProvider>
            <Transactions />
            <UpdateTransactionDialog />
            <DeleteTransactionDialog />
          </ManageTransactionsProvider>
        </TransactionFilterProvider>
      </RootLayout>
    </PrivateRoute>
  )
}
