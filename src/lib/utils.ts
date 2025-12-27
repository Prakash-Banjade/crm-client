import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
