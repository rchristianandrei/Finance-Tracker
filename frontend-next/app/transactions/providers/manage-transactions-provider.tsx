"use client"

import { transactionApi } from "@/api/transactions"
import { useAccount } from "@/providers/account-provider"
import { Transaction } from "@/types/transaction"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useTransactionFilter } from "./transaction-filter-provider"
import { toast } from "sonner"
import { useAddTransaction } from "@/providers/add-transaction-provider"

interface ManageTransactionsContextType {
  transactions: Transaction[]
  loading: boolean
  totalTransactions: number
  selectedCategories: string[]
  updateTransaction: (transaction: Transaction) => Promise<void>
  deleteTransaction: (transactionId: number) => Promise<void>
}

const ManageTransactionsContext = createContext<
  ManageTransactionsContextType | undefined
>(undefined)

export function ManageTransactionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { selectedAccount } = useAccount()
  const { transactionAdded } = useAddTransaction()

  const { dateRange, type, selectedCategories, currentPage, search } =
    useTransactionFilter()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    getTransactions(controller)

    return () => {
      controller.abort()
    }
  }, [
    transactionAdded,
    selectedAccount,
    search,
    type,
    selectedCategories,
    dateRange,
    currentPage,
  ])

  const getTransactions = useCallback(
    async (controller?: AbortController) => {
      if (!selectedAccount) return
      setLoading(true)

      let filter = {
        search: search ?? undefined,
        type: type ? (type === "expense" ? 1 : 2) : undefined,
        categories: selectedCategories ?? undefined,
        startDate: dateRange?.from ?? undefined,
        endDate: dateRange?.to ?? undefined,
        page: currentPage,
      }

      try {
        const transactionsData = await transactionApi.readTransactions(
          selectedAccount.id,
          filter,
          controller?.signal
        )

        setTransactions(transactionsData.data)
        setTotalTransactions(transactionsData.totalCount)
      } catch (error) {
        toast.error("Unable to fetch transactions")
      } finally {
        setLoading(false)
      }
    },
    [selectedAccount, search, type, selectedCategories, dateRange, currentPage]
  )

  const updateTransaction = useCallback(
    async (transaction: Transaction) => {
      await transactionApi.update(transaction)
      console.log("called")
      getTransactions()
    },
    [getTransactions]
  )

  const deleteTransaction = useCallback(
    async (transactionId: number) => {
      await transactionApi.delete(transactionId)
      getTransactions()
    },
    [getTransactions]
  )

  return (
    <ManageTransactionsContext.Provider
      value={{
        transactions,
        loading,
        totalTransactions,
        selectedCategories,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </ManageTransactionsContext.Provider>
  )
}

export function useManageTransactions() {
  const context = useContext(ManageTransactionsContext)

  if (!context) {
    throw new Error(
      "useManageTransactions must be used within an ManageTransactionsProvider"
    )
  }

  return context
}
