"use client"

import axios from "axios"
import { toast } from "sonner"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import { useState } from "react"
import { AccountForm } from "./account-form"
import { AccountFormValues } from "@/lib/validations/account"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import { useAccount } from "@/providers/account-provider"

export function CreateAccountDialog({
  isInitiallyOpen,
  onClose,
}: {
  isInitiallyOpen?: boolean
  onClose?: () => void
}) {
  const { createAccount } = useAccount()
  const [isOpen, setIsOpen] = useState(isInitiallyOpen ?? false)
  const [errorMessage, setErrorMessage] = useState("")

  function onOpenDialogChange(open: boolean) {
    setIsOpen(open)
    if (open) return
    setErrorMessage("")
    onClose?.()
  }

  async function onSubmit(values: AccountFormValues) {
    setErrorMessage("")
    try {
      await createAccount({
        name: values.name,
        initialBalance: values.initialBalance,
      })
      toast.success("Account created successfully")
      onClose?.()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data ?? err.message
        setErrorMessage(message)
      }
      throw err
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus /> <span className="hidden md:inline">Create New Account</span>
        </Button>
      </DialogTrigger>
      <AccountForm
        title="Create Account"
        errorMessage={errorMessage}
        onSave={onSubmit}
      />
    </Dialog>
  )
}
