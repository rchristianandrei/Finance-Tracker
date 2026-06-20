"use client"

import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { useAccount } from "@/providers/account-provider"
import { AccountFormValues } from "@/lib/validations/account"
import { Account } from "@/types/account"
import { AccountForm } from "./account-form"

export function UpdateAccountDialog({
  account,
  onClose,
}: {
  account?: Account
  onClose: () => void
}) {
  const { updateAccount } = useAccount()

  async function onSubmit(values: AccountFormValues) {
    if (!account) return
    try {
      await updateAccount({ id: account.id, ...values })
      toast.success("Account updated successfully")
      onClose()
    } catch (err) {
      toast.error("Failed to update account")
    }
  }

  return (
    <Dialog open={account != null} onOpenChange={() => onClose()}>
      {account && (
        <AccountForm
          title="Update Account"
          account={account}
          onSave={onSubmit}
        ></AccountForm>
      )}
    </Dialog>
  )
}
