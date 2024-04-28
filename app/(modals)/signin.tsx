import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "@/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
// import { Link, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

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
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      alert("Check you emails!");
    } catch (error: any) {
      console.log(error);
      alert("Sign un failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

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

export default Login;

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
