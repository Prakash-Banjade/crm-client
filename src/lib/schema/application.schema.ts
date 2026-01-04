import z from "zod";
import { EMonth } from "../types";

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