import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useManageTransactions } from "./providers/manage-transactions-provider"
import { useTransactionFilter } from "./providers/transaction-filter-provider"

export function Pagination() {
  const { currentPage, goToPage } = useTransactionFilter()
  const { transactions, totalTransactions } = useManageTransactions()

  const hasNoTransactions = transactions.length <= 0 ? 0 : 1
  const fromItem = (currentPage - 1) * 10 + hasNoTransactions
  const toItem = fromItem + transactions.length - hasNoTransactions
  const disabledNext = currentPage * 10 >= totalTransactions

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  }

  const nextPage = () => {
    if (disabledNext) return
    goToPage(currentPage + 1)
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" onClick={prevPage} disabled={currentPage <= 1}>
        <ChevronDown className="rotate-90" />
      </Button>

      <div className="text-sm text-muted-foreground">
        {fromItem} - {toItem} of {totalTransactions}
      </div>

      <Button variant="outline" onClick={nextPage} disabled={disabledNext}>
        <ChevronDown className="-rotate-90" />
      </Button>
    </div>
  )
}
