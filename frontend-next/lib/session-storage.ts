const selectedAccountIdKey = "selectedAccountId"

export const manageSession = {
  setSelectedAccountId: (accountId: number | null) => {
    if (accountId)
      sessionStorage.setItem(selectedAccountIdKey, accountId.toString())
    else sessionStorage.removeItem(selectedAccountIdKey)
  },
  getSelectedAccountId: () => {
    const temp = sessionStorage.getItem(selectedAccountIdKey)
    if (!temp) return null
    return Number(temp)
  },
}
