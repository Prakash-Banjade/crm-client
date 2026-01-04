import z from "zod";
import { EMonth } from "../types";
import { EApplicationPriority, EApplicationStatus } from "../types/application.type";

export const createApplicationSchema = z.object({
    studentId: z.string({ required_error: "Student ID is required" }).uuid({ message: "Invalid Student ID" }),
    course: z.object({
        value: z.string({ required_error: "Course ID is required" }).uuid({ message: "Invalid Course ID" }),
        label: z.string({ required_error: "Course Name is required" }),
    }),
    university: z.object({
        value: z.string({ required_error: "University ID is required" }).uuid({ message: "Invalid University ID" }),
        label: z.string({ required_error: "University Name is required" }),
    }),
    year: z.string({ required_error: "Year is required" }).min(1, { message: "Year is required" }),
    intake: z.nativeEnum(EMonth, { required_error: "Intake is required" }),
});

export type TCreateApplicationSchema = z.infer<typeof createApplicationSchema>;

export const createApplicationDefaultValues: TCreateApplicationSchema = {
    studentId: "",
    course: {
        value: "",
        label: "",
    },
    university: {
        value: "",
        label: "",
    },
    year: "",
    intake: EMonth.January,
};

export const updateApplicationSchema = z.object({
    status: z.nativeEnum(EApplicationStatus).optional(),
    priority: z.nativeEnum(EApplicationPriority).optional(),
});

export type TUpdateApplicationSchema = z.infer<typeof updateApplicationSchema>;

export const applicationMessageSchema = z.object({
    conversationId: z.string().uuid(),
    content: z.string().max(250, { message: "Message must be at most 250 characters long" }).optional(),
    files: z.array(z.object({
        fileName: z.string().min(1, { message: "File is required" })
    })),
}).refine(
    (data) => data.content || data.files?.length,
    {
        message: "At least one of content or files is required",
    }
);

export type TApplicationMessageSchema = z.infer<typeof applicationMessageSchema>;

export const applicationMessageDefaultValues: TApplicationMessageSchema = {
    conversationId: "",
    content: "",
    files: [],
};