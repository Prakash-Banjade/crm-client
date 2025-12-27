import { PaginatedResponse } from "."

export type TOrganization = {
    id: string,
    name: string,
    contactNumber: string,
    email: string,
    concerningPersonName: string,
    createdBy: string | null,
    blackListedAt: string | null
    createdAt: string
}

export type TOrganizationsResponse = PaginatedResponse<TOrganization>