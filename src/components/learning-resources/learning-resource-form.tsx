"use client";

import { Button, LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { learningResourceDefaultValues, learningResourceSchema, TLearningResourceSchema } from "@/lib/schema/learning-resources.schema";
import { createLearningResource, updateLearningResource } from "@/lib/actions/learning-resources.action";
import { FileUpload } from "../forms/file-upload";
import { useParams } from "next/navigation";

type Props = {
    setIsOpen: (value: boolean) => void;
    defaultValues?: TLearningResourceSchema & { id: string },
    setIsFormDirty?: (value: boolean) => void;
}

export default function LearningResourcesForm({ setIsOpen, defaultValues, setIsFormDirty }: Props) {
    const { id } = useParams();

    const isEditing = !!defaultValues?.id;

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createLearningResource,
        invalidateTags: [QueryKey.LEARNING_RESOURCES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateLearningResource,
        invalidateTags: [QueryKey.LEARNING_RESOURCES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const form = useForm<TLearningResourceSchema>({
        resolver: zodResolver(learningResourceSchema),
        defaultValues: {
            ...(defaultValues || learningResourceDefaultValues),
        },
    });


    const onSubmit = (data: TLearningResourceSchema) => {
        if (isEditing && defaultValues?.id) {
            update({ id: defaultValues.id, formData: data });
        } else {
            create({ ...data, parentId: id as string | null });
        }
    }

    useEffect(() => {
        setIsFormDirty?.(form.formState.isDirty);
    }, [form.formState.isDirty, setIsFormDirty]);

    useConfirmExit(form.formState.isDirty && !form.formState.isSubmitSuccessful);;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input required placeholder="Enter title" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter description"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {id && <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>File<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <FileUpload
                                    name="files"
                                    value={field.value ?? []}
                                    multiple
                                    onValueChange={(url) => field.onChange(url)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />}

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
                            {isEditing ? "Save Changes" : "Add"}
                        </LoadingButton>
                    </div>

                </div>
            </form>
        </Form>
    )
}