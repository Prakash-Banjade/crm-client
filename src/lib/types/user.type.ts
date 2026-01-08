import { PaginatedResponse, Role } from ".";

export type TUser = {
    userId: string;
    profileImageUrl: string | null;
    fullName: string;
    email: string;
    role: Role
    createdAt: string;
    blacklistedAt: string | null;
}

export type TUsersResponse = PaginatedResponse<TUser>