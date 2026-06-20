"use client"

import { transactionApi } from "@/api/transactions"
import { useAccount } from "@/providers/account-provider"
import { Transaction } from "@/types/transaction"
import axios from "axios"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { useTransactionFilter } from "./transaction-filter-provider"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const { selectedAccount } = useAccount()

  const { dateRange, type, selectedCategories, currentPage, search } =
    useTransactionFilter()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    ;(async () => {
      if (!selectedAccount) return

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
          controller.signal
        )

        setTransactions(transactionsData.data)
        setTotalTransactions(transactionsData.totalCount)
      } catch (err) {
        if (axios.isCancel(err)) return
      } finally {
        setLoading(false)
      }
    })()

    return () => {
      controller.abort()
    }
  }, [
    selectedAccount,
    search,
    type,
    selectedCategories,
    dateRange,
    currentPage,
  ])

  const updateTransaction = useCallback(
    async (transaction: Transaction) => {
      await transactionApi.update(transaction)
      router.refresh()
    },
    [router]
  )

  const deleteTransaction = useCallback(
    async (transactionId: number) => {
      await transactionApi.delete(transactionId)
      router.refresh()
    },
    [router]
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
