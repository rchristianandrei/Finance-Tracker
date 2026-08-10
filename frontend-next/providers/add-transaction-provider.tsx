"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { useAccount } from "./account-provider"
import {
  CreateIncomeTransactionRequest,
  transactionApi,
} from "@/api/transactions"

interface AddTransactionContextType {
  transactionAdded: {}
  addTransaction: (request: CreateIncomeTransactionRequest) => Promise<void>
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
  const [transactionAdded, setTransactionAdded] = useState<{}>({})

  const addTransaction = useCallback(
    async (request: CreateIncomeTransactionRequest) => {
      await transactionApi.createIncomeTransaction(request)
      setTransactionAdded({})
      loadAccounts()
    },
    []
  )

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
