import * as Haptics from "expo-haptics";
import { Platform, StatusBar, View } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useAppColorScheme } from "twrnc";

import CardList from "components/CardList";
import tw from "utils/tailwind";

export default function DarkModeScreen({ navigation }: any) {
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);

  const themeList = [
    {
      name: "On",
      icon: null,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setColorScheme("dark");
        if (Platform.OS !== "ios") {
          StatusBar.setBarStyle("dark-content");
        }
      },
    },
    {
      name: "Off",
      icon: null,
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setColorScheme("light");
        StatusBar.setBarStyle("light-content");
      },
    },
    { name: "System", icon: null, onPress: () => {} },
  ];

  return (
    <View
      style={tw`flex-1 items-center bg-neutral-50 dark:bg-neutral-900 pt-6`}
    >
      <CardList data={themeList} navigation={navigation}></CardList>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <ExpoStatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
