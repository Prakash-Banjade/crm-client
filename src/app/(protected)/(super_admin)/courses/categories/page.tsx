"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ContainerLayout from "@/components/container-layout";
import { Button, LoadingButton } from "@/components/ui/button";
import { useServerAction } from "@/hooks/use-server-action";
import { createCategory, deleteCategory, updateCategory } from "@/lib/actions/courses.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { useFetch } from "@/hooks/useFetch";
import DataTableLoadingSkeleton from "@/components/data-table/data-table-loading-skeleton";
import { DataTable } from "@/components/data-table/data-table";
import { PaginatedResponse } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMemo, useState } from "react";
import { ResponsiveAlertDialog } from "@/components/ui/responsive-alert-dialog";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { ResponsiveDialog } from "@/components/ui/responsive-dialog";
import SearchInput, { SEARCH_KEY } from "@/components/search-components/search-input";
import { useSearchParams } from "next/navigation";
import { createQueryString } from "@/lib/utils";

const formSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters long"),
});

export default function Page() {
    return (
        <ContainerLayout
            title="Categories"
            description="Manage course categories"
        >
            <div className="grid grid-cols-3 gap-8">
                <CategoriesForm />
                <section className="col-span-2">
                    <CategoriesTable />
                </section>
            </div>
        </ContainerLayout>
    )
}

function CategoriesForm({
    setIsOpen,
    defaultValues,
}: {
    setIsOpen?: (value: boolean) => void
    defaultValues?: { id: string, name: string }
}) {
    const isEditing = !!defaultValues;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues ?? { name: "" },
    });

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createCategory,
        invalidateTags: [QueryKey.CATEGORIES],
        onSuccess: () => {
            form.reset();
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateCategory,
        invalidateTags: [QueryKey.CATEGORIES],
        onSuccess: () => {
            setIsOpen?.(false);
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (isEditing) {
            update({ id: defaultValues?.id!, name: values.name });
        } else {
            create(values);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required placeholder="Eg. General" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <LoadingButton
                    type="submit"
                    isLoading={isCreating || isUpdating}
                    loadingText={isEditing ? "Updating..." : "Creating..."}
                >
                    {isEditing ? "Update" : "Create"}
                </LoadingButton>
            </form>
        </Form>
    )
}

function CategoriesTable() {
    const searchParams = useSearchParams();

    const queryString = useMemo(() => {
        return createQueryString({
            [SEARCH_KEY]: searchParams.get(SEARCH_KEY)
        })
    }, [searchParams])

    const { data, isLoading } = useFetch<PaginatedResponse<{ id: string, name: string }>>({
        endpoint: QueryKey.CATEGORIES,
        queryKey: [
            QueryKey.CATEGORIES,
            queryString
        ],
        queryString
    });

    if (isLoading) return <DataTableLoadingSkeleton />

    return (
        <DataTable
            columns={categoriesColumns}
            data={data?.data ?? []}
            meta={data?.meta}
            filters={
                <div><SearchInput /></div>
            }
        />
    )
}

export const categoriesColumns: ColumnDef<{ id: string, name: string }>[] = [
    {
        header: "S.N",
        cell: ({ row }) => <p className="text-14 font-medium"> {row.index + 1} </p>,
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const [isDeleteOpen, setIsDeleteOpen] = useState(false);
            const [isEditOpen, setIsEditOpen] = useState(false);

            const { isPending: deletePending, mutate: deleteMutate } = useServerAction({
                action: deleteCategory,
                invalidateTags: [QueryKey.CATEGORIES],
                onSuccess: () => {
                    setIsDeleteOpen(false);
                }
            });

            return (
                <>
                    <ResponsiveAlertDialog
                        isOpen={isDeleteOpen}
                        setIsOpen={setIsDeleteOpen}
                        title="Delete Category"
                        description="Are you sure you want to delete this category?"
                        action={() => deleteMutate(row.original.id)}
                        actionLabel="Yes, Delete"
                        isLoading={deletePending}
                        loadingText="Deleting..."
                    />

                    <ResponsiveDialog
                        title="Edit Category"
                        isOpen={isEditOpen}
                        setIsOpen={setIsEditOpen}
                    >
                        <CategoriesForm setIsOpen={setIsEditOpen} defaultValues={row.original} />
                    </ResponsiveDialog>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                <Pencil />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                                <Trash />
                                Remove
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    },
]