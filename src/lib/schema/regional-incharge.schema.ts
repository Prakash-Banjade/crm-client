import z from "zod";
import { NAME_WITH_SPACE_REGEX } from "../constants";

export const regionalInchargeSchema = z.object({
  name: z.string().min(1, "Name is required").regex(NAME_WITH_SPACE_REGEX, { message: "Name must contain only letters and spaces" }),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Email must be a valid email address"),
  role: z.string().min(1, "Role is required"),
  profileImage: z.string().nullish(),
});

export type TRegionalInchargeSchema = z.infer<typeof regionalInchargeSchema>;

export const regionalInchargeDefaultValues: TRegionalInchargeSchema = {
  name: "",
  phone: "",
  email: "",
  profileImage: null,
  role: "",
};
