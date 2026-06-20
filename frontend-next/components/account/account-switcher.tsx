"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Check, ChevronsUpDownIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAccount } from "@/providers/account-provider"
import { CreateAccountDialog } from "./create-account-dialog"
import { UpdateAccountDialog } from "./update-account-dialog"
import { useState } from "react"
import { Account } from "@/types/account"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Badge } from "@/components/ui/badge"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { toast } from "sonner"

export function AccountSwitcher() {
  const { isMobile } = useSidebar()
  const { accounts, defaultAccount, selectedAccount, setSelectedAccount } =
    useAccount()
  const [updateAccount, setUpdateAccount] = useState<Account | null>(null)
  const [deleteAccount, setDeleteAccount] = useState<Account | null>(null)

  const onDeleteAccount = (account: Account) => {
    if (defaultAccount?.id === account.id) {
      toast.error("Cannot delete the default account")
      return
    }
    setDeleteAccount(account)
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {selectedAccount && (
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
                    <AvatarFallback>
                      {selectedAccount.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {selectedAccount.name}
                    </span>
                  </div>
                  <ChevronsUpDownIcon className="ml-auto" />
                </SidebarMenuButton>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-fit"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Accounts
              </DropdownMenuLabel>
              {accounts.map((account) => (
                <ContextMenu key={account.id}>
                  <ContextMenuTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedAccount(account.id)
                      }}
                      className="gap-2 p-2"
                    >
                      <Avatar className="flex size-6 items-center justify-center">
                        <AvatarFallback className="rounded-lg">
                          {account.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span>{account.name}</span>

                        {account.id === defaultAccount?.id && (
                          <Badge variant="default" className="h-4 text-[10px]">
                            Default
                          </Badge>
                        )}
                      </div>

                      {account.id === selectedAccount?.id && <Check />}
                    </DropdownMenuItem>
                  </ContextMenuTrigger>

                  <ContextMenuContent>
                    <ContextMenuItem onClick={() => setUpdateAccount(account)}>
                      Edit
                    </ContextMenuItem>

                    <ContextMenuItem
                      className="text-destructive"
                      onClick={() => {
                        onDeleteAccount(account)
                      }}
                    >
                      Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
              <DropdownMenuSeparator />
              <CreateAccountDialog />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      {updateAccount && (
        <UpdateAccountDialog
          account={updateAccount}
          onClose={() => {
            setUpdateAccount(null)
          }}
        />
      )}
      {deleteAccount && (
        <DeleteAccountDialog
          account={deleteAccount}
          onClose={() => setDeleteAccount(null)}
        />
      )}
    </>
  )
}
