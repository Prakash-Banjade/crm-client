import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingButton } from "../ui/button";
import { AlertCircle, Globe, MapPin, Save } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { studentAddressDefaultValues, studentBackgroundInfoDefaultValues, studentEmergencyContactDefaultValues, studentNationalityDefaultValues, studentPassportDefaultValues, StudentSchema, TStudentSchema } from "@/lib/schema/student.schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { EGender, EMaritalStatus } from "@/lib/types";
import { ESouthAsianCountry } from "@/lib/types/country.type";
import { NumberInput } from "../ui/number-input";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "../ui/multi-select";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { updateStudent } from "@/lib/actions/student.action";
import { useServerAction } from "@/hooks/use-server-action";
import { QueryKey } from "@/lib/react-query/queryKeys";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSingleStudent } from "@/lib/types/student.types";
import { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function StudentPersonalInfoForm({ student }: { student: TSingleStudent }) {
    return (
        <div className="flex-1 space-y-6 mb-40">
            <BasicInfoForm student={student} />

            <div
                className={cn("space-y-6", !student.personalInfo && "opacity-50 pointer-events-none cursor-not-allowed")}
                title={!!student.personalInfo ? "" : "Please fill basic information first"}
            >
                <AddressForm student={student} />

                <PassportAndNationalityForm student={student} />

                <BackgroundInfoForm student={student} />

                <EmergencyContactForm student={student} />
            </div>
        </div>
    )
}

function BasicInfoForm({ student }: { student: TSingleStudent }) {
    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues: {
            ...student,
            personalInfo: {
                ...student.personalInfo,
                dob: (student.personalInfo?.dob || new Date().toISOString().split("T")[0]),
                gender: EGender.Male,
                maritalStatus: EMaritalStatus.Unmarried,
            }
        },
    });

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
                        <CardTitle>Personal Details</CardTitle>
                        <CardDescription>Basic identification details as per your the documents.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <section className="grid md:grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="personalInfo.dob"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date of Birth<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Gender<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(EGender).map((gender) => (
                                                        <SelectItem key={gender} value={gender} className="capitalize">
                                                            {gender}
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
                                name="personalInfo.maritalStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marital Status<span className="text-destructive">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Select marital status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(EMaritalStatus).map((maritalStatus) => (
                                                        <SelectItem key={maritalStatus} value={maritalStatus} className="capitalize">
                                                            {maritalStatus}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
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
    )
}

