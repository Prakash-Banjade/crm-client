import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams"

export function DateRangeFilter({
    className,
}: React.HTMLAttributes<HTMLDivElement>) {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const { dateFrom, dateTo } = React.useMemo(() => {
        const dateFrom_search = searchParams.get('dateFrom')

        const dateFrom = dateFrom_search
            ? !isNaN(Date.parse(dateFrom_search))
                ? new Date(dateFrom_search)
                : undefined
            : undefined;

        const dateTo_search = searchParams.get('dateTo')

        const dateTo = dateTo_search
            ? !isNaN(Date.parse(dateTo_search))
                ? new Date(dateTo_search)
                : undefined
            : undefined;

        return {
            dateFrom,
            dateTo,
        }
    }, [searchParams])

    const [date, setDate] = React.useState<DateRange | undefined>({
        from: dateFrom,
        to: dateTo,
    });

    const handleDateChange = (date: DateRange | undefined) => {
        const dateFrom = date?.from;
        const dateTo = date?.to;

        setSearchParams('dateFrom', dateFrom ? format(dateFrom, 'yyyy-MM-dd') : undefined)
        setSearchParams('dateTo', dateTo ? format(dateTo, 'yyyy-MM-dd') : undefined)
        setDate(date);
    }

    return (
        <div>
            <div className={cn("grid gap-2", className)}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Filter by date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={handleDateChange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}