// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

type LogoutResponse = { success: true } | { error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<LogoutResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ error: `Method ${req.method} Not Allowed` });
  }

  // Ici tu pourrais plus tard effacer un cookie de session, etc.
  return res.status(200).json({ success: true });
}
