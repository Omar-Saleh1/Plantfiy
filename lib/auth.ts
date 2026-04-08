import { cookies } from "next/headers";

/** Cookie name — use the same string in `/api/set-token` if you change it. */
export const ACCESS_TOKEN_COOKIE = "accessToken";

export async function getUserToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
}
