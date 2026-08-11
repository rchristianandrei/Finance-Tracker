"use client"

import { transactionApi } from "@/api/transactions"
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
import axios from "axios"
import { useAccount } from "@/providers/account-provider"

interface ManageTransactionsContextType {
  transactions: Transaction[]
  loading: boolean
  totalTransactions: number
  selectedCategories: string[]
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
  const { loadAccounts } = useAccount()
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
    search,
    type,
    selectedCategories,
    dateRange,
    currentPage,
  ])

  const getTransactions = useCallback(
    async (controller?: AbortController) => {
      setLoading(true)

      let filter = {
        search: search ?? undefined,
        type: type
          ? type === "expense"
            ? 1
            : type === "income"
              ? 2
              : 3
          : undefined,
        categories: selectedCategories ?? undefined,
        startDate: dateRange?.from ?? undefined,
        endDate: dateRange?.to ?? undefined,
        page: currentPage,
      }

      try {
        const transactionsData = await transactionApi.readTransactions(
          filter,
          controller?.signal
        )

        setTransactions(transactionsData.data)
        setTotalTransactions(transactionsData.totalCount)
      } catch (error) {
        if (axios.isCancel(error)) return
        toast.error("Unable to fetch transactions")
      } finally {
        setLoading(false)
      }
    },
    [search, type, selectedCategories, dateRange, currentPage]
  )

  const deleteTransaction = useCallback(
    async (transactionId: number) => {
      await transactionApi.delete(transactionId)
      getTransactions()
      loadAccounts()
    },
    [getTransactions, loadAccounts]
  )

  return (
    <ManageTransactionsContext.Provider
      value={{
        transactions,
        loading,
        totalTransactions,
        selectedCategories,
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
