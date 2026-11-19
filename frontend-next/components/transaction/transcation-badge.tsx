import { cn } from "@/lib/utils"
import { TransactionTypeLabel } from "@/types/transaction-type"

export function TransactionBadge({
  type,
  children,
}: {
  type: TransactionTypeLabel
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        `rounded-full px-2 py-1 text-xs font-medium`,
        type === "income"
          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
          : type === "expense"
            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            : "bg-white text-black"
      )}
    >
      {children}
    </span>
  )
}
