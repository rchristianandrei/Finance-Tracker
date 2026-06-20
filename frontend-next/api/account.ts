import api from "@/lib/axios"
import { Account } from "@/types/account"

export const accountApi = {
  getAccounts: () => {
    return api.get<{ accounts: Account[]; defaultAccount: Account | null }>(
      "/account"
    )
  },
  createAccount: (values: { name: string; isDefault: boolean }) => {
    return api.post<Account>(`/account`, values)
  },
}
