import React from "react";
import useUser from "../../lib/useUser";
import useMutation from "../../lib/useMutation";
import useSWR from "swr";
import { Tweet } from "@prisma/client";
import { useRouter } from "next/router";
import { cls } from "../../lib/utils";

interface TweetWithCount extends Tweet {
  user: {
    name: string;
  };
  _count: {
    likes: number;
  };
}
interface TweetResponse {
  tweet: TweetWithCount;
  isLiked: boolean;
}

export default () => {
  const {
    query: { id },
  } = useRouter();
  const user = useUser();
  const { data, mutate } = useSWR<TweetResponse>(id && `/api/tweet/${id}`);
  const [toggleLike] = useMutation(`/api/tweet/${id}/like`);

  const onLikeClick = () => {
    if (!data) return;

    mutate(
      (prev) =>
        prev && {
          ...prev,
          isLiked: !prev.isLiked,
          tweet: {
            ...prev.tweet,
            _count: {
              likes: prev.tweet._count.likes + (prev.isLiked ? -1 : 1),
            },
          },
        },
      false
    );
    toggleLike({});
  };

  return (
    <div className="h-screen bg-neutral-900 text-white p-8 flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="p-2 bg-neutral-800 rounded-lg">
          <div className="font-bold pb-2">{data?.tweet.user.name}</div>
          {data?.tweet.tweet}
        </div>
        <button
          onClick={onLikeClick}
          className={cls(
            "p-2 rounded-md flex items-center hover:bg-gray-100 justify-center w-fit gap-2 self-end",
            data?.isLiked
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-gray-500"
          )}
        >
          {data?.isLiked ? (
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          )}
          {data?.tweet._count.likes}
        </button>
      </div>
    </div>
  );
};
