import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { formatDate } from "date-fns";
import { EApplicationPriority, EApplicationStatus, TApplication } from "@/lib/types/application.type";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { StudentTabs } from "../single-student-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/search-components/search-input";
import { DateRangeFilter } from "@/components/search-components/date-range-filter";
import { useSearchParams } from "next/navigation";
import { InfiniteMultiSelect } from "@/components/forms/infinite-multi-select";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { EMonth } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";

export const applicationColumns: ColumnDef<TApplication>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "ackNo",
        header: () => {
            const searchParams = useSearchParams();
            const key = "ackNo";

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={searchParams.get(key) ? "secondary" : "ghost"}
                            size="sm"
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                        >
                            <span>Ack No.</span>
                            <ChevronsUpDown className="size-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <SearchInput searchKey={key} placeholder="Search by Ack No." />
                    </PopoverContent>
                </Popover>
            )
        },
        cell: ({ row }) => (
            <div className="h-8 flex items-center">
                <Link href={`students/application/${row.original.student.id}?tab=${StudentTabs.Applications}&applicationId=${row.original.id}`}>
                    {row.original.ackNo}
                </Link>
            </div>
        ),
    },
    {
        accessorKey: "student.fullName",
        header: ({ column }) => {
            return <DataTableColumnHeader column={column} title="Name" />
        },
        cell: ({ row }) => {
            return (
                <Link href={`students/application/${row.original.student.id}?tab=${StudentTabs.Applications}&applicationId=${row.original.id}`} className="capitalize font-medium hover:text-blue-500 hover:underline"> {row.original.student.fullName} </Link>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: () => {
            const searchParams = useSearchParams();
            const dateFromKey = "dateFrom";
            const dateToKey = "dateTo";

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={(searchParams.get(dateFromKey) || searchParams.get(dateToKey)) ? "secondary" : "ghost"}
                            size="sm"
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                        >
                            <span>Created At</span>
                            <ChevronsUpDown className="size-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <DateRangeFilter />
                    </PopoverContent>
                </Popover>
            )
        },
        cell: ({ row }) => <p> {formatDate(row.original.createdAt, "dd/MM/yyyy HH:mm")} </p>,
    },
    {
        accessorKey: "course.university.name",
        header: () => {
            const { searchParams, setSearchParams } = useCustomSearchParams();
            const key = "university";

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={(searchParams.get(key)) ? "secondary" : "ghost"}
                            size="sm"
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                        >
                            <span>University</span>
                            <ChevronsUpDown className="size-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <InfiniteMultiSelect
                            endpoint={`${QueryKey.UNIVERSITIES}/${QueryKey.OPTIONS}`}
                            className="w-[250px]"
                            selected={JSON.parse(decodeURIComponent(searchParams.get(key) || "[]"))}
                            onSelectionChange={(values) => {
                                setSearchParams({ [key]: values.length > 0 ? encodeURIComponent(JSON.stringify(values)) : undefined })
                            }}
                        />
                    </PopoverContent>
                </Popover>
            )
        },
        cell: ({ row }) => <p> {row.original.course.university.name} </p>,
    },
    {
        accessorKey: "course.name",
        header: () => {
            const { searchParams, setSearchParams } = useCustomSearchParams();
            const key = "course";

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={(searchParams.get(key)) ? "secondary" : "ghost"}
                            size="sm"
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                        >
                            <span>Program</span>
                            <ChevronsUpDown className="size-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <InfiniteMultiSelect
                            endpoint={`${QueryKey.COURSES}/${QueryKey.OPTIONS}`}
                            className="w-[250px]"
                            selected={JSON.parse(decodeURIComponent(searchParams.get(key) || "[]"))}
                            onSelectionChange={(values) => {
                                setSearchParams({ [key]: values.length > 0 ? encodeURIComponent(JSON.stringify(values)) : undefined })
                            }}
                        />
                    </PopoverContent>
                </Popover>
            )
        },
        cell: ({ row }) => <p> {row.original.course.name} </p>,
    },
    {
        accessorKey: "intake",
        header: () => {
            const { searchParams, setSearchParams } = useCustomSearchParams();
            const intakeMonths = "intakeMonths";
            const intakeYears = "intakeYears";

            const PAST_YEARS = 5;
            const FUTURE_YEARS = 4;

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={(searchParams.get(intakeMonths) || searchParams.get(intakeYears)) ? "secondary" : "ghost"}
                            size="sm"
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                        >
                            <span>Intake</span>
                            <ChevronsUpDown className="size-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <MultiSelect
                            onValuesChange={(values: string[]) => {
                                setSearchParams({
                                    [intakeMonths]: values.join(","),
                                });
                            }}
                            values={searchParams.get(intakeMonths)?.split(",") || []}
                        >
                            <MultiSelectTrigger className="w-[250px]">
                                <MultiSelectValue
                                    overflowBehavior="cutoff"
                                    placeholder="Select intake month"
                                />
                            </MultiSelectTrigger>
                            <MultiSelectContent>
                                <MultiSelectGroup>
                                    {
                                        Object.entries(EMonth).map(([key, value]) => (
                                            <MultiSelectItem key={key} value={value}>{key}</MultiSelectItem>
                                        ))
                                    }
                                </MultiSelectGroup>
                            </MultiSelectContent>
                        </MultiSelect>
                        <MultiSelect
                            onValuesChange={(values: string[]) => {
                                setSearchParams({
                                    [intakeYears]: values.join(","),
                                });
                            }}
                            values={searchParams.get(intakeYears)?.split(",") || []}
                        >
                            <MultiSelectTrigger className="w-[250px]">
                                <MultiSelectValue
                                    overflowBehavior="cutoff"
                                    placeholder="Select intake year"
                                />
                            </MultiSelectTrigger>
                            <MultiSelectContent>
                                <MultiSelectGroup>
                                    {
                                        Array.from({ length: PAST_YEARS }).map((_, index) => (
                                            <MultiSelectItem key={index} value={(new Date().getFullYear() - (PAST_YEARS - index)).toString()}>
                                                {new Date().getFullYear() - (PAST_YEARS - index)}
                                            </MultiSelectItem>
                                        ))
                                    }
                                    {
                                        Array.from({ length: FUTURE_YEARS }).map((_, index) => (
                                            <MultiSelectItem key={index} value={(new Date().getFullYear() + index).toString()}>
                                                {new Date().getFullYear() + index}
                                            </MultiSelectItem>
                                        ))
                                    }
                                </MultiSelectGroup>
                            </MultiSelectContent>
                        </MultiSelect>
                    </PopoverContent>
                </Popover>
            )
        },
        cell: ({ row }) => <p className="capitalize">{row.original.intake} - {row.original.year} </p>,
    },
    {
        accessorKey: "priority",
        header: () => {
            const { searchParams, setSearchParams } = useCustomSearchParams();
            const key = "priority";

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={(searchParams.get(key)) ? "secondary" : "ghost"}
                            size="sm"
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                        >
                            <span>Priority</span>
                            <ChevronsUpDown className="size-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <Select
                            defaultValue={searchParams.get(key) || ""}
                            onValueChange={val => {
                                setSearchParams({ [key]: val })
                            }}
                        >
                            <SelectTrigger id="priority" className="w-[250px]">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    Object.entries(EApplicationPriority).map(([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                            {key.replace(/_/g, " ")}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </PopoverContent>
                </Popover>
            )
        },
        cell: ({ row }) => {
            const p = row.original.priority;
            return (
                <Badge
                    variant={
                        p === EApplicationPriority.High
                            ? "destructive"
                            : p === EApplicationPriority.Medium
                                ? "warning"
                                : p === EApplicationPriority.Low
                                    ? "success"
                                    : "outline"
                    }
                    className="capitalize text-sm"
                >
                    {p}
                </Badge>
            )
        },
    },
    {
        accessorKey: "createdBy.lowerCasedFullName",
        header: "Created By",
        cell: ({ row }) => {
            const createdBy = row.original.createdBy?.lowerCasedFullName || "N/A";
            return <p className={cn("capitalize", createdBy === "N/A" && "text-muted-foreground")}> {createdBy} </p>;
        },
    },
    {
        accessorKey: "status",
        header: () => {
            const { searchParams, setSearchParams } = useCustomSearchParams();
            const key = "status";

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={(searchParams.get(key)) ? "secondary" : "ghost"}
                            size="sm"
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                        >
                            <span>Status</span>
                            <ChevronsUpDown className="size-4 ml-2" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                        <Select
                            defaultValue={searchParams.get(key) || ""}
                            onValueChange={val => {
                                setSearchParams({ [key]: val })
                            }}
                        >
                            <SelectTrigger id="status" className="w-[250px]">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    Object.entries(EApplicationStatus).map(([key, value]) => (
                                        <SelectItem key={key} value={value}>
                                            {key.replace(/_/g, " ")}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </PopoverContent>
                </Popover>
            )
        },
        cell: ({ row }) => {
            const status = row.original.status;

            return (
                <p className="capitalize font-medium">{status.split("_").join(" ")}</p>
            )
        },
    },
]