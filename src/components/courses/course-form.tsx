"use client";

import { courseDefaultValues, courseSchema, ECourseRequirement, EProgramLevel, TCourseSchema } from "@/lib/schema/course.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button, LoadingButton } from "../ui/button";
import { useRouter } from "next/navigation";
import { useConfirmExitAlert } from "@/context/confirm-exit-provider";
import { useServerAction } from "@/hooks/use-server-action";
import { createCourse, updateCourse } from "@/lib/actions/courses.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { EMonth, Role } from "@/lib/types";
import { Input } from "../ui/input";
import { InfiniteSelect } from "../forms/infinite-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";
import { NumberInput } from "../ui/number-input";
import { Editor } from "../editor/blocks/editor-x/editor";
import { useConfirmExit } from "@/hooks/use-confirm-exit";

type Props = {
    defaultValues?: TCourseSchema & { id: string };
}

export default function CourseForm({ defaultValues }: Props) {
    const isEditing = !!defaultValues;

    const router = useRouter();
    const { setExitLocation, setIsOpen } = useConfirmExitAlert();

    const form = useForm<TCourseSchema>({
        resolver: zodResolver(courseSchema),
        defaultValues: defaultValues ?? courseDefaultValues
    });


    const { isPending: isCreating, mutate: create } = useServerAction({
        action: createCourse,
        invalidateTags: [QueryKey.COURSES],
        onSuccess: () => {
            router.push(`/courses`);
        },
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateCourse,
        invalidateTags: [QueryKey.COURSES],
    });

    const onSubmit = (data: TCourseSchema) => {
        data.commissions = data.commissions.map((item) => item.trim()).filter((item) => item.length > 0);
        data.paymentTerms = data.paymentTerms.map((item) => item.trim()).filter((item) => item.length > 0);

        if (isEditing) {
            update({ formData: data, id: defaultValues?.id! });
        } else {
            create(data);
        }
    }

    const name = useWatch({
        control: form.control,
        name: "name",
    });

    useConfirmExit(form.formState.isDirty && !form.formState.isSubmitSuccessful);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="@container">
                <section className="space-y-6 pb-40">
                    <header className="container">
                        <h3 className="text-3xl font-bold capitalize max-w-[50ch] wrap-break-words">
                            {name || "N/A"}
                        </h3>
                    </header>
                    <section className="border-y sticky z-1 backdrop-blur-3xl top-0">
                        <section className="container flex justify-between items-center py-3">
                            <p className="text-sm text-muted-foreground">
                                {isEditing ? "Updating an course" : "Creating new course"}
                            </p>
                            <section className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant={'outline'}
                                    size={'lg'}
                                    onClick={() => {
                                        if (form.formState.isDirty) {
                                            setExitLocation(`/${Role.SUPER_ADMIN}/courses`);
                                            setIsOpen(true);
                                        } else {
                                            router.push(`/${Role.SUPER_ADMIN}/courses`);
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>

                                <LoadingButton
                                    type="submit"
                                    size={"lg"}
                                    isLoading={isCreating || isUpdating}
                                    loadingText="Saving..."
                                >
                                    Save
                                </LoadingButton>
                            </section>
                        </section>
                    </section>

                    <section className="container space-y-12">
                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-medium">Basic Course Information</h4>
                                {/* <Separator /> */}
                            </section>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Course Name" {...field} />
                                        </FormControl>
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
                                                endpoint={`/${QueryKey.UNIVERSITIES}/${QueryKey.OPTIONS}`}
                                                placeholder="Select university"
                                                selected={{
                                                    label: field.value.label,
                                                    value: field.value.value
                                                }}
                                                onSelectionChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <InfiniteSelect
                                                endpoint={`/${QueryKey.CATEGORIES}/${QueryKey.OPTIONS}`}
                                                placeholder="Select category"
                                                selected={{
                                                    label: field.value.label,
                                                    value: field.value.value
                                                }}
                                                onSelectionChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <FormField
                                control={form.control}
                                name="programLevel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Program Level<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Select program level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.entries(EProgramLevel).map(([key, value]) => (
                                                        <SelectItem key={key} value={value} className="capitalize">{value.split("_").join(" ")}</SelectItem>
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
                                name="courseUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course URL<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Eg. https://www.example.com" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="@4xl:col-span-2">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Editor
                                                    placeholder="Describe course here..."
                                                    editorSerializedState={field.value.json}
                                                    onSerializedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </section>
                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-medium">Duration & Schedule</h4>
                                {/* <Separator /> */}
                            </section>
                            <FormField
                                control={form.control}
                                name="duration"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Duration (Months)<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 12" required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="intakes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Intakes<span className="text-destructive">*</span></FormLabel>
                                        <MultiSelect onValuesChange={field.onChange} values={field.value}>
                                            <FormControl>
                                                <MultiSelectTrigger className="w-full">
                                                    <MultiSelectValue placeholder="Select intakes..." />
                                                </MultiSelectTrigger>
                                            </FormControl>
                                            <MultiSelectContent>
                                                <MultiSelectGroup>
                                                    {
                                                        Object.entries(EMonth).map(([key, value]) => (
                                                            <MultiSelectItem key={key} value={value}>{key}</MultiSelectItem>
                                                        ))
                                                    }
                                                </MultiSelectGroup>
                                            </MultiSelectContent>
                                        </MultiSelect>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </section>
                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-medium">Financial Details</h4>
                            </section>
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Currency<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Eg. NPR, USD, CAD" required  {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fee<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <NumberInput required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="applicationFee"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Application Fee<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <NumberInput required {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="hasScholarship"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Has Scholarship<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={val => field.onChange(val === "true")} defaultValue={field.value.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Select program level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="true" className="capitalize">Yes</SelectItem>
                                                <SelectItem value="false" className="capitalize">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="commissions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Commissions (comma separated)<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Eg. commission 1, commission 2,..."
                                                {...field}
                                                value={field.value.join(",")}
                                                required
                                                onChange={(e) => {
                                                    field.onChange(e.target.value.split(","));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="paymentTerms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Terms<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Eg. term 1, term 2,..."
                                                {...field}
                                                value={field.value.join(",")}
                                                required
                                                onChange={(e) => {
                                                    field.onChange(e.target.value.split(","));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </section>
                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-medium">Academic Requirements</h4>
                                {/* <Separator /> */}
                            </section>

                            <FormField
                                control={form.control}
                                name="minGrade12Percentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Grade 12 Percentage</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 75" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minUgPercentage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Undergraduate Percentage</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 75" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="minWorkExperience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Work Experience (Years)</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gapAccepted"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gap Accepted (Years)</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 2" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="requirements"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Subject Requirements<span className="text-destructive">*</span></FormLabel>
                                        <MultiSelect onValuesChange={field.onChange} values={field.value}>
                                            <FormControl>
                                                <MultiSelectTrigger className="w-full">
                                                    <MultiSelectValue placeholder="Select subject requirements..." />
                                                </MultiSelectTrigger>
                                            </FormControl>
                                            <MultiSelectContent>
                                                <MultiSelectGroup>
                                                    {
                                                        Object.entries(ECourseRequirement).map(([key, value]) => (
                                                            <MultiSelectItem key={key} value={value} className="capitalize">{key.split('_').join(' ')}</MultiSelectItem>
                                                        ))
                                                    }
                                                </MultiSelectGroup>
                                            </MultiSelectContent>
                                        </MultiSelect>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </section>
                        <section className="grid @4xl:grid-cols-2 grid-cols-1 gap-6">
                            <section className="@4xl:col-span-2 space-y-1">
                                <h4 className="text-lg font-medium">Academic Requirements</h4>
                                {/* <Separator /> */}
                            </section>
                            <FormField
                                control={form.control}
                                name="ieltsOverall"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>IELTS Overall</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 7.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="ieltsMinScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>IELTS Min Score</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 6" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pteOverall"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PTE Overall</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 80" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pteMinScore"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>PTE Min Score</FormLabel>
                                        <FormControl>
                                            <NumberInput placeholder="Eg. 46" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </section>
                    </section>
                </section>
            </form>
        </Form>
    )
}