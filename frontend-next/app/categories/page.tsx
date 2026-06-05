import { PrivateRoute } from "@/components/guards/PrivateRoute"
import { Categories } from "./categories"
import { RootLayout } from "@/components/layouts/root-layout/root-layout"

export default function Page() {
  return (
    <PrivateRoute>
      <RootLayout>
        <Categories />
      </RootLayout>
    </PrivateRoute>
  )
}
