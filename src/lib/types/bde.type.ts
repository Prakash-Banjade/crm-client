import { PaginatedResponse } from ".";
export type TBde = {
    id: string;
    phoneNumber: string;
    account: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }
}

export type TBdesResponse = PaginatedResponse<TBde>;
