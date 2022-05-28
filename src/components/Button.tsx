import tw from "utils/tailwind";
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { forwardRef } from "react";

type ButtonProps = {
  buttonStyle?: any;
  children?: any;
  disabled?: boolean;
  icon?: any;
  iconAlignment?: any;
  labelStyle?: any;
  onPress: any;
  spinner?: any;
  spinnerProps?: any;
  text?: string;
};

const Button = forwardRef(
  (
    {
      buttonStyle,
      children,
      disabled = false,
      icon,
      iconAlignment,
      labelStyle,
      onPress,
      spinner,
      spinnerProps,
      text = "",
    }: ButtonProps,
    ref
  ) => {
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
        activeOpacity={children ? 1 : 0.8}
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        ref={ref}
        style={tw.style(`w-full py-4 rounded-lg z-10 ${buttonStyle}`, {
          transform: [{ scale }],
        })}
      >
        {children ? (
          children
        ) : (
          <View style={tw`flex-row min-w-full justify-center`}>
            {icon && iconAlignment === "left" ? icon : null}
            {spinner ? (
              <ActivityIndicator
                {...spinnerProps}
                style={{ marginRight: 10 }}
              />
            ) : null}
            <Text style={tw`text-base ${labelStyle}`}>{text}</Text>
            {icon && iconAlignment === "right" ? icon : null}
          </View>
        )}
      </TouchableOpacity>
    );
  }
);

export default Button;
