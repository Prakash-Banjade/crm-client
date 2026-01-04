import { EGender, PaginatedResponse } from ".";
import { ECountry } from "./country.type";
import { TSingleStudent, TStudent } from "./student.types";

export type TLead = Pick<TSingleStudent, "id" | "firstName" | "lastName" | "email" | "phoneNumber" | "createdAt"> & {
   asLead: {
      gender: EGender;
      address: string;
      country: ECountry;
      interestedCourse: string;

   }
}

export type TLeadsResponse = PaginatedResponse<TLead>;  