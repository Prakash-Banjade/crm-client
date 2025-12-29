import z from "zod";

export const adminUserFormSchema = z.object({
    firstName: z.string().min(1, {
        message: "First name is required"
    }).max(50, {
        message: "First name must be at most 50 characters long"
    }),
    lastName: z.string().min(1, {
        message: "Last name is required"
    }).max(50, {
        message: "Last name must be at most 50 characters long"
    }),
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