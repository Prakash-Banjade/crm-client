"use client";

import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { studentDefaultValues, StudentSchema, TStudentSchema } from "@/lib/schema/student.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { useServerAction } from "@/hooks/use-server-action";
import { createStudent } from "@/lib/actions/student.action";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button, LoadingButton } from "../ui/button";

type Props = {
    setIsOpen: (value: boolean) => void;
    setIsFormDirty: (value: boolean) => void;
}

export default function AddStudentForm({ setIsOpen, setIsFormDirty }: Props) {
    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues: studentDefaultValues
    });

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createStudent,
        invalidateTags: [QueryKey.STUDENTS],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const onSubmit = async (data: TStudentSchema) => {
        create(data);
    }

    useEffect(() => {
        setIsFormDirty?.(form.formState.isDirty);
    }, [form.formState.isDirty]);

    useConfirmExit(form.formState.isDirty && !form.formState.isSubmitSuccessful);;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            isLoading={isCreating}
                            type="submit"
                            loadingText="Adding..."
                        >
                            Add Student
                        </LoadingButton>
                    </div>
                </div>
            </form>
        </Form>
    )
}