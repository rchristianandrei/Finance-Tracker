"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"
import { Edit, Trash, Users } from "lucide-react"
import { useManageUsers } from "../providers/manage-users-provider"

export function UsersList() {
  const { users } = useManageUsers()

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="grid grid-cols-[1fr_auto]">
                  <div>
                    <span
                      className={cn(
                        "text-muted-foreground",
                        user.status === 1 ? "text-yellow-500" : "text-green-500"
                      )}
                    >
                      {user.status === 1 ? "PENDING" : "ACTIVE"}
                    </span>

                    <span className="block cursor-help truncate">
                      {user.lastName}, {user.firstName}
                    </span>
                  </div>
                  <div className="flex flex-col text-right text-muted-foreground">
                    <span>{user.createdAt.toDateString()}</span>
                    <span>
                      {user.createdAt.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem>
                  <Edit />
                  Edit
                </ContextMenuItem>

                <ContextMenuItem className="text-destructive">
                  <Trash /> Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
