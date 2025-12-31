import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useFetch } from "@/hooks/useFetch";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { AlertCircle, Check, ChevronsUpDown, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";

type Props = {
    value?: string;
    onValueChange: (value: string) => void;
    className?: string;
    countryId: string
}

export default function StatesSelect({ value, onValueChange, className, countryId }: Props) {
    const [open, setOpen] = useState(false);

    const { data, isLoading, error, refetch, isFetching } = useFetch<{ states: string[] }>({
        endpoint: `${QueryKey.COUNTRIES}/states/${countryId}`,
        queryKey: [QueryKey.COUNTRIES, QueryKey.OPTIONS, countryId],
        options: {
            enabled: !!countryId,
        }
    });

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-transparent"
                        disabled={isLoading || isFetching}
                    >
                        <div className="flex flex-wrap gap-1 flex-1">
                            {!value ? (
                                <span className="text-muted-foreground">Select State</span>
                            ) : (
                                <span>{value}</span>
                            )}
                        </div>
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Search states..." />
                        <CommandList className="max-h-64 overflow-auto">
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
                                    {data?.states.length === 0 && !isLoading && !isFetching ? (
                                        <CommandEmpty>
                                            No states found.
                                        </CommandEmpty>
                                    ) : (
                                        <CommandGroup>
                                            {data?.states.map((option) => (
                                                <CommandItem
                                                    key={option}
                                                    value={option}
                                                    onSelect={() => {
                                                        onValueChange(option)
                                                        setOpen(false);
                                                    }}
                                                    className="cursor-pointer px-3 flex items-center justify-between"
                                                >
                                                    {option}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            value === option ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
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