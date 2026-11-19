import { isSameISODate } from "@/lib/compare-date"
import {
  TransactionFormValues,
  transactionSchema,
} from "@/lib/validations/transaction"
import { useAccount } from "@/providers/account-provider"
import { useAddTransaction } from "@/providers/add-transaction-provider"
import { useCategory } from "@/providers/category-provider"
import { Account } from "@/types/account"
import { Category } from "@/types/category"
import { Transaction } from "@/types/transaction"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { useForm, UseFormReturn } from "react-hook-form"

interface SaveTransactionContextType {
  transaction?: Transaction
  isTransactionSheetOpen: boolean
  isSubmitting: boolean
  isCreateCategorySheetOpen: boolean
  form: UseFormReturn<TransactionFormValues>
  currentType: "income" | "expense" | "transfer"
  selectedFromAccount: Account | undefined
  selectedToAccount: Account | undefined
  selectedCategory: Category | undefined
  currentTransactionDate: Date
  submitTransaction: (values: TransactionFormValues) => Promise<void>
  openCategorySheet: () => void
  closeCategorySheet: () => void
  openTransactionSheet: () => void
  closeTransactionSheet: () => void
}

const SaveTransactionContext = createContext<
  SaveTransactionContextType | undefined
>(undefined)

export function SaveTransactionProvider({
  initialOpen,
  initialTransaction,
  children,
}: {
  initialOpen?: boolean
  initialTransaction?: Transaction
  children: React.ReactNode
}) {
  const {
    addExpenseTransaction,
    updateExpenseTransaction,
    addIncomeTransaction,
    updateIncomeTransaction,
    addTransferTransaction,
    updateTransferTransaction,
  } = useAddTransaction()
  const { accounts } = useAccount()
  const { categories } = useCategory()

  const [transaction, _] = useState<Transaction | undefined>(initialTransaction)

  const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(
    () => initialOpen || false
  )
  const [isCreateCategorySheetOpen, setIsCreateCategorySheetOpen] =
    useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)

  const type = transaction?.type ?? "expense"

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      ...(type !== "income" && {
        fromAccountId: transaction?.fromAccount?.id ?? undefined,
      }),
      ...(type !== "expense" && {
        toAccountId: transaction?.toAccount?.id ?? undefined,
      }),
      ...(type !== "transfer" && {
        categoryId: transaction?.category?.id ?? 0,
      }),
      description: transaction?.description ?? "",
      amount: transaction?.amount ?? undefined,
      date: transaction?.date ?? new Date(),
      ...(type === "expense" && {
        dashboardDate: isSameISODate(
          transaction?.date ?? new Date(),
          transaction?.dashboardDate ?? new Date()
        )
          ? undefined
          : transaction?.dashboardDate,
      }),
    },
  })

  const currentType = form.watch("type")
  const selectedFromAccountId = form.watch("fromAccountId")
  const selectedToAccountId = form.watch("toAccountId")
  const selectedCategoryId = form.watch("categoryId")
  const currentTransactionDate = form.watch("date")

  const selectedFromAccount = useMemo(
    () => accounts.find((a) => a.id === selectedFromAccountId),
    [accounts, selectedFromAccountId]
  )
  const selectedToAccount = useMemo(
    () => accounts.find((a) => a.id === selectedToAccountId),
    [accounts, selectedToAccountId]
  )
  const selectedCategory = useMemo(
    () => categories.find((a) => a.id === selectedCategoryId),
    [selectedCategoryId]
  )

  const openCategorySheet = useCallback(() => {
    setIsCreateCategorySheetOpen(true)
    setIsTransactionSheetOpen(false)
  }, [])

  const closeCategorySheet = useCallback(() => {
    setIsCreateCategorySheetOpen(false)
    setIsTransactionSheetOpen(true)
  }, [])

  const openTransactionSheet = useCallback(() => {
    setIsTransactionSheetOpen(true)
  }, [])
  const closeTransactionSheet = useCallback(() => {
    setIsTransactionSheetOpen(false)
  }, [])

  const submitTransaction = useCallback(
    async (values: TransactionFormValues) => {
      if (isSubmitting) return
      setIsSubmitting(true)

      try {
        switch (values.type) {
          case "expense":
            if (!values.dashboardDate) {
              values.dashboardDate = values.date
            }
            if (transaction) {
              await updateExpenseTransaction({ ...values, id: transaction.id })
            } else {
              await addExpenseTransaction(values)
            }
            break
          case "income":
            if (transaction) {
              await updateIncomeTransaction({ ...values, id: transaction.id })
            } else {
              await addIncomeTransaction(values)
            }
            break
          case "transfer":
            if (transaction) {
              await updateTransferTransaction({ ...values, id: transaction.id })
            } else {
              await addTransferTransaction(values)
            }
            break
        }
        form.reset()
      } finally {
        setIsSubmitting(false)
      }
    },
    [transaction, addExpenseTransaction, updateExpenseTransaction]
  )

  return (
    <SaveTransactionContext.Provider
      value={{
        transaction,
        isTransactionSheetOpen,
        form,
        isSubmitting,
        isCreateCategorySheetOpen,
        currentType,
        selectedFromAccount,
        selectedToAccount,
        selectedCategory,
        currentTransactionDate,
        submitTransaction,
        openCategorySheet,
        openTransactionSheet,
        closeTransactionSheet,
        closeCategorySheet,
      }}
    >
      {children}
    </SaveTransactionContext.Provider>
  )
}

export function useSaveTransaction() {
  const context = useContext(SaveTransactionContext)

  if (!context) {
    throw new Error(
      "useSaveTransaction must be used within an SaveTransactionProvider"
    )
  }

  return context
}
