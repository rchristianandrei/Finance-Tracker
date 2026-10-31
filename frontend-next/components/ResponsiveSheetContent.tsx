import { SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

export function ResponsiveSheetContent({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()
  return (
    <SheetContent
      side={isMobile ? "bottom" : "right"}
      className={
        isMobile
          ? "flex h-[90dvh] max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-t-2xl px-4 pb-[env(safe-area-inset-bottom)]"
          : "flex w-full flex-col gap-0 overflow-hidden px-6 sm:max-w-sm"
      }
    >
      {children}
    </SheetContent>
  )
}
