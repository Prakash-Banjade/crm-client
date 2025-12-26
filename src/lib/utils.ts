import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function extractErrorMessage(error: any): string {
  if (!error || typeof error !== 'object') {
    return 'Something went wrong';
  }

  const messageContainer = error?.message;

  if (typeof messageContainer === 'string') {
    return messageContainer;
  }

  if (typeof messageContainer?.message === 'string') {
    return messageContainer.message;
  }

  if (
    Array.isArray(messageContainer?.message) &&
    messageContainer.message.length > 0 &&
    typeof messageContainer.message[0] === 'string'
  ) {
    return messageContainer.message[0];
  }

  return 'Something went wrong';
}
