"use client"

import { useSaveTransaction } from "./save-transation-provider"
import { AccountController } from "./components/account-controller"
import { DescriptionController } from "./components/description-controller"
import { AmountAndDateController } from "./components/amount-and-date-controller"

export function TransferTransactionFields() {
  const { selectedFromAccount, selectedToAccount } = useSaveTransaction()

  return (
    <>
      <AccountController name="fromAccountId" account={selectedFromAccount} />
      <AccountController name="toAccountId" account={selectedToAccount} />
      <DescriptionController />
      <AmountAndDateController />
    </>
  )
}
