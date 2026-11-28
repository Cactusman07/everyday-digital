// Reading environment variables. Server-side only.

/** An environment variable's value, treating unset and blank as the same. */
export const env = (key: string): string | undefined =>
  process.env[key]?.trim() || undefined;
