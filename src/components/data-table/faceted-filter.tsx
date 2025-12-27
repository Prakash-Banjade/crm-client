import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, PlusCircle } from "lucide-react";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

interface Option {
    label: string;
    value: string;
    count?: number;
}

interface FacetedFilterProps {
    title: string;
    searchKey: string;
    options: Option[];
    externalSelectedValue?: string[];
    setExternalSelectedValue?: (selectedValue: string[]) => void;
    popoverAlign?: "start" | "end";
}

export function FacetedFilter({
    title,
    searchKey,
    options,
    externalSelectedValue,
    setExternalSelectedValue,
    popoverAlign = "start",
}: FacetedFilterProps) {
    // Use external state if provided, else fall back to URL search params
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const [internalSelectedValue, setInternalSelectedValue] = useState<string[]>(
        searchParams.get(searchKey)?.split(",") ?? []
    );

    // Decide which selected value to use
    const selectedValue = externalSelectedValue ?? internalSelectedValue;

    const selectedValues = new Set(
        options.filter((option) => selectedValue.includes(option.value)).map((option) => option.value)
    );

    const handleSelectValue = (value: string) => {
        const newSelectedValue = selectedValue.includes(value)
            ? selectedValue.filter((item) => item !== value)
            : [...selectedValue, value];

        // Update based on available state management
        if (setExternalSelectedValue) {
            setExternalSelectedValue(newSelectedValue);
        } else {
            setInternalSelectedValue(newSelectedValue);
            setSearchParams(searchKey, newSelectedValue.join(","));
        }
    };

    const clearFilters = () => {
        if (setExternalSelectedValue) {
            setExternalSelectedValue([]);
        } else {
            setInternalSelectedValue([]);
            setSearchParams(searchKey, undefined);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="border-dashed">
                    <PlusCircle className="mr-2 size-4" />
                    {title}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option, ind) => (
                                            <Badge
                                                variant="secondary"
                                                key={ind}
                                                className="rounded-sm px-1 font-normal capitalize"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0" align={popoverAlign}>
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList className="max-h-full">
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-75 overflow-y-auto overflow-x-hidden">
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value);

                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => handleSelectValue(option.value)}
                                    >
                                        <div
                                            className={cn(
                                                "mr-2 flex size-4 items-center justify-center rounded-sm border border-primary",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "opacity-50 [&_svg]:invisible"
                                            )}
                                        >
                                            <CheckIcon className="size-4" aria-hidden="true" />
                                        </div>
                                        <span className="capitalize">{option.label}</span>
                                        {(option.count || option.count === 0) && (
                                            <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                                                {option.count}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={clearFilters}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}