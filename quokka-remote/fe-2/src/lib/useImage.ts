import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "@firebase/storage";
import { initializeApp } from "firebase/app";
import { useState } from "react";
import { v4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyCGdmVCxIlxSP0NMt1qkXgRRv3zvTTxwWA",
  authDomain: "quokka-1c35c.firebaseapp.com",
  projectId: "quokka-1c35c",
  storageBucket: "quokka-1c35c.appspot.com",
  messagingSenderId: "170005453262",
  appId: "1:170005453262:web:46691f9a97dabab559339f",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const useImage = () => {
  const [isLoading, setLoading] = useState(false);

  const upload = async (file: File) => {
    try {
      setLoading(true);
      const hash = v4();
      const imgRef = ref(storage, `files/${hash}`);
      const val = await uploadBytes(imgRef, file);
      const url = await getDownloadURL(val.ref);
      return { url, hash } as { url: string; hash: string };
    } catch (error) {
      console.log("e", error);
    } finally {
      setLoading(false);
    }
  };
  return { upload, isLoading };
};
