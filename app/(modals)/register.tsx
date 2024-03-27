import { Button, TextInput, View, StyleSheet } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import Spinner from "react-native-loading-spinner-overlay";
import { useState } from "react";
import { Link, Stack } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import { TouchableOpacity } from "react-native-gesture-handler";

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Create the user and send the verification email
  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        emailAddress,
        password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  // Verify the email address
  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      // Set the user's session as active
      setActive({ session: completeSignUp.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />
      <Spinner visible={loading} />

      {!pendingVerification && (
        <>
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

          <Button
            onPress={onSignUpPress}
            title="Sign up"
            color={"#6c47ff"}
          ></Button>

          {/* <TextInput
            autoCapitalize="none"
            placeholder="simon@galaxies.dev"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          /> */}
          {/* <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          /> */}
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder="Code..."
              style={[defaultStyles.inputField, { marginBottom: 30 }]}
              onChangeText={setCode}
            />
          </View>
          <Button
            onPress={onPressVerify}
            title="Verify Email"
            color={"#6c47ff"}
          ></Button>

          <Link href={"/(tabs)/profile"} asChild>
            <Button
              title="to profile page"
              // color={Colors.dark}
            />
          </Link>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Register;
