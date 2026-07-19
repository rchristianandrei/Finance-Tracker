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
  const { currentPage } = useUserFilter()

  const [users, setUsers] = useState<User[]>([])
  const [totalUsers, setTotalUsers] = useState(0)

  useEffect(() => {
    const abortController = new AbortController()
    getUsers(abortController.signal)

    return () => {
      abortController.abort()
    }
  }, [currentPage])

  const getUsers = useCallback(
    async (signal?: AbortSignal) => {
      console.log("load user")
      try {
        const response = await userApi.readUsers({ page: currentPage }, signal)
        setUsers(response.data)
        setTotalUsers(response.totalCount)
      } catch (error) {
        if (axios.isCancel(error)) return
        console.log(error)
        toast.error("Unable to load users")
      }
    },
    [currentPage]
  )

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
