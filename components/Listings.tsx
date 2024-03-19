import { View, Text } from "react-native";
import React, { useEffect } from "react";

interface Props {
  listings: any[];
  // refresh: number;
  category: string;
}

const Listings = ({ listings: items, category }: Props) => {
  useEffect(() => {
    console.log("RELOAD LISTINGS", items.length);
  }, [category]);

  return (
    <View>
      <Text>Listing</Text>
    </View>
  );
};

export default Listings;
