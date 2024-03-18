import Link from "next/link";
import { useContext } from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger
} from "~/components/ui/menubar";
import { GlobalContext } from "~/lib/utils";
import { EditProfile } from "./EditProfile";
import { getCookie } from "cookies-next";
import { request } from "~/lib/request";
import { useRouter } from "next/router";

const Menu = () => { 
  const [state, dispath] = useContext(GlobalContext) as any
  const route = useRouter()

  return (
    <>
    <EditProfile></EditProfile>
    <Menubar value={route.route}>
      <MenubarMenu value='/groups'>
        <MenubarTrigger>
          <Link href={"/groups"}>Groups</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu value='/notes'>
        <MenubarTrigger>
          <Link href={"/notes"}>Notes</Link>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
    </>
  );

}


export default Menu;
