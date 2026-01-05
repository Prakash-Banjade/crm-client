import { useServerAction } from "@/hooks/use-server-action";
import { createApplication } from "@/lib/actions/application.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { createApplicationDefaultValues, createApplicationSchema, TCreateApplicationSchema } from "@/lib/schema/application.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EMonth } from "@/lib/types";
import { Button, LoadingButton } from "@/components/ui/button";
import { InfiniteSelect } from "@/components/forms/infinite-select";
import { createQueryString } from "@/lib/utils";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

type Props = {
    setIsOpen: (value: boolean) => void;
}

export default function NewApplicationForm({ setIsOpen }: Props) {
    const { studentId } = useParams();
    const { setSearchParams } = useCustomSearchParams();

    const form = useForm<TCreateApplicationSchema>({
        resolver: zodResolver(createApplicationSchema),
        defaultValues: {
            ...createApplicationDefaultValues,
            studentId: studentId as string,
        },
    });

    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createApplication,
        invalidateTags: [
            QueryKey.APPLICATIONS,
            // same query string as in applications list of single student
            createQueryString({
                studentId,
                take: 50,
            })
        ],
        onSuccess: (res) => {
            setSearchParams({ applicationId: res.data.applicationId });
            setIsOpen(false);
        },
    });

    const onSubmit = (data: TCreateApplicationSchema) => {
        create(data);
    }

    const { "0": university, "1": intake } = useWatch({
        control: form.control,
        name: ["university", "intake"],
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Year<span className="text-destructive">*</span></FormLabel>
                            <Select onValueChange={val => field.onChange(val)} defaultValue={field.value.toString()}>
                                <FormControl>
                                    <SelectTrigger className="w-full capitalize">
                                        <SelectValue placeholder="Select year" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {
                                        Array.from({ length: 4 }).map((_, index) => (
                                            <SelectItem key={index} value={(new Date().getFullYear() + index).toString()}>
                                                {new Date().getFullYear() + index}
                                            </SelectItem>
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
                    name="intake"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Intake<span className="text-destructive">*</span></FormLabel>
                            <Select
                                onValueChange={val => {
                                    field.onChange(val)
                                    form.setValue("university", { label: "", value: "" })
                                    form.setValue("course", { label: "", value: "" })
                                }}
                                defaultValue={field.value.toString()}
                            >
                                <FormControl>
                                    <SelectTrigger className="w-full capitalize">
                                        <SelectValue placeholder="Select intake" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.values(EMonth).map((month) => (
                                        <SelectItem key={month} value={month} className="capitalize">
                                            {month}
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
                    name="university"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>University<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <InfiniteSelect
                                    endpoint={`/universities/options`}
                                    onSelectionChange={val => {
                                        field.onChange(val);
                                        form.setValue("course", { label: "", value: "" })
                                    }}
                                    selected={field.value}
                                    queryParams={{
                                        intake: intake
                                    }}
                                    placeholder="Select university"
                                    enabled={!!intake}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Course<span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <InfiniteSelect
                                    endpoint={`/courses/options`}
                                    onSelectionChange={val => {
                                        field.onChange(val);
                                    }}
                                    selected={field.value}
                                    queryParams={{
                                        universityIds: university.value
                                    }}
                                    placeholder="Select course"
                                    enabled={!!university.value}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="col-span-2 mt-6 flex justify-end">
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
                            Submit
                        </LoadingButton>
                    </div>
                </div>
            </form>
        </Form>
    )
}