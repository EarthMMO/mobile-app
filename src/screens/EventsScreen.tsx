import * as Haptics from "expo-haptics";
import { FlatList, Image, Text, View } from "react-native";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

import Button from "components/Button";
import tw from "utils/tailwind";
import useUserStore from "stores/user";
import useWallet from "hooks/useWallet";
import { ITEM_CONTRACT_ABI, ITEM_CONTRACT_ADDRESS } from "config";
import { RootTabScreenProps } from "../../types";
import { apiRequest } from "utils";

export default function EventsScreen({
  navigation,
}: RootTabScreenProps<"Events">) {
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);
  const currentWallet = useWallet();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await apiRequest("v0/event", "GET");
        setEvents(events);
        setIsFetching(false);
        console.log("EVENTS", events);
      } catch (error) {
        console.log("ERROR", error);
      }
    }

    fetchEvents();
  }, []);

  async function claimNFT() {
    try {
      const provider = ethers.getDefaultProvider("rinkeby", {
        infura: {
          projectId: "43c57a3294c74a7aa5eec78297aadad8",
          projectSecret: "e0ed1f4709a64fde93b11ca2d209d75f",
        },
      });
      const wallet = new ethers.Wallet(currentWallet.privateKey, provider);
      const itemContract = new ethers.Contract(
        ITEM_CONTRACT_ADDRESS,
        ITEM_CONTRACT_ABI,
        wallet
      );
      //console.log("ITEM CONTRACT", itemContract);
      //const events = await itemContract.events(0);
      //console.log("EVENTS", events);
      const tx = await itemContract.claim(0);
      //console.log("TRANSACTION", tx);
      const receipt = await tx.wait();
      //console.log("RECEIPT", receipt);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  async function onRefresh() {
    try {
      setIsFetching(true);
      const events = await apiRequest("v0/event", "GET");
      setEvents(events);
      setIsFetching(false);
      console.log(events);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  if (isFetching) {
    return (
      <Placeholder
        Animation={Fade}
        Left={PlaceholderMedia}
        Right={PlaceholderMedia}
      >
        <PlaceholderLine width={80} />
        <PlaceholderLine />
        <PlaceholderLine width={30} />
      </Placeholder>
    );
  }

  return (
    <View style={tw`flex-1 items-center bg-neutral-50 dark:bg-neutral-900`}>
      {/*
      <Text>{currentWallet.jwt}</Text>
      <Text>{JSON.stringify(user)}</Text>
      */}
      <FlatList
        data={events}
        renderItem={({ item, index }) => (
          <View key={item.id} style={tw`w-11/12 pb-6 m-auto shadow-md`}>
            <Image
              source={require("../../assets/images/ethny.png")}
              style={tw`w-full h-38 rounded-t-lg`}
            />
            <View style={tw`w-full bg-white rounded-b-lg p-4`}>
              <View style={tw`flex-row justify-between`}>
                <Text style={tw`text-3xl font-bold`}>{item.name}</Text>
                <Button
                  buttonStyle={
                    "w-3/12 py-1 border-2 border-black dark:border-white bg-black dark:bg-white"
                  }
                  labelStyle={"text-white dark:text-black font-bold"}
                  text={"Claim"}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    claimNFT();
                  }}
                />
              </View>
              <Text style={tw`text-xl font-bold text-gray-400 mb-2`}>
                Rewards
              </Text>
              <Image
                source={{
                  uri: `https://ipfs.io/ipfs/${item.ItemNFTImageHash}`,
                }}
                style={tw`w-16 h-16 rounded-xl border-3 border-blue-500`}
              />
            </View>
          </View>
        )}
        onRefresh={onRefresh}
        refreshing={isFetching}
        style={tw`w-full`}
        contentContainerStyle={tw`py-6`}
      />
    </View>
  );
}
