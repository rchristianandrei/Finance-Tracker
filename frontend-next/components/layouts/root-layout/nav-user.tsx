"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/providers/auth-provider"
import { ChevronsUpDownIcon, LogOutIcon } from "lucide-react"
import { useMemo, useState } from "react"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout } = useAuth()

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const fallbackName = useMemo(() => {
    if (!user) return null
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
  }, [user])

  const onClickLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {user && (
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback>{fallbackName}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="truncate text-xs">{user.id}</span>
                </div>
                <ChevronsUpDownIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-fit"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              {user && (
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {fallbackName}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="truncate text-xs">{user.id}</span>
                  </div>
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClickLogout}>
              <LogOutIcon />
              Log out {isLoggingOut && <Spinner />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
