import { AppSidebar } from "@/components/layouts/root-layout/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DynamicBreadcrumb } from "./DynamicBreadcrumb"
import { CreateTransactionDialog } from "@/components/create-transaction-dialog"

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false} className="h-screen">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <DynamicBreadcrumb />
          </div>
          <CreateTransactionDialog />
        </header>
        <div className="flex-1 overflow-auto p-4">
          <div className="min-h-full md:h-full">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
