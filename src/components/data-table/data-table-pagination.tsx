import {
    ChevronRight,
    ChevronLeft,
    ChevronsRight,
    ChevronsLeft
} from "lucide-react";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TMeta } from "@/lib/types";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

function getNearestTensArray(num: number) {
    const result = [];
    for (let i = 10; i <= 50; i += 10) {
        result.push(i);
        if (i >= num) break;
    }
    return result;
}

interface DataTablePaginationProps<TData> {
    table?: Table<TData>;
    meta: TMeta;
}

export function DataTablePagination<TData>({
    meta,
}: DataTablePaginationProps<TData>) {

    const { searchParams, setSearchParams } = useCustomSearchParams();

    return (
        <div className="flex items-center sm:justify-between sm:flex-row flex-col gap-3 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Total: {meta.itemCount} Records
            </div>
            <div className="w-full sm:w-fit flex flex-wrap items-center justify-between space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${meta.take}`}
                        onValueChange={(value) => {
                            if (value) {
                                setSearchParams("take", value);
                            } else {
                                setSearchParams("take", undefined);
                            }
                        }}
                    >
                        <SelectTrigger className="h-8! w-[70px]">
                            <SelectValue placeholder={meta.take} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {getNearestTensArray(meta.itemCount).map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-x-6 lg:space-x-8 flex items-center">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {meta.page} of {meta.pageCount}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden  lg:flex"
                            onClick={() => {
                                setSearchParams("page", "1");
                            }}
                            disabled={!meta.hasPreviousPage}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className=""
                            onClick={() => {
                                setSearchParams("page", `${meta.page - 1}`);
                            }}
                            disabled={!meta.hasPreviousPage}
                        >
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className=""
                            onClick={() => {
                                setSearchParams("page", `${meta.page + 1}`);
                            }}
                            disabled={!meta.hasNextPage}
                        >
                            <span className="sr-only">Go to next page</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hidden  lg:flex"
                            onClick={() => {
                                setSearchParams("page", `${meta.pageCount}`);
                            }}
                            disabled={!meta.hasNextPage}
                        >
                            <span className="sr-only">Go to last page</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
