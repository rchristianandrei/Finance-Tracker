import { AdminRoute } from "@/components/guards/AdminRoute"
import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { Filters } from "./components/filters"
import { UsersList } from "./components/users-list"

export default () => {
  return (
    <PrivateRoute>
      <AdminRoute>
        <RootLayout>
          <div className="flex flex-col gap-4">
            {/* <Filters /> */}
            <UsersList />
          </div>
        </RootLayout>
      </AdminRoute>
    </PrivateRoute>
  )
}
