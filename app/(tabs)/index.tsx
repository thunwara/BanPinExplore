import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import ListingsMap from "@/components/ListingsMap";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import listingsData from "@/assets/data/homestay-long-listing.json";
import listingsDataGeo from "@/assets/data/homestay-long-listing.geo.json";

const Page = () => {
  const items = useMemo(() => listingsData as any, []);
  const getoItems = useMemo(() => listingsDataGeo, []);
  const [category, setCategory] = useState<string>("Tiny homes");

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, marginTop: 80 }}>
      {/* Define pour custom header */}
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <GestureHandlerRootView style={{flex: 1}}>
      <ListingsMap listings={getoItems} />
        <ListingsBottomSheet listings={items} category={category} />
      </GestureHandlerRootView>
    </View>
  );
};

export default Page;
