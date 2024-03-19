import { Button } from "~/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
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
import { GlobalContext } from "~/lib/utils";

const CreateNote = dynamic(() => import("~/components/CreateNote"), {
  ssr: false,
});

const Note = dynamic(() => import("~/components/Note"), {
  ssr: false,
});

export default function GroupNotes() {
  const router = useRouter();
  const groupId = router.query["id"];
  const [global, m, queryClient] = useContext(GlobalContext) as any;

  const [filterType, setFilterType] = useState<any>({
    key: "",
    value: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-notes-by-group"],
    queryFn: () => request.get(`/groups-note/${groupId}`),
  });

  const { group, notes } = data?.data || {};

  const cards =
    filterType.key && filterType.value
      ? (notes || []).filter((item: any) => {

          const itemF = {...item, update_by: global?.usernames?.[item?.update_by] || item?.update_by || '' }
          if (filterType.key === "is_public")
            return itemF[filterType.key] === true;

          return itemF[filterType.key].includes(filterType.value);
        })
      : notes || [];

  const cardsResult = cards.map((card:any) => {
    return {...card, update_by: global?.usernames?.[card?.update_by] || card?.update_by || '' }
  })

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="z-10 mb-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Menu />
      </div>

      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Select
              value={filterType.key}
              onValueChange={(val) =>
                setFilterType({ key: val, value: undefined })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter field" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by</SelectLabel>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="content">Content of type Basic</SelectItem>
                  <SelectItem value="update_by">By User name</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {["title", "type", "content", "update_by"].includes(
              filterType.key,
            ) && (
              <Input
                className="ml-4"
                type="text"
                placeholder="content of user"
                value={String(filterType.value || "")}
                onChange={(val) =>
                  setFilterType({ ...filterType, value: val.target.value })
                }
              />
            )}
            <Button
              className="ml-4"
              variant="outline"
              onClick={() => setFilterType({ key: "", value: undefined })}
            >
              Remove
            </Button>
          </div>
          <div>
            {Boolean(group?.id) && (
              <CreateNote
                refetch={refetch}
                groupId={group?.id}
                typeOfGroup={group?.type}
              ></CreateNote>
            )}
          </div>
        </div>
        {isLoading ? (
          "...Loading..."
        ) : (
          <div className="flex flex-wrap justify-start">
            {cardsResult
              ? cardsResult.map((note: any, index: any) => (
                  <Note key={note.id + index} card={note}></Note>
                ))
              : "Empty"}
          </div>
        )}
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}
