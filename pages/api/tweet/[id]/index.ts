import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../../lib/withSession";
import db from "../../../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tweet = await db.tweet.findUnique({
    where: {
      id: Number(req.query.id),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  const isLiked = await db.like.findFirst({
    where: {
      tweetId: Number(req.query.id),
      userId: req.session.user?.id,
    },
    select: {
      id: true,
    },
  });

  res.json({ tweet, isLiked });
}

export default withSessionRoute(handler);
