import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { DashboardProvider } from "./components/transactions/providers/dashboard-provider"
import { TransactionFilter } from "./components/transactions/components/transaction-filter"
import { AccountsSection } from "./components/accounts/accounts-section"
import { TransctionSummary } from "./components/transactions/components/transaction-summary"
import { ExpenseByCategory } from "./components/transactions/components/expense-by-category"
import { IncomeByCategory } from "./components/transactions/components/income-by-category"

export const metadata = {
  title: "Dashboard",
}

export default function Page() {
  return (
    <PrivateRoute>
      <RootLayout>
        <DashboardProvider>
          <div className="flex flex-col gap-4">
            <AccountsSection />
            <TransactionFilter />
            <TransctionSummary />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <IncomeByCategory />
              <ExpenseByCategory />
            </div>
          </div>
        </DashboardProvider>
      </RootLayout>
    </PrivateRoute>
  )
}
