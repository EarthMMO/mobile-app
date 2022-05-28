import * as Haptics from "expo-haptics";
import Popover from "react-native-popover-view";
import { BlurView } from "expo-blur";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "components/Button";
import tw from "utils/tailwind";

function Item({ borderColor, image, margin, placement }: any) {
  const insets = useSafeAreaInsets();
  return (
    <View style={tw`mb-6 ${margin}`}>
      <Popover
        from={
          <Button
            buttonStyle={`w-16 h-16 rounded-xl bg-white shadow-md items-center justify-center`}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
          >
            {image ? (
              <Image
                source={{
                  uri: `https://ipfs.io/ipfs/${image}`,
                }}
                style={tw`w-16 h-16 border-3 ${borderColor} rounded-xl`}
              />
            ) : (
              <FontAwesome color={"#ebebeb"} name={"plus"} size={30} />
            )}
          </Button>
        }
        arrowSize={{ width: 0, height: 0 }}
        backgroundStyle={{ backgroundColor: "transparent" }}
        onOpenStart={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        displayAreaInsets={insets}
        offset={10}
        placement={placement}
        popoverStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: 12,
        }}
      >
        <BlurView intensity={20} tint={"dark"} style={tw`w-70 h-100`} />
        <Image
          source={{
            uri: `https://ipfs.io/ipfs/${image}`,
          }}
          style={tw`absolute w-full h-full rounded-xl resize-contain`}
        />
      </Popover>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <View
      style={tw`flex-1 flex-row items-center justify-between bg-neutral-50 dark:bg-neutral-900`}
    >
      <View style={tw`absolute w-full h-full`}>
        <Image
          source={require("../../assets/images/body.png")}
          style={tw`w-full h-full resize-contain`}
        />
      </View>

      <View style={tw`ml-4`}>
        <Item
          image={"QmQh3NYuAXrthNU5kKpJkdJUoB9ovJnkPdZy8gsxkSedYz"}
          borderColor={"border-blue-500"}
          placement={"right"}
        />
        <Item placement={"right"} />
        <Item placement={"right"} />
        <Item placement={"right"} />
        <Item placement={"right"} />
        <Item placement={"right"} />
        <Item placement={"right"} />
      </View>

      <View style={tw`flex-row h-full items-end`}>
        <Item
          image={"QmQh3NYuAXrthNU5kKpJkdJUoB9ovJnkPdZy8gsxkSedYz"}
          borderColor={"border-red-500"}
          margin={"mr-3"}
          placement={"top"}
        />
        <Item margin={"ml-3"} placement={"top"} />
      </View>

      <View style={tw`mr-4`}>
        <Item placement={"left"} />
        <Item placement={"left"} />
        <Item placement={"left"} />
        <Item
          image={"QmQh3NYuAXrthNU5kKpJkdJUoB9ovJnkPdZy8gsxkSedYz"}
          borderColor={"border-purple-500"}
          placement={"left"}
        />
        <Item placement={"left"} />
        <Item placement={"left"} />
        <Item placement={"left"} />
      </View>
    </View>
  );
}
