import * as Haptics from "expo-haptics";
import Popover from "react-native-popover-view";
import { BlurView } from "expo-blur";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "components/Button";
import tw from "utils/tailwind";

export const item1 = {
  name: "Shadowmourne",
  description:
    "Shadowmourne is a legendary axe that is the counterpart to Frostmourne, the blade of The Lich King.",
  imagePath: require("../../assets/images/shadowmourne.jpg"),
  event: "ETHNewYork",
  address: "0xc962da7bb07c7168caaf8edc718ff1cc8dd2b2094e8cd95ddf6d477174048d83",
  nameColor: "text-orange-500",
  soulbound: "Soulbound Token",
};

export const item2 = {
  name: "Judgement Crown",
  description:
    "Increases damage and healing done by magical spells and effects by up to 32.",
  imagePath: require("../../assets/images/judgement.jpg"),
  event: "DappCamp Cohort 3",
  address: "0xbdfedfa64b1ccd819dc4705830e0e5bdfe2c2dbb6bc9826f8fa00d8b7e075fdd",
  nameColor: "text-purple-500",
  soulbound: "Soulbound Token",
};

export const item3 = {
  name: "Sneaker #2929",
  description: "NFT Sneaker, use it in STEPN to move2earn!",
  imagePath: require("../../assets/images/stepn.png"),
  event: null,
  collection: "StepN",
  address: "736wcniqNGcHH7Vv9T3bJSdTehpCg6mknWav9Rkzg3Ja",
  nameColor: "text-orange-500",
  soulbound: "Solana NFT",
};

export const item4 = {
  name: '"Fate Glow" Bronze Ring of Rage',
  description:
    "Rings (for Loot) is the first and largest 3D interpretation of an entire category in Loot.",
  imagePath: require("../../assets/images/ring.jpg"),
  event: null,
  collection: "Rings (for Loot)",
  address: "0x73c5013fa9701425be4a436ca0cec1c0898e6f14",
  nameColor: "text-blue-500",
  soulbound: "ERC-721 Token",
};

export const item5 = {
  name: "ETHNewYork POAP",
  description: "Part of the EthGlobal Community",
  imagePath: require("../../assets/images/poap.png"),
  event: "ETHNewYork",
  address: "0xbdfedfa64b1ccd819dc4705830e0e5bdfe2c2dbb6bc9826f8fa00d8b7e075fdd",
  nameColor: "text-yellow-500",
  soulbound: "ERC-721 Token",
};

export const item6 = {
  name: "Necklace of Calisea",
  description: "+8 Stamina\n+7 Intellect\n+7 Spirit",
  imagePath: require("../../assets/images/necklace.jpeg"),
  event: null,
  collection: "World of Warcraft",
  address: "0x73c5013fa9701425be4a436ca0cec1c0898e6f14",
  nameColor: "text-blue-500",
  soulbound: "Soulbound Token",
};

export function Item({ borderColor, item = {}, margin, placement }: any) {
  const {
    address,
    description,
    event,
    imagePath,
    name,
    nameColor,
    soulbound,
    collection,
  } = item;

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
            {imagePath ? (
              <Image
                source={imagePath}
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
        <BlurView intensity={20} tint={"dark"} style={tw`w-70 h-90`} />
        <View style={tw`absolute p-4`}>
          <Text style={tw`ml-20 text-lg font-bold ${nameColor}`}>{name}</Text>
          <Text style={tw`ml-20 text-lg text-white`}>{soulbound}</Text>
          <Text style={tw`mt-4 text-base italic text-gray-400`}>
            {description}
          </Text>
          <Text style={tw`mt-4 text-base text-gray-400`}>
            {event && `Event: ${event}`}
            {collection && `Collection: ${collection}`}
          </Text>
          <Text style={tw`mt-4 text-base text-gray-400`}>
            Address: {address}
          </Text>
        </View>
        <Image
          source={imagePath}
          style={tw`absolute m-4 w-16 h-16 border border-neutral-600 rounded-xl resize-contain`}
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
          borderColor={"border-purple-500"}
          item={item2}
          placement={"right"}
        />
        <Item
          borderColor={"border-blue-500"}
          item={item6}
          placement={"right"}
        />
        <Item placement={"right"} />
        <Item placement={"right"} />
        <Item placement={"right"} />
        <Item placement={"right"} />
        <Item placement={"right"} />
      </View>

      <View style={tw`flex-row h-full items-end`}>
        <Item
          borderColor={"border-orange-500"}
          item={item1}
          margin={"mr-3"}
          placement={"top"}
        />
        <Item
          borderColor={"border-yellow-500"}
          item={item5}
          margin={"ml-3"}
          placement={"top"}
        />
      </View>

      <View style={tw`mr-4`}>
        <Item placement={"left"} />
        <Item placement={"left"} />
        <Item placement={"left"} />
        <Item
          item={item3}
          borderColor={"border-orange-500"}
          placement={"left"}
        />
        <Item item={item4} borderColor={"border-blue-500"} placement={"left"} />
        <Item placement={"left"} />
        <Item placement={"left"} />
      </View>
    </View>
  );
}
