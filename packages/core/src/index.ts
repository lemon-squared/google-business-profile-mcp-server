export const serverName = "google-business-profile-mcp";

/** Supplies a Google access token. The CLI and a future hosted worker both implement this. */
export interface BusinessProfileAuthProvider {
  getAccessToken: () => Promise<string>;
}
