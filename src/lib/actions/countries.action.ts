"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TCountriesSchema } from "../schema/countries.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createCountry(
  formData: TCountriesSchema
): Promise<ActionResponse> {
  return await serverMutate({
    body: formData,
    endpoint: `/${QueryKey.COUNTRIES}`,
    method: "POST",
  });
}

export async function updateCountry({
  id,
  formData,
}: {
  id: string;
  formData: TCountriesSchema;
}): Promise<ActionResponse> {
  return await serverMutate({
    body: formData,
    endpoint: `/${QueryKey.COUNTRIES}/${id}`,
    method: "PATCH",
  });
}

export async function deleteCountry(id: string): Promise<ActionResponse> {
  return await serverMutate({
    body: {},
    endpoint: `/${QueryKey.COUNTRIES}/${id}`,
    method: "DELETE",
  });
}
