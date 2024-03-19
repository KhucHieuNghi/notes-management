import copy from "copy-to-clipboard";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { request } from "~/lib/request";
import Link from "next/link";
import moment from "moment";

export const GroupNote = (props: any) => {
  const { toast } = useToast();
  const [state, setState] = useState(props.card || {}) as any;
  const card = state || {};

  const mutation = useMutation({
    mutationFn: (card: any) => {
      return request
        .patch("/groups-note", { ...card })
        .then((res) => {
          toast({
            variant: "default",
            title: "Update successful.",
          });
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
      className="m-2 max-w-sm overflow-hidden rounded p-4 shadow-lg"
    >
      <div className="flex items-center justify-between space-x-10 rounded-lg py-4">
        <div className="mb-2 text-xl font-bold">
          {card.group_name}{" "}
          <span className="text-xs font-light">
            ( {card.notesCount} ) notes
          </span>
        </div>
        <Link href={`groups/${card.id}`} className="cursor-pointer">
          <svg
            className="h-8 w-8 text-gray-500"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <line x1="5" y1="12" x2="19" y2="12" />{" "}
            <line x1="15" y1="16" x2="19" y2="12" />{" "}
            <line x1="15" y1="8" x2="19" y2="12" />
          </svg>
        </Link>
      </div>
      <div className="flex space-x-10">
        <div className="flex items-center space-x-2">
          <Switch
            checked={card.is_public}
            onCheckedChange={(e) => {
              const val = { ...card, is_public: e };
              setState(val);
              mutation.mutate(val);
            }}
          />
          <Label htmlFor="airplane-mode">Is Public</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={card.is_deleted}
            onCheckedChange={(e) => {
              const val = { ...card, is_deleted: e };
              setState(val);
              mutation.mutate(val);
            }}
          />
          <Label htmlFor="airplane-mode">Is Delete</Label>
        </div>
      </div>
      <div className="flex items-center space-x-10">
        <div className="pt-4">
          <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">{`#${card.type}`}</span>
          <span className="inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">{`By:${card.update_by.slice(0, 5)}`}</span>
        </div>
      </div>{" "}
      <div className="flex items-center justify-between">
        <span className="inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{`CreateAt: ${moment(card.create_at).add(7, "hour").fromNow()}`}</span>
        {card.is_public && (
          <div
            className="flex w-[150px] cursor-pointer items-center"
            onClick={() => {
              copy(
                `${process.env["NEXT_PUBLIC_BASE_URL_FE"]}/share/${card.link_share}`,
              );
              toast({
                variant: "default",
                title: "Copied",
              });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
            <span className="text-xs">Copy link</span>
          </div>
        )}
      </div>
    </div>
  );
};
