import { z } from "zod";
import { ECountry } from "../types/country.type";
import { EGender } from "../types";

export const LeadSchema = z.object({
    firstName: z.string().min(1, 'First Name is required').max(100, 'First Name must be less than 100 characters'),
    lastName: z.string().min(1, 'Last Name is required').max(100, 'Last Name must be less than 100 characters'),
    email: z.string().email('Email is required'),
    phoneNumber: z.string().min(1, 'Phone Number is required'),
    asLead: z.object({
        gender: z.nativeEnum(EGender),
        address: z.string().max(250, 'Address must be less than 250 characters'),
        country: z.nativeEnum(ECountry),
        interestedCourse: z.string().max(100, 'Interested Course must be less than 100 characters'),
    })
})

export type TLeadSchema = z.infer<typeof LeadSchema>


export const LeadsDefaultValues: TLeadSchema = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    asLead: {
        gender: EGender.Male,
        address: '',
        country: ECountry.NP,
        interestedCourse: '',
    }
};