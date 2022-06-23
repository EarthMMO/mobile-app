import * as Haptics from "expo-haptics";
import Popover from "react-native-popover-view";
import { BlurView } from "expo-blur";
import { FontAwesome } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Button from "components/Button";
import tw from "utils/tailwind";

export default function Avatar({ source }: any) {
  return (
    <Button
      buttonStyle={`w-16 h-16 rounded-full bg-white shadow-md items-center justify-center`}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
    >
      <Image
        source={source}
        style={tw`w-16 h-16 rounded-full resize-contain`}
      />
    </Button>
  );
}
