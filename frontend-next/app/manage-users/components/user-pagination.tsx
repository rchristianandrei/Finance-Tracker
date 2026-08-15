"use client"

import { Pagination } from "@/components/filters/pagination"
import { useManageUsers } from "../providers/manage-users-provider"
import { useUserFilter } from "../providers/user-filter-provider"
import { pageSize } from "@/lib/pageSize"

export function UserPagination() {
  const { currentPage, goToPage } = useUserFilter()
  const { users, totalUsers } = useManageUsers()

  const hasNoItems = users.length <= 0 ? 0 : 1
  const fromItem = (currentPage - 1) * pageSize + hasNoItems
  const toItem = fromItem + users.length - hasNoItems
  const disabledNext = currentPage * pageSize >= totalUsers

  return (
    <div className="sticky bottom-0 flex items-center justify-center">
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
    </div>
  )
}
