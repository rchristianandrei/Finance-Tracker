"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"

import { PlusIcon } from "lucide-react"

import { toast } from "sonner"
import { AccountForm } from "@/components/account/account-form"
import { AccountFormValues } from "@/lib/validations/account"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { useState } from "react"
import { useAccount } from "@/providers/account-provider"

export function CreateAccountDialog() {
  const { accounts, createAccount } = useAccount()
  const [open, setOpen] = useState(false)

  async function onSubmit(values: AccountFormValues) {
    try {
      createAccount(values)
      setOpen(false)
      toast.success("Account created successfully")
    } catch (err) {
      toast.error("Failed to create account")
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value && accounts.length >= 5) {
          toast.error("You already reached max of 5 accounts")
          return
        }
        setOpen(value)
      }}
    >
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="gap-2 p-2"
          onSelect={(e) => {
            e.preventDefault()
          }}
        >
          <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
            <PlusIcon className="size-4" />
          </div>
          <div className="font-medium text-muted-foreground">Add Account</div>
        </DropdownMenuItem>
      </DialogTrigger>

      <AccountForm title="Create Account" onSave={onSubmit} />
    </Dialog>
  )
}
