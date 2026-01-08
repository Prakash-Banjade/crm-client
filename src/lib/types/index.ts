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
    data: T[];
    meta: TMeta;
}

export type SelectOption = {
    label: string,
    value: string,
}

export type TPaginatedOptions = PaginatedResponse<SelectOption>;

export type ActionResponse<T extends { message?: string } = { message?: string }> = {
    success: true;
    data: T;
    error?: null
} | {
    success: false;
    error: {
        message: string;
        error?: string;
    };
    data?: null
};

export type TFileUploadResponse = {
    filename: string;
    originalName: string;
    url: string;
}[]

export enum EMonth {
    January = 'january',
    February = 'february',
    March = 'march',
    April = 'april',
    May = 'may',
    June = 'june',
    July = 'july',
    August = 'august',
    September = 'september',
    October = 'october',
    November = 'november',
    December = 'december',
}

export enum EGender {
    Male = 'male',
    Female = 'female',
    Other = 'other',
}

export enum EMaritalStatus {
    Married = 'married',
    Unmarried = 'unmarried',
    Divorced = 'divorced',
    Widowed = 'widowed',
    Separated = 'separated',
    Other = 'other',
}