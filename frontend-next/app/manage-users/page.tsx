import { AdminRoute } from "@/components/guards/AdminRoute"
import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { Filters } from "./components/filters"
import { UsersList } from "./components/users-list"
import { ManageUsersProvider } from "./providers/manage-users-provider"
import { UserFilterProvider } from "./providers/user-filter-provider"
import { Suspense } from "react"

export default () => {
  return (
    <PrivateRoute>
      <AdminRoute>
        <RootLayout>
          <Suspense fallback={null}>
            <UserFilterProvider>
              <ManageUsersProvider>
                <div className="flex flex-col gap-4">
                  <Filters />
                  <UsersList />
                </div>
              </ManageUsersProvider>
            </UserFilterProvider>
          </Suspense>
        </RootLayout>
      </AdminRoute>
    </PrivateRoute>
  )
}
