"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { useAccount } from "./account-provider"
import {
  CreateExpenseTransactionRequest,
  CreateIncomeTransactionRequest,
  CreateTransferTransactionRequest,
  transactionApi,
  UpdateExpenseTransactionRequest,
  UpdateIncomeTransactionRequest,
  UpdateTransferTransactionRequest,
} from "@/api/transactions"

interface AddTransactionContextType {
  transactionAdded: {}
  addIncomeTransaction: (
    request: CreateIncomeTransactionRequest
  ) => Promise<void>
  addExpenseTransaction: (
    request: CreateExpenseTransactionRequest
  ) => Promise<void>
  addTransferTransaction: (
    request: CreateTransferTransactionRequest
  ) => Promise<void>
  updateIncomeTransaction: (
    income: UpdateIncomeTransactionRequest
  ) => Promise<void>
  updateExpenseTransaction: (
    income: UpdateExpenseTransactionRequest
  ) => Promise<void>
  updateTransferTransaction: (
    expense: UpdateTransferTransactionRequest
  ) => Promise<void>
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

  const addIncomeTransaction = useCallback(
    async (request: CreateIncomeTransactionRequest) => {
      await transactionApi.createIncomeTransaction(request)
      setTransactionAdded({})
      loadAccounts()
    },
    []
  )
  const addExpenseTransaction = useCallback(
    async (request: CreateExpenseTransactionRequest) => {
      await transactionApi.createExpenseTransaction(request)
      setTransactionAdded({})
      loadAccounts()
    },
    []
  )

  const addTransferTransaction = useCallback(
    async (request: CreateTransferTransactionRequest) => {
      await transactionApi.createTransferTransaction(request)
      setTransactionAdded({})
      loadAccounts()
    },
    []
  )

  const updateIncomeTransaction = useCallback(
    async (income: UpdateIncomeTransactionRequest) => {
      await transactionApi.updateIncomeTransaction(income)
      loadAccounts()
      setTransactionAdded({})
    },
    [loadAccounts]
  )

  const updateExpenseTransaction = useCallback(
    async (expense: UpdateExpenseTransactionRequest) => {
      await transactionApi.updateExpenseTransaction(expense)
      loadAccounts()
      setTransactionAdded({})
    },
    [loadAccounts]
  )

  const updateTransferTransaction = useCallback(
    async (expense: UpdateTransferTransactionRequest) => {
      await transactionApi.updateTransferTransaction(expense)
      loadAccounts()
      setTransactionAdded({})
    },
    [loadAccounts]
  )

  return (
    <AddTransactionContext.Provider
      value={{
        transactionAdded,
        addIncomeTransaction,
        addExpenseTransaction,
        addTransferTransaction,
        updateIncomeTransaction,
        updateExpenseTransaction,
        updateTransferTransaction,
      }}
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
