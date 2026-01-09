import { useConfirmExit } from "@/hooks/use-confirm-exit";
import { useServerAction } from "@/hooks/use-server-action";
import { updateStudent } from "@/lib/actions/student.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { StudentSchema, studentWorkExperienceDefaultValues, TStudentSchema } from "@/lib/schema/student.schema";
import { EModeOfSalary, TSingleStudent } from "@/lib/types/student.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button, LoadingButton } from "../ui/button";

export default function StudentWorkExperienceForm({ student }: { student: TSingleStudent }) {
    const defaultValues = useMemo(() => {
        return {
            ...student,
            workExperiences: student.workExperiences || [],
        }
    }, [student])

    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues: defaultValues,
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateStudent,
        invalidateTags: [QueryKey.STUDENTS],
    });

    const onSubmit = (data: TStudentSchema) => {
        if (!data.workExperiences?.length) return;

        update({ id: student.id, formData: data });
    };

    useConfirmExit(form.formState.isDirty && !form.formState.isSubmitSuccessful);;

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "workExperiences",
    })

    return (
        <div className="flex-1 mb-40">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-6">
                        {
                            fields.map((f, i) => {
                                return (
                                    <Card key={f.id}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                Experience {i + 1}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name={`workExperiences.${i}.organization`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Organization Name<span className="text-destructive">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input required placeholder="Eg. Abhyam Robotics..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`workExperiences.${i}.position`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Position<span className="text-destructive">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input required placeholder="Eg. Software Engineer..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`workExperiences.${i}.jobProfile`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Job Profile<span className="text-destructive">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input required placeholder="Eg. Software Engineer..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`workExperiences.${i}.workingFrom`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Working From<span className="text-destructive">*</span></FormLabel>
                                                            <FormControl>
                                                                <Input type="date" required {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`workExperiences.${i}.workingTo`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Working To <span className="text-muted-foreground text-xs">Leave blank if currently working</span></FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} value={field.value || ''} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`workExperiences.${i}.modeOfSalary`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Mode of Salary<span className="text-destructive">*</span></FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="w-full capitalize">
                                                                        <SelectValue placeholder="Select mode of salary" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {
                                                                        Object.values(EModeOfSalary).map((modeOfSalary) => (
                                                                            <SelectItem key={modeOfSalary} value={modeOfSalary} className="capitalize">
                                                                                {modeOfSalary}
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
                                                    name={`workExperiences.${i}.comment`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Comment</FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    className="resize-none field-sizing-content"
                                                                    placeholder="Eg. Software Engineer..."
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Button type="button" variant={"destructive"} onClick={() => remove(i)}>
                                                <Trash2 />
                                                Remove
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        }
                        <div className="flex items-center justify-center gap-2 text-lg border border-dashed p-12 cursor-pointer hover:bg-accent/20 transition-colors" role="button" onClick={() => append(studentWorkExperienceDefaultValues)}>
                            <Plus />
                            Add Experience
                        </div>
                        {
                            fields.length > 0 && (
                                <LoadingButton
                                    type="submit"
                                    isLoading={isUpdating}
                                    loadingText="Saving..."
                                >
                                    <Save />
                                    Save Experiences
                                </LoadingButton>
                            )
                        }
                    </div>
                </form>
            </Form>
        </div>
    )
}