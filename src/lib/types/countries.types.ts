import { PaginatedResponse } from ".";

export type TCountry = {
id: string;
name: string;
flag: string | null;
states : string[];
createdAt: string;
}

export type TCountriesResponse = PaginatedResponse<TCountry>;