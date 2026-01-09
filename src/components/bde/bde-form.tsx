"use client";

import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { useServerAction } from "@/hooks/use-server-action";
import { createBde, updateBde } from "@/lib/actions/bde.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { bdeDefaultValues, bdeSchema, TBdeSchema } from "@/lib/schema/bde.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, LoadingButton } from "../ui/button";

type Props = {
    setIsOpen: (value: boolean) => void;
    defaultValues?: TBdeSchema & { id: string }
    setIsFormDirty?: (value: boolean) => void;
}

export default function BdeForm({ setIsOpen, defaultValues, setIsFormDirty }: Props) {
    const isEditing = !!defaultValues?.id;

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createBde,
        invalidateTags: [QueryKey.BDES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateBde,
        invalidateTags: [QueryKey.BDES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const form = useForm<TBdeSchema>({
        resolver: zodResolver(bdeSchema),
        defaultValues: {
            ...(defaultValues || bdeDefaultValues),

        },
    });

    const onSubmit = (data: TBdeSchema) => {
        if (isEditing) {
            update({ id: defaultValues.id, formData: data });
        } else {
            create(data);
        }
    }

    useEffect(() => {
        setIsFormDirty?.(form.formState.isDirty);
    }, [form.formState.isDirty]);

    useConfirmExit(form.formState.isDirty && !form.formState.isSubmitSuccessful);;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="email" required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="+977 98********" required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            type="button"
                            variant={'outline'}
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            isLoading={isCreating || isUpdating}
                            type="submit"
                            loadingText={isEditing ? "Updating..." : "Adding..."}
                        >
                            {isEditing ? "Save Changes" : "Add BDE"}
                        </LoadingButton>
                    </div>

                </div>
            </form>
        </Form>
    )
}