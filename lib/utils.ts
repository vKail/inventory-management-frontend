import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility to capitalize first letter of each word
export function capitalizeWords(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Utility to format null values for display
export function formatNullValue(value: any, defaultValue: string = "No especificado"): string {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }
  return String(value);
}

// Utility to format numbers for display
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") {
    return "0";
  }
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return num.toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

// Utility to validate text fields (no numbers or special characters)
export function validateTextField(value: string): boolean {
  if (!value || value.trim() === "") return false;

  // Check if contains only letters, spaces, and basic punctuation
  const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:!?()-]+$/;
  return textRegex.test(value.trim());
}

// Utility to get text field error message
export function getTextFieldErrorMessage(fieldName: string): string {
  return `${fieldName} debe contener solo letras y espacios válidos`;
}

// Utility to format boolean values for display
export function formatBooleanValue(value: boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "No especificado";
  }
  return value ? "Sí" : "No";
}

// Utility to format boolean values for display with custom labels
export function formatBooleanValueCustom(
  value: boolean | null | undefined,
  trueLabel: string = "Sí",
  falseLabel: string = "No"
): string {
  if (value === null || value === undefined) {
    return "No especificado";
  }
  return value ? trueLabel : falseLabel;
}
