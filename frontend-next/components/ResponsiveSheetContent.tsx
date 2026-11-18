"use client"

import { SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function ResponsiveSheetContent({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  return (
    <SheetContent
      side={isMobile ? "bottom" : "right"}
      className={cn(
        "flex w-full flex-col gap-0 overflow-auto px-6 sm:max-w-sm",
        isMobile
          ? "h-[90dvh] max-h-[90dvh] rounded-t-2xl px-4 pb-[env(safe-area-inset-bottom)]"
          : ""
      )}
    >
      {children}
    </SheetContent>
  )
}
