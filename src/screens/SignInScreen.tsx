import * as SecureStore from "expo-secure-store";
import { Alert, Button, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";

import useColorScheme from "hooks/useColorScheme";
import useUserStore from "stores/user";
import { View } from "components/Themed";
import { createOrImportWallet } from "utils/wallet";

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  //const [wallet, setWallet] = useState(null);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);

  //useEffect(() => {
  //  async function getUserAddress() {
  //    const wallet = await SecureStore.getItemAsync("wallet");
  //    setWallet(JSON.parse(wallet!));
  //  }

  //  getUserAddress();
  //}, [user.isSignedIn]);

  const textTheme =
    colorScheme === "light" ? styles.lightText : styles.darkText;

  return (
    <View style={styles.container}>
      <Button
        onPress={async () => {
          const response = await createOrImportWallet();
          updateUser({ ...response, isSignedIn: true });
        }}
        title="Create Wallet"
      />
      <Button
        onPress={() => {
          Alert.prompt("Import Wallet", "", async (text) => {
            const response = await createOrImportWallet(text);
            updateUser({ ...response, isSignedIn: true });
          });
        }}
        title="Import Wallet"
      />
      {/*
      <Button
        onPress={async () => {
          const wallet = await SecureStore.getItemAsync("wallet");
          console.log("WALLET", JSON.parse(wallet!));
          console.log("USER", JSON.stringify(user));
          Alert.alert("LOGGING");
        }}
        title="Console Log"
      />
      <Text>{"USER " + JSON.stringify(user)}</Text>
      <Text>{"WALLET " + JSON.stringify(wallet)}</Text>
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
  lightText: {
    color: "white",
  },
  darkText: {
    color: "black",
  },
});
