"use client";

import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { LeadSchema, LeadsDefaultValues, TLeadSchema } from "@/lib/schema/lead.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { useServerAction } from "@/hooks/use-server-action";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, LoadingButton } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EGender } from "@/lib/types";
import { ESouthAsianCountry } from "@/lib/types/country.type";
import { createStudent, updateStudent } from "@/lib/actions/student.action";

type Props = {
    setIsOpen: (value: boolean) => void;
    defaultValues?: TLeadSchema & { id: string }
    setIsFormDirty: (value: boolean) => void;
}

export default function LeadForm({ setIsOpen, defaultValues, setIsFormDirty }: Props) {
    const isEditing = !!defaultValues?.id;

    const form = useForm<TLeadSchema>({
        resolver: zodResolver(LeadSchema),
        defaultValues: defaultValues || LeadsDefaultValues
    });

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createStudent,
        invalidateTags: [QueryKey.STUDENTS],
        onSuccess: () => {
            setIsOpen(false);
            form.reset();
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateStudent,
        invalidateTags: [QueryKey.STUDENTS],
        onSuccess: () => {
            setIsOpen(false);
            form.reset();
        },
    });

    const onSubmit = async (data: TLeadSchema) => {
        if (isEditing) {

            update({ id: defaultValues.id, formData: data });
        } else {
            create(data);
        }
    }

    useEffect(() => {
        setIsFormDirty?.(form.formState.isDirty);
    }, [form.formState.isDirty]);

    useConfirmExit(form.formState.isDirty);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="asLead.gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender<span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full capitalize">
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(EGender).map((gender) => (
                                            <SelectItem key={gender} value={gender} className="capitalize">
                                                {gender}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="asLead.country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country<span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(ESouthAsianCountry).map(([code, name]) => (
                                            <SelectItem key={code} value={name}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="asLead.address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="asLead.interestedCourse"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interested Course<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required {...field} />
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
                            {
                                isEditing ? "Update Lead" : "Add Lead"
                            }
                        </LoadingButton>
                    </div>
                </div>
            </form>
        </Form>
    )
}