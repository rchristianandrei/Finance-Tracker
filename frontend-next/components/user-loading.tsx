"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, Clock } from "lucide-react"

export function UserLoading() {
  const [elapsed, setElapsed] = useState(0)
  const [dots, setDots] = useState("")

  // Reset when loading starts/stops
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Animated dots
  useEffect(() => {
    const d = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(d)
  }, [])

  return (
    <div className="flex min-h-50 flex-col items-center justify-center gap-5 p-6">
      {/* Spinner + icon */}
      <div className="relative flex h-14 w-14 items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full animate-spin text-muted-foreground/30"
          viewBox="0 0 56 56"
          fill="none"
        >
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <svg
          className="absolute inset-0 h-full w-full animate-spin text-primary"
          style={{ animationDuration: "1.2s" }}
          viewBox="0 0 56 56"
          fill="none"
        >
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="150"
            strokeDashoffset="110"
            strokeLinecap="round"
          />
        </svg>
        <Wifi className="h-5 w-5 text-primary transition-colors duration-700" />
      </div>

      <div className="space-y-1 text-center">
        <p className="text-sm font-semibold tracking-tight">
          Connecting
          <span className="font-normal text-muted-foreground">{dots}</span>
        </p>
        <p className="max-w-65 text-xs text-muted-foreground">
          Reaching the server…
        </p>
      </div>

      {/* Elapsed badge */}
      {elapsed > 0 && (
        <Badge
          variant="secondary"
          className="gap-1 font-mono text-xs tabular-nums"
        >
          <Clock className="h-3 w-3" />
          {elapsed}s
        </Badge>
      )}
    </div>
  )
}
