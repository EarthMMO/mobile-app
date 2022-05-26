import tw from "utils/tailwind";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ButtonProps = {
  buttonStyle?: any;
  disabled?: boolean;
  icon?: any;
  iconAlignment?: any;
  labelStyle?: any;
  onPress: any;
  spinner?: any;
  spinnerProps?: any;
  text?: string;
};

export default function Button({
  buttonStyle,
  disabled = false,
  icon,
  iconAlignment,
  labelStyle,
  onPress,
  spinner,
  spinnerProps,
  text = "Text",
}: ButtonProps) {
  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const scaleOutputRange = [1, 0.95];
  const scale = animation.interpolate({
    inputRange,
    outputRange: scaleOutputRange,
  });

  const onPressIn = () => {
    Animated.spring(animation, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(animation, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={tw.style(
        `w-full bg-red-500 py-4 border-2 rounded-lg z-10 ${buttonStyle}`,
        {
          transform: [{ scale }],
        }
      )}
    >
      <View style={tw`flex-row min-w-full justify-center`}>
        {icon && iconAlignment === "left" ? icon : null}
        {spinner ? (
          <ActivityIndicator {...spinnerProps} style={{ marginRight: 10 }} />
        ) : null}
        <Text style={tw`text-base ${labelStyle}`}>{text}</Text>
        {icon && iconAlignment === "right" ? icon : null}
      </View>
    </TouchableOpacity>
  );
}
