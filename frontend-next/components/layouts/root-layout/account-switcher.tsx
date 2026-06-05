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
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAccount } from "@/providers/account-provider"

export function AccountSwitcher() {
  const { isMobile } = useSidebar()
  const { accounts, selectedAccount } = useAccount()

  return (
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
            {accounts.map((account, index) => (
              <DropdownMenuItem
                key={account.name}
                onClick={() => {
                  console.log("Select Account")
                }}
                className="gap-2 p-2"
              >
                <Avatar className="flex size-6 items-center justify-center">
                  <AvatarFallback className="rounded-lg">
                    {account.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {account.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <PlusIcon className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">
                Add Account
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
