import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  getCompetitionIdentityBySlug,
  getCompetitionSlugFromName,
} from "./competition-identity";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get status color classes for competition registration status
 */
export function getStatusColors(status: string) {
  const statusLower = status.toLowerCase();

  if (
    statusLower === "verified" ||
    statusLower === "complete" ||
    statusLower === "paid"
  ) {
    return {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
    };
  }

  if (
    statusLower === "incomplete" ||
    statusLower === "pending" ||
    statusLower === "waiting"
  ) {
    return {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-600",
    };
  }

  if (statusLower === "rejected" || statusLower === "failed") {
    return {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
    };
  }

  // Default
  return {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
  };
}

/**
 * Get stage color classes for competition stage
 */
export function getStageColors(stage: string) {
  const stageLower = stage.toLowerCase();

  if (stageLower === "final") {
    return {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
    };
  }

  if (stageLower === "semifinal") {
    return {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      text: "text-indigo-600",
    };
  }

  if (stageLower === "preliminary") {
    return {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
    };
  }

  // Default
  return {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
  };
}

/**
 * Get display label for sales type
 */
export function getSalesTypeLabel(salesType: string) {
  const normalized = salesType.toLowerCase();

  if (normalized === "early_bird") return "Early Bird";
  if (normalized === "normal") return "Normal";
  if (normalized === "flash_sale") return "Flash Sale";

  return salesType;
}

/**
 * Competition slug mapping based on event name
 */
export function getCompetitionSlug(eventName: string): string {
  const resolvedSlug = getCompetitionSlugFromName(eventName);
  return resolvedSlug || eventName.toLowerCase().replace(/\s+/g, "-");
}

/**
 * Get display name from slug (reverse mapping)
 */
export function getDisplayNameFromSlug(slug: string): string {
  return getCompetitionIdentityBySlug(slug)?.displayName || "Competition";
}
