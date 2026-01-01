import z from "zod";
import { ECountry } from "../types/country.type";
import { differenceInYears, isFuture, isPast } from "date-fns";
import { EGender, EMaritalStatus } from "../types";
import { ELevelOfEducation, EModeOfSalary } from "../types/student.types";
import { NAME_REGEX, NAME_WITH_SPACE_REGEX } from "../constants";

export const StudentDocumentsSchema = z.object({
    cv: z.string().min(1, 'CV is required'),
    gradeTenMarksheet: z.string().min(1, 'Grade 10 Marksheet is required'),
    gradeElevenMarksheet: z.string().optional(),
    gradeTwelveMarksheet: z.string().min(1, 'Grade 12 Marksheet is required'),
    passport: z.string().min(1, 'Passport is required'),
    ielts: z.string().min(1, 'IELTS is required'),
    recommendationLetter: z.string().min(1, 'Recommendation Letter is required'),
    workExperience: z.string().optional(),
});

export const StudentAddressSchema = z.object({
    address1: z.string().min(1, 'Address 1 is required').max(250, 'Address 1 must be less than 250 characters'),
    address2: z.string().optional(),
    city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
    country: z.nativeEnum(ECountry, { required_error: 'Country is required' }),
    state: z.string().min(1, 'State is required').max(100, 'State must be less than 100 characters'),
    zipCode: z.coerce.number().min(1, 'Zip Code is required'),
});

export const StudentPassportSchema = z.object({
    number: z.string().min(1, 'Passport Number is required'),
    issueDate: z.string().datetime(),
    expiryDate: z.string().datetime(),
    issueCountry: z.nativeEnum(ECountry, { required_error: 'Issue Country is required' }),
    cityOfBrith: z.string().min(1, 'City of Birth is required').max(100, 'City of Birth must be less than 100 characters'),
    countryOfBrith: z.nativeEnum(ECountry, { required_error: 'Country of Birth is required' }),
}).refine((data) => data.issueDate <= data.expiryDate, {
    message: 'Issue Date must be less than or equal to Expiry Date',
    path: ['expiryDate'],
}).refine((data) => isFuture(data.expiryDate), {
    message: 'Expiry Date must be in the future',
    path: ['expiryDate'],
})

export const StudentNationalitySchema = z.object({
    nationality: z.nativeEnum(ECountry, { required_error: 'Nationality is required' }),
    citizenship: z.nativeEnum(ECountry, { required_error: 'Citizenship is required' }),
    livingAndStudyingCountry: z.nativeEnum(ECountry, { required_error: 'Living and Studying Country is required' }),
    otherCountriesCitizenship: z.array(z.nativeEnum(ECountry)).optional(),
});

export const StudentBackgroundInfoSchema = z.object({
    appliedImmigrationCountry: z.nativeEnum(ECountry).optional(),
    medicalCondition: z.string().min(1, 'Medical Condition is required').max(250, 'Medical Condition must be less than 250 characters'),
    visaRefusalCountries: z.array(z.nativeEnum(ECountry)),
    criminalRecord: z.string().max(250, 'Criminal Record must be less than 250 characters').optional(),
});

export const StudentEmergencyContactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    relationship: z.string().min(1, 'Relationship is required').max(100, 'Relationship must be less than 100 characters'),
    phoneNumber: z.string().min(5, 'Phone Number is required'),
    email: z.string().email('Email is required'),
});

export const StudentPersonalInfoSchema = z.object({
    dob: z.string().datetime({ message: 'Date of Birth is required' }),
    gender: z.nativeEnum(EGender, { message: 'Gender is required' }),
    maritalStatus: z.nativeEnum(EMaritalStatus, { message: 'Marital Status is required' }),
    mailingAddress: StudentAddressSchema,
    permanentAddress: StudentAddressSchema,
    passport: StudentPassportSchema,
    nationality: StudentNationalitySchema,
    backgroundInfo: StudentBackgroundInfoSchema,
    emergencyContact: StudentEmergencyContactSchema,
}).refine((data) => isPast(data.dob) && differenceInYears(data.dob, new Date()) >= 16, {
    message: 'Date of Birth must be at least 16 years old',
    path: ['dob'],
});

