import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/withSession";
import db from "../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await db.user.findUnique({
    where: {
      email: req.body.email,
    },
  });

  if (user) {
    req.session.user = user;
    await req.session.save();
  }

  res.json(user);
}

export default withSessionRoute(handler);
