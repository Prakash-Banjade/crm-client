"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { cn, createQueryString } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useDebounce } from "@/hooks/useDebounce"
import { SelectOption } from "@/lib/types"
import { useInfiniteOptions } from "@/hooks/useInfiniteOptions"

interface InfiniteMultiSelectProps {
    endpoint: string
    placeholder?: string
    selected?: SelectOption[]
    onSelectionChange?: (values: SelectOption[]) => void
    className?: string
    limit?: number
}

export function InfiniteMultiSelect({
    endpoint,
    placeholder = "Select options...",
    selected = [],
    onSelectionChange,
    className,
    limit = 10,
}: InfiniteMultiSelectProps) {
    const [open, setOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")

    const debouncedSearch = useDebounce(search, 500)

    const { options, totalCount, error, fetchNextPage, hasNextPage, isLoading, isFetching, isFetchingNextPage, refetch } =
        useInfiniteOptions(endpoint, createQueryString({
            take: limit.toString(),
            q: debouncedSearch
        }))

    const observerRef = React.useRef<HTMLDivElement>(null)
    const listRef = React.useRef<HTMLDivElement>(null)

    // Handle selection changes
    const handleSelect = React.useCallback(
        (option: SelectOption) => {
            const newSelected = selected.some(item => item.value === option.value) ? selected.filter((item) => item.value !== option.value) : [...selected, option]
            onSelectionChange?.(newSelected)
        },
        [selected, onSelectionChange],
    )

    // Handle removing selected items
    const handleRemove = React.useCallback(
        (value: string) => {
            const newSelected = selected.filter((item) => item.value !== value)
            onSelectionChange?.(newSelected)
        },
        [selected, onSelectionChange],
    )

    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
            // when we're within 20px of the bottom…
            if (
                scrollHeight - scrollTop - clientHeight < 20 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage()
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    )

    // Get selected option labels for display
    const selectedOptions = React.useMemo(() => {
        return options.filter((option) => selected.some((item) => item.value === option.value)).reverse();
    }, [options, selected]);

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between min-h-10 h-auto bg-transparent"
                    >
                        <div className="flex flex-wrap gap-1 flex-1">
                            {selected.length === 0 ? (
                                <span className="text-muted-foreground">{placeholder}</span>
                            ) : (
                                <>
                                    {selectedOptions.slice(0, 2).map((option) => (
                                        <Badge key={option.value} variant="secondary" className="text-xs">
                                            <span className="max-w-[20ch] truncate">{option.label}</span>
                                            <div
                                                role="button"
                                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleRemove(option.value)
                                                    }
                                                }}
                                                onMouseDown={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                }}
                                                onClick={() => handleRemove(option.value)}
                                            >
                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                            </div>
                                        </Badge>
                                    ))}
                                    {selected.length > 2 && (
                                        <Badge variant="secondary" className="text-xs">
                                            +{selected.length - 2} more
                                        </Badge>
                                    )}
                                </>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput placeholder="Search options..." value={search} onValueChange={setSearch} />
                        <CommandList ref={listRef} onScroll={handleScroll} className="max-h-64 overflow-auto">
                            {error ? (
                                <Alert className="m-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-sm flex items-center justify-between">
                                        <span>{error.message}</span>
                                        <Button variant="ghost" size="sm" onClick={() => refetch()}>
                                            <RefreshCw className="h-3 w-3" />
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <>
                                    {options.length === 0 && !isLoading && !isFetching ? (
                                        <CommandEmpty>
                                            {debouncedSearch ? `No options found for "${debouncedSearch}"` : "No options found."}
                                        </CommandEmpty>
                                    ) : (
                                        <CommandGroup>
                                            {options.map((option) => (
                                                <CommandItem
                                                    key={option.value}
                                                    value={option.value}
                                                    onSelect={() => handleSelect(option)}
                                                    className="cursor-pointer px-3 flex items-center justify-between"
                                                >
                                                    <span className="truncate">{option.label}</span>
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selected.some((item) => item.value === option.value) ? "opacity-100" : "opacity-0",
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}

                                            {/* Intersection observer target */}
                                            {hasNextPage && <div ref={observerRef} className="h-4" />}

                                            {/* Loading indicators */}
                                            {(isLoading || isFetchingNextPage) && (
                                                <div className="flex items-center justify-center p-4">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span className="ml-2 text-sm text-muted-foreground">
                                                        {isLoading ? "Loading..." : "Loading more..."}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Show total count */}
                                            {options.length > 0 && !hasNextPage && (
                                                <div className="p-2 text-xs text-muted-foreground text-center border-t">
                                                    Showing {options.length} of {totalCount} options
                                                </div>
                                            )}
                                        </CommandGroup>
                                    )}
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
