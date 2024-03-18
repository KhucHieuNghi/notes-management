import { getDownloadURL, getStorage, ref, uploadBytes } from "@firebase/storage";
import { initializeApp } from 'firebase/app';
import { useState } from "react";
import { v4 } from "uuid";


const firebaseConfig = {
    apiKey: "AIzaSyCGdmVCxIlxSP0NMt1qkXgRRv3zvTTxwWA",
    authDomain: "quokka-1c35c.firebaseapp.com",
    projectId: "quokka-1c35c",
    storageBucket: "quokka-1c35c.appspot.com",
    messagingSenderId: "170005453262",
    appId: "1:170005453262:web:46691f9a97dabab559339f"
  };
  

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)

export const useImage = () => {

  const [isLoading, setLoading]= useState(false)
    
    const upload = async (file:any) => {
        try {
          setLoading(true)
        const imgRef = ref(storage,`files/${v4()}`)
        const val = await uploadBytes(imgRef,file)
        return getDownloadURL(val.ref)
     } catch (error) {
        console.log('e', error)
     }finally{
      setLoading(false)
     }
    }
    return {upload, isLoading};
}
