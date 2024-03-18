import "~/styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useReducer } from "react";
import { GlobalContext } from "~/lib/utils";
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { request } from "~/lib/request";
import { getCookie, getCookies } from "cookies-next";
import { Toaster } from "~/components/ui/toaster";
import { useRouter } from "next/router";

function globalReducer(state: any, action: any) {
  switch (action.type) {
    case 'setUser': {
      return { ...state, user: action.value };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const route = useRouter()
  const isRoutesRequiredLogin = ['/groups', '/notes'].includes(route.route)
  
  const [global, dispatch] = useReducer(
    globalReducer,
    {
      user: undefined
    }
  );

  const getMe = () => {
    const token = getCookie(process.env['NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME'] as any)
    if (token) {
      request.post('/me', { token }).catch(() => {
        if(isRoutesRequiredLogin){
          route.push('/')
        }
      }).then((res: any) => {
        dispatch({ type: 'setUser', value: res?.data })
      })
    }
  }

  useEffect(() => {
    getMe()
  }, [])

  // const { isPending, error, data } = useQuery({
  //   queryKey: ['repoData'],
  //   queryFn: () => request.get('/me')
  // })
  // console.log('isPending', isPending, data, error)

  return (
    <GlobalContext.Provider value={[global, dispatch]}>
      <QueryClientProvider client={queryClient}>
        {
          isRoutesRequiredLogin && !global.user ? '...Loading...' : <Component {...pageProps} />
        }
        <Toaster />
      </QueryClientProvider>
    </GlobalContext.Provider>
  )

  // return <GlobalContext.Provider value={[global, dispatch]}><Component {...pageProps} /></GlobalContext.Provider>;
}
