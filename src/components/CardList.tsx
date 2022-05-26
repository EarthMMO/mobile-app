import { FlatList, Pressable, Text, View } from "react-native";

import tw from "utils/tailwind";

type CardListProps = {
  data: any;
  navigation: any;
};

export default function CardList({ data, navigation }: CardListProps) {
  return (
    <View style={tw`w-10/12 bg-white shadow-md rounded-lg`}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <Pressable
            style={({ pressed }) =>
              tw.style(
                pressed ? "bg-gray-100" : "bg-white",
                index === 0 && "rounded-t-lg",
                index === data.length - 1
                  ? "rounded-b-lg"
                  : "border-b border-gray-100",
                "px-3 py-3"
              )
            }
            onPress={item.onPress}
          >
            {({ pressed }) => (
              <Text style={tw`text-base font-medium`}>{item.name}</Text>
            )}
          </Pressable>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}
