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

export function AccountsSection() {
  const { accounts } = useAccount()
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
          {accounts.map((a) => (
            <ContextMenu key={a.id}>
              <ContextMenuTrigger asChild>
                <Card key={a.id} className="gap-1">
                  <CardHeader>
                    <CardTitle>{a.name}</CardTitle>
                  </CardHeader>
                  <CardContent
                    className={cn(
                      "text-2xl",
                      a.balance >= 0 ? "text-green-600" : "text-destructive"
                    )}
                  >
                    {formatMoney(Math.abs(a.balance))}
                  </CardContent>
                </Card>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>
                  <Edit />
                  Edit
                </ContextMenuItem>

                <ContextMenuItem
                  className="text-destructive"
                  onClick={() => setDeleteAccountEvent(a)}
                >
                  <Trash /> Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </CardContent>
      </Card>
      {deleteAccountEvent && (
        <DeleteAccountDialog
          account={deleteAccountEvent}
          onClose={() => setDeleteAccountEvent(null)}
        />
      )}
    </>
  )
}
