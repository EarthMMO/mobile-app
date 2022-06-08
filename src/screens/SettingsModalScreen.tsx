import * as SecureStore from "expo-secure-store";
import { Image, Platform, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import CardList from "components/CardList";
import tw from "utils/tailwind";
import useUserStore from "stores/user";
import useWallet from "hooks/useWallet";
import { formatAddress } from "utils";

export default function SettingsModalScreen({ navigation }: any) {
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);
  const currentWallet = useWallet();
  const [balance, setBalance] = useState("0");

  useEffect(() => {
    async function getBalance() {
      const provider = ethers.getDefaultProvider("rinkeby", {
        infura: {
          projectId: "43c57a3294c74a7aa5eec78297aadad8",
          projectSecret: "e0ed1f4709a64fde93b11ca2d209d75f",
        },
      });
      const wallet = new ethers.Wallet(currentWallet.privateKey, provider);
      const balance = await wallet.getBalance();
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
    }

    if (currentWallet?.privateKey) {
      getBalance();
    }
  }, [currentWallet?.privateKey]);

  const settingsList = [
    {
      name: "Dark mode",
      icon: null,
      onPress: () => navigation.navigate("DarkMode"),
    },
    {
      name: "Sign out",
      icon: null,
      onPress: async () => {
        await SecureStore.deleteItemAsync("wallet");
        updateUser({
          ethereumAddress: "",
          userId: null,
          isSignedIn: false,
        });
        navigation.goBack();
      },
    },
  ];

  if (!currentWallet?.privateKey) {
    return null;
  }

  return (
    <View style={tw`flex-1 items-center bg-neutral-50 dark:bg-neutral-900`}>
      <Image
        source={require("../../assets/images/thomas.png")}
        style={tw`mb-2 h-26 w-26 rounded-full`}
      />
      <Text style={tw`text-2xl font-bold mb-2`}>Thomas Vu</Text>
      <View style={tw`mb-2 px-3 py-0.5 rounded-full bg-blue-100`}>
        <Text style={tw`text-base text-blue-800`}>
          {formatAddress(currentWallet?.ethereumAddress)}
        </Text>
      </View>
      <Text style={tw`mb-6 text-base text-gray-500`}>{balance} ETH</Text>
      <CardList data={settingsList} navigation={navigation}></CardList>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
