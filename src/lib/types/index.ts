export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    COUNSELOR = 'counselor',
    BDE = 'bde',
    USER = 'user',
}

export type TMeta = {
    page: number;
    take: number;
    itemCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
};

export interface PaginatedResponse<T> {
    data: T & {
        id: string,
        [key: string]: any
    }[];
    meta: TMeta;
}

export type SelectOption = {
    label: string,
    value: string,
}