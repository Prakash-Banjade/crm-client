import "server only";

import { cacheTag } from "next/cache";
import { QueryKey } from "../react-query/queryKeys";
import { serverFetch } from "../server-fetch";

export const getOrganizationById = async (id: string) => {
    'use cache'
    cacheTag(QueryKey.ORGANIZATIONS, id);

    const response = await serverFetch('/' + QueryKey.ORGANIZATIONS + '/' + id);
    const data = await response.json();
    return data;
}