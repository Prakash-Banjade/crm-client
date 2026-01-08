import { z } from "zod";
import { NAME_REGEX, NAME_WITH_SPACE_REGEX } from "../constants";

export const bdeSchema = z
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
    });

export type TBdeSchema = z.infer<typeof bdeSchema>;

export const bdeDefaultValues: TBdeSchema = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
}