import "~/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useReducer } from "react";
import { GlobalContext } from "~/lib/utils";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { request } from "~/lib/request";
import { getCookie, getCookies, setCookie } from "cookies-next";
import { Toaster } from "~/components/ui/toaster";
import { useRouter } from "next/router";
import { CodeSandboxLogoIcon } from "@radix-ui/react-icons";
import moment from "moment-timezone";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

function globalReducer(state: any, action: any) {
  switch (action.type) {
    case "setUser": {
      return { ...state, user: action.value };
    }
    case "setUsers": {
      return { ...state, users: action.value };
    }
    case "setUserNames": {
      return { ...state, usernames: action.value };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const route = useRouter();

  const isRoutesRequiredLogin = [
    "/groups",
    "/notes",
    "/groups/[id]",
    "/notes/[id]",
  ].includes(route.route);

  const [global, dispatch] = useReducer(globalReducer, {
    user: undefined,
    users: [],
    usernames: {}
  });

  const getUsers = () => {
    return request
    .get("/users")
    .catch(() => {
    })
    .then((res: any) => {
      console.log(res);
      const users = res?.data?.data;
      dispatch({ type: "setUsers", value: users });

      const usernames = Object.values(users).reduce((result:any, user:any) => {
        result[user?.id] = user.username
        return result
      }, {})

      dispatch({ type: "setUserNames", value: usernames });
    });
  }

  const getMe = () => {
    const token = getCookie(
      process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,
    );
    if (token) {
      request
        .post("/me", { token })
        .catch(() => {
          setCookie(process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,  '')
          if (isRoutesRequiredLogin) {
            route.push("/");
          }
        })
        .then((res: any) => {
          dispatch({ type: "setUser", value: res?.data });
          if(res?.data.role === 'ADMIN'){
            getUsers()
          }
        });
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <GlobalContext.Provider value={[global, dispatch, queryClient]}>
      <QueryClientProvider client={queryClient}>
        {isRoutesRequiredLogin && !global.user ? (
          "...Loading..."
        ) : (
          <Component {...pageProps} />
        )}
        <Toaster />
      </QueryClientProvider>
    </GlobalContext.Provider>
  );
}
