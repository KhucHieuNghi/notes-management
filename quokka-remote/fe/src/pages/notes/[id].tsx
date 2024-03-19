import { Button } from "~/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Menu from "~/components/Menu";
import { Switch } from "~/components/ui/switch";
import { request } from "~/lib/request";

import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useRouter } from "next/router";
import { GroupNote } from "~/components/GroupNote";
import dynamic from "next/dynamic";

const CreateNote = dynamic(() => import("~/components/CreateNote"), {
  ssr: false,
});

const Note = dynamic(() => import("~/components/Note"), {
  ssr: false,
});

const TLDraw = dynamic(() => import("~/components/TLDraw"), {
  ssr: false,
});

export default function GroupNotes() {
  const router = useRouter();
  const noteId = router.query["id"];

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-notes-by-id"],
    queryFn: () => request.get(`/notes/${noteId}`),
  });

  const note = data?.data?.data;

  if (note) return <TLDraw noteId={note.id} note={note} key={note.id} />;

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="z-10 mb-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Menu />
      </div>

      {isLoading && "...Loading..."}
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}
