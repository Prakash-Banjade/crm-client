import z from "zod";
import { richTextDefaultValues, richTextSchema } from "./rich-text.schema";

export const universitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  country: z.object({
    id: z.string().uuid("Country is required"),
    name: z.string().min(1, "Country is required"),
    image: z.string().min(1, "Flag is required"),
    states: z.array(z.string().min(1, "State is required"))
  }),
  state: z.string().min(1, "State is required"),
  commission: z.string().min(1, "Commission is required"),
  description: richTextSchema
});

export type TUniversitySchema = z.infer<typeof universitySchema>;

export const universityDefaultValues: TUniversitySchema = {
  name: "",
  country: {
    id: "",
    name: "",
    image: "",
    states: []
  },
  state: "",
  commission: "",
  description: richTextDefaultValues,
};
