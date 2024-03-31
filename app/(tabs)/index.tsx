import { View } from "react-native";
import React, { useMemo, useState } from "react";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
// import listingsData from "@/assets/data/airbnb-listings.json";
import listingsData from "@/assets/data/homestay-long-listing.json";
import ListingsMap from "@/components/ListingsMap";
// import listingsDataGeo from "@/assets/data/airbnb-listings.geo.json";
import listingsDataGeo from "@/assets/data/homestay-long-listing.geo.json";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

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
