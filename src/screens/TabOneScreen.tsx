import * as SecureStore from "expo-secure-store";
import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "components/EditScreenInfo";
import useUserStore from "stores/user";
import useWallet from "hooks/useWallet";
import { RootTabScreenProps } from "../../types";
import { Text, View } from "components/Themed";

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);
  const wallet = useWallet();

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