function AddressForm({ student }: { student: TSingleStudent }) {
    const defaultValues = useMemo(() => {
        return {
            ...student,
            personalInfo: {
                ...student.personalInfo,
                mailingAddress: {
                    ...(student.personalInfo?.mailingAddress || studentAddressDefaultValues),
                },
                permanentAddress: {
                    ...(student.personalInfo?.permanentAddress || studentAddressDefaultValues),
                },
            }
        }
    }, [student])

    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues: defaultValues,
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
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-muted-foreground" /> Address Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        {/* Mailing Address */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wide">Mailing Address</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="personalInfo.mailingAddress.address1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address 1<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input required placeholder="123 Main St" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.mailingAddress.address2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address 2</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apt 123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.mailingAddress.country"
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
                                    name="personalInfo.mailingAddress.state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input required placeholder="Lumbini" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.mailingAddress.city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input required placeholder="Butwal" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.mailingAddress.zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zip Code<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <NumberInput required placeholder="12345" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Separator />

                        {/* Permanent Address */}
                        <div className="space-y-4">
                            <section className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold uppercase tracking-wide">Permanent Address</h3>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="sameAsMailingAddress"
                                        onCheckedChange={checked => {
                                            if (checked) {
                                                form.setValue("personalInfo.permanentAddress", form.getValues("personalInfo.mailingAddress"));
                                            }
                                        }}
                                    />
                                    <Label htmlFor="sameAsMailingAddress">Same as mailing address</Label>
                                </div>
                            </section>
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="personalInfo.permanentAddress.address1"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address 1<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input required placeholder="123 Main St" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.permanentAddress.address2"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address 2</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Apt 123" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.permanentAddress.country"
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
                                    name="personalInfo.permanentAddress.state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>State<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input required placeholder="Lumbini" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.permanentAddress.city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <Input required placeholder="Butwal" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="personalInfo.permanentAddress.zipCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Zip Code<span className="text-destructive">*</span></FormLabel>
                                            <FormControl>
                                                <NumberInput required placeholder="12345" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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

function PassportAndNationalityForm({ student }: { student: TSingleStudent }) {
    const defaultValues = useMemo(() => {
        return {
            ...student,
            personalInfo: {
                ...student.personalInfo,
                passport: {
                    ...(student.personalInfo?.passport || studentPassportDefaultValues),
                },
                nationality: {
                    ...(student.personalInfo?.nationality || studentNationalityDefaultValues),
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
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-muted-foreground" /> Passport & Nationality
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="personalInfo.passport.number"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Passport Number<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="BX123456" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.passport.issueDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Issue Date<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.passport.expiryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry Date<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.passport.issueCountry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country of Issue<span className="text-destructive">*</span></FormLabel>
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
                                name="personalInfo.passport.cityOfBrith"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City of Birth<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Kathmandu" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.passport.countryOfBrith"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Country of Birth<span className="text-destructive">*</span></FormLabel>
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
                                name="personalInfo.nationality.livingAndStudyingCountry"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Is the applicant living and studying in any other country?</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                                name="personalInfo.nationality.otherCountriesCitizenship"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Is the applicant a citizen of more than one country?</FormLabel>
                                        <MultiSelect onValuesChange={field.onChange} values={field.value}>
                                            <FormControl>
                                                <MultiSelectTrigger className="w-full">
                                                    <MultiSelectValue placeholder="Select intakes..." />
                                                </MultiSelectTrigger>
                                            </FormControl>
                                            <MultiSelectContent>
                                                <MultiSelectGroup>
                                                    {
                                                        Object.values(ESouthAsianCountry).map((country) => (
                                                            <MultiSelectItem key={country} value={country}>{country}</MultiSelectItem>
                                                        ))
                                                    }
                                                </MultiSelectGroup>
                                            </MultiSelectContent>
                                        </MultiSelect>
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

function BackgroundInfoForm({ student }: { student: TSingleStudent }) {
    const defaultValues = useMemo(() => {
        return {
            ...student,
            personalInfo: {
                ...student.personalInfo,
                backgroundInfo: {
                    ...(student.personalInfo?.backgroundInfo || studentBackgroundInfoDefaultValues),
                }
            }
        }
    }, [student])

    const form = useForm<TStudentSchema>({
        resolver: zodResolver(StudentSchema),
        defaultValues: student,
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
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-muted-foreground" /> Background Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 border rounded-lg p-4">
                            <FormField
                                control={form.control}
                                name="personalInfo.backgroundInfo.appliedImmigrationCountry"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>Has applicant applied for any type of immigration into any country? <span className="text-xs text-muted-foreground">If yes, please specify</span></FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                                            <FormControl>
                                                <SelectTrigger className="w-52 sm:w-72 capitalize">
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
                            <Separator />
                            <FormField
                                control={form.control}
                                name="personalInfo.backgroundInfo.medicalCondition"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center justify-between">
                                            <FormLabel>Does applicant suffer from serious medical conditions? <span className="text-xs text-muted-foreground">If yes, please specify</span></FormLabel>
                                            <FormControl>
                                                <Input placeholder="Medical condition" className="w-52 sm:w-72" {...field} />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <FormField
                                control={form.control}
                                name="personalInfo.backgroundInfo.criminalRecord"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>Has applicant ever been convicted of a criminal offense? <span className="text-xs text-muted-foreground">If yes, please specify</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Criminal record" className="w-52 sm:w-72" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator />
                            <FormField
                                control={form.control}
                                name="personalInfo.backgroundInfo.visaRefusal"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between">
                                        <FormLabel>Has applicant ever been refused any visa? <span className="text-xs text-muted-foreground">If yes, please clarify</span></FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Visa refusal" className="w-52 sm:w-72 field-sizing-content resize-none" {...field} />
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

function EmergencyContactForm({ student }: { student: TSingleStudent }) {
    const defaultValues = useMemo(() => {
        return {
            ...student,
            personalInfo: {
                ...student.personalInfo,
                emergencyContact: {
                    ...(student.personalInfo?.emergencyContact || studentEmergencyContactDefaultValues),
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
                        <CardTitle>Emergency Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="personalInfo.emergencyContact.name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Parent or Guardian Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.emergencyContact.relationship"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Relationship<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Father/Mother" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.emergencyContact.phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="tel" required placeholder="+977 98********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="personalInfo.emergencyContact.email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address<span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="email" required placeholder="guardian@email.com" {...field} />
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