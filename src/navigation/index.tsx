/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import * as SecureStore from "expo-secure-store";
import { ColorSchemeName, Pressable, Text } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

import ChatScreen from "screens/ChatScreen";
import Colors from "constants/Colors";
import DarkModeScreen from "screens/DarkModeScreen";
import EventsScreen from "screens/EventsScreen";
import LinkingConfiguration from "navigation/LinkingConfiguration";
import MapScreen from "screens/MapScreen";
import NotFoundScreen from "screens/NotFoundScreen";
import PartyScreen from "screens/PartyScreen";
import ProfileScreen from "screens/ProfileScreen";
import RoomScreen from "screens/RoomScreen";
import SettingsModalScreen from "screens/SettingsModalScreen";
import SignInScreen from "screens/SignInScreen";
import SplashScreen from "screens/SplashScreen";
import tw from "utils/tailwind";
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

const ModalStackView = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SettingsModal"
      component={SettingsModalScreen}
      options={({ navigation }) => ({
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#fafafa", // bg-neutral-50
        },
        headerTitle: "",
        headerRight: () => (
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}
          >
            <Text style={tw`text-base font-bold`}>Done</Text>
          </Pressable>
        ),
      })}
    />
    <Stack.Screen
      name="DarkMode"
      component={DarkModeScreen}
      options={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#fafafa", // bg-neutral-50
        },
        headerTitle: "Dark mode",
        presentation: "card",
      }}
    />
  </Stack.Navigator>
);

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
          isSignedIn: true,
          userId,
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
          component={MainStackView}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="Modal"
          component={ModalStackView}
          options={{ headerShown: false }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const MainStackView = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BottomTab"
      component={BottomTabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Room"
      component={RoomScreen}
      options={{ headerBackTitleVisible: false }}
    />
  </Stack.Navigator>
);

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Events"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].text,
      }}
    >
      <BottomTab.Screen
        name="Chats"
        component={ChatScreen}
        options={({ navigation }: RootTabScreenProps<"Chat">) => ({
          title: "Chats",
          tabBarIcon: ({ color }) => (
            <TabBarIcon library="Ionicons" name="chatbubbles" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Party"
        component={PartyScreen}
        options={({ navigation }: RootTabScreenProps<"Party">) => ({
          title: "Party",
          tabBarIcon: ({ color }) => (
            <TabBarIcon library="Ionicons" name="people" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Events"
        component={EventsScreen}
        options={({ navigation }: RootTabScreenProps<"Events">) => ({
          title: "Events",
          tabBarIcon: ({ color }) => (
            <TabBarIcon library="MaterialIcons" name="event" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Map"
        component={MapScreen}
        options={({ navigation }: RootTabScreenProps<"Map">) => ({
          title: "Map",
          tabBarIcon: ({ color }) => (
            <TabBarIcon library="Ionicons" name="map" color={color} />
          ),
        })}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }: RootTabScreenProps<"Profile">) => ({
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              library="Ionicons"
              name="person-circle-outline"
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="cog"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: { color: string; library: string; name: string }) {
  switch (props.library) {
    case "Ionicons":
      return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
    case "MaterialIcons":
      return (
        <MaterialIcons size={30} style={{ marginBottom: -3 }} {...props} />
      );
    default:
      return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
  }
}
