import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/withSession";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(req.session.user);
}

export default withSessionRoute(handler);
