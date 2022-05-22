import { Pressable, StyleSheet, Text } from "react-native";

import useColorScheme from "hooks/useColorScheme";

type ButtonProps = {
  onPress: any;
  title: string;
};

export default function Button({ onPress, title = "Save" }: ButtonProps) {
  const colorScheme = useColorScheme();

  const buttonTheme =
    colorScheme === "light" ? styles.lightText : styles.darkText;
  const textTheme =
    colorScheme === "light" ? styles.lightButton : styles.darkButton;

  return (
    <Pressable style={[styles.button, styles.darkButton]} onPress={onPress}>
      <Text style={[styles.text, textTheme]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
  },
  lightButton: {
    backgroundColor: "black",
  },
  darkButton: {
    backgroundColor: "white",
  },
  lightText: {
    color: "white",
  },
  darkText: {
    color: "black",
  },
});
