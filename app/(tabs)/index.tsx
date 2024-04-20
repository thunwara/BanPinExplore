import { View } from "react-native";
import React, { useMemo, useState } from "react";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import listingsData from "@/assets/data/homestay-long-listing.json";
import listingsDataGeo from "@/assets/data/homestay-long-listing.geo.json";
import ListingsMap from "@/components/ListingsMap";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Listings from "@/components/Listings";

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
      {/* <Listings listings={items} refresh={0} category={category} /> */}
      <ListingsMap listings={getoItems} />
      <GestureHandlerRootView>
        <>
          <ListingsBottomSheet listings={items} category={category} />
        </>
      </GestureHandlerRootView>
    </View>
  );
};

export default Page;
