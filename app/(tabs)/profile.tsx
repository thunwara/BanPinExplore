import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
// import { useAuth, useUser } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Link } from "expo-router";
import Login from "../(modals)/login";
import wishlists from "@/app/(tabs)/wishlists";
import trips from "@/app/(tabs)/trips";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

const Users = FIREBASE_AUTH.currentUser;

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="wishlists" component={wishlists} />
      <InsideStack.Screen name="trip" component={trips} />
    </InsideStack.Navigator>
  );
}

const Page = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  // Load user data on mount
  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }

  const button = async () => {
    console.log("BUTTON PRESSED");
  };

  return (
    <>
      <SafeAreaView style={defaultStyles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Profile</Text>
          <Ionicons name="notifications-outline" size={26} />
        </View>

        {!user && (
          <>
            <Text>please sign in</Text>
            <Link href={"/(modals)/login"} asChild>
              <TouchableOpacity style={styles.container}>
                <Ionicons
                  name="create-outline"
                  size={24}
                  // color={Colors.dark}
                />
                <Text>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </>
        )}

        {user && (
          <View style={styles.card}>
            <View style={{ flexDirection: "row", gap: 6 }}>
            </View>
            <Text>hello,</Text>
            <Text>email: {user.email}</Text>
            <Text>Since {user?.uid}</Text>
          </View>
        )}

        {user && (
          <Button
            title="Log Out"
            onPress={() => {
              signOut(FIREBASE_AUTH)
                .then(() => {
                  console.log("USER SIGN OUT");
                })
                .catch((error) => {
                  console.log(error);
                });
            }}
            color="black"
          />
        )}
      </SafeAreaView>

      {/* <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: true }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: true }}
          />
        )}
      </Stack.Navigator> */}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 24,
  },
  header: {
    fontFamily: "mon-b",
    fontSize: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFF00",
    padding: 10,
    marginVertical: 4,
  },
});

export default Page;