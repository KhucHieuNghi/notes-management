import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useToast } from "~/components/ui/use-toast";
import { request } from "~/lib/request";

const formSigninSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(8).max(128),
});

const formSignUpSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().min(0).max(120).email(),
  fullname: z.string().min(2).max(50),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128),
});

export function Admin() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState<undefined | Boolean>();

  const [stateSignup, setStateSignup] = useState({
    username: "adminqokka",
    email: "adminqokka@gmail.com",
    fullname: "adminqokka",
    password: "12345678",
    confirmPassword: "12345678",
  });

  const [errorsSignup, setErrorsSignup] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    confirmPassword: "",
  });

  const [stateSignIn, setStateSignIn] = useState({
    username: "",
    password: "",
  });

  const [errorsSignIn, setErrorsSignIn] = useState({
    username: "",
    password: "",
  });

  const { toast } = useToast();

  const mutationLogin = useMutation({
    mutationFn: (user: any) => {
      return request
        .post("/signin", { ...user })
        .then((res) => {
          setCookie(
            process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,
            res.data.token,
          );
        })
        .catch((e) => {
          toast({
            variant: "default",
            title: `Error: ${e?.response?.data?.message || ""}`,
          });
        });
    },
  });

  const mutation = useMutation({
    mutationFn: (user: any) => {
      return request.post("/signup?type=basic", { ...user }).catch((e) => {
        toast({
          variant: "default",
          title: `Error: ${e?.response?.data?.message || ""}`,
        });
      });
    },
  });

  useEffect(() => {
    const token = getCookie(
      process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,
    );
    setHasToken(Boolean(token));
  }, []);

  const onSubmitSignup = async () => {
    try {
      const val = formSignUpSchema.parse(stateSignup);

      if (val.confirmPassword !== val.password) {
        toast({
          variant: "default",
          title: `Confirm password and password don't match`,
        });
      }

      setErrorsSignup({
        username: "",
        email: "",
        fullname: "",
        password: "",
        confirmPassword: "",
      });

      await mutation.mutate(val);

      toast({
        variant: "default",
        title: "Create successful.",
      });

      setStateSignup({
        username: "",
        email: "",
        fullname: "",
        password: "",
        confirmPassword: "",
      });
    } catch (e: any) {
      console.log(Object.keys(e), e["issues"]);
      if (e?.["issues"]) {
        return e?.["issues"]?.map(({ path, message }: any) => {
          const [key] = path;
          setErrorsSignup((errorSignUpPrev) => ({
            ...errorSignUpPrev,
            [key]: message,
          }));
        });
      }
    }
  };

  const onSubmitSignIn = async () => {
    try {
      const val = formSigninSchema.parse(stateSignIn);

      setErrorsSignIn({
        username: "",
        password: "",
      });

      await mutationLogin.mutateAsync(val);

      toast({
        variant: "default",
        title: "Login successful.",
      });

      setStateSignIn({
        username: "",
        password: "",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (e: any) {
      console.log(Object.keys(e), e["issues"]);
      if (e?.["issues"]) {
        return e?.["issues"]?.map(({ path, message }: any) => {
          const [key] = path;
          setErrorsSignIn((errorSignUpPrev) => ({
            ...errorSignUpPrev,
            [key]: message,
          }));
        });
      }
    }
  };

  console.log("hasToken, hasToken", hasToken);

  if (hasToken === undefined) return <div>...Loading...</div>;

  if (hasToken)
    return (
      <div>
        {" "}
        Please, logout current account, click here: <Link href="/">
          Home
        </Link>{" "}
      </div>
    );

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <Button asChild>
            <Link href={"/"}>Home</Link>
          </Button>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none dark:from-black dark:via-black">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By <b>NK</b>
            </a>
          </div>
        </div>

        <div className="">
          <Tabs defaultValue="login" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">LogIn</TabsTrigger>
              <TabsTrigger value="signup">SignUp</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login with Admin </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">User Name</Label>
                    <Input
                      id="username"
                      placeholder="quokka_admin"
                      onChange={(e) =>
                        setStateSignIn({
                          ...stateSignIn,
                          username: e.target.value,
                        })
                      }
                      value={stateSignIn.username}
                    />
                    <small className="text-[red]">
                      {errorsSignIn["username"]}
                    </small>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input
                      id="password"
                      type="password"
                      onChange={(e) =>
                        setStateSignIn({
                          ...stateSignIn,
                          password: e.target.value,
                        })
                      }
                      value={stateSignIn.password}
                    />
                    <small className="text-[red]">
                      {errorsSignIn["password"]}
                    </small>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    disabled={mutationLogin.isPending}
                    onClick={onSubmitSignIn}
                  >
                    {mutationLogin.isPending && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Signup with Admin</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current">User Name</Label>
                    <Input
                      id="username"
                      placeholder="quokka_admin"
                      onChange={(e) =>
                        setStateSignup({
                          ...stateSignup,
                          username: e.target.value,
                        })
                      }
                      value={stateSignup.username}
                    />
                    <small className="text-[red]">
                      {errorsSignup["username"]}
                    </small>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="current">Email</Label>
                    <Input
                      placeholder="Quokka@quokka.com"
                      id="email"
                      onChange={(e) =>
                        setStateSignup({
                          ...stateSignup,
                          email: e.target.value,
                        })
                      }
                      value={stateSignup.email}
                    />
                    <small className="text-[red]">
                      {errorsSignup["email"]}
                    </small>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="current">Full Name</Label>
                    <Input
                      id="fullname"
                      placeholder="Quokka"
                      onChange={(e) =>
                        setStateSignup({
                          ...stateSignup,
                          fullname: e.target.value,
                        })
                      }
                      value={stateSignup.fullname}
                    />
                    <small className="text-[red]">
                      {errorsSignup["fullname"]}
                    </small>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="current">Current password</Label>
                    <Input
                      id="password"
                      type="password"
                      onChange={(e) =>
                        setStateSignup({
                          ...stateSignup,
                          password: e.target.value,
                        })
                      }
                      value={stateSignup.password}
                    />
                    <small className="text-[red]">
                      {errorsSignup["password"]}
                    </small>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      onChange={(e) =>
                        setStateSignup({
                          ...stateSignup,
                          confirmPassword: e.target.value,
                        })
                      }
                      value={stateSignup.confirmPassword}
                    />
                    <small className="text-[red]">
                      {errorsSignup["confirmPassword"]}
                    </small>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    disabled={mutation.isPending}
                    onClick={onSubmitSignup}
                  >
                    {mutation.isPending && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
      </main>
    </>
  );
}

export default Admin;
