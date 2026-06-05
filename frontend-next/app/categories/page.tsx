import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { Categories } from "./categories"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { ManageCategoriesProvider } from "./providers/manage-category-provider"
import { UpdateCategoryDialog } from "./components/update-category-dialog"

export default function Page() {
  return (
    <PrivateRoute>
      <RootLayout>
        <ManageCategoriesProvider>
          <Categories />
          <UpdateCategoryDialog />
        </ManageCategoriesProvider>
      </RootLayout>
    </PrivateRoute>
  )
}
