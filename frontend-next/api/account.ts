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
  updateAccount: (values: { id: number; name: string; isDefault: boolean }) => {
    return api.put<Account>(`/account/${values.id}`, {
      name: values.name,
      isDefault: values.isDefault,
    })
  },
  deleteAccount: (accountId: number) => {
    return api.delete(`/account/${accountId}`)
  },
}
