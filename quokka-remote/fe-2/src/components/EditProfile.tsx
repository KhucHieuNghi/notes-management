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
  DialogTrigger
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { request } from "~/lib/request";
import { useImage } from "~/lib/useImage";
import { GlobalContext } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useToast } from "./ui/use-toast";

const formSchema = z.object({
  fullname: z.string().min(2).max(50),
})

export function EditProfile() {
  const { upload, isLoading } = useImage()
  const [state, dispatch] = useContext(GlobalContext) as any
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: state.user.fullname,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    const newUser = { ...state.user, fullname: values.fullname }

    dispatch({ type: 'setUser', value: newUser })

    await mutation.mutate(newUser)

    toast({
      variant: "default",
      title: "Upload successful.",
    })

  }

  const mutation = useMutation({
    mutationFn: (user: any) => {
      return request.patch('/me', { ...user }).then(res => {
        setCookie(process.env['NEXT_PUBLIC_JWT_SECRET_TOKEN_NAME'] as any, res.data.token)
      })
    },
  })

  const onUpload = async (e: any) => {

    const url = await upload(e.target.files[0])
    const newUser = { ...state.user, picture: url }

    dispatch({ type: 'setUser', value: newUser })

    await mutation.mutate(newUser)

    toast({
      variant: "default",
      title: "Upload successful.",
    })
  }
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Avatar className="max-w-[30px] max-h-[30px] mr-[6px]">
              <AvatarImage src={state.user.picture} />
              <AvatarFallback>{state.user.fullname}</AvatarFallback>
            </Avatar>
            Edit Profile of {state.user.fullname}
          </Button>

        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription className="flex item-center justify-center">
              <div className={`avatar-wrapper ${isLoading && 'opacity-10 pointer-events-none'}`}>
                <Avatar className="w-full h-full cursor-pointer" onClick={() => { console.log('first') }}>
                  <AvatarImage src={state.user.picture} />
                  <AvatarFallback>{state.user.fullname}</AvatarFallback>
                </Avatar>
                <input
                  className="file-upload w-[500px] h-[500px] z-50 absolute top-[-100px]"
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
