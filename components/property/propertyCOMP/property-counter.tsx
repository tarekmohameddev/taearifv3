"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface PropertyCounterProps {
  label: string
  value: number | null | undefined
  onChange: (value: number) => void
}

export function PropertyCounter({ label, value, onChange }: PropertyCounterProps) {
  const increment = () => {
    const currentValue = value ?? 0
    onChange((Number(currentValue) + 1))
  }

  const decrement = () => {
    const currentValue = value ?? 0
    onChange(currentValue > 0 ? Number(currentValue - 1) : 0)
  }

  return (
    <div className="flex border rounded-md overflow-hidden">
      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-none border-l" onClick={increment}>
        <Plus className="h-4 w-4" />
      </Button>
      <div className="flex-1 flex items-center justify-center px-3">
        {value == null ? (
          <span className="text-gray-500 text-xs text-center">{label}</span>
        ) : (
          <>
            <span className="text-gray-500 text-xs">{label}</span>
            <span className="font-medium ml-2">{value}</span>
          </>
        )}
      </div>
      <Button type="button" variant="ghost" size="icon" className="h-10 w-10 rounded-none border-r" onClick={decrement}>
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  )
}