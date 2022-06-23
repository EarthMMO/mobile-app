import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { Image, Platform, Text, View } from "react-native";
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar";
import { ethers } from "ethers";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useEffect, useState } from "react";

import Button from "components/Button";
import CardList from "components/CardList";
import tw from "utils/tailwind";
import useUserStore from "stores/user";
import useWallet from "hooks/useWallet";
import { BACKEND_API_URL } from "config";
import { apiRequest, formatAddress } from "utils";

export default function SettingsModalScreen({ navigation }: any) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [user, updateUser] = useUserStore((state) => [
    state.user,
    state.updateUser,
  ]);
  const currentWallet = useWallet();
  const [balance, setBalance] = useState("0");
  const [image, setImage] = useState("");

  useEffect(() => {
    async function getBalance() {
      const provider = ethers.getDefaultProvider("rinkeby", {
        infura: {
          projectId: "43c57a3294c74a7aa5eec78297aadad8",
          projectSecret: "e0ed1f4709a64fde93b11ca2d209d75f",
        },
      });
      const wallet = new ethers.Wallet(currentWallet.privateKey, provider);
      const balance = await wallet.getBalance();
      const balanceInEth = ethers.utils.formatEther(balance);
      setBalance(balanceInEth);
      updateUser({ etherBalance: balanceInEth });
    }

    async function getUser() {
      const response = await apiRequest(`v0/user/${user.userId}`, "GET");
      console.log(response);
      updateUser({ profileImagePath: response.profileImagePath });
    }

    if (currentWallet?.privateKey) {
      getBalance();
      getUser();
    }
  }, [currentWallet?.privateKey]);

  async function uploadProfileImage(image) {
    const data = new FormData();

    data.append("image", {
      name: user.userId + "_PROFILE_IMAGE",
      uri: Platform.OS === "ios" ? image.replace("file://", "") : image,
    });

    return await apiRequest(
      `v0/user/${user.userId}/upload`,
      "PATCH",
      data,
      true,
      true
    );
  }

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

  if (!currentWallet?.privateKey) {
    return null;
  }

  return (
    <View style={tw`flex-1 items-center bg-neutral-50 dark:bg-neutral-900`}>
      {/*
      <Text>{"USER " + JSON.stringify(user)}</Text>
      */}
      <Button
        activeOpacity
        buttonStyle={`mb-2 w-26 h-26 rounded-full bg-white items-center justify-center`}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          showActionSheetWithOptions(
            {
              options: ["Take Photo", "Choose Photo", "Remove Photo", "Cancel"],
              cancelButtonIndex: 3,
              destructiveButtonIndex: 2,
            },
            async (buttonIndex) => {
              // Do something here depending on the button index selected
              if (buttonIndex === 0) {
                const cameraPermissionResult = await requestPermission();

                if (cameraPermissionResult.granted) {
                  const result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 1,
                  });
                  const image = result.uri;

                  if (!result.cancelled) {
                    setImage(image);
                    const response = uploadProfileImage(image);
                  }
                }
              } else if (buttonIndex === 1) {
                // No permissions request is necessary for launching the image library
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.All,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
                });
                const image = result.uri;

                if (!result.cancelled) {
                  setImage(image);
                  const response = uploadProfileImage(image);
                }
              }
            }
          );
        }}
      >
        <Image
          source={
            image
              ? { uri: image }
              : user.profileImagePath
              ? {
                  uri: BACKEND_API_URL + "/" + user.profileImagePath,
                }
              : ""
          }
          style={tw`h-26 w-26 rounded-full resize-contain`}
        />
      </Button>
      <Text style={tw`text-2xl font-bold mb-2`}>Thomas Vu</Text>
      <View style={tw`mb-2 px-3 py-0.5 rounded-full bg-blue-100`}>
        <Text style={tw`text-base text-blue-800`}>
          {formatAddress(currentWallet?.ethereumAddress)}
        </Text>
      </View>
      <Text style={tw`mb-6 text-base text-gray-500`}>
        {user.etherBalance} ETH
      </Text>
      <CardList data={settingsList} navigation={navigation}></CardList>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
