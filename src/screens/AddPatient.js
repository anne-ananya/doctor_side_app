import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useContext } from "react";
import { Picker } from "@react-native-picker/picker";
import AuthContext from "../../AuthContext";
import { database } from "../../firebaseConfig";
import {
  ref,
  get,
  push,
  child,
  update,
  serverTimestamp,
  remove,
} from "firebase/database";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import sendEmail from "../components/sendEmail";

const AddPatient = () => {
  const route = useRoute();
  const { preferredDate, patientEmail } = route.params || {};
  const authContext = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    appointmentDate: preferredDate || "",
    patientPhoneNumber: "",
    patientEmail: patientEmail || "",
    patientDisease: "",
    cost: "",
    prescription: "",
    vitals: {
      heartRate: "",
      spo2: "",
      bloodGlucose: {
        fasting: "",
        nonFasting: "",
      },
    },
    medicalHistory: "",
    dateOfArrival: serverTimestamp(),
    doctorID: authContext.user,
  });

  const pickerItems = [
    { label: "Covid19", value: "Covid19" },
    { label: "Diabetes", value: "Diabetes" },
    { label: "Flu", value: "Flu" },
    { label: "Fever", value: "Fever" },
    { label: "Heart Disease", value: "HeartDisease" },
    { label: "Diarrheal", value: "Diarrheal" },
  ];

  const myFirebase = async () => {
    const newPatientKey = push(child(ref(database), "patients")).key;
    const patientRefPath = "/patients/" + newPatientKey;
    const updates = {};
    updates[patientRefPath] = formData;
  
    try {
      // ✅ Add patient
      await update(ref(database), updates);
      console.log("✅ Patient data saved successfully!");
  
      // ✅ Send email
      await sendEmail(formData);
  
      // ✅ Find and delete appointment request
      const snapshot = await get(child(ref(database), "appointmentRequests"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const matchedEntry = Object.entries(data).find(
          ([id, request]) => request.patientEmail === formData.patientEmail
        );
  
        if (matchedEntry) {
          const [requestId] = matchedEntry;
          const requestRef = ref(database, `appointmentRequests/${requestId}`);
          await remove(requestRef);
          console.log("🗑️ Appointment request deleted successfully.");
        } else {
          console.warn("⚠️ No matching appointment request found.");
        }
      }
  
      alert("✅ Patient added and appointment request removed.");
    } catch (error) {
      console.error("❌ Error updating patient data or sending email:", error);
      alert("⚠️ Patient added, but email or request removal failed.");
    }
  };
  
  

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setFormData({
      ...formData,
      appointmentDate: currentDate.toLocaleDateString(),
    });
  };

  const showDatePicker = () => setShow(true);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.footer}
          source={require("../../assets/header-login-screen.png")}
        />
        <Text style={styles.topText}>Add Patient</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        <KeyboardAvoidingView behavior="padding">
          <Text style={styles.headingText}>Add Patient Info</Text>
          <TextInput
            style={styles.input}
            placeholder="Patient Name"
            onChangeText={(text) =>
              setFormData({ ...formData, patientName: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Patient Email"
            keyboardType="email-address"
            value={formData.patientEmail}
            onChangeText={(text) =>
              setFormData({ ...formData, patientEmail: text })
            }
          />
          <TouchableOpacity style={styles.input} onPress={showDatePicker}>
            <Text>
              Appointment Date:{" "}
              {formData.appointmentDate || "Select a date"}
            </Text>
          </TouchableOpacity>
          {show && <DateTimePicker value={date} onChange={handleDateChange} />}
          <TextInput
            style={styles.input}
            placeholder="Patient Phone Number"
            keyboardType="phone-pad"
            onChangeText={(text) =>
              setFormData({ ...formData, patientPhoneNumber: text })
            }
          />

          <View style={styles.input}>
            <Picker
              selectedValue={formData.patientDisease}
              onValueChange={(value) =>
                setFormData({ ...formData, patientDisease: value })
              }
            >
              <Picker.Item label="Select Disease" value="" />
              {pickerItems.map((item, index) => (
                <Picker.Item key={index} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Cost"
            keyboardType="numeric"
            onChangeText={(text) =>
              setFormData({ ...formData, cost: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Prescription"
            onChangeText={(text) =>
              setFormData({ ...formData, prescription: text })
            }
          />
          <TouchableOpacity style={styles.button} onPress={myFirebase}>
            <Text style={styles.buttonText}>Add Patient</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddPatient;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  headerContainer: { alignItems: "center" },
  scrollContainer: { width: "90%", marginVertical: 20 },
  topText: { fontWeight: "bold", fontSize: 18, color: "white", marginTop: 50 },
  headingText: { fontSize: 22, fontWeight: "bold", color: "#35A2CD" },
  input: {
    width: "100%",
    backgroundColor: "rgb(220,220,220)",
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
  },
  textArea: { height: 80 },
  button: {
    backgroundColor: "#35A2CD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
