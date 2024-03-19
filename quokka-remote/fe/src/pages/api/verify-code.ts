// pages/api/callback.js
import { WorkOS } from '@workos-inc/node';
import type { NextApiRequest, NextApiResponse } from 'next';
const workos = new WorkOS(process.env.WORKOS_API_KEY);
const clientId = process.env.WORKOS_CLIENT_ID;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const code = req.query.code as string;

  const { user } = await workos.userManagement.authenticateWithCode({
    code,
    clientId: clientId as string,
  });

  const {id, ...userResponse}= user

  const userResult = {...userResponse, work_id:id }

  res.json(JSON.stringify({user:userResult, code}));
  } catch (error) {
    return res.json({})
  }
};