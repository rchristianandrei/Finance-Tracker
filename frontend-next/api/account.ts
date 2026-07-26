import api from "@/lib/axios"
import { Account } from "@/types/account"

export const accountApi = {
  create: () => {},
  getAccounts: () => {
    return api.get<Account[]>(`/account`)
  },
  update: () => {},
  delete: () => {},
}
