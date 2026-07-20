"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { toast } from "sonner"
import { User } from "@/types/user"
import { userApi } from "@/api/users"
import axios from "axios"
import { useUserFilter } from "./user-filter-provider"

interface ManageUsersContextType {
  users: User[]
  totalUsers: number
}

const ManageUsersContext = createContext<ManageUsersContextType | undefined>(
  undefined
)

export function ManageUsersProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { search, currentPage } = useUserFilter()

  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)

  const getUsers = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await userApi.readUsers(
          { search: search, page: currentPage },
          signal
        )
        setUsers(response.data)
        setTotalUsers(response.totalCount)
      } catch (error) {
        if (axios.isCancel(error)) return
        console.log(error)
        toast.error("Unable to load users")
      }
    },
    [search, currentPage]
  )

  useEffect(() => {
    const abortController = new AbortController()
    getUsers(abortController.signal)

    return () => {
      abortController.abort()
    }
  }, [getUsers])

  return (
    <ManageUsersContext.Provider value={{ users, totalUsers }}>
      {children}
    </ManageUsersContext.Provider>
  )
}

export function useManageUsers() {
  const context = useContext(ManageUsersContext)

  if (!context) {
    throw new Error("useManageUsers must be used within an ManageUsersProvider")
  }

  return context
}
