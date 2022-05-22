import * as SecureStore from "expo-secure-store";
import { Button, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import EditScreenInfo from "components/EditScreenInfo";
import useUserStore from "stores/user";
import { RootTabScreenProps } from "../../types";
import { Text, View } from "components/Themed";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <Button
        onPress={async () => {
          await SecureStore.deleteItemAsync("wallet");
          updateUser({
            ethereumAddress: "",
            userId: null,
            isSignedIn: false,
          });
        }}
        title="Sign out"
      />
      {/*
      <Text>{"USER " + JSON.stringify(user)}</Text>
      <Text>{"WALLET " + JSON.stringify(wallet)}</Text>
      */}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
