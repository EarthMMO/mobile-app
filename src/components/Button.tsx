import * as Haptics from "expo-haptics";
import tw from "utils/tailwind";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ButtonProps = {
  disabled: boolean;
  icon?: any;
  iconAlignment?: any;
  labelStyle: any;
  onPress: any;
  spinner: any;
  spinnerProps: any;
  buttonStyle?: any;
  text?: string;
};

export default function Button({
  disabled = false,
  icon,
  iconAlignment,
  labelStyle,
  onPress,
  spinner,
  spinnerProps,
  buttonStyle = "",
  text = "Button",
}: ButtonProps) {
  const animation = new Animated.Value(0);
  const inputRange = [0, 1];
  const scaleOutputRange = [1, 0.98];
  const translateOutputRange = [0, 5];
  const scale = animation.interpolate({
    inputRange,
    outputRange: scaleOutputRange,
  });
  const translate = animation.interpolate({
    inputRange,
    outputRange: translateOutputRange,
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
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }}
      activeOpacity={0.8}
      disabled={disabled}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          tw`${buttonStyle} py-4 w-9/12 border-2 border-black rounded-lg z-10`,
          {
            transform: [
              { scale },
              { translateX: translate },
              { translateY: translate },
            ],
          },
        ]}
      >
        <View style={tw`flex-row min-w-full justify-center`}>
          {icon && iconAlignment === "left" ? icon : null}
          {spinner ? (
            <ActivityIndicator {...spinnerProps} style={{ marginRight: 10 }} />
          ) : null}
          <Text style={tw`${labelStyle} text-base`}>{text}</Text>
          {icon && iconAlignment === "right" ? icon : null}
        </View>
      </Animated.View>
      <Animated.View
        style={[
          tw`absolute left-0 top-0 h-[60px] w-9/12 bg-white rounded-lg my-shadow-md`,
          {
            transform: [{ scale }],
          },
        ]}
      ></Animated.View>
    </TouchableOpacity>
  );
}
