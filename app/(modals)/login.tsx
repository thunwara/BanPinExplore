import Colors from "@/constants/Colors";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
  Button,
} from "react-native";

import useWarmUpBrowser from "@/hooks/useWarmUpBrowser";
import Spinner from "react-native-loading-spinner-overlay";
import { defaultStyles } from "@/constants/Styles";
import { Ionicons } from "@expo/vector-icons";
import { useOAuth, useSignIn, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";

enum Strategy {
  Google = "oauth_google",
  // Apple = "oauth_apple",
  // Facebook = "oauth_facebook",
}

const Page = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  useWarmUpBrowser();

  const router = useRouter();
  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
  // const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });
  // const { startOAuthFlow: facebookAuth } = useOAuth({strategy: "oauth_facebook"});

  const onLogInPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
      // [Strategy.Apple]: appleAuth,
      // [Strategy.Facebook]: facebookAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      console.log(
        "🚀 ~ file: login.tsx:31 ~ onSelectAuth ~ createdSessionId:",
        createdSessionId
      );

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back(); //close modal after finishing authen
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
        value={emailAddress}
        onChangeText={setEmailAddress}
      />

      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        style={[defaultStyles.inputField, { marginBottom: 30 }]}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={onLogInPress} style={defaultStyles.btn}>
        <Text style={defaultStyles.btnText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnText}>
        <Text style={styles.btnText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnText}>
        <Link href={"/(modals)/register"} asChild>
          <Text>Create Account</Text>
        </Link>
      </TouchableOpacity>

      <View style={styles.seperatorView}>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text style={styles.seperator}>or</Text>
        <View
          style={{
            flex: 1,
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>

      <View style={{ gap: 20 }}>
        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => onSelectAuth(Strategy.Google)}
        >
          <Ionicons
            name="logo-google"
            size={24}
            style={defaultStyles.btnIcon}
          />
          <Text style={styles.btnOutlineText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
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
