import { useServerAction } from "@/hooks/use-server-action";
import { updateStudent } from "@/lib/actions/student.action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { studentLevelOfStudyDefaultValues, StudentSchema, TStudentSchema } from "@/lib/schema/student.schema";
import { EGradingSystem, ELevelOfEducation, TSingleStudent } from "@/lib/types/student.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Save } from "lucide-react";
import { LoadingButton } from "../ui/button";
import { ESouthAsianCountry } from "@/lib/types/country.type";
import { Input } from "../ui/input";
import { NumberInput } from "../ui/number-input";
import { Activity, startTransition, useEffect, useMemo } from "react";

export default function StudentAcademicQualificationForm({ student }: { student: TSingleStudent }) {
    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues: student,
    });

    const { isPending: isUpdating, mutate: update } = useServerAction({
        action: updateStudent,
        invalidateTags: [QueryKey.STUDENTS],
    });

    const onSubmit = (data: TStudentSchema) => {
        update({ id: student.id, formData: data });
    };

    return (
        <div className="flex-1 mb-40 space-y-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground" /> Education Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="academicQualification.countryOfEducation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Country<span className="text-destructive">*</span></FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value || undefined} required>
                                                <FormControl>
                                                    <SelectTrigger className="w-full capitalize">
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        Object.values(ESouthAsianCountry).map((country) => (
                                                            <SelectItem key={country} value={country} className="capitalize">
                                                                {country}
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
                                    name="academicQualification.highestLevelOfEducation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Highest Level of Education<span className="text-destructive">*</span></FormLabel>
                                            <Select
                                                onValueChange={val => {
                                                    startTransition(() => {
                                                        field.onChange(val)
                                                    })
                                                }}
                                                value={field.value || undefined} required
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full capitalize">
                                                        <SelectValue placeholder="Select country" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        Object.values(ELevelOfEducation).map((level) => (
                                                            <SelectItem key={level} value={level} className="capitalize">
                                                                {level.split('_').join(' ')}
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

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

            <Activity mode={student.academicQualification?.highestLevelOfEducation === ELevelOfEducation.Postgraduate ? 'visible' : 'hidden'}>
                <>
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Postgraduate}
                        student={student}
                    />
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Undergraduate}
                        student={student}
                    />
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Grade12}
                        student={student}
                    />
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Grade10}
                        student={student}
                    />
                </>
            </Activity>

            <Activity mode={student.academicQualification?.highestLevelOfEducation === ELevelOfEducation.Undergraduate ? 'visible' : 'hidden'}>
                <>
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Undergraduate}
                        student={student}
                    />
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Grade12}
                        student={student}
                    />
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Grade10}
                        student={student}
                    />
                </>
            </Activity>

            <Activity mode={student.academicQualification?.highestLevelOfEducation === ELevelOfEducation.Grade12 ? 'visible' : 'hidden'}>
                <>
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Grade12}
                        student={student}
                    />
                    <LevelOfStudyForm
                        levelOfStudy={ELevelOfEducation.Grade10}
                        student={student}
                    />
                </>
            </Activity>

            <Activity mode={student.academicQualification?.highestLevelOfEducation === ELevelOfEducation.Grade10 ? 'visible' : 'hidden'}>
                <LevelOfStudyForm
                    levelOfStudy={ELevelOfEducation.Grade10}
                    student={student}
                />
            </Activity>
        </div>
    )
}

function LevelOfStudyForm({ levelOfStudy, student }: { levelOfStudy: ELevelOfEducation, student: TSingleStudent }) {
    const defaultValues = useMemo(() => {
        return {
            ...student,
            academicQualification: {
                ...student.academicQualification,
                levelOfStudies: {
                    ...student.academicQualification?.levelOfStudies,
                    [levelOfStudy]: student.academicQualification?.levelOfStudies?.[levelOfStudy] || studentLevelOfStudyDefaultValues
                }
            }
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 uppercase">
                            {levelOfStudy.split('_').join(' ')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid @5xl:grid-cols-3 @2xl:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.nameOfBoard`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name of Board<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Eg. National Examination Board" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.nameOfInstitution`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name of Institution<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Eg. Aayam Global School" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.country`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value} required>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Select country" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(ESouthAsianCountry).map((country) => (
                                                        <SelectItem key={country} value={country} className="capitalize">
                                                            {country}
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
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.state`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Eg. Lumbini" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.city`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Eg. Butwal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.degreeAwarded`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Qualification Achieved/Degree Awarded<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Eg. Master of Business Administration" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.gradingSystem`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grading System<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || EGradingSystem.CGPA} required>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Select grading system" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(EGradingSystem).map((gradingSystem) => (
                                                        <SelectItem key={gradingSystem} value={gradingSystem} className="capitalize">
                                                            {gradingSystem}
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
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.score`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Score<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <NumberInput required placeholder="Eg. 3.5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.primaryLanguage`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Primary Language<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Eg. English" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.startDate`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`academicQualification.levelOfStudies.${levelOfStudy}.endDate`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
    )
}


