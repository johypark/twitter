import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/withSession";
import db from "../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await db.user.create({
    data: {
      ...req.body,
    },
  });

  res.json(user);
}

export default withSessionRoute(handler);
