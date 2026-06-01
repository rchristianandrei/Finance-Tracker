import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { useSearchParams } from "next/navigation"

export function Pagination() {
  const searchParams = useSearchParams()

  const page = Number(searchParams.get("page") ?? 1)

  const goToPage = (newPage: number) => {
    // navigate({
    //   page: String(newPage),
    // })
  }

  const prevPage = () => {
    if (page > 1) {
      goToPage(page - 1)
    }
  }

  const nextPage = () => {
    goToPage(page + 1)
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" onClick={prevPage} disabled={page <= 1}>
        <ChevronDown className="rotate-90" />
      </Button>

      <div className="text-sm text-muted-foreground">Page {page}</div>

      <Button variant="outline" onClick={nextPage}>
        <ChevronDown className="-rotate-90" />
      </Button>
    </div>
  )
}
