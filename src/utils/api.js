/**
 * Utility functions for API calls
 */

// Get the API URL from environment variables with fallback
export const getApiUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "localhost:5000";
  // Add https:// prefix if not present and not localhost
  if (!apiUrl.includes("localhost") && !apiUrl.startsWith("http")) {
    return `https://${apiUrl}`;
  }
  // Add http:// prefix for localhost if not present
  if (apiUrl.includes("localhost") && !apiUrl.startsWith("http")) {
    return `http://${apiUrl}`;
  }
  return apiUrl;
};

// Get the full API endpoint
export function getApiEndpoint(path) {
  // Use Railway backend URL from environment variable if available
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://spend-ly-backend-production.up.railway.app";

  // Ensure path starts with a slash
  const formattedPath = path.startsWith("/") ? path : `/${path}`;

  return `${apiUrl}${formattedPath}`;
}
