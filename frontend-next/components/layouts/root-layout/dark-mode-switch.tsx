import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function DarkModeSwitch() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <div onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      <Button variant="outline" aria-label="Toggle dark mode">
        {resolvedTheme === "light" && (
          <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        )}
        {resolvedTheme === "dark" && (
          <Moon className="h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
        )}
        <span className="">Toggle dark mode</span>
      </Button>
    </div>
  )
}
