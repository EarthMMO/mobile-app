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
import { Item, item6, item2, item5 } from "screens/ProfileScreen";

function EventCard({ item }: any) {
  const { borderColor, coverImage, id, name, itemEventId, ItemNFTImageHash } =
    item;
  const [claimStatus, setClaimStatus] = useState("Claim");
  const currentWallet = useWallet();
  const isLoading =
    claimStatus === "Submitting..." || claimStatus === "Confirming...";
  const isClaimed = claimStatus === "Claimed";

  async function claimNFT(itemId: number) {
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

      setClaimStatus("Claimed");

      const balance = await wallet.getBalance();
      //console.log("BALANCE", balance);

      //setClaimStatus("Submitting...");
      const tx = await itemContract.claim(itemId);
      console.log("TRANSACTION", tx);

      //setClaimStatus("Confirming...");
      const receipt = await tx.wait();
      console.log("RECEIPT", receipt);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  return (
    <View key={id} style={tw`w-11/12 pb-6 m-auto shadow-md`}>
      <Image
        source={
          coverImage ? coverImage : require("../../assets/images/ethny.png")
        }
        style={tw`w-full h-38 rounded-t-lg`}
      />
      <View style={tw`w-full bg-white rounded-b-lg p-4`}>
        <Text style={tw`text-3xl font-bold`}>{name}</Text>
        <Text style={tw`text-xl font-bold text-gray-400 mb-2`}>Rewards</Text>
        <View style={tw`flex-row`}>
          {name === "ETHNewYork" ? (
            <Item
              item={item6}
              borderColor={"border-blue-500"}
              placement={"right"}
            />
          ) : (
            <Item item={item2} borderColor={"border-purple-500"} />
          )}
          <View style={tw`mr-4`} />
          {name === "ETHNewYork" && (
            <Item
              item={item5}
              borderColor={"border-yellow-500"}
              placement={"top"}
            />
          )}
          {/*
          <Text style={tw`absolute font-bold mt-[3px] ml-[5px]`}>
            {itemEventId}
          </Text>
          */}
        </View>
        <Button
          buttonStyle={`w-full py-3 border-2 border-black ${
            isClaimed ? "bg-white" : "bg-black"
          }`}
          labelStyle={`font-bold ${isClaimed ? "text-black" : "text-white"}`}
          spinner={isLoading}
          spinnerProps={{
            color: "white",
          }}
          text={claimStatus}
          disabled={claimStatus !== "Claim"}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            claimNFT(itemEventId);
          }}
        />
      </View>
    </View>
  );
}

export default function EventsScreen({
  navigation,
}: RootTabScreenProps<"Events">) {
  const [events, setEvents] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await apiRequest("v0/event", "GET");
        events.push({
          ItemNFTImageHash: "QmWGAyzGk2S925Ldsjv2KWrfHz4Pj2MmBfK3TA5qmZhqcs",
          coverImage: require("../../assets/images/dappcamp.png"),
          name: "DappCamp Cohort 3",
          borderColor: "border-purple-500",
        });
        console.log("EVENTS", events);
        setEvents(events);
        setIsFetching(false);
      } catch (error) {
        console.log("ERROR", error);
      }
    }

    fetchEvents();
  }, []);

  async function onRefresh() {
    try {
      setIsFetching(true);
      const events = await apiRequest("v0/event", "GET");
      events.push({
        ItemNFTImageHash: "QmWGAyzGk2S925Ldsjv2KWrfHz4Pj2MmBfK3TA5qmZhqcs",
        coverImage: require("../../assets/images/dappcamp.png"),
        name: "DappCamp Cohort 3",
        borderColor: "border-purple-500",
      });
      console.log("EVENTS", events);
      setEvents(events);
      setIsFetching(false);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  if (isFetching) {
    return null;
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
          <EventCard key={item.id} item={item} />
        )}
        onRefresh={onRefresh}
        refreshing={isFetching}
        style={tw`w-full`}
        contentContainerStyle={tw`py-6`}
      />
    </View>
  );
}
