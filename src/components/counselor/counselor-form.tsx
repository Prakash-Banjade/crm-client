"use client";

import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { useServerAction } from "@/hooks/use-server-action";
import { createCounselor, updateCounselor } from "@/lib/actions/counselor.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { counselorDefaultValues, counselorSchema, ECounselorType, TCounselorSchema } from "@/lib/schema/counselor.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button, LoadingButton } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
type Props = {
    setIsOpen: (value: boolean) => void;
    defaultValues?: TCounselorSchema & { id: string }
    setIsFormDirty?: (value: boolean) => void;
}
export default function CounselorForm({ setIsOpen, defaultValues, setIsFormDirty }: Props) {
    const isEditing = !!defaultValues?.id;

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createCounselor,
        invalidateTags: [QueryKey.COUNSELORS],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateCounselor,
        invalidateTags: [QueryKey.COUNSELORS],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const form = useForm<TCounselorSchema>({
        resolver: zodResolver(counselorSchema),
        defaultValues: {
            ...(defaultValues || counselorDefaultValues),

        },
    });

    const onSubmit = (data: TCounselorSchema) => {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <section className="grid md:grid-cols-2 gap-4">
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
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Type<span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={val => field.onChange(val === "true")} defaultValue={field.value.toString()}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={ECounselorType.Application}>Application</SelectItem>
                                        <SelectItem value={ECounselorType.Commission}>Commission</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <section className="space-y-3">
                    <h3 className="font-medium text-base">Permissions</h3>
                    <FormField
                        control={form.control}
                        name="seeAndReceiveApplicationNotifications"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>See and receive notifications of application</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="exportApplicationToExcelFile"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Export application to excel file from manage applications section</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="showCommissionInfo"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Show commission info to counselor in search program</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="reassignStudents"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Re-assign student to parent partner after application goes to 'Visa Received'</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hideSensitiveChatContent"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Hide sensitive chat content from counselors in application chat</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hideCommissionFromPromotionalContent"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel>Hide commissions from promotional content on dashboard</FormLabel>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </section>

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
                            {isEditing ? "Save Changes" : "Add Counselor"}
                        </LoadingButton>
                    </div>

                </div>
            </form>
        </Form>
    )
}