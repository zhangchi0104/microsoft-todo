import { authorize } from "./auth";

import { useEffect, useState } from "react";
export function useAuthorize() {
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    async function authorizeAsync() {
      const token = await authorize();
      setToken(token);
    }
    authorizeAsync();
  }, []);
  return token;
}
