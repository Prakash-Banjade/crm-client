import z from "zod";

export const learningResourceSchema = z.object({
  parentId: z.string().uuid().nullable(),
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "Description is required"),
  files: z.array(z.string().min(1, "files is required")),
});

export type TLearningResourceSchema = z.infer<typeof learningResourceSchema>;

export const learningResourceDefaultValues: TLearningResourceSchema = {
  parentId: null,
  title: "",
  description: "",
  files: [],
};
