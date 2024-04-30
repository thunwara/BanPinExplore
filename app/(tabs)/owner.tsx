import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { places } from "@/assets/data/places";
import { useRouter } from "expo-router";
// @ts-ignore
import DatePicker from "react-native-modern-datepicker";

import { addDoc, collection, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import DropdownStatus from "@/components/DropdownStatus";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const guestsGropus = [
  {
    name: "Adults",
    text: "Ages 13 or above",
    count: 0,
  },
  {
    name: "Children",
    text: "Ages 2-12",
    count: 0,
  },
  {
    name: "Infants",
    text: "Under 2",
    count: 0,
  },
  {
    name: "Pets",
    text: "Pets allowed",
    count: 0,
  },
];

export interface Homestay {
  District: string;
  HomestayName: string;
  HomestayOwner: string;
  id: string;
}

const Page = () => {
  const [openCard, setOpenCard] = useState(0);
  const [selectedPlace, setSelectedPlace] = useState(0);

  const [groups, setGroups] = useState(guestsGropus);
  const router = useRouter();
  const today = new Date().toISOString().substring(0, 10);

  const [homestays, setHomestays] = useState<{ id: string }[]>([]);
  const [selectedHomestay, setSelectedHomestay] = useState("");
  const [status] = useState("booked");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [numPeople, setNumPeople] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const homestaySnapshot = await getDocs(
          collection(FIRESTORE_DB, "Homestay")
        );
        const homestayData = homestaySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHomestays(homestayData);
      } catch (error) {
        console.error("Error fetching homestays:", error);
      } finally {
        // console.log("Homestay data fetched:", homestays);
      }
    };
    fetchHomestays();
  }, []);

  useEffect(() => {
    // Check if homestay data has been fetched
    if (homestays.length > 0) {
      console.log("Homestay data fetched:", homestays);
    }
  }, [homestays]);

  const onClearAll = () => {
    setSelectedPlace(0);
    setOpenCard(0);
    setStartDate("");
    setEndDate("");
    setNumPeople("");
  };

  const saveBooking = async () => {
    setLoading(true);
    try {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        // Create a new document in the "bookings" collection with the booking details
        const bookingData = {
          startDate: startDate,
          endDate: endDate,
          numPeople: numPeople,
          homestayId: selectedHomestay,
          status: status,
          selectedPlace: selectedPlace, // Assuming you have the place information stored somewhere
          userID: currentUser.uid, // Add the userID field with the current user's UID
        };
        await addDoc(collection(FIRESTORE_DB, "Booking"), bookingData);
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error: any) {
      console.log(error);
      alert("Booking failed: " + error.message);
    } finally {
      setLoading(false);
      router.navigate("/(tabs)/booking");
    }
  };

  return (
      <View style={styles.container}>
        <KeyboardAvoidingView behavior="padding">
          <TextInput
            autoCapitalize="none"
            placeholder="HomestayA"
            style={[defaultStyles.inputField, { marginBottom: 30 }]}
            placeholderTextColor="#000"
            value={selectedHomestay}
            onChangeText={(text) => setSelectedHomestay(text)}
          ></TextInput>

          <TextInput
            autoCapitalize="none"
            placeholder="5 May 2024"
            style={[defaultStyles.inputField, { marginBottom: 30 }]}
            placeholderTextColor="#000"
            value={startDate}
            onChangeText={(text) => setStartDate(text)}
          ></TextInput>

          <TextInput
            autoCapitalize="none"
            placeholder="7 May 2024"
            style={[defaultStyles.inputField, { marginBottom: 30 }]}
            placeholderTextColor="#000"
            value={endDate}
            onChangeText={(text) => setEndDate(text)}
          ></TextInput>

          <TextInput
            autoCapitalize="none"
            placeholder="QUnzU6GpFloUs7SKdLnZ"
            style={[defaultStyles.inputField, { marginBottom: 30 }]}
            placeholderTextColor="#000"
            value={numPeople}
            onChangeText={(text) => setNumPeople(text)}
          ></TextInput>

          <DropdownStatus/>

          {loading && <ActivityIndicator size="large" color="#0000ff" />}

          <TouchableOpacity
            onPress={saveBooking}
            style={[defaultStyles.btn, { marginBottom: 10 }]}
          >
            <Text style={defaultStyles.btnText}>Save status</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: "#fff",
    padding: 26,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  cardHeader: {
    fontFamily: "mon-b",
    fontSize: 24,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  searchSection: {
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 8,
    marginBottom: 16,
  },
  searchIcon: {
    padding: 10,
  },
  inputField: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  placesContainer: {
    flexDirection: "row",
    gap: 25,
  },
  place: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  placeSelected: {
    borderColor: Colors.grey,
    borderWidth: 2,
    borderRadius: 10,
    width: 100,
    height: 100,
  },
  previewText: {
    fontFamily: "mon-sb",
    fontSize: 14,
    color: Colors.grey,
  },
  previewdData: {
    fontFamily: "mon-sb",
    fontSize: 14,
    // color: Colors.dark,
  },

  guestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey,
  },
});
export default Page;
