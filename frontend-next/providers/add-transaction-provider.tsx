"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { Transaction } from "@/types/transaction"
import { useAccount } from "./account-provider"

interface AddTransactionContextType {
  transactionAdded: Transaction | null
  addTransaction: (transaction: Transaction) => void
}

const AddTransactionContext = createContext<
  AddTransactionContextType | undefined
>(undefined)

export function AddTransactionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { loadAccounts } = useAccount()
  const [transactionAdded, setTransactionAdded] = useState<Transaction | null>(
    null
  )

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactionAdded(transaction)
    loadAccounts()
  }, [])

  return (
    <AddTransactionContext.Provider
      value={{ transactionAdded, addTransaction }}
    >
      {children}
    </AddTransactionContext.Provider>
  )
}

export function useAddTransaction() {
  const context = useContext(AddTransactionContext)

  if (!context) {
    throw new Error(
      "useAddTransaction must be used within an AddTransactionProvider"
    )
  }

  return context
}
