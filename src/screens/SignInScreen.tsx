import * as Haptics from "expo-haptics";
import tw from "utils/tailwind";
import { Alert, StatusBar, Text, View } from "react-native";
import { useAppColorScheme } from "twrnc";
import { useState } from "react";

import Button from "components/Button";
import useUserStore from "stores/user";
import useWallet from "hooks/useWallet";
import { createOrImportWallet } from "utils/wallet";

export default function SignInScreen() {
  const [isCreating, setIsCreating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);
  const wallet = useWallet();
  const isLoading = isCreating || isImporting;

  return (
    <View
      style={tw`flex-1 items-center justify-center bg-white dark:bg-neutral-900`}
    >
      <Button
        onPress={async () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setIsCreating(true);
          const response = await createOrImportWallet();
          updateUser({ ...response, isSignedIn: true });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setIsCreating(false);
        }}
        buttonStyle={
          "w-10/12 border-2 border-black dark:border-white bg-black dark:bg-white"
        }
        disabled={isLoading}
        labelStyle={"text-white dark:text-black font-bold"}
        spinner={isCreating}
        spinnerProps={{
          color: "white",
        }}
        text={isCreating ? "Creating..." : "Create Wallet"}
      />
      <View style={tw`mb-8`} />
      <Button
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          Alert.prompt("Import Wallet", "", async (text) => {
            setIsImporting(true);
            const response = await createOrImportWallet(text);
            updateUser({ ...response, isSignedIn: true });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsImporting(false);
          });
        }}
        buttonStyle={
          "w-10/12 border-2 dark:border-white bg-white dark:bg-neutral-900"
        }
        disabled={isLoading}
        labelStyle={"dark:text-white font-bold"}
        spinner={isImporting}
        spinnerProps={{
          color: "black",
        }}
        text={isImporting ? "Importing..." : "Import Wallet"}
      />
      <View style={tw`mb-8`} />
      <Button
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          toggleColorScheme();
          StatusBar.setBarStyle(
            colorScheme === "light" ? "light-content" : "dark-content"
          );
        }}
        buttonStyle={
          "w-10/12 border-2 dark:border-white bg-white dark:bg-neutral-900"
        }
        disabled={isLoading}
        labelStyle={"dark:text-white font-bold"}
        text={`${colorScheme}`}
      />
      {/*
      <Text>{"USER " + JSON.stringify(user)}</Text>
      <Text>{"WALLET " + JSON.stringify(wallet)}</Text>
      */}
    </View>
  );
}
