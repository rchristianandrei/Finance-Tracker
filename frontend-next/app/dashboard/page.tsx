import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { DashboardProvider } from "./providers/dashboard-provider"
import { DashboardFilter } from "./components/dashboard-filter"
import { AccountsSection } from "./components/accounts-section"
import { TransctionSummary } from "./components/transaction-summary"
import { IncomeByCategory } from "./components/income-by-category"
import { ExpenseByCategory } from "./components/expense-by-category"

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
            <DashboardFilter />
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
