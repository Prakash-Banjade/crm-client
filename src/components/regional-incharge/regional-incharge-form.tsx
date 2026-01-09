import { Button, LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { regionalInchargeDefaultValues, regionalInchargeSchema, TRegionalInchargeSchema } from "@/lib/schema/regional-incharge.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImageUpload from "../forms/image-upload";
import { createRegionalIncharge, updateRegionalIncharge } from "@/lib/actions/regional-incharge.action";
import { TRegionalIncharge } from "@/lib/types/regional-incharge.types";
import { useEffect } from "react";
import { useConfirmExit } from "@/hooks/use-confirm-exit";

type Props = {
    setIsOpen: (value: boolean) => void;
    defaultValues?: TRegionalIncharge
    setIsFormDirty?: (value: boolean) => void;
}

export default function RegionalInchargeForm({ setIsOpen, defaultValues, setIsFormDirty }: Props) {
    const isEditing = !!defaultValues?.id;

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createRegionalIncharge,
        invalidateTags: [QueryKey.REGIONAL_INCHARGES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateRegionalIncharge,
        invalidateTags: [QueryKey.REGIONAL_INCHARGES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const form = useForm<TRegionalInchargeSchema>({
        resolver: zodResolver(regionalInchargeSchema),
        defaultValues: {
            ...(defaultValues || regionalInchargeDefaultValues),

        },
    });

    const onSubmit = (data: TRegionalInchargeSchema) => {
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
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
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="tel" required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="text" required {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                                <ImageUpload name="logo" value={field.value} onValueChange={field.onChange} />
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
                            loadingText={isEditing ? "Updating..." : "Creating..."}
                        >
                            {isEditing ? "Save Changes" : "Add"}
                        </LoadingButton>
                    </div>

                </div>
            </form>
        </Form>
    )
}