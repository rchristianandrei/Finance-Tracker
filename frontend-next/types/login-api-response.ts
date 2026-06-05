import { User } from "./user"

export type LoginApiResponse =
  | {
      status: 1
      message: string
    }
  | {
      status: 2
      user: User
    }
