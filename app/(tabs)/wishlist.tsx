import { View, Text } from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";

const Page = () => {
  const user = useUser();

  return (
    <View>
      <Text>Wishlist for</Text>
    </View>
  );
};

export default Page;
