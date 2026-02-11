import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Convert URL parameter value from dashed format to spaced format
 * Example: "very-satisfied" -> "very satisfied"
 */
export function formatAnswerValue(value: string): string {
  return value.replace(/-/g, ' ')
}

/**
 * Format date to a readable string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
