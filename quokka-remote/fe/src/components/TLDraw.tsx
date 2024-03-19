import { ReloadIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Editor, Tldraw, TLComponents } from "tldraw";
import { editorChangeEvent, editorExternalAsset } from "~/lib/ldraw";
import { useImage } from "~/lib/useImage";
import { toast } from "./ui/use-toast";
import { request } from "~/lib/request";
import { Button } from "./ui/button";
import Link from "next/link";

const updateNoteAsync = _.debounce(
  (note, mutation) => {
    mutation.mutate({
      ...note,
    });
  },
  500,
  {},
);

export const TLDraw = (props: any) => {
  const view = props.modeView;
  const [editor, setEditor] = useState<Editor>();
  const { upload } = useImage();

  const mutation = useMutation({
    mutationFn: (note: any) => {
      if (view) return Promise.resolve();
      return request
        .patch("/notes", { ...note })
        .then(() => {
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

  const setAppToState = useCallback((editor: Editor) => {
    if (props.note.content) {
      editor.store.loadSnapshot(JSON.parse(props.note.content));
    }
    setEditor(editor);
  }, []);

  const [storeEvents, setStoreEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    const cleanupFunction = editor.store.listen(
      (change) => {
        return editorChangeEvent(change, () =>
          updateNoteAsync(
            {
              ...props.note,
              content: JSON.stringify(editor?.store?.getSnapshot()) || {},
            },
            mutation,
          ),
        );
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

  const components: TLComponents = view
    ? {
        ContextMenu: null,
        ActionsMenu: null,
        HelpMenu: null,
        ZoomMenu: null,
        MainMenu: null,
        Minimap: null,
        StylePanel: null,
        PageMenu: null,
        NavigationPanel: null,
        Toolbar: null,
        KeyboardShortcutsDialog: null,
        QuickActions: null,
        HelperButtons: null,
        DebugMenu: null,
        MenuPanel: null,
        TopPanel: null,
        SharePanel: null,
      }
    : {
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

      <div
        className="absolute z-[200] h-[50px] w-[50px]"
        style={{ zIndex: 2000, top: "100px", left: "24px" }}
      >
        <Link href={"/"}>
          <Button>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.85355 3.14645C7.04882 3.34171 7.04882 3.65829 6.85355 3.85355L3.70711 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H3.70711L6.85355 11.1464C7.04882 11.3417 7.04882 11.6583 6.85355 11.8536C6.65829 12.0488 6.34171 12.0488 6.14645 11.8536L2.14645 7.85355C1.95118 7.65829 1.95118 7.34171 2.14645 7.14645L6.14645 3.14645C6.34171 2.95118 6.65829 2.95118 6.85355 3.14645Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </Button>
        </Link>
      </div>
      <div style={{ width: "100vw", height: "100vh" }}>
        <Tldraw
          onMount={setAppToState}
          components={components}
          // snapshot={
          //   props?.note?.content ? JSON.parse(props?.note?.content) : undefined
          // }
        />
      </div>
    </div>
  );
};

export default TLDraw;
