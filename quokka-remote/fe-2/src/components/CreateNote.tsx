import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useContext, useEffect, useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Switch } from "./ui/switch";
import { useToast } from "./ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "./ui/textarea";
import { ClipboardMenuGroup } from "tldraw";

const formSchema = z.object({
  group_id: z.string().min(2).max(50),
  type: z.string(),
  thumbnail: z.string().min(0),
  title: z.string().min(2),
  content: z.string().min(0),
  is_deleted: z.boolean(),
});

export function CreateNote(props: any) {
  const [open, setOpen] = useState(false);
  const [state, dispatch] = useContext(GlobalContext) as any;
  const { toast } = useToast();
  const { upload, isLoading } = useImage();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      group_id: props.groupId as string,
      type: props.typeOfGroup === "draw" ? "draw" : "basic", // basic, markdown, draw
      thumbnail: "",
      title: "",
      content: "",
      is_deleted: false,
    },
  });

  useEffect(() => {
    form.setValue("group_id", props.groupId);
    form.setValue("type", props.typeOfGroup === "draw" ? "draw" : "basic");
  }, [props]);

  const mutation = useMutation({
    mutationFn: (group: any) => {
      return request.post("notes", { ...group });
    },
    onSuccess: () => {
      props.refetch();
    },
  });

  const onUpload = async (e: any) => {
    try {
      const { url } = (await upload(e.target.files[0])) as any;

      form.setValue("thumbnail", url);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // props.groupId
      await mutation.mutateAsync(values);

      toast({
        variant: "default",
        title: "Create successful.",
      });

      setOpen(false);
      form.reset({});
    } catch (e: any) {
      toast({
        variant: "default",
        title: `Error: ${e?.response?.data?.message}`,
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Create Note</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Form {...form}>
              <div
                className={`avatar-wrapper-note ${isLoading && "pointer-events-none opacity-10"}`}
              >
                <Avatar className="h-full w-full cursor-pointer">
                  <AvatarImage src={form.getValues()?.thumbnail} />
                  <AvatarFallback>{form.getValues().title}</AvatarFallback>
                </Avatar>
                <input
                  className="file-upload absolute top-[-100px] z-50 h-[500px] w-[500px]"
                  accept="image/*"
                  onChange={onUpload}
                  id="contained-button-file"
                  type="file"
                />
              </div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="title of note" {...field} />
                      </FormControl>
                      <FormDescription>Title of note</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type note...</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="basic"
                                disabled={props.typeOfGroup === "draw"}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Basic</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                value="draw"
                                disabled={props.typeOfGroup !== "draw"}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Draw</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem disabled value="markdown" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Markdown
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.getValues().type === "basic" && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Abcdefg" {...field} />
                        </FormControl>
                        <FormDescription>Content of note</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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

export default CreateNote;
