import api from "@/lib/axios"
import { Account } from "@/types/account"

export type CreateAccountRequest = {
  name: string
  initialBalance: number
}

export const accountApi = {
  create: (req: CreateAccountRequest) => {
    return api.post<Account>(`/account`, req)
  },
  getAccounts: () => {
    return api.get<Account[]>(`/account`)
  },
  update: () => {},
  delete: (accountId: number) => {
    return api.delete<Account[]>(`/account/${accountId}`)
  },
}
