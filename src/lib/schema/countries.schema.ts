import z from "zod";

export const countriesSchema = z.object({
  name: z.string().min(1, "Name is required"),

  states: z
    .array(z.string().min(1, "State name is required"))
    .min(1, "At least one state is required"),
  flag: z.string().nullish(),
});

export type TCountriesSchema = z.infer<typeof countriesSchema>;

export const countriesDefaultValues: TCountriesSchema = {
  name: "",
  states: [],
  flag: null,
};
