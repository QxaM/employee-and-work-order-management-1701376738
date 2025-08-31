import { APIRequestContext } from "@playwright/test";
import { ProfileData } from "../types/Profile";

const PROFILE_SERVICE_URL = "http://localhost:8082";

export const getMyProfile = async (
  apiContext: APIRequestContext,
  email: string,
  roles: string[],
): Promise<ProfileData> => {
  const response = await apiContext.get(PROFILE_SERVICE_URL + `/profiles/me`, {
    headers: {
      "X-User": email,
      "X-Roles": roles.join(","),
    },
  });

  if (!response.ok()) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
};
