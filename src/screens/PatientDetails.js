import React from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";

const PatientDetails = ({ navigation, route }) => {
  const {
    cost,
    dateOfArrival,
    doctorID,
    patientDisease,
    patientName,
    appointmentDate,
    patientPhoneNumber,
    patientuid,
    prescription,
  } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image style={styles.footer} source={require("../../assets/header-login-screen.png")} />
        <Text style={styles.topText}>Patient Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer} style={styles.subContainer}>
        <Text style={styles.headingText}>Patient Information</Text>
        <Image source={require("../../assets/patientimg.png")} />
        
        {/* Patient Details Section */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.input}>{patientName}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>patient Phone Number:</Text>
          <Text style={styles.input}>{patientPhoneNumber}</Text>
        </View>
        {/* Button to navigate to Patient Record */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("PatientRecord", { patientPhoneNumber })}
        >
          <Text style={styles.buttonText}>See Patient Record</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  topText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingTop: 20,
  },
  inputContainer: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    color: "gray",
  },
  button: {
    backgroundColor: "#35A2CD",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default PatientDetails;
