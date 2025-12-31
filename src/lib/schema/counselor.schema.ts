import { z } from "zod";
import { NAME_REGEX, NAME_WITH_SPACE_REGEX } from "../constants";

export enum ECounselorType {
    Application = 'application',
    Commission = 'commission',
}

export const counselorSchema = z
    .object({
        firstName: z
            .string({ required_error: "First name is required" })
            .min(1, "First name should not be empty")
            .regex(NAME_REGEX, "Name can have only alphabets"),

        lastName: z
            .string({ required_error: "Last name is required" })
            .min(1, "Last name should not be empty")
            .regex(NAME_WITH_SPACE_REGEX, "Seems like invalid last name"),

        email: z
            .string({ required_error: "Email is required" })
            .email("Email must be a valid email address"),

        phoneNumber: z
            .string({ required_error: "Phone number is required" })
            .min(1, "Phone number is required"),

        type: z.nativeEnum(ECounselorType, {
            required_error: "Counselor type is required",
            invalid_type_error: "Invalid counselor type",
        }),

        seeAndReceiveApplicationNotifications: z
            .boolean()
            .optional(),

        exportApplicationToExcelFile: z
            .boolean()
            .optional(),

        showCommissionInfo: z
            .boolean()
            .optional(),

        reassignStudents: z
            .boolean()
            .optional(),

        hideSensitiveChatContent: z
            .boolean()
            .optional(),

        hideCommissionFromPromotionalContent: z
            .boolean()
            .optional(),
    });

export type TCounselorSchema = z.infer<typeof counselorSchema>;

export const counselorDefaultValues: TCounselorSchema = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    type: ECounselorType.Application,
    seeAndReceiveApplicationNotifications: false,
    exportApplicationToExcelFile: false,
    showCommissionInfo: false,
    reassignStudents: false,
    hideSensitiveChatContent: false,
    hideCommissionFromPromotionalContent: false,
}