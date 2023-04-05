import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../lib/withSession";
import db from "../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tweet = await db.tweet.create({
    data: {
      user: {
        connect: {
          id: req.session.user?.id,
        },
      },
      tweet: req.body.tweet,
    },
  });

  res.json(tweet);
}

export default withSessionRoute(handler);
