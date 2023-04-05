import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useMutation from "../lib/useMutation";

interface CreateAccountForm {
  name: string;
  email: string;
}

export default () => {
  const [createAccount, { data, loading }] = useMutation("/api/create-account");
  const router = useRouter();
  const { register, handleSubmit } = useForm<CreateAccountForm>();

  useEffect(() => {
    if (data) {
      alert("Account created! Please log in!");
      router.push("/log-in");
    }
  }, [data, router]);

  const onValid = (data: CreateAccountForm) => {
    if (loading) return;

    createAccount(data);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-neutral-900 text-white">
      <div className="flex justify-center items-center flex-col gap-8 bg-neutral-800 p-8 rounded-3xl shadow-2xl">
        <h1 className="text-4xl font-bold">Create Account</h1>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onValid)}>
          <input
            className="text-black p-2 rounded-lg"
            placeholder="Name"
            type="text"
            {...register("name")}
            required
          />
          <input
            className="text-black p-2 rounded-lg"
            placeholder="Email"
            type="email"
            {...register("email")}
            required
          />
          <button className="p-2 rounded-lg shadow-lg bg-neutral-700">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};
