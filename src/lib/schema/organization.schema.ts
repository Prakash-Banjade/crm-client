import { z } from "zod";

export const bankingDetailsSchema = z.object({
    bankName: z.string().min(1, "Bank Name is required"),
    bankLocation: z.string().min(1, "Bank Location is required"),
    bankState: z.string().min(1, "Bank State is required"),
    bankCity: z.string().min(1, "Bank City is required"),
    accountNumber: z.string().min(1, "Account Number is required"),
    benificiaryName: z.string().min(1, "Benificiary Name is required"),
    swiftCode: z.string().optional(),
});

export const organizationSchema = z.object({
    name: z.string().min(1, "Organization Name is required"),
    address: z.string().min(1, "Address is required"),
    contactNumber: z.string().min(1, "Contact Number is required"),
    concerningPersonName: z.string().min(1, "Concerning Person Name is required"),
    email: z.string().email("Email must be a valid email address"),
    vatNumber: z.string().min(1, "VAT Number is required"),
    panNumber: z.string().min(1, "Pan Number is required"),
    bankingDetails: bankingDetailsSchema,
    websiteUrl: z.string().url("Website URL must be a valid URL").optional(),
    brandColorPrimary: z.string().optional(),
    brandColorSecondary: z.string().optional(),
    logo: z.string().nullish(),
    panCertificate: z.string().nullish(),
    registrationDocument: z.string().nullish(),
});

export type TBankingDetailsSchema = z.infer<typeof bankingDetailsSchema>;
export type TOrganizationSchema = z.infer<typeof organizationSchema>;

export const organizationDefaultValues: TOrganizationSchema = {
    name: "",
    address: "",
    contactNumber: "",
    concerningPersonName: "",
    email: "",
    vatNumber: "",
    panNumber: "",
    bankingDetails: {
        bankName: "",
        bankLocation: "",
        bankState: "",
        bankCity: "",
        accountNumber: "",
        benificiaryName: "",
        swiftCode: "",
    },
    websiteUrl: "",
    brandColorPrimary: "#1447e6",
    brandColorSecondary: "#1447e6",
    logo: null,
    panCertificate: null,
    registrationDocument: null,
}