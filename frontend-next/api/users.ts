import api from "@/lib/axios"
import { User } from "@/types/user"

export const userApi = {
  readUsers: async (
    filter?: {
      search?: string
      startDate?: Date
      endDate?: Date
      page?: number
      type?: number
      categories?: string[]
    },
    signal?: AbortSignal
  ) => {
    let params = new URLSearchParams()

    if (filter?.search) {
      params.set("Search", filter.search)
    }

    if (filter?.type) {
      params.set("TransactionType", filter.type.toString())
    }

    if (filter?.categories) {
      filter.categories.forEach((c) => params.append("Categories", c))
    }

    if (filter?.startDate) {
      params.set("StartDate", filter.startDate.toISOString())
    }

    if (filter?.endDate) {
      params.set("EndDate", filter.endDate.toISOString())
    }

    if (filter?.page) {
      params.set("Page", filter.page.toString())
    }

    const response = await api.get<{ data: User[]; totalCount: number }>(
      "user",
      { params, signal }
    )

    response.data.data = response.data.data.map((u) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    }))

    return response.data
  },
}
