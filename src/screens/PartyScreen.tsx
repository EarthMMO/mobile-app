import * as Haptics from "expo-haptics";
import { FlatList, Image, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

import Avatar from "components/Avatar";
import Button from "components/Button";
import tw from "utils/tailwind";
import useUserStore from "stores/user";
import useWallet from "hooks/useWallet";
import { BACKEND_API_URL } from "config";
import { ITEM_CONTRACT_ABI, ITEM_CONTRACT_ADDRESS } from "config";
import { Item, item6, item2, item5 } from "screens/ProfileScreen";
import { RootTabScreenProps } from "../../types";
import { apiRequest } from "utils";

function EventCard({ item, userId }: any) {
  const { description, _id, members: initialMembers, name } = item;
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState(initialMembers);
  const isMember = members.some((member: any) => member._id === userId);

  return (
    <View key={_id} style={tw`w-11/12 pb-6 m-auto shadow-md`}>
      <View style={tw`w-full bg-white rounded-lg p-4`}>
        <Text style={tw`text-3xl font-bold`}>{name}</Text>
        <Text style={tw`text-lg font-bold text-gray-400 mb-2`}>
          {description}
        </Text>
        <View style={tw`flex-row mb-6`}>
          {members.map((member: any) => (
            <>
              <Avatar
                source={{
                  uri: member.profileImagePath
                    ? BACKEND_API_URL + "/" + member.profileImagePath
                    : "",
                }}
              />
              <View style={tw`mr-2`} />
            </>
          ))}
        </View>
        <Button
          activeOpacity
          buttonStyle={`w-full py-3 border-2 border-black ${
            isMember ? "bg-white" : "bg-black"
          }`}
          labelStyle={`font-bold ${isMember ? "text-black" : "text-white"}`}
          spinner={isLoading}
          spinnerProps={{
            color: isMember ? "black" : "white",
          }}
          text={isMember ? "Leave party" : "Join party"}
          disabled={isLoading}
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setIsLoading(true);
            const response = await apiRequest(`v0/group/${_id}`, "PATCH", {
              action: isMember ? "leave" : "join",
              userId,
            });
            setMembers(response.members);
            setIsLoading(false);
          }}
        />
      </View>
    </View>
  );
}

export default function PartyScreen({
  navigation,
}: RootTabScreenProps<"Party">) {
  const [groups, setGroups] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const groups = await apiRequest("v0/group", "GET");
        console.log("GROUPS", groups);
        setGroups(groups);
        setIsFetching(false);
      } catch (error) {
        console.log("ERROR", error);
      }
    }

    fetchGroups();
  }, []);

  async function onRefresh() {
    try {
      setIsFetching(true);
      const groups = await apiRequest("v0/group", "GET");
      console.log("GROUPS", groups);
      setGroups(groups);
      setIsFetching(false);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  async function createParty() {
    try {
      const party = await apiRequest("v0/group", "POST", {
        name: "New Party",
        description: "New Party Description",
        maxGroupSize: "5",
      });
      return party;
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
        data={groups}
        renderItem={({ item, index }) => (
          <EventCard key={item.id} item={item} userId={user.userId} />
        )}
        onRefresh={onRefresh}
        refreshing={isFetching}
        style={tw`w-full`}
        contentContainerStyle={tw`py-6`}
      />
      <View style={tw`absolute bottom-3 right-3`}>
        <Button
          buttonStyle={`w-14 h-14 rounded-full bg-white shadow-md items-center justify-center`}
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const party = await createParty();
          }}
        >
          <FontAwesome color={"#000000"} name={"plus"} size={24} />
        </Button>
      </View>
    </View>
  );
}
