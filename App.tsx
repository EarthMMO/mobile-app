import "react-native-get-random-values"; // Import the crypto getRandomValues shim (**BEFORE** the shims)
import "@ethersproject/shims"; // Import the the ethers shims (**BEFORE** ethers)
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAppColorScheme, useDeviceContext } from "twrnc";

import Navigation from "navigation";
import tw from "utils/tailwind";
import useCachedResources from "hooks/useCachedResources";

export default function App() {
  useDeviceContext(tw, { withDeviceColorScheme: false });
  const isLoadingComplete = useCachedResources();
  const [colorScheme, toggleColorScheme, setColorScheme] =
    useAppColorScheme(tw);

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
