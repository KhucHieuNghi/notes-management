import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

import Menu from "~/components/Menu";
import { useContext } from "react";
import { GlobalContext } from "~/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { request } from "~/lib/request";
import { CreateGroup } from "~/components/CreateGroup";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { GroupNote } from "~/components/GroupNote";

export default function Groups() {
    // const [state, dispath] = useContext(GlobalContext) as any

    const { data, isLoading, refetch } = useQuery({ queryKey: ['groups-note'], queryFn: () => request.get('/groups-note') })

    const cards = data?.data?.data || []
    console.log("🚀 ~ Groups ~ cards:", cards)

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <Menu />
                <CreateGroup refetch={refetch}></CreateGroup>
            </div>

            <div className="">
                {
                    isLoading ? '...Loading...' : (
                        <div className="flex flex-wrap justify-center">
                            {
                                cards.map((card: any, index: any) => <GroupNote key={index} card={card}></GroupNote>)
                            }
                        </div>
                    )
                }


            </div>

            <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
            </div>
        </main>
    );
}
