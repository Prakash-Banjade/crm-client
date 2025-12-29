import z from "zod";
import { NAME_REGEX, NAME_WITH_SPACE_REGEX } from "../constants";

export const adminUserFormSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name is required"
    }).max(50, {
        message: "First name must be at most 50 characters long"
    }).regex(NAME_REGEX, { message: "First name can contain only alphabets" }),
    lastName: z.string().min(1, {
        message: "Last name is required"
    }).max(50, {
        message: "Last name must be at most 50 characters long"
    }).regex(NAME_WITH_SPACE_REGEX, { message: "Last name can contain only alphabets and spaces" }),
    email: z.string().email({
        message: "Invalid email address"
    }),
    organizationId: z.string().uuid(),
});

export type TAdminUserFormSchema = z.infer<typeof adminUserFormSchema>;

export const adminUserFormDefaultValues: TAdminUserFormSchema = {
    firstName: "",
    lastName: "",
    email: "",
    organizationId: "",
}