/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as SecureStore from "expo-secure-store";
import { ColorSchemeName, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import Colors from "constants/Colors";
import LinkingConfiguration from "navigation/LinkingConfiguration";
import ModalScreen from "screens/ModalScreen";
import NotFoundScreen from "screens/NotFoundScreen";
import SignInScreen from "screens/SignInScreen";
import SplashScreen from "screens/SplashScreen";
import TabOneScreen from "screens/TabOneScreen";
import TabTwoScreen from "screens/TabTwoScreen";
import useColorScheme from "hooks/useColorScheme";
import useUserStore from "stores/user";
import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../../types";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [userAddress, setUserAddress] = useState(null);
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);

  useEffect(() => {
    async function loadUserAddress() {
      const walletString = await SecureStore.getItemAsync("wallet");
      if (user.isSignedIn || walletString !== null) {
        const wallet = JSON.parse(walletString!);
        const ethereumAddress = wallet.ethereumAddress;
        const userId = wallet.userId;
        updateUser({
          ethereumAddress,
          userId,
          isSignedIn: true,
        });
        setUserAddress(ethereumAddress);
      } else {
        setUserAddress(null);
      }
      setIsLoadingAddress(false);
    }

    loadUserAddress();
  }, [user.isSignedIn]);

  if (isLoadingAddress) {
    // We haven't finished checking for userAddress yet
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator>
      {userAddress === null ? (
        <Stack.Screen
          name="Root"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen}
        options={({ navigation }: RootTabScreenProps<"TabOne">) => ({
          title: "Tab One",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: "Tab Two",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
