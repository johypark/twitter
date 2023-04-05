import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

export default function useUser() {
  const { data, isValidating } = useSWR<User>("/api/user");
  const router = useRouter();

  useEffect(() => {
    if (!data && !isValidating) {
      router.replace("/create-account");
    }
  }, [data, router, isValidating]);

  return data;
}
