import { z } from "zod";
import { EMonth } from "../types";
import { richTextDefaultValues, richTextSchema } from "./rich-text.schema";

export enum EProgramLevel {
    High_School = 'high_school',
    UG_Diploma_Certificate_Associate_Degree = 'ug_diploma_certificate_associate_degree',
    UG = 'ug',
    PG_Diploma_Certificate = 'pg_diploma_certificate',
    PG = 'pg',
    UG_PG_Accelerated_Degree = 'ug_pg_accelerated_degree',
    PHD = 'phd',
    Foundation = 'foundation',
    Short_Term_Programs = 'short_term_programs',
    Pathway_Programs = 'pathway_programs',
    Twinning_Programmes_UG = 'twinning_programmes_ug',
    Twinning_Programmes_PG = 'twinning_programmes_pg',
    English_Language_Program = 'english_language_program',
    Online_Programmes_Distance_Learning = 'online_programmes_distance_learning',
}

export enum ECourseRequirement {
    PTE = 'pte',
    TOEFL_iBT = 'toefl_ibt',
    IELTS = 'ielts',
    DET = 'det',
    SAT = 'sat',
    ACT = 'act',
    GRE = 'gre',
    GMAT = 'gmat',
    Without_English_Proficiency = 'without_english_proficiency',
    Without_GRE = 'without_gre',
    Without_GMAT = 'without_gmat',
    Without_Maths = 'without_maths',
    STEM_Courses = 'stem_courses',
    Scholarship_Available = 'scholarship_available',
    With_15_Years_Of_Education = 'with_15_years_of_education',
    [`Application_Fee_Waiver_(100%)`] = 'application_fee_waiver_100',
}

export const courseSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name should not be empty"),

    description: richTextSchema,

    category: z.object({
        value: z
            .string({ required_error: "Category ID is required" })
            .uuid("Category ID must be a valid UUID"),
        label: z.string({ required_error: "Category name is required" })
    }),

    university: z.object({
        value: z
            .string({ required_error: "University ID is required" })
            .uuid("University ID must be a valid UUID"),
        label: z.string({ required_error: "University name is required" })
    }),

    fee: z
        .coerce
        .number({ required_error: "Fee is required" })
        .min(0, "Fee cannot be less than 0"),

    applicationFee: z
        .coerce
        .number({ required_error: "Application fee is required" })
        .min(0, "Application fee cannot be less than 0"),

    currency: z
        .string({ required_error: "Currency is required" })
        .min(1, "Currency should not be empty"),

    commissions: z
        .array(
            z.string().min(1, "Commission value should not be empty"),
            { required_error: "Commissions are required" }
        ),

    intakes: z
        .array(z.nativeEnum(EMonth), {
            required_error: "Intakes are required",
        })
        .min(1, "At least one intake is required"),

    ieltsOverall: z
        .coerce
        .number()
        .min(0, "IELTS overall score cannot be less than 0")
        .max(9, "IELTS overall score cannot be greater than 9"),

    ieltsMinScore: z
        .coerce
        .number()
        .min(0, "IELTS minimum score cannot be less than 0")
        .max(9, "IELTS minimum score cannot be greater than 9"),

    pteOverall: z
        .coerce
        .number()
        .min(0, "PTE overall score cannot be less than 0")
        .max(90, "PTE overall score cannot be greater than 90"),

    pteMinScore: z
        .coerce
        .number()
        .min(0, "PTE minimum score cannot be less than 0")
        .max(90, "PTE minimum score cannot be greater than 90"),

    minWorkExperience: z
        .coerce
        .number()
        .min(0, "Minimum work experience cannot be less than 0"),

    gapAccepted: z
        .coerce
        .number()
        .min(0, "Gap accepted cannot be less than 0"),

    minGrade12Percentage: z
        .coerce
        .number()
        .min(0, "Minimum grade 12 percentage cannot be less than 0")
        .max(100, "Minimum grade 12 percentage cannot be greater than 100"),

    minUgPercentage: z
        .coerce
        .number()
        .min(0, "Minimum UG percentage cannot be less than 0")
        .max(100, "Minimum UG percentage cannot be greater than 100"),

    courseUrl: z
        .string({ required_error: "Course URL is required" })
        .url("Course URL must be a valid URL"),

    paymentTerms: z
        .array(
            z.string().min(1, "Payment term should not be empty"),
            { required_error: "Payment terms are required" }
        ),

    duration: z
        .number({ required_error: "Duration is required" })
        .min(1, "Duration cannot be less than 1 month"),

    requirements: z
        .array(z.nativeEnum(ECourseRequirement), {
            required_error: "Requirements are required",
        }),

    programLevel: z.nativeEnum(EProgramLevel, {
        required_error: "Program level is required",
        invalid_type_error: "Program level is invalid",
    }),

    hasScholarship: z.boolean(),
});

export type TCourseSchema = z.infer<typeof courseSchema>;

export const courseDefaultValues: TCourseSchema = {
    name: '',
    description: richTextDefaultValues,
    category: {
        value: '',
        label: ''
    },
    university: {
        value: '',
        label: ''
    },
    fee: 0,
    applicationFee: 0,
    currency: '',
    commissions: [],
    intakes: [],
    ieltsOverall: 0,
    ieltsMinScore: 0,
    pteOverall: 0,
    pteMinScore: 0,
    minWorkExperience: 0,
    gapAccepted: 0,
    minGrade12Percentage: 0,
    minUgPercentage: 0,
    courseUrl: '',
    paymentTerms: [],
    duration: 0,
    requirements: [],
    programLevel: EProgramLevel.High_School,
    hasScholarship: false,
}
