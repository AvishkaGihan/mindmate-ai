/**
 * Client-Side Validation Utilities
 * Provides immediate feedback to users before network requests are initiated.
 * Logic mirrors backend validation to ensure consistency.
 */

// Regular expression for basic email format validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validators = {
  /**
   * Validates an email address.
   * @param email The email string to check.
   * @returns Error message string if invalid, otherwise null.
   */
  email: (email: string): string | null => {
    if (!email) return "Email is required.";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
    return null;
  },

  /**
   * Validates a password.
   * Requirements: Minimum 8 characters.
   * @param password The password string to check.
   * @returns Error message string if invalid, otherwise null.
   */
  password: (password: string): string | null => {
    if (!password) return "Password is required.";
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    // Future: Add checks for numbers/special characters if strict security is required.
    return null;
  },

  /**
   * Validates required text fields (e.g., Name).
   * @param value The text value.
   * @param fieldName The name of the field for the error message.
   * @returns Error message string if invalid, otherwise null.
   */
  required: (value: string, fieldName: string = "Field"): string | null => {
    if (!value || value.trim().length === 0) return `${fieldName} is required.`;
    return null;
  },

  /**
   * Validates journal entry content.
   * @param content The journal text.
   * @returns Error message string if invalid, otherwise null.
   */
  journalContent: (content: string): string | null => {
    if (!content || content.trim().length === 0)
      return "Journal content cannot be empty.";
    // Arbitrary large limit to prevent payload issues, matching typical backend limits
    if (content.length > 10000)
      return "Journal entry is too long (max 10,000 characters).";
    return null;
  },

  /**
   * Validates mood intensity.
   * @param intensity The intensity value, expected 1-10.
   * @returns Error message string if invalid, otherwise null.
   */
  moodIntensity: (intensity: number): string | null => {
    if (intensity < 1 || intensity > 10)
      return "Intensity must be between 1 and 10.";
    return null;
  },
};
