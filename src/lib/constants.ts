export const PHONE_NUMBER_REGEX = /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

export const PHONE_NUMBER_REGEX_STRING = '^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$'

export const enum AuthMessage {
    INVALID_AUTH_CREDENTIALS_MSG = 'Invalid email or password',
    DEVICE_NOT_FOUND = 'Invalid device identity',
    TOKEN_EXPIRED = "TokenExpiredError",
};

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NAME_REGEX = /^[A-Za-z]+$/;
export const NAME_WITH_SPACE_REGEX = /^[A-Za-z.]+( [A-Za-z.]+)*$/;

export const MILITARY_TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const NUMBER_REGEX_STRING = '^[0-9]*$'

export const ISO_TIME = 'T00:00:00Z' as const;

export const RESEND_OTP_TIME_SEC = 60;

export enum CookieKey {
    ORGANIZATION_ID = 'organizationId',
    ACCESS_TOKEN = 'access_token',
    REFRESH_TOKEN = 'refresh_token',
}