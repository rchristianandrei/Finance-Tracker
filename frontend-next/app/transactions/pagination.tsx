import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useManageTransactions } from "./manage-transactions-provider"

export function Pagination() {
  const { totalTransactions, currentPage, goToPage } = useManageTransactions()

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
        <span className="hidden md:inline">Page</span> {currentPage} of{" "}
        {Math.ceil(totalTransactions / 10)}
      </div>

      <Button variant="outline" onClick={nextPage} disabled={disabledNext}>
        <ChevronDown className="-rotate-90" />
      </Button>
    </div>
  )
}
