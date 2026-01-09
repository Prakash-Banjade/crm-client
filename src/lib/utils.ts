import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { EMonth } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractErrorMessage(error: any): { error: string, message: string } {
  if (!error || typeof error !== 'object') {
    return { error: 'Error', message: 'Something went wrong' };
  }

  const messageContainer = error?.message;

  if (typeof messageContainer === 'string') {
    return { error: error.error || 'Error', message: messageContainer };
  }

  if (typeof messageContainer?.message === 'string') {
    return { error: messageContainer?.error || 'Error', message: messageContainer.message };
  }

  if (
    Array.isArray(messageContainer?.message) &&
    messageContainer.message.length > 0 &&
    typeof messageContainer.message[0] === 'string'
  ) {
    return { error: messageContainer?.error || 'Error', message: messageContainer.message[0] };
  }

  return { error: 'Error', message: 'Something went wrong' };
}

export function createQueryString(params: Record<string, any>) {
  // Remove undefined values
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => !!value)
  );

  return new URLSearchParams(filteredParams).toString();
}

export function truncateFilename(filename: string, maxLength: number) {
  const lastDotIndex = filename.lastIndexOf('.');

  // Handle case with no extension
  if (lastDotIndex === -1) {
    return filename.length > maxLength ? `${filename.slice(0, maxLength)}...` : filename;
  }

  const name = filename.slice(0, lastDotIndex);
  const extension = filename.slice(lastDotIndex);

  // If filename exceeds max length, truncate the name part
  return (name.length > maxLength - extension.length - 3)
    ? `${name.slice(0, maxLength - extension.length - 3)}...${extension}`
    : filename;
}

export function getObjectUrl(filename: string): string {
  return `${process.env.NEXT_PUBLIC_FILE_PREFIX}${filename}`;
}

export function getKeyByValue(obj: { [key: string]: any }, value: any) {
  return Object.keys(obj).find(key => obj[key] === value);
}

export function getAcronym(name: string) {
  const words = name.split(" ")

  const firstInitial = words[0] ? words[0][0].toUpperCase() : ""
  const secondInitial = words[1] ? words[1][0].toUpperCase() : ""

  return firstInitial + secondInitial
}

export function sortMonths(givenMonths: EMonth[]) {
  const monthsArr = Object.values(EMonth);

  return givenMonths.sort((a, b) => monthsArr.indexOf(a) - monthsArr.indexOf(b));
}