import * as SecureStore from "expo-secure-store";
import { Image, Platform, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import CardList from "components/CardList";
import tw from "utils/tailwind";
import useUserStore from "stores/user";

export default function SettingsModalScreen({ navigation }: any) {
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);

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

  return (
    <View style={tw`flex-1 items-center bg-neutral-50 dark:bg-neutral-900`}>
      <Image
        source={require("../../assets/images/thomas.png")}
        style={tw`mb-2 h-26 w-26 rounded-full`}
      />
      <Text style={tw`text-2xl font-bold mb-6`}>Thomas Vu</Text>
      <CardList data={settingsList} navigation={navigation}></CardList>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
