import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../../lib/withSession";
import db from "../../../../lib/db";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isLiked = await db.like.findFirst({
    where: {
      tweetId: Number(req.query.id),
      userId: req.session.user?.id,
    },
    select: {
      id: true,
    },
  });

  if (isLiked) {
    await db.like.delete({
      where: {
        id: isLiked.id,
      },
    });
  } else {
    await db.like.create({
      data: {
        user: {
          connect: {
            id: req.session.user?.id,
          },
        },
        tweet: {
          connect: {
            id: Number(req.query.id),
          },
        },
      },
    });
  }

  res.json({});
}

export default withSessionRoute(handler);
