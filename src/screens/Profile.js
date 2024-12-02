import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ref, onValue, update } from "firebase/database";
import { database } from "../../firebaseConfig";
import AuthContext from "../../AuthContext";
import { getAuth, signOut } from "firebase/auth";

const Profile = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [editable, setEditable] = useState(false); // State to toggle edit mode
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const dbRef = ref(database, "user/" + authContext.user);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setProfileData(data);
    });
  }, [authContext.user]);

  // Save Updated Profile Data
  const saveProfile = () => {
    const dbRef = ref(database, "user/" + authContext.user);
    update(dbRef, profileData)
      .then(() => {
        Alert.alert("Success", "Profile updated successfully!");
        setEditable(false); // Disable edit mode after saving
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Failed to update profile.");
      });
  };

  // Signout User
  const signOutUser = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        authContext.signout();
        navigation.replace("Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.footer}
          source={require("../../assets/header-login-screen.png")}
        />
        <Text style={styles.topText}>My Profile</Text>
      </View>
      <View style={styles.subContainer}>
        <Text style={styles.headingText}>My Profile</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={profileData.username}
          editable={editable}
          onChangeText={(text) => setProfileData({ ...profileData, username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={profileData.email}
          editable={editable}
          onChangeText={(text) => setProfileData({ ...profileData, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={profileData.password}
          editable={editable}
          onChangeText={(text) => setProfileData({ ...profileData, password: text })}
        />
        {editable ? (
          <TouchableOpacity style={styles.button} onPress={saveProfile}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setEditable(true)}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={signOutUser}>
          <Text style={styles.buttonText}>Signout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: {
    flex: 3,
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
  headingText: {
    fontWeight: "bold",
    color: "#35A2CD",
    fontSize: 25,
    marginBottom: 8,
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
  buttonText: {
    color: "#fff",
  },
});
