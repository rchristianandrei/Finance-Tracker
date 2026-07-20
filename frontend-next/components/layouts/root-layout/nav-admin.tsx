"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/providers/auth-provider"
import { Users } from "lucide-react"
import Link from "next/link"

const items = [
  {
    title: "Manage Users",
    url: "/manage-users",
    icon: <Users />,
  },
]

export function NavAdmin() {
  const { user } = useAuth()
  if (!user || !user.isAdmin) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <Link href={item.url} prefetch={false}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
