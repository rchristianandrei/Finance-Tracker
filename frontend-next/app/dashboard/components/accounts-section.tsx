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
import { Edit, Trash } from "lucide-react"
import { useState } from "react"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { UpdateAccountDialog } from "./update-account-dialog"

export function AccountsSection() {
  const { accounts } = useAccount()
  const [updateAccountEvent, setUpdateAccountEvent] = useState<Account | null>(
    null
  )
  const [deleteAccountEvent, setDeleteAccountEvent] = useState<Account | null>(
    null
  )

  return (
    <>
      <Card>
        <CardHeader className="flex items-center justify-between gap-2">
          <CardTitle>Accounts</CardTitle>
          <CreateAccountDialog />
        </CardHeader>
        <CardContent className="grid-cols-3-1 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <ContextMenu key={account.id}>
              <ContextMenuTrigger asChild>
                <Card key={account.id} className="gap-1">
                  <CardHeader>
                    <CardTitle>{account.name}</CardTitle>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      "text-2xl",
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
        </CardContent>
      </Card>
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
