import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Editor, Tldraw, TLComponents } from "tldraw";
import { editorChangeEvent, editorExternalAsset } from "~/lib/ldraw";
import { useImage } from "~/lib/useImage";
import { toast } from "./ui/use-toast";
import { request } from "~/lib/request";

export const TLDraw = () => {
  const [editor, setEditor] = useState<Editor>();
  const { upload } = useImage();

  const mutation = useMutation({
    mutationFn: (note: any) => {
      // return request.patch("/notes", { ...note });
      return new Promise((res) => {
        setTimeout(() => {
          res();
        }, 3000);
      });
    },
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Update successful.",
      });
    },
  });

  const updateNoteAsync = _.debounce(
    (note) => {
      mutation.mutate({ ...note, content: editor?.store?.getSnapshot() || {} });
    },
    3000,
    {},
  );
  //

  const setAppToState = useCallback((editor: Editor) => {
    setEditor(editor);
  }, []);

  const [storeEvents, setStoreEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    const cleanupFunction = editor.store.listen(
      (change) => {
        return editorChangeEvent(change, updateNoteAsync);
      },
      {
        source: "user",
        scope: "all",
      },
    );

    editor.registerExternalAssetHandler(
      "file",
      async (props: { type: "file"; file: File }) =>
        editorExternalAsset(
          props,
          upload as (file: File) => Promise<{ url: string; hash: string }>,
        ),
    );

    return () => {
      cleanupFunction();
    };
  }, [editor]);

  const components: TLComponents = {
    HelpMenu: null,
    KeyboardShortcutsDialog: null,
    QuickActions: null,
    HelperButtons: null,
    DebugMenu: null,
    SharePanel: null,
  };

  return (
    <div style={{ display: "flex", position: "relative" }}>
      {mutation.isPending && (
        <div
          className="absolute z-[200] h-[50px] w-[50px]"
          style={{ zIndex: 2000, bottom: "24px", right: "24px" }}
        >
          <ReloadIcon className="mr-2 h-10 w-10 animate-spin" />
        </div>
      )}
      <div style={{ width: "100vw", height: "100vh" }}>
        <Tldraw onMount={setAppToState} components={components} />
      </div>
    </div>
  );
};

export default TLDraw;
