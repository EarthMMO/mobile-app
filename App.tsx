import "react-native-get-random-values"; // Import the crypto getRandomValues shim (**BEFORE** the shims)
import "@ethersproject/shims"; // Import the the ethers shims (**BEFORE** ethers)
import Navigation from "navigation";
import useCachedResources from "hooks/useCachedResources";
import useColorScheme from "hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

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
