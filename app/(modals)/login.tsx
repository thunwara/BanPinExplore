import Colors from "@/constants/Colors";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
  Button,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import useWarmUpBrowser from "@/hooks/useWarmUpBrowser";
import Spinner from "react-native-loading-spinner-overlay";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@/FirebaseConfig";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLasttName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const db = FIRESTORE_DB;
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      // Create user in Firebase Authentication
      const { user: authUser } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User created in Firebase Authentication:", authUser);

      // Create user document in Firestore
      const userRef = doc(db, "Users", authUser.uid);
      await setDoc(userRef, {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        // Add additional fields as needed
      });
      console.log("User data created in Firestore");

      alert("Account created successfully!");
    } catch (error: any) {
      console.error("Sign up failed:", error.message);
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  useWarmUpBrowser();

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={[defaultStyles.inputField, { marginBottom: 30 }]}
          placeholderTextColor="#ABABAB"
          value={email}
          onChangeText={(text) => setEmail(text)}
        ></TextInput>

        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          style={[defaultStyles.inputField, { marginBottom: 30 }]}
          placeholderTextColor="#ABABAB"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
        ></TextInput>

        <TextInput
          autoCapitalize="none"
          placeholder="First Name"
          style={[defaultStyles.inputField, { marginBottom: 30 }]}
          placeholderTextColor="#ABABAB"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        ></TextInput>

        <TextInput
          autoCapitalize="none"
          placeholder="Last Name"
          style={[defaultStyles.inputField, { marginBottom: 30 }]}
          placeholderTextColor="#ABABAB"
          value={lastName}
          onChangeText={(text) => setLasttName(text)}
        ></TextInput>

        <TextInput
          autoCapitalize="none"
          placeholder="Phone Number"
          style={[defaultStyles.inputField, { marginBottom: 30 }]}
          placeholderTextColor="#ABABAB"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
        ></TextInput>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        <TouchableOpacity
          onPress={signIn}
          style={[defaultStyles.btn, { marginBottom: 10 }]}
        >
          <Text style={defaultStyles.btnText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={signUp}
          style={[defaultStyles.btn, { marginBottom: 10 }]}
        >
          <Text style={defaultStyles.btnText}>Create Account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 26,
  },

  seperatorView: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 30,
  },
  seperator: {
    fontFamily: "mon-sb",
    color: Colors.grey,
    fontSize: 16,
  },
  btnOutline: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.grey,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  btnOutlineText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  btnText: {
    // fontFamily: "mon-sb",
    margin: 8,
    alignItems: "center",
  },
});
