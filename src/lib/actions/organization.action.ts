"use server";

import { TOrganizationSchema } from "../schema/organization.schema";
import { serverFetch } from "../server-fetch";
import { ActionResponse } from "../types";
import { extractErrorMessage } from "../utils";

export async function createOrganization(formData: TOrganizationSchema): Promise<ActionResponse> {
    const res = await serverFetch("/organizations", {
        method: "POST",
        body: JSON.stringify(formData),
        cache: 'no-store'
    });

    const data = await res.json();

    if (!res.ok) {
        console.log(data)
        const message = extractErrorMessage(data);
        return {
            success: false,
            error: {
                message: message.message,
                error: message.error
            }
        }
    }

    return {
        success: true,
        data,
    };
}