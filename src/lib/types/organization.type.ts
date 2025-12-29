import { PaginatedResponse } from "."
import { TOrganizationSchema } from "../schema/organization.schema"

export type TOrganization = {
    id: string,
    name: string,
    contactNumber: string,
    email: string,
    concerningPersonName: string,
    createdBy: string | null,
    blacklistedAt: string | null
    createdAt: string
}

export type TOrganizationsResponse = PaginatedResponse<TOrganization>

export type TSingleOrganization = TOrganizationSchema & TOrganization;