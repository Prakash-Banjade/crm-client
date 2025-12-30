import z from "zod";

export const regionalInchargeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Email must be a valid email address"),

  profileImage: z.string().nullish(),
});

export type TRegionalInchargeSchema = z.infer<typeof regionalInchargeSchema>;

export const regionalInchargeDefaultValues: TRegionalInchargeSchema = {
  name: "",
  phone: "",
  email: "",
  profileImage: null,
};
