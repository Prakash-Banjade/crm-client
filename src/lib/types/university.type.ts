import { PaginatedResponse } from ".";
import { IRichTextSchema } from "../schema/rich-text.schema";

export type TUniversity = {
    id: string;
    name: string;
    country: {
        id: string,
        name: string,
        states: string[]
        flag: string
    }
    state: string;
    commission: string;
    description: IRichTextSchema;
}

export type TUniversitiesResponse = PaginatedResponse<TUniversity>;