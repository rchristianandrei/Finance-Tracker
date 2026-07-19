"use client"

import { userApi } from "@/api/users"
import { Pagination } from "@/components/filters/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"
import { User } from "@/types/user"
import { Edit, Trash, Users } from "lucide-react"
import { useEffect, useState } from "react"

export function UsersList() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const response = await userApi.readUsers()
        setUsers(response)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users />
            <CardTitle>Users</CardTitle>
          </div>
          {/* <Pagination /> */}
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                          user.status === 1
                            ? "text-yellow-500"
                            : "text-green-500"
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
      </CardContent>
    </Card>
  )
}
