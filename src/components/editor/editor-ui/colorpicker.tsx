import * as React from "react"
import { HexColorPicker } from "react-colorful"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PRESET_COLORS } from "./colors-config"

type Props = {
  disabled?: boolean
  icon?: React.ReactNode
  label?: string
  title?: string
  stopCloseOnClickSelf?: boolean
  color: string
  onChange?: (color: string, skipHistoryStack: boolean) => void
}

export default function ColorPicker({
  disabled = false,
  color,
  onChange,
  icon,
  label,
  ...rest
}: Props) {
  return (
    <Popover modal={true}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          type="button"
          aria-label={label}
          size={"icon"}
          className="!h-8 !w-8"
          variant={"outline"}
          {...rest}
        >
          <span className="size-4 rounded-full">{icon}</span>
          {/* <ChevronDownIcon className='size-4'/> */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <HexColorPicker
          color={color}
          onChange={(color) => onChange?.(color, false)}
        />
        <Input
          maxLength={7}
          onChange={(e) => {
            e.stopPropagation()
            onChange?.(e?.currentTarget?.value, false)
          }}
          value={color}
        />
        <section className="flex p-1 gap-1 flex-wrap">
          {
            PRESET_COLORS.map(({ name, value }) => (
              <button
                key={value}
                type="button"
                title={name}
                className="size-7 rounded-md border shadow-sm"
                style={{ backgroundColor: value }}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange?.(value, false)
                }}
              />
            ))
          }
        </section>
      </PopoverContent>
    </Popover>
  )
}
