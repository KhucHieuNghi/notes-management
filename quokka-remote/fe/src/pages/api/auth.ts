// Create an API route `pages/api/auth.js`
import { WorkOS } from "@workos-inc/node";
import axios from "axios";
import { getCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;

const getURIProvider = () =>
  workos.userManagement.getAuthorizationUrl({
    provider: "authkit",

    redirectUri: `${process.env["NEXT_PUBLIC_BASE_URL_FE"]}/api/callback`,
    clientId: clientId as string,
  });

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = getCookie(
      process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,
      { req: _req, res },
    ) as string;

    if (!token) {
      const authorizationUrl = getURIProvider();

      return res.redirect(authorizationUrl);
    }

    await axios.post(`${process.env["NEXT_PUBLIC_BASE_URL"]}/me`, {
      token: token,
    });

    return res.redirect("/");
  } catch {
    const authorizationUrl = getURIProvider();

    return res.redirect(authorizationUrl);
  }
};
