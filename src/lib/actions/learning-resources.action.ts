"use server";

import { QueryKey } from "../react-query/queryKeys";
import { TLearningResourceSchema } from "../schema/learning-resources.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createLearningResource(
  formData: TLearningResourceSchema
): Promise<ActionResponse> {
  return await serverMutate({
    body: formData,
    endpoint: `/${QueryKey.LEARNING_RESOURCES}`,
    method: "POST",
  });
}

export async function updateLearningResource({
  id,
  formData,
}: {
  id: string;
  formData: TLearningResourceSchema;
}): Promise<ActionResponse> {
  return await serverMutate({
    body: formData,
    endpoint: `/${QueryKey.LEARNING_RESOURCES}/${id}`,
    method: "PATCH",
  });
}

export async function deleteLearningResource(id: string): Promise<ActionResponse> {
  return await serverMutate({
    body: {},
    endpoint: `/${QueryKey.LEARNING_RESOURCES}/${id}`,
    method: "DELETE",
  });
}


