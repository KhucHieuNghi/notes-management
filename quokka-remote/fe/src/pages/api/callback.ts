// pages/api/callback.js
import { WorkOS } from "@workos-inc/node";
import { setCookie } from "cookies-next";
import type { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query.code as string;
  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId: clientId as string,
  });

  const { id, ...userResponse } = user;

  const userResult = { ...userResponse, work_id: id };

  console.log('userResult', userResult, code)

  const tokenRes = await axios.post(
    `${process.env["NEXT_PUBLIC_BASE_URL"]}/oauth2-callback`,
    userResult,
  );

  console.log('tokenRes', tokenRes)

  setCookie(
    process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,
    tokenRes.data.token,
    {
      req,
      res,
      path: "/",
      httpOnly: false,
      secure: false,
    },
  );

  res.redirect("/");
};
