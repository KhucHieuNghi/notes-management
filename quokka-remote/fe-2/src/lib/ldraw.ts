import _ from "lodash";
import {
  TLAssetId,
  AssetRecordType,
  getHashForString,
  MediaHelpers,
  isGifAnimated,
  TLAsset,
} from "tldraw";

export const editorExternalAsset = async (
  {
    file,
  }: {
    type: "file";
    file: File;
  },
  upload: (file: File) => Promise<{ url: string; hash: string }>,
) => {
  const { url } = await upload(file);

  const assetId: TLAssetId = AssetRecordType.createId(getHashForString(url));

  let size: {
    w: number;
    h: number;
  };
  let isAnimated: boolean;
  let shapeType: "image" | "video";

  //[c]
  if (
    ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(
      file.type,
    )
  ) {
    shapeType = "image";
    size = await MediaHelpers.getImageSize(file);
    isAnimated = file.type === "image/gif" && (await isGifAnimated(file));
  } else {
    shapeType = "video";
    isAnimated = true;
    size = await MediaHelpers.getVideoSize(file);
  }
  //[d]
  const asset: TLAsset = AssetRecordType.create({
    id: assetId,
    type: shapeType,
    typeName: "asset",
    props: {
      name: file.name,
      src: url,
      w: size.w,
      h: size.h,
      mimeType: file.type,
      isAnimated,
    },
  });

  return asset;
};

function logChangeEvent(eventName: string) {
  // setStoreEvents((events) => [...events, eventName]);
}

export const editorChangeEvent = (change: any, callback: any) => {
  // Added
  for (const record of Object.values(change.changes.added) as any) {
    if (record.typeName === "shape") {
      callback();
      // logChangeEvent(`created shape (${record.type})\n`);
    }
  }

  // Updated
  for (const [from, to] of Object.values(change.changes.updated) as any) {
    if (
      from.typeName === "instance" &&
      to.typeName === "instance" &&
      from.currentPageId !== to.currentPageId
    ) {
      callback();
      // logChangeEvent(
      //   `changed page (${from.currentPageId}, ${to.currentPageId})`,
      // );
    } else if (from.id.startsWith("shape") && to.id.startsWith("shape")) {
      let diff = _.reduce(
        from,
        (result: any[], value, key: string) =>
          _.isEqual(value, (to as any)[key])
            ? result
            : result.concat([key, (to as any)[key]]),
        [],
      );
      if (diff?.[0] === "props") {
        diff = _.reduce(
          (from as any).props,
          (result: any[], value, key) =>
            _.isEqual(value, (to as any).props[key])
              ? result
              : result.concat([key, (to as any).props[key]]),
          [],
        );
      }
      logChangeEvent(`updated shape (${JSON.stringify(diff)})\n`);
    }
  }

  // Removed
  for (const record of Object.values(change.changes.removed) as any) {
    if (record.typeName === "shape") {
      callback();
      // logChangeEvent(`deleted shape (${record.type})\n`);
    }
  }
};
