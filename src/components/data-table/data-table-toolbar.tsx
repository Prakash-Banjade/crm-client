"use client";

import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { PropsWithChildren } from 'react'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { usePathname, useRouter } from 'next/navigation'

export interface DataTableToolbarProps<TData> extends PropsWithChildren {
    table: Table<TData>,
    searchLabel?: string;
    reset?: boolean;
    show?: {
        viewColumn?: boolean;
        resetButton?: boolean;
    }
}

export function DataTableToolbar<TData>({
    table,
    children,
    reset = true,
    show = {
        viewColumn: true,
        resetButton: true,
    }
}: DataTableToolbarProps<TData>) {
    const router = useRouter();
    const pathname = usePathname();

    const { searchParams } = useCustomSearchParams();

    const handleReset = () => {
        router.push(pathname);
    }

    return (
        <div className='flex items-end justify-between mb-3'>
            <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                {children}
            </div>

            <section className='flex items-center gap-x-2'>
                {show.resetButton && searchParams.size > 0 && !(searchParams.size === 1 && searchParams.has('search')) && reset && (
                    <Button
                        variant='ghost'
                        onClick={handleReset}
                        className='h-8 px-2 lg:px-3'
                    >
                        Reset
                        <X className='ml-2 h-4 w-4' />
                    </Button>
                )}
                {
                    show.viewColumn && (
                        <DataTableViewOptions table={table} />
                    )
                }
            </section>
        </div>
    )
}