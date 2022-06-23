import * as Haptics from "expo-haptics";
import { FlatList, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import Avatar from "components/Avatar";
import Button from "components/Button";
import tw from "utils/tailwind";
import useUserStore from "stores/user";
import { BACKEND_API_URL } from "config";
import { RootTabScreenProps } from "../../types";
import { apiRequest } from "utils";

function EventCard({ navigation, item, userId }: any) {
  const { _id, chatRoomId, message, postedByUser, roomInfo } = item;
  const [isLoading, setIsLoading] = useState(false);
  //const [members, setMembers] = useState(initialMembers);

  return (
    <Button
      onPress={() =>
        navigation.navigate("Room", {
          roomId: chatRoomId,
        })
      }
    >
      <View key={_id} style={tw`w-11/12 m-auto shadow-md`}>
        <View style={tw`w-full bg-white rounded-lg p-4`}>
          <Text style={tw`text-3xl font-bold`}>{chatRoomId}</Text>
          <Text style={tw`text-lg font-bold text-gray-400 mb-2`}>
            {message.messageText}
          </Text>
          <View style={tw`flex-row mb-6`}>
            {roomInfo.map((member: any) => (
              <>
                <Avatar
                  source={{
                    uri: member[0].profileImagePath
                      ? BACKEND_API_URL + "/" + member[0].profileImagePath
                      : "",
                  }}
                />
                <View style={tw`mr-2`} />
              </>
            ))}
          </View>
          {/*
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
        */}
        </View>
      </View>
    </Button>
  );
}

export default function ChatScreen({
  navigation,
}: RootTabScreenProps<"Chats">) {
  const [rooms, setRooms] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);

  useEffect(() => {
    async function fetchRooms() {
      try {
        const rooms = await apiRequest("v0/room", "GET");
        console.log("ROOMS", rooms.conversation);
        setRooms(rooms.conversation);
        setIsFetching(false);
      } catch (error) {
        console.log("ERROR", error);
      }
    }

    fetchRooms();
  }, []);

  async function onRefresh() {
    try {
      setIsFetching(true);
      const rooms = await apiRequest("v0/room", "GET");
      console.log("ROOMS", rooms.conversation);
      setRooms(rooms.conversation);
      setIsFetching(false);
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  async function createRoom() {
    try {
      const room = await apiRequest("v0/room/initiate", "POST", {
        userIds: [
          "0391136364cb4d44a3224c0f2d92e70a",
          "90e3f72bb31b429b82510ef950b9b37b",
        ],
        type: "party",
      });
      console.log("ROOM", room);
      return room;
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
        data={rooms}
        renderItem={({ item, index }) => (
          <EventCard
            key={item.id}
            navigation={navigation}
            item={item}
            userId={user.userId}
          />
        )}
        contentContainerStyle={tw`py-6`}
        onRefresh={onRefresh}
        refreshing={isFetching}
        style={tw`w-full`}
      />
      <View style={tw`absolute bottom-3 right-3`}>
        <Button
          buttonStyle={`w-14 h-14 rounded-full bg-white shadow-md items-center justify-center`}
          onPress={async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const room = await createRoom();
          }}
        >
          <FontAwesome color={"#000000"} name={"plus"} size={24} />
        </Button>
      </View>
    </View>
  );
}
