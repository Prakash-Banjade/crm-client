import { PaginatedResponse } from ".";
import { EBookingType, EBookingSubType, CreateBookingInput } from "../schema/booking.schema";

export type TBooking = {
    id: string;
    name: string;
    dob: string;
    email: string;
    type: EBookingType;
    subType: EBookingSubType;
    location: string;
    phNo: string;
    bookingDate: string;
    passportAttachment: string;
    paymentProof: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TBookingResponse = PaginatedResponse<TBooking>;
export type TSingleBooking = CreateBookingInput & TBooking;

