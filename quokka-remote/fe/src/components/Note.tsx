import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { request } from "~/lib/request";
import Link from "next/link";
import moment from "moment";
import { Textarea } from "./ui/textarea";
import { z } from "zod";
import _ from "lodash";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GlobalContext } from "~/lib/utils";

const formSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(0),
  is_deleted: z.boolean(),
});

const updateNoteAsync = _.debounce((note: any, mutation: any) => {
  mutation.mutate({ ...note });
}, 150);

export const Note = (props: any) => {
  const view = props.modeView;
  const { toast } = useToast();
  const [state, setState] = useState(props.card || {}) as any;
  const card = state || {};
  const [global, m, queryClient] = useContext(GlobalContext) as any;

  const mutation = useMutation({
    mutationFn: (group: any) => {
      return request
        .patch("notes", { ...group })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["get-notes-by-group"] });
          props.refetch();
        })
        .catch((err) => {
          toast({
            variant: "default",
            title: `Error: ${err?.response?.data?.message}`,
          });
        });
    },
  });

  return (
    <div
      key={card.id}
      className="m-2 w-[500px] max-w-sm overflow-hidden rounded p-4 shadow-lg"
    >
      <div className="flex items-center justify-between space-x-10 rounded-lg py-4">
        <div className="flex w-[80%] items-center space-x-1 text-xl font-bold">
          <Avatar className="mr-4 h-[40px] w-[40px] cursor-pointer">
            <AvatarImage src={card.thumbnail} />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="inline-flex">{card.title}</div>
        </div>
        <div className="inline-flex w-[150px] items-center space-x-2 rounded-full px-3 text-[12px] text-gray-700">
          {`UpdateAt: ${moment(card.update_at).add(7, "hour").fromNow()}`}
          {mutation.isPending && (
            <div
              className="z-[200] ml-2 h-[10px] w-[10px]"
              style={{ zIndex: 2000 }}
            >
              <ReloadIcon className="mr-2 h-[15px] w-[15px] animate-spin" />
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between space-x-10">
        {state.type === "basic" && (
          <Textarea
            value={state.content}
            onChange={(e) => {
              if (view) return;
              const newNote = { ...state, content: e.target.value };
              setState(newNote);
              updateNoteAsync(newNote, mutation);
            }}
          />
        )}

        {state.type === "draw" && (
          <Button color="">
            <Link href={`/notes/${state.id}`} className="txt-gradient">
              <i>
                <b>Go to Draw</b>
              </i>
            </Link>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between space-x-10">
        <div className="pt-4">
          <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">{`#${card.type}`}</span>
          <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">{`By:${card.update_by.slice(0, 5)}`}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={card.is_deleted}
            onCheckedChange={(e) => {
              if (view) return;
              const val = { ...card, is_deleted: e };
              setState(val);
              mutation.mutate(val);
            }}
          />
          <Label htmlFor="airplane-mode">Is Delete</Label>
        </div>
      </div>{" "}
    </div>
  );
};

export default Note;
