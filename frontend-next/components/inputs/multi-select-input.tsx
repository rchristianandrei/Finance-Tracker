import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMemo } from "react"

export function MultiSelectInput({
  displayText,
  choices,
  selected,
  onSelectedValueChange,
}: {
  displayText: string
  choices: { key: string; value: string }[]
  selected: string[]
  onSelectedValueChange?: (selected: string[]) => void
}) {
  const allSelected = useMemo(
    () => selected.length === choices.length || selected.length === 0,
    [choices, selected]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-auto justify-start truncate font-normal"
        >
          {`${displayText}: `}
          {allSelected
            ? "All"
            : selected.length === 1
              ? choices.find((c) => c.key === selected[0])?.value
              : selected.length}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-55 p-2"
        style={{
          maxHeight: "var(--radix-popover-content-available-height)",
        }}
      >
        {/* Fixed */}
        <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={() => {
              if (allSelected) return
              onSelectedValueChange?.([])
            }}
            className="accent-primary"
          />
          {displayText}
        </label>

        <div className="my-1 border-t" />

        {/* Scrollable */}
        <div className="overflow-y-auto">
          <div className="flex flex-col gap-1">
            {choices.map((choice, index) => (
              <label
                key={index}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(choice.key)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const current = [...selected, choice.key]
                      onSelectedValueChange?.(
                        current.length === choices.length ? [] : current
                      )
                    } else {
                      onSelectedValueChange?.(
                        selected.filter((s) => s !== choice.key)
                      )
                    }
                  }}
                  className="accent-primary"
                />

                <span className="truncate">{choice.value}</span>
              </label>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