export const StudentLevelOfStudySchema = z.object({
    levelOfStudy: z.nativeEnum(ELevelOfEducation, { message: 'Level of Study is required' }),
    nameOfBoard: z.string().min(1, 'Name of Board is required').max(100, 'Name of Board must be less than 100 characters'),
    nameOfInstitution: z.string().min(1, 'Name of Institution is required').max(100, 'Name of Institution must be less than 100 characters'),
    country: z.nativeEnum(ECountry, { message: 'Country is required' }),
    state: z.string().min(1, 'State is required').max(100, 'State must be less than 100 characters'),
    city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
    degreeAwarded: z.string().min(1, 'Degree Awarded is required').max(100, 'Degree Awarded must be less than 100 characters'),
    score: z.coerce.number().min(0, 'Score must be greater than 0'),
    primaryLanguage: z.string().min(1, 'Primary Language is required').max(100, 'Primary Language must be less than 100 characters'),
    startDate: z.string().datetime({ message: 'Start Date is required' }),
    endDate: z.string().datetime({ message: 'End Date is required' }),
}).refine((data) => isPast(data.endDate) && data.endDate >= data.startDate, {
    message: 'End Date must be a past date and greater than Start Date',
    path: ['endDate'],
})

export const StudentAcademicQualificationSchema = z.object({
    countryOfEducation: z.nativeEnum(ECountry),
    highestLevelOfEducation: z.nativeEnum(ELevelOfEducation),
    levelOfStudies: z.array(StudentLevelOfStudySchema).min(1),
});

export const StudentWorkExperienceSchema = z.object({
    organization: z.string().min(1, 'Organization is required').max(100, 'Organization must be less than 100 characters'),
    position: z.string().min(1, 'Position is required').max(100, 'Position must be less than 100 characters'),
    jobProfile: z.string().min(1, 'Job Profile is required').max(100, 'Job Profile must be less than 100 characters'),
    workingFrom: z.string().datetime({ message: 'Working From is required' }),
    workingTo: z.string().datetime({ message: 'Working To is required' }).optional(),
    modeOfSalary: z.nativeEnum(EModeOfSalary, { message: 'Mode of Salary is required' }),
    comment: z.string().max(250, 'Comment must be less than 250 characters').optional(),
}).refine((data) => data.workingTo && (isPast(data.workingTo) && data.workingTo >= data.workingFrom), {
    message: 'Working To must be a past date and greater than Working From',
    path: ['workingTo'],
}).refine((data) => isPast(data.workingFrom), {
    message: 'Working From must be a past date',
    path: ['workingFrom'],
})

export const StudentSchema = z.object({
    firstName: z.string().min(1, "First Name is required").regex(NAME_REGEX, { message: "Invalid First Name. First Name should contain only letters" }),
    lastName: z.string().min(1, "Last Name is required").regex(NAME_WITH_SPACE_REGEX, { message: "Invalid Last Name. Last Name should contain only letters and spaces" }),
    email: z.string().email("Invalid Email"),
    phoneNumber: z.string().min(1, "Phone Number is required"),
    personalInfo: StudentPersonalInfoSchema.optional(),
    academicQualification: StudentAcademicQualificationSchema.optional(),
    workExperiences: z
        .array(StudentWorkExperienceSchema)
        .optional(),
    documents: StudentDocumentsSchema.optional(),
});

export type TStudentSchema = z.infer<typeof StudentSchema>;

export const studentDefaultValues: TStudentSchema = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    personalInfo: undefined,
    academicQualification: undefined,
    workExperiences: [],
    documents: undefined,
}
