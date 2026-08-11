import api from "@/lib/axios"
import { Transaction } from "@/types/transaction"

export type CreateTransactionBaseRequest = {
  description: string
  amount: number
  date: Date
}

export type CreateIncomeTransactionRequest = CreateTransactionBaseRequest & {
  toAccountId: number
  categoryId: number
}

export type CreateExpenseTransactionRequest = CreateTransactionBaseRequest & {
  fromAccountId: number
  categoryId: number
}

export type CreateTransferTransactionRequest = CreateTransactionBaseRequest & {
  fromAccountId: number
  toAccountId: number
}

export type UpdateIncomeTransactionRequest = CreateIncomeTransactionRequest & {
  id: number
}

export type UpdateExpenseTransactionRequest =
  CreateExpenseTransactionRequest & {
    id: number
  }
export type UpdateTransferTransactionRequest =
  CreateTransferTransactionRequest & {
    id: number
  }

export const transactionApi = {
  createIncomeTransaction: async (income: CreateIncomeTransactionRequest) => {
    const body = {
      ...income,
      date: income.date.toISOString(),
    }
    return await api.post(`/transaction/income`, body)
  },
  createExpenseTransaction: async (
    expense: CreateExpenseTransactionRequest
  ) => {
    const body = {
      ...expense,
      date: expense.date.toISOString(),
    }
    return await api.post(`/transaction/expense`, body)
  },
  createTransferTransaction: async (
    transfer: CreateTransferTransactionRequest
  ) => {
    const body = {
      ...transfer,
      date: transfer.date.toISOString(),
    }
    return await api.post(`/transaction/transfer`, body)
  },
  readTransactions: async (
    filter?: {
      search?: string
      startDate?: Date
      endDate?: Date
      page?: number
      type?: number
      categories?: string[]
    },
    signal?: AbortSignal
  ) => {
    let params = new URLSearchParams()

    if (filter?.search) {
      params.set("Search", filter.search)
    }

    if (filter?.type) {
      params.set("TransactionType", filter.type.toString())
    }

    if (filter?.categories) {
      filter.categories.forEach((c) => params.append("Categories", c))
    }

    if (filter?.startDate) {
      params.set("StartDate", filter.startDate.toISOString())
    }

    if (filter?.endDate) {
      params.set("EndDate", filter.endDate.toISOString())
    }

    if (filter?.page) {
      params.set("Page", filter.page.toString())
    }

    const response = await api.get<{
      totalCount: number
      data: Transaction[]
    }>(`/transaction`, { params, signal })

    response.data.data = response.data.data.map((t) => ({
      ...t,
      date: new Date(t.date),
    }))

    return response.data
  },
  update: (updatedValues: {
    id: number
    date: Date
    accountId: number
    categoryId: number
    description: string
    amount: number
  }) => {
    const body = {
      ...updatedValues,
      date: updatedValues.date.toISOString(),
    }
    return api.put(`/transaction/${updatedValues.id}`, body)
  },
  updateIncomeTransaction: async (income: UpdateIncomeTransactionRequest) => {
    const body = {
      ...income,
      date: income.date.toISOString(),
    }
    return await api.put(`/transaction/income/${income.id}`, body)
  },
  updateExpenseTransaction: async (
    expense: UpdateExpenseTransactionRequest
  ) => {
    const body = {
      ...expense,
      date: expense.date.toISOString(),
    }
    return await api.put(`/transaction/expense/${expense.id}`, body)
  },
  updateTransferTransaction: async (
    transfer: UpdateTransferTransactionRequest
  ) => {
    const body = {
      ...transfer,
      date: transfer.date.toISOString(),
    }
    return await api.put(`/transaction/transfer/${transfer.id}`, body)
  },
  delete: (id: number) => {
    return api.delete(`/transaction/${id}`)
  },
}
