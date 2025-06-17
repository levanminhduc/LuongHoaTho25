/**
 * Safe date formatting utilities to prevent hydration mismatch
 */

/**
 * Format date string safely for SSR/client consistency
 * Uses ISO format on server, localized format on client
 */
export function formatDateSafe(
  dateString: string | Date,
  locale: string = "vi-VN",
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateString) return "";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    // Check if date is valid
    if (isNaN(date.getTime())) return "";

    // For SSR compatibility, use consistent format
    if (typeof window === "undefined") {
      // Server-side: use ISO format that's consistent
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    }

    // Client-side: use localized format
    return date.toLocaleDateString(
      locale,
      options || {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format date with time safely
 */
export function formatDateTimeSafe(
  dateString: string | Date,
  locale: string = "vi-VN"
): string {
  if (!dateString) return "";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) return "";

    if (typeof window === "undefined") {
      // Server-side: use ISO format
      return date.toISOString().replace("T", " ").split(".")[0];
    }

    // Client-side: use localized format
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "";
  }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string | Date): string {
  if (!dateString) return "";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) return "";

    // For SSR consistency, always return the formatted date during SSR
    if (typeof window === "undefined") {
      return formatDateSafe(date);
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return formatDateSafe(date);
  } catch (error) {
    console.error("Error getting relative time:", error);
    return "";
  }
}
