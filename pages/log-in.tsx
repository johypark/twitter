import { User } from "@prisma/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import useMutation from "../lib/useMutation";

interface LoginForm {
  email: string;
}

export default () => {
  const { mutate } = useSWR<User>("/api/user");
  const router = useRouter();
  const [login, { data, loading }] = useMutation<User>("/api/log-in");
  const { register, handleSubmit } = useForm<LoginForm>();

  useEffect(() => {
    if (data) {
      mutate(data);
      router.push("/");
    }
  }, [data, router]);

  const onValid = (data: LoginForm) => {
    if (loading) return;

    login(data);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-neutral-900 text-white">
      <div className="flex justify-center items-center flex-col gap-8 bg-neutral-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold">Login</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onValid)}>
          <input
            className="text-black p-2 rounded-lg"
            placeholder="Email"
            type="email"
            {...register("email")}
            required
          />
          <button className="p-2 rounded-lg shadow-lg bg-neutral-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
