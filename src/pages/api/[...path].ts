import type { NextApiRequest, NextApiResponse } from "next";
import { connectDb } from "@/server/config/db";
import { createApp } from "@/server/app";

// Express parses the body itself; Next.js must not consume the stream first.
export const config = {
  api: {
    bodyParser: false,
  },
};

const app = createApp();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  await connectDb();

  await new Promise<void>((resolve, reject) => {
    res.on("finish", resolve);
    res.on("close", resolve);
    res.on("error", reject);
    app(req, res);
  });
}
