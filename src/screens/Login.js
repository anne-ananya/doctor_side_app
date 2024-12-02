import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import AuthContext from "../../AuthContext";

const Login = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const authcontext = useContext(AuthContext);

  const handleEmailChange = (email) => {
    setUser((prevUser) => ({
      ...prevUser,
      email: email,
    }));
    setMessage({ text: "", type: "" }); // Clear any previous messages
  };

  const handlePasswordChange = (password) => {
    setUser((prevUser) => ({
      ...prevUser,
      password: password,
    }));
    setMessage({ text: "", type: "" }); // Clear any previous messages
  };

  const signinUser = () => {
    setLoader(true);
    setMessage({ text: "", type: "" });
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        authcontext.signin(userCredential.user.uid, () => {
          navigation.replace("BottomTab");
        });
        setLoader(false);
      })
      .catch((error) => {
        setLoader(false);
        let errorMessage = "An error occurred. Please try again.";
        if (error.code === "auth/wrong-password") {
          errorMessage = "Wrong password. Please try again.";
        } else if (error.code === "auth/user-not-found") {
          errorMessage = "User not found. Please check your email.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format.";
        }
        setMessage({ text: errorMessage, type: "error" });
      });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.footer}
        source={require("../../assets/header-login-screen.png")}
      />
      <Text style={styles.topText}>Sign In</Text>
      <View style={styles.subContainer}>
        <Text style={styles.headingText}>Welcome Back</Text>
        <Text style={styles.simpleText}>Sign in to continue</Text>
        {message.text ? (
          <Text style={[styles.messageBox, styles.error]}>{message.text}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          onChangeText={handleEmailChange}
          value={user.email}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          onChangeText={handlePasswordChange}
          value={user.password}
        />
        <Pressable
          style={[styles.button, loader && styles.buttonDisabled]}
          onPress={signinUser}
          disabled={loader} // Disable button during loader state
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </Pressable>
        <ActivityIndicator animating={loader} size="large" />
      </View>
      <Image
        style={styles.footer}
        source={require("../../assets/footer-login-screen.png")}
      />
      <Text style={styles.bottomText}>
        Don’t have an account?{" "}
        <Text onPress={() => navigation.navigate("Signup")}>Signup Now</Text>
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    height: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
  },
  topText: {
    position: "absolute",
    top: 70,
    fontWeight: "bold",
    color: "white",
    fontSize: 18,
  },
  bottomText: {
    position: "absolute",
    bottom: 50,
    color: "white",
    fontSize: 14,
  },
  headingText: {
    fontWeight: "bold",
    color: "#35A2CD",
    fontSize: 25,
    marginBottom: 8,
  },
  simpleText: {
    marginBottom: 15,
  },
  input: {
    width: "90%",
    height: 40,
    margin: 12,
    backgroundColor: "rgb(220,220,220)",
    padding: 10,
    borderRadius: 12,
  },
  button: {
    marginTop: 10,
    height: 35,
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#35A2CD",
    borderRadius: 12,
  },
  buttonDisabled: {
    backgroundColor: "gray", // Gray out the button when disabled
  },
  buttonText: {
    color: "#fff",
  },
  messageBox: {
    marginVertical: 10,
    padding: 10,
    width: "90%",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
});
