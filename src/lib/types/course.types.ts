import { EMonth, PaginatedResponse } from ".";
import { ECourseRequirement, EProgramLevel } from "../schema/course.schema";
import { IRichTextSchema } from "../schema/rich-text.schema";

export type TCourse = {
    id: string;
    name: string;
    category: {
        id: string;
        name: string;
    }
    university: {
        id: string;
        name: string;
        state: string;
        country: {
            id: string;
            name: string;
        }
    }
    fee: number;
    applicationFee: number;
    commissions: string[];
    intakes: EMonth[];
    ieltsOverall: number;
    ieltsMinScore: number;
    pteOverall: number;
    pteMinScore: number;
    currency: string;
    minWorkExperience: number;
    gapAccepted: number;
    minGrade12Percentage: number;
    minUgPercentage: number;
    courseUrl: string;
    paymentTerms: string[];
    duration: number;
    requirements: ECourseRequirement[];
    programLevel: EProgramLevel;
    hasScholarship: boolean;
}

export type TCoursesResponse = PaginatedResponse<TCourse>;

export type TSingleCourse = TCourse & { description: IRichTextSchema }