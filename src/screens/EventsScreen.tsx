import * as Haptics from "expo-haptics";
import { FlatList, Image, Text, View } from "react-native";
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
import { RootTabScreenProps } from "../../types";
import { apiRequest } from "utils";

export default function EventsScreen({
  navigation,
}: RootTabScreenProps<"Events">) {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);
  const wallet = useWallet();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const events = await apiRequest("v0/event", "GET", user.jwt);
        setEvents(events);
        setIsLoading(false);
        console.log(events);
      } catch (error) {
        console.log("ERROR", error);
      }
    }

    fetchEvents();
  }, []);

  if (isLoading) {
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
                    "w-3/12 py-1 border-black dark:border-white bg-black dark:bg-white"
                  }
                  labelStyle={"text-white dark:text-black font-bold"}
                  text={"Claim"}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
                style={tw`w-16 h-16 rounded-xl border-4 border-blue-500`}
              />
            </View>
          </View>
        )}
        style={tw`w-full`}
        contentContainerStyle={tw`py-6`}
      />
    </View>
  );
}
