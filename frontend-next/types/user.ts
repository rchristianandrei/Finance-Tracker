export type UserStatus = 1 | 2

export type User = {
  id: number
  isAdmin: boolean
  status: UserStatus
  firstName: string
  lastName: string
  createdAt: Date
}
