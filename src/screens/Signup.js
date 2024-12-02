import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { auth, database } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

const Signup = ({ navigation }) => {
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [user, setUser] = useState({
    username: "",
    doctorRegNumber: "",
    qualification: "",
    yearOfRegistration: "",
    email: "",
    password: "",
  });
  const [passwordValid, setPasswordValid] = useState(false); // New state for password validation

  const myFirebase = (userID) => {
    const DBRef = ref(database, "user/" + userID);
    set(DBRef, user);
  };

  const handleChange = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };

  const handlePasswordChange = (password) => {
    setUser((prevUser) => ({
      ...prevUser,
      password: password,
    }));
    setPasswordValid(password.length >= 6); // Check if password is valid
  };

  const signupUser = () => {
    setLoader(true);
    setMessage({ text: "", type: "" });
    createUserWithEmailAndPassword(auth, user.email, user.password)
      .then((userCredential) => {
        myFirebase(userCredential.user.uid);
        setLoader(false);
        setMessage({ text: "Successfully signed up!", type: "success" });
      })
      .catch((error) => {
        setLoader(false);
        setMessage({ text: error.message, type: "error" });
      });
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.footer}
        source={require("../../assets/header-login-screen.png")}
      />
      <Text style={styles.topText}>Sign Up</Text>
      <View style={styles.subContainer}>
        <Text style={styles.headingText}>Sign up new account</Text>
        {message.text ? (
          <Text
            style={[
              styles.messageBox,
              message.type === "success" ? styles.success : styles.error,
            ]}
          >
            {message.text}
          </Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          onChangeText={(text) => handleChange("username", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Doctor Registration Number"
          onChangeText={(text) => handleChange("doctorRegNumber", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Qualification"
          onChangeText={(text) => handleChange("qualification", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Year of Registration"
          keyboardType="numeric"
          onChangeText={(text) => handleChange("yearOfRegistration", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          keyboardType="email-address"
          onChangeText={(text) => handleChange("email", text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Password"
          secureTextEntry={true}
          onChangeText={handlePasswordChange}
        />
        {!passwordValid && user.password.length > 0 && (
          <Text style={styles.validationMessage}>
            Password must be at least 6 characters long.
          </Text>
        )}
        <Pressable
          style={[styles.button, !passwordValid && styles.buttonDisabled]}
          onPress={signupUser}
          disabled={!passwordValid} // Disable button if password is invalid
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <ActivityIndicator animating={loader} size="large" />
      </View>
      <Image
        style={styles.footer}
        source={require("../../assets/footer-login-screen.png")}
      />
      <Text style={styles.bottomText}>
        Already have an account?
        <Text onPress={() => navigation.navigate("Login")}> Login Now</Text>
      </Text>
    </View>
  );
};

export default Signup;

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
    marginBottom: 13,
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
  validationMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  messageBox: {
    marginVertical: 10,
    padding: 10,
    width: "90%",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 16,
  },
  success: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  error: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
});
