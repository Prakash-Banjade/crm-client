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
import { QueryKey } from "@/lib/react-query/queryKeys"
import { EGradingSystem, ELevelOfEducation } from "@/lib/types/student.types"

type TStudentWithQualification = {
    id: string,
    fullName: string,
    levelOfStudies: {
        [value in ELevelOfEducation]?: {
            score: number,
            gradingSystem: EGradingSystem
        }
    }
}

interface StudentsWithQualificationSearchProps {
    placeholder?: string
    className?: string
    queryString?: string;
    onSelect?: (option: TStudentWithQualification) => void
}


export function StudentsWithQualificationSearch({
    placeholder = "Select options...",
    className,
    onSelect,
}: StudentsWithQualificationSearchProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [selected, setSelected] = React.useState<TStudentWithQualification | null>(null);

    const debouncedSearch = useDebounce(search, 500);

    const {
        options,
        totalCount,
        error,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
        isFetchingNextPage,
        refetch,
    } = useInfiniteOptions<TStudentWithQualification>(
        `${QueryKey.STUDENTS}/with-qualification`,
        createQueryString({
            q: debouncedSearch,
        }),
    );

    const observerRef = React.useRef<HTMLDivElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    // Handle selection changes
    const handleSelect = React.useCallback(
        (option: TStudentWithQualification) => {
            setSelected(option);
            onSelect?.(option);
            setOpen(false);
        },
        [selected]
    );

    const handleScroll = React.useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
            // when we're within 20px of the bottom…
            if (
                scrollHeight - scrollTop - clientHeight < 20 &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={isLoading}
                        aria-disabled={isLoading}
                        className="w-full justify-between bg-transparent"
                    >
                        <div className="flex flex-wrap gap-1 flex-1">
                            {(!selected || !selected.fullName) ? (
                                <span className="text-muted-foreground">{placeholder}</span>
                            ) : (
                                <span>{selected.fullName}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-(--radix-popover-trigger-width) p-0" align="start">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Search options..."
                            value={search}
                            onValueChange={setSearch}
                        />
                        <CommandList
                            ref={listRef}
                            onScroll={handleScroll}
                            className="max-h-64 overflow-auto"
                        >
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
                                            {debouncedSearch
                                                ? `No options found for "${debouncedSearch}"`
                                                : "No options found."}
                                        </CommandEmpty>
                                    ) : (
                                        <CommandGroup>
                                            {options.map((option) => (
                                                <CommandItem
                                                    key={option.id}
                                                    value={option.id}
                                                    onSelect={() => handleSelect(option)}
                                                    className="cursor-pointer px-3 flex items-center justify-between"
                                                >
                                                    <span className="truncate">{option.fullName}</span>
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selected?.id === option.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
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
    );
}

