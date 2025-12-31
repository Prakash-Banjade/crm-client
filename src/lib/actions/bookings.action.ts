"use server";

import { QueryKey } from "../react-query/queryKeys";
import { CreateBookingInput } from "../schema/booking.schema";
import { serverMutate } from "../server-mutate";
import { ActionResponse } from "../types";

export async function createBooking(
  formData: CreateBookingInput
): Promise<ActionResponse> {
  return await serverMutate({
    body: formData,
    endpoint: `/${QueryKey.BOOKINGS}`,
    method: "POST",
  });
}

export async function updateBooking({
  id,
  formData,
}: {
  id: string;
  formData: CreateBookingInput;
}): Promise<ActionResponse> {
  return await serverMutate({
    body: formData,
    endpoint: `/${QueryKey.BOOKINGS}/${id}`,
    method: "PATCH",
  });
}

export async function deleteBooking(id: string): Promise<ActionResponse> {
  return await serverMutate({
    body: {},
    endpoint: `/${QueryKey.BOOKINGS}/${id}`,
    method: "DELETE",
  });
}
