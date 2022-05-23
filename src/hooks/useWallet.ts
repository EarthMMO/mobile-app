import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function useWallet() {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    async function getWallet() {
      try {
        const wallet = await SecureStore.getItemAsync("wallet");
        setWallet(JSON.parse(wallet!));
      } catch (error) {
        // We might want to provide this error information to an error reporting service
        console.warn(error);
      }
    }

    getWallet();
  }, []);

  return wallet;
}
