import { PaginatedResponse } from ".";
import { TRegionalInchargeSchema } from "../schema/regional-incharge.schema";

export type TRegionalIncharge = {
  id: string;
  name: string;
  phone: string;
  profileImage: string | null;
  email: string;

  createdAt: string;
};

export type TRegionalInchargeResponse = PaginatedResponse<TRegionalIncharge>;

export type TSingleOrganization = TRegionalInchargeSchema & TRegionalIncharge;
