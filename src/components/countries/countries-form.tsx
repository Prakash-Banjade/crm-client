import { Button, LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ImageUpload from "../forms/image-upload";
import { TCountry } from "@/lib/types/countries.types";
import { countriesDefaultValues, countriesSchema, TCountriesSchema } from "@/lib/schema/countries.schema";
import { createCountry, updateCountry } from "@/lib/actions/countries.action";

type Props = {
    setIsOpen: (value: boolean) => void;
    defaultValues?: TCountry
}

export default function CountriesForm({ setIsOpen, defaultValues }: Props) {
    const isEditing = !!defaultValues?.id;

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createCountry,
        invalidateTags: [QueryKey.COUNTRIES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateCountry,
        invalidateTags: [QueryKey.COUNTRIES],
        onSuccess: () => {
            setIsOpen(false);
        },
    });

    const form = useForm<TCountriesSchema>({
        resolver: zodResolver(countriesSchema),
        defaultValues: {
            ...(defaultValues || countriesDefaultValues),

        },
    });

    const onSubmit = (data: TCountriesSchema) => {
        if (isEditing) {
            update({ id: defaultValues.id, formData: data });
            console.log(data)
        } else {
            create(data);
        }
    }

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
                    name="states"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>States<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input 
                                    type="text" 
                                    placeholder="Eg. NYC, California..."
                                    required 
                                    {...field}
                                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value.split(', ').map(s => s.trim()))}
                                />
                            </FormControl>
                            <FormDescription>
                                Enter states separated by commas.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="flag"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Flag</FormLabel>
                            <FormControl>
                                <ImageUpload name="flag" value={field.value} onValueChange={field.onChange} />
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