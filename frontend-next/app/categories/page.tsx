import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"
import { ManageCategoriesProvider } from "./providers/manage-category-provider"
import { CategoryList } from "./components/category-list"
import { CategoryFilter } from "./components/category-filter"
import { ManageCategoryFilterProvider } from "./providers/manage-category-filter"

export const metadata = {
  title: "Categories",
}

export default function Page() {
  return (
    <PrivateRoute>
      <RootLayout>
        <ManageCategoryFilterProvider>
          <ManageCategoriesProvider>
            <div className="flex flex-col gap-4">
              <CategoryFilter />
              <CategoryList />
            </div>
          </ManageCategoriesProvider>
        </ManageCategoryFilterProvider>
      </RootLayout>
    </PrivateRoute>
  )
}
