"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
    value: string
    onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    const handlePresetColor = (color: string) => {
        onChange(color)
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
                >
                    <div className="flex items-center gap-2 w-full">
                        <div
                            className="h-6 w-6 border border-border"
                            style={{ backgroundColor: value }}
                            aria-label={`Color: ${value}`}
                        />
                        <span className="flex-1 text-foreground">{value}</span>
                    </div>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-4" align="start">
                <div className="space-y-4">
                    {/* Interactive Color Picker */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Custom Color</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="color"
                                value={value}
                                onChange={handleColorChange}
                                className="h-10 w-16 rounded cursor-pointer border border-border"
                                aria-label="Color picker input"
                            />
                            <Input
                                type="text"
                                value={value}
                                onChange={handleColorChange}
                                placeholder="#000000"
                                className="flex-1 font-mono text-sm"
                                maxLength={7}
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
