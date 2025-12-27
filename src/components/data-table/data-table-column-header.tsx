import { Column } from '@tanstack/react-table'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    sortBy?: string;
    title: string
}


enum Order {
    ASC = "ASC",
    DESC = "DESC",
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    sortBy,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const { setSearchParams } = useCustomSearchParams();

    const handleSort = (order: Order) => {
        setSearchParams("sortBy", sortBy ?? column.id);
        setSearchParams("order", order);
    }

    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant='ghost'
                        size='sm'
                        className='-ml-3 h-8 data-[state=open]:bg-accent'
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? (
                            <ArrowDown className='ml-2 h-4 w-4' />
                        ) : column.getIsSorted() === 'asc' ? (
                            <ArrowUp className='ml-2 h-4 w-4' />
                        ) : (
                            <ChevronsUpDown className='ml-2 h-4 w-4' />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='start'>
                    <DropdownMenuItem onClick={() => handleSort(Order.ASC)}>
                        <ArrowUp className='mr-1 h-3.5 w-3.5 text-muted-foreground/70' />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort(Order.DESC)}>
                        <ArrowDown className='mr-1 h-3.5 w-3.5 text-muted-foreground/70' />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                        <EyeOff className='mr-1 h-3.5 w-3.5 text-muted-foreground/70' />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}