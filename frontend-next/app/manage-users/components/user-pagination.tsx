"use client"

import { Pagination } from "@/components/filters/pagination"
import { useManageUsers } from "../providers/manage-users-provider"
import { useUserFilter } from "../providers/user-filter-provider"

export function UserPagination() {
  const { currentPage, goToPage } = useUserFilter()
  const { users, totalUsers } = useManageUsers()

  const hasNoItems = users.length <= 0 ? 0 : 1
  const fromItem = (currentPage - 1) * 10 + hasNoItems
  const toItem = fromItem + users.length - hasNoItems
  const disabledNext = currentPage * 10 >= totalUsers

  return (
    <Pagination
      currentPage={currentPage}
      display={`${fromItem} - ${toItem} of ${totalUsers}`}
      disableNext={disabledNext}
      disablePrev={currentPage <= 1}
      onNext={() => {
        goToPage(currentPage + 1)
      }}
      onPrev={() => {
        goToPage(currentPage - 1)
      }}
    />
  )
}
