import { z } from "zod";
import { NAME_WITH_SPACE_REGEX } from "../constants";

export enum EBookingType {
    IELTS = 'ielts',
    PTE = 'pte',
}

export enum EBookingSubType {
    GENERAL = 'general',
    ACADEMIC = 'academic',
    UKVI = 'ukvi',
}

export const bookingSchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .min(1, "Name is required")
        .regex(NAME_WITH_SPACE_REGEX, { message: "Name should not contain special characters" }),

    dob: z
        .string({ required_error: "Date of birth is required" })
        .refine((value) => new Date(value) < new Date(), "Date of birth must be before today"),

    email: z
        .string({ required_error: "Email is required" })
        .email("Email must be a valid email address"),

    type: z.nativeEnum(EBookingType, {
        required_error: "Booking type is required",
        invalid_type_error: "Booking type is invalid",
    }),

    subType: z.nativeEnum(EBookingSubType, {
        required_error: "Booking sub type is required",
        invalid_type_error: "Booking sub type is invalid",
    }),

    location: z
        .string({ required_error: "Location is required" })
        .min(1, "Location is required"),

    phNo: z
        .string({ required_error: "Phone number is required" })
        .min(1, "Phone number is required"),

    bookingDate: z
        .string({ required_error: "Booking date is required" })
        .refine((value) => new Date(value) >= new Date(), "Booking date cannot be a past date"),

    passportAttachment: z
        .string({ required_error: "Passport attachment is required" })
        .min(1, "Passport attachment is required"),

    paymentProof: z
        .string({ required_error: "Payment proof is required" })
        .min(1, "Payment proof is required"),
});

export type CreateBookingInput = z.infer<typeof bookingSchema>;

export const bookingDefaultValues: CreateBookingInput = {
    name: "",
    dob: "",
    email: "",
    type: EBookingType.IELTS,
    subType: EBookingSubType.GENERAL,
    location: "",
    phNo: "",
    bookingDate: "",
    passportAttachment: "",
    paymentProof: "",
};
