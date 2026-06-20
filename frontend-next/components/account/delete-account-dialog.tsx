"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import axios from "axios"
import { FieldError } from "@/components/ui/field"
import { Account } from "@/types/account"
import { useAccount } from "@/providers/account-provider"
import { toast } from "sonner"

export function DeleteAccountDialog({
  account,
  onClose,
}: {
  account?: Account
  onClose: () => void
}) {
  const { deleteAccount } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onConfirm = async () => {
    if (!account) return

    setIsLoading(true)
    try {
      await deleteAccount(account?.id)
      toast.success("Account successfully deleted!")
      onClose()
    } catch (error) {
      setErrorMessage("Unable to delete the account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={account !== null}>
      {account && (
        <TooltipProvider>
          <AlertDialogContent className="w-[95vw] max-w-xl!">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account</AlertDialogTitle>

              <AlertDialogDescription>
                Are you sure you want to delete this account? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-3 rounded-md border p-4 text-sm">
              <div className="flex flex-wrap justify-between">
                <span className="font-medium">Name</span>

                <Tooltip>
                  <TooltipTrigger className="max-w-50 truncate">
                    {account.name}
                  </TooltipTrigger>
                  <TooltipContent>{account.name}</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {errorMessage && (
              <FieldError className="text-center">{errorMessage}</FieldError>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isLoading} onClick={onClose}>
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault()
                  onConfirm()
                }}
                className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </TooltipProvider>
      )}
    </AlertDialog>
  )
}
