import * as Haptics from "expo-haptics";
import tw from "utils/tailwind";
import { Alert, Text, View } from "react-native";
import { useState } from "react";

import Button from "components/Button";
import useUserStore from "stores/user";
import useWallet from "hooks/useWallet";
import { createOrImportWallet } from "utils/wallet";

export default function SignInScreen() {
  const [createSpinner, setCreateSpinner] = useState(false);
  const [importSpinner, setImportSpinner] = useState(false);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);
  const wallet = useWallet();

  return (
    <View style={tw`flex-1 items-center justify-center bg-white`}>
      <Button
        onPress={async () => {
          setCreateSpinner(true);
          const response = await createOrImportWallet();
          updateUser({ ...response, isSignedIn: true });
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setCreateSpinner(false);
        }}
        buttonStyle={"bg-black"}
        labelStyle={"text-white font-bold"}
        spinner={createSpinner}
        spinnerProps={{
          color: "white",
        }}
        text="Create Wallet"
      />
      <View style={tw`mb-8`} />
      <Button
        onPress={() => {
          Alert.prompt("Import Wallet", "", async (text) => {
            setImportSpinner(true);
            const response = await createOrImportWallet(text);
            updateUser({ ...response, isSignedIn: true });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setImportSpinner(false);
          });
        }}
        buttonStyle={"bg-white"}
        labelStyle={"font-bold"}
        spinner={importSpinner}
        spinnerProps={{
          color: "black",
        }}
        text="Import Wallet"
      />
      {/*
      <Text>{"USER " + JSON.stringify(user)}</Text>
      <Text>{"WALLET " + JSON.stringify(wallet)}</Text>
      */}
    </View>
  );
}
