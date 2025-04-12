
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Safe string lowercase function that handles null/undefined
export function safeToLowerCase(str: string | null | undefined): string {
  return str ? str.toLowerCase() : '';
}
