import { Button } from "~/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { CreateGroup } from "~/components/CreateGroup";
import { GroupNote } from "~/components/GroupNote";
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
import Note from "~/components/Note";
import Link from "next/link";
import { GlobalContext } from "~/lib/utils";

export default function Groups() {
  const [filterType, setFilterType] = useState<any>({
    key: "",
    value: "",
  });

  const [global] = useContext(GlobalContext) as any;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["get-notes"],
    queryFn: () => request.get("/notes"),
  });

  const cards =
    filterType.key && filterType.value
      ? (data?.data?.data || []).filter((item: any) => {

        const itemF = {...item, update_by: global?.usernames?.[item?.update_by] || item?.update_by || '' }

          return itemF[filterType.key].includes(filterType.value);
        })
      : data?.data?.data || [];

  const cardsResult = cards.map((card:any) => {
    return {...card, update_by: global?.usernames?.[card?.update_by] || card?.update_by || '' }
  })

  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="z-10 mb-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Menu />
      </div>

      <div className="">
        <div className="mb-2 mb-5 flex items-center">
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
                <SelectItem value="update_by">By Id User</SelectItem>
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
        {isLoading ? (
          "...Loading..."
        ) : (
          <div className="flex flex-wrap justify-start">
            {cardsResult.map((card: any, index: any) => (
              <Note key={card.id + index} card={card}></Note>
            ))}
          </div>
        )}
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}
