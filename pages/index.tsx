import React, { useEffect } from "react";
import useUser from "../lib/useUser";
import { useForm } from "react-hook-form";
import useMutation from "../lib/useMutation";
import useSWR from "swr";
import { Tweet } from "@prisma/client";
import Link from "next/link";

interface TweetForm {
  tweet: string;
}

interface TweetWithCount extends Tweet {
  user: {
    name: string;
  };
  _count: {
    likes: number;
  };
}

export default () => {
  const user = useUser();
  const { register, handleSubmit, setValue } = useForm<TweetForm>();
  const [upload, { loading, data }] = useMutation("/api/upload");
  const { data: tweets, mutate } = useSWR<TweetWithCount[]>("/api/tweets");

  useEffect(() => {
    if (data) {
      mutate();
    }
  }, [data]);

  const onValid = (data: TweetForm) => {
    if (loading) return;

    setValue("tweet", "");
    upload(data);
  };

  return (
    <div className="h-screen bg-neutral-900 text-white p-8 flex flex-col gap-4">
      <form
        onSubmit={handleSubmit(onValid)}
        className="bg-white rounded-lg flex flex-col"
      >
        <div className="text-black px-2 pt-2 font-bold">{user?.name}</div>
        <textarea
          className="text-black p-2 rounded-lg w-full"
          placeholder="What's happening?"
          {...register("tweet")}
          required
        />
        <button className="w-fit p-2 m-2 rounded-lg shadow-lg bg-neutral-700 self-end">
          {loading ? "Loading..." : "Tweet"}
        </button>
      </form>

      <div className="flex flex-col-reverse gap-4 overflow-scroll">
        {tweets?.map((tweet) => (
          <Link href={`/tweet/${tweet.id}`} key={tweet.id}>
            <div className="flex flex-col p-2 gap-2 bg-neutral-800 rounded-lg cursor-pointer">
              <div className="font-bold">{tweet.user.name}</div>
              {tweet.tweet}
              <div className="flex gap-1 items-center text-sm self-end">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                <span>{tweet._count.likes}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
