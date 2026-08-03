import api from "@/lib/axios"
import { Account } from "@/types/account"

type AccountRequest = {
  name: string
  initialBalance: number
}

export type CreateAccountRequest = AccountRequest & {}

export type UpdateAccountRequest = AccountRequest & {
  accountId: number
}

export type TransferBalanceRequest = {
  fromAccountId: number
  toAccountId: number
  amount: number
}

export const accountApi = {
  create: (req: CreateAccountRequest) => {
    return api.post<Account>(`/account`, req)
  },
  transferBalance: (req: TransferBalanceRequest) => {
    return api.post<Account>(`/account/transfer`, req)
  },
  getAccounts: () => {
    return api.get<Account[]>(`/account`)
  },
  update: (req: UpdateAccountRequest) => {
    return api.put<Account>(`/account/${req.accountId}`, req)
  },
  delete: (accountId: number) => {
    return api.delete<Account[]>(`/account/${accountId}`)
  },
}
