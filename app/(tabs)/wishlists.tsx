import { View, Text } from "react-native";
import React, { useMemo, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import Listings from "@/components/Listings";
import listingsData from "@/assets/data/homestay-long-listing.json";
import listingsDataGeo from "@/assets/data/homestay-long-listing.geo.json";

const Page = () => {
  const user = useUser();
  const items = useMemo(() => listingsData as any, []);
  const getoItems = useMemo(() => listingsDataGeo, []);
  const [category, setCategory] = useState<string>("Tiny homes");

  return (
    <View>
      <Listings listings={items} category={category} />
    </View>
  );
};

export default Page;
