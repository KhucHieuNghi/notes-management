import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { request } from "~/lib/request";
import { useImage } from "~/lib/useImage";
import { GlobalContext } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useToast } from "./ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  fullname: z.string().min(2).max(50),
  username: z.string().min(3).max(128),
});

export function EditProfile() {
  const { upload, isLoading } = useImage();
  const [state, dispatch] = useContext(GlobalContext) as any;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: state.user.fullname,
      username: state.user.username,
    },
  });

  const mutationVerifyAccount = useMutation({
    mutationFn: (username: any) => {
      return request.post("/verify-account", { username });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newUser = { ...state.user, fullname: values.fullname, username: values.username };

      await mutationVerifyAccount.mutateAsync(values.username)
      
      dispatch({ type: "setUser", value: newUser });

      await mutation.mutateAsync(newUser);

      toast({
        variant: "default",
        title: "Upload successful.",
      });
    } catch (error:any) {
      form.setError('username', {message: error?.response?.data?.message})
      toast({
        variant: "default",
        title: `Error: ${error?.response?.data?.message || ''}.`,
      });
    }
  };

  const mutation = useMutation({
    mutationFn: (user: any) => {
      return request.patch("/me", { ...user }).then((res) => {
        setCookie(
          process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,
          res.data.token,
        );
      });
    },
  });


  const onUpload = async (e: any) => {
    const { url } = (await upload(e.target.files[0])) as any;
    const newUser = { ...state.user, picture: url };

    dispatch({ type: "setUser", value: newUser });

    await mutation.mutateAsync(newUser);

    toast({
      variant: "default",
      title: "Upload successful.",
    });
  };
  return (
    <>
      <Dialog>
        <div className="flex items-center space-x-2">
          <DialogTrigger asChild>
            <Button variant="outline">
              <Avatar className="mr-[6px] max-h-[30px] max-w-[30px]">
                <AvatarImage src={state.user.picture} />
                <AvatarFallback>{state.user.fullname}</AvatarFallback>
              </Avatar>
              Edit Profile of {state.user.fullname}
            </Button>
          </DialogTrigger>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setCookie(
                process.env["NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME"] as any,
                undefined,
              );

              setTimeout(() => {
                window.location.href = "/";
              }, 1000);
            }}
          >
            LogOut
          </Button>
        </div>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription className="item-center flex justify-center">
              <div
                className={`avatar-wrapper ${isLoading && "pointer-events-none opacity-10"}`}
              >
                <Avatar className="h-full w-full cursor-pointer">
                  <AvatarImage src={state.user.picture} />
                  <AvatarFallback>{state.user.fullname}</AvatarFallback>
                </Avatar>
                <input
                  className="file-upload absolute top-[-100px] z-50 h-[500px] w-[500px]"
                  accept="image/*"
                  onChange={onUpload}
                  id="contained-button-file"
                  type="file"
                />
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="quokka" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Name</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
