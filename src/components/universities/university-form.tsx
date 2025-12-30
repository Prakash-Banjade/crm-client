import { Button, LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { createUniversity, updateUniversity } from "@/lib/actions/university.action";
import { TUniversity } from "@/lib/types/university.type";
import { TUniversitySchema, universityDefaultValues, universitySchema } from "@/lib/schema/university.schema";
import { Editor } from "../editor/blocks/editor-x/editor";
import { CountrySelect } from "../forms/country-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
    setIsOpen: (value: boolean) => void;
    defaultValues?: TUniversity
    setIsFormDirty?: (value: boolean) => void;
}

export default function UniversityForm({ setIsOpen, defaultValues, setIsFormDirty }: Props) {
    const isEditing = !!defaultValues?.id;

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createUniversity,
        invalidateTags: [QueryKey.UNIVERSITIES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateUniversity,
        invalidateTags: [QueryKey.UNIVERSITIES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const form = useForm<TUniversitySchema>({
        resolver: zodResolver(universitySchema),
        defaultValues: {
            ...(defaultValues || universityDefaultValues),

        },
    });

    const onSubmit = (data: TUniversitySchema) => {
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
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country<span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <CountrySelect
                                        onValueChange={val => {
                                            field.onChange({
                                                id: val.value,
                                                name: val.label,
                                                image: val.image,
                                                states: val.states,
                                            })
                                            form.setValue("state", "");
                                        }}
                                        value={{
                                            label: field.value.name,
                                            value: field.value.id,
                                            image: field.value.image,
                                            states: field.value.states,
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State <span className="text-destructive">*</span></FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} required>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            form.watch("country.states").map((state) => (
                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="commission"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Commission<span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input type="text" required {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <FormLabel>Description<span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Editor
                                        placeholder="Start writing..."
                                        editorSerializedState={field.value.json}
                                        onSerializedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
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
                            {isEditing ? "Save Changes" : "Add University"}
                        </LoadingButton>
                    </div>

                </div>
            </form>
        </Form>
    )
}