"use client"

import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { useState } from "react"
import { Account } from "@/types/account"
import { AccountForm } from "@/components/account/account-form"
import { AccountFormValues } from "@/lib/validations/account"
import { useAccount } from "@/providers/account-provider"

export function UpdateAccountDialog({
  account,
  onClose,
}: {
  account: Account
  onClose: () => void
}) {
  const { updateAccount } = useAccount()
  const [isOpen, setIsOpen] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  async function onSubmit(values: AccountFormValues) {
    if (!account) return
    try {
      await updateAccount({
        accountId: account.id,
        name: values.name,
        initialBalance: values.initialBalance,
      })

      toast.success("Account updated successfully")
      onClose()
    } catch (err) {
      setErrorMessage("Failed to update account")
    }
  }

  return (
    <>
      <Dialog
        open={isOpen && account != null}
        onOpenChange={(value) => {
          setIsOpen(value)
          onClose()
        }}
      >
        {account && (
          <AccountForm
            title="Update Account"
            account={account}
            onSave={onSubmit}
            errorMessage={errorMessage}
          ></AccountForm>
        )}
      </Dialog>
    </>
  )
}
