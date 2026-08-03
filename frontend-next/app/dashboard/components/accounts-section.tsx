"use client"

import { CreateAccountDialog } from "@/components/account/create-account-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { formatMoney } from "@/lib/format-money"
import { cn } from "@/lib/utils"
import { useAccount } from "@/providers/account-provider"
import { Account } from "@/types/account"
import { ArrowUpDownIcon, Edit, Trash } from "lucide-react"
import { useState } from "react"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { UpdateAccountDialog } from "./update-account-dialog"
import { TransferBalanceDialog } from "./accounts/transfer-balance-dialog"

export function AccountsSection() {
  const { accounts } = useAccount()
  const [transferBalanceEvent, setTransferBalanceEvent] =
    useState<Account | null>(null)
  const [updateAccountEvent, setUpdateAccountEvent] = useState<Account | null>(
    null
  )
  const [deleteAccountEvent, setDeleteAccountEvent] = useState<Account | null>(
    null
  )

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 md:justify-between">
          <CardTitle>Accounts</CardTitle>
          <CreateAccountDialog />
        </div>
        <div className="grid-cols-3-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <ContextMenu key={account.id}>
              <ContextMenuTrigger asChild>
                <Card key={account.id} className="gap-1">
                  <CardHeader>
                    <CardTitle>{account.name}</CardTitle>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      "text-xl font-bold",
                      account.balance >= 0
                        ? "text-green-600"
                        : "text-destructive"
                    )}
                  >
                    {formatMoney(Math.abs(account.balance))}
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() => setTransferBalanceEvent(account)}
                >
                  <ArrowUpDownIcon />
                  Transfer Balance
                </ContextMenuItem>
                <ContextMenuItem onClick={() => setUpdateAccountEvent(account)}>
                  <Edit />
                  Edit
                </ContextMenuItem>

                <ContextMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteAccountEvent(account)}
                >
                  <Trash /> Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
      {transferBalanceEvent && (
        <TransferBalanceDialog
          account={transferBalanceEvent}
          onClose={() => setTransferBalanceEvent(null)}
        />
      )}
      {updateAccountEvent && (
        <UpdateAccountDialog
          account={updateAccountEvent}
          onClose={() => setUpdateAccountEvent(null)}
        />
      )}
      {deleteAccountEvent && (
        <DeleteAccountDialog
          account={deleteAccountEvent}
          onClose={() => setDeleteAccountEvent(null)}
        />
      )}
    </>
  )
}
