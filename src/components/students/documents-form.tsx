import { useServerAction } from "@/hooks/use-server-action";
import { updateStudent } from "@/lib/actions/student.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { studentDocumentsDefaultValues, StudentSchema, TStudentSchema } from "@/lib/schema/student.schema";
import { TSingleStudent } from "@/lib/types/student.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useEffect, useMemo } from "react";
import { FileUpload } from "../forms/file-upload";
import { LoadingButton } from "../ui/button";
import { Save } from "lucide-react";

export default function StudentDocumentsForm({ student }: { student: TSingleStudent }) {
    const defaultValues = useMemo(() => {
        return {
            ...student,
            documents: student.documents || studentDocumentsDefaultValues,
        }
    }, [student])

    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues,
    });

    // important! to keep the form in sync with the student changes
    useEffect(() => {
        form.reset(defaultValues)
    }, [defaultValues])

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateStudent,
        invalidateTags: [QueryKey.STUDENTS],
    });

    const onSubmit = (data: TStudentSchema) => {
        update({ id: student.id, formData: data });
    };

    return (
        <div className="flex-1 mb-40">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Documents</CardTitle>
                            <CardDescription>Upload the required documents.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <section className="grid @5xl:grid-cols-3 @2xl:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="documents.cv"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>CV<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.cv"
                                                    value={field.value}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={1}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documents.gradeTenMarksheet"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>Grade 10 Marksheet<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.gradeTenMarksheet"
                                                    value={field.value}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={1}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documents.gradeElevenMarksheet"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>Grade 11 Marksheet</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.gradeElevenMarksheet"
                                                    value={field.value || undefined}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={1}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documents.gradeTwelveMarksheet"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>Grade 12 Marksheet<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.gradeTwelveMarksheet"
                                                    value={field.value}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={1}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documents.passport"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>Passport<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.passport"
                                                    value={field.value}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={1}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documents.ielts"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>IELTS/PTE/MOI<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.ielts"
                                                    value={field.value}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={1}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documents.recommendationLetter"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>Recommendation Letter (2)<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.recommendationLetter"
                                                    value={field.value}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={2}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="documents.workExperience"
                                    render={({ field }) => (
                                        <FormItem className="h-fit">
                                            <FormLabel>Work Experience Certificates</FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    name="documents.workExperience"
                                                    value={field.value || undefined}
                                                    onValueChange={val => {
                                                        field.onChange(val[0])
                                                    }}
                                                    maxLimit={1}
                                                    multiple={false}
                                                    accept=".pdf"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </section>
                            <LoadingButton
                                type="submit"
                                isLoading={isUpdating}
                                loadingText="Saving..."
                            >
                                <Save />
                                Save Changes
                            </LoadingButton>
                        </CardContent>
                    </Card>
                </form>
            </Form>
        </div>
    )
}