/**
 * Date & Time Utilities
 * Handles formatting and manipulation of dates across the application.
 * Uses native Intl APIs to avoid heavy external dependencies like Moment.js.
 */

/**
 * Formats a date into a readable string (e.g., "Dec 15, 2025").
 * @param date ISO string or Date object.
 * @returns Formatted date string.
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
};

/**
 * Formats a time string (e.g., "10:30 AM").
 * @param date ISO string or Date object.
 * @returns Formatted time string.
 */
export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
};

/**
 * Returns a relative time string (e.g., "Just now", "5m ago", "2h ago").
 * Useful for chat interfaces and recent activity.
 * @param date ISO string or Date object.
 */
export const getTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  // Fallback to absolute date for older items
  return formatDate(d);
};

/**
 * Checks if a given date represents today.
 * @param date ISO string or Date object.
 */
export const isToday = (date: string | Date): boolean => {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

/**
 * Returns the day name (e.g., "Monday", "Tue").
 * @param date ISO string or Date object.
 * @param short If true, returns abbreviated day (e.g., "Mon").
 */
export const getDayName = (
  date: string | Date,
  short: boolean = false
): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    weekday: short ? "short" : "long",
  }).format(d);
};

/**
 * Returns a greeting based on the current time of day.
 * Useful for the Home screen welcome message.
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

/**
 * Returns the start of the current week (Sunday) as a Date object.
 * Useful for filtering chart data.
 */
export const getStartOfWeek = (): Date => {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) to 6 (Sat)
  const diff = now.getDate() - day;
  const start = new Date(now.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};
