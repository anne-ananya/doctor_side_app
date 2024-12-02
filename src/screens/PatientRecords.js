import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Input, Overlay, Button } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ref, push, set, get } from "firebase/database";
import { database } from "../../firebaseConfig"; // Replace with your Firebase configuration file
import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Warning: Overlay: Support for defaultProps will be removed", // Specific warning to suppress
]);

const screenWidth = Dimensions.get("window").width - 50; // Deducting margin for better layout

const PatientRecord = ({ route }) => {
  const { patientPhoneNumber } = route.params; // Get the patient's phone number

  const [vitalsLog, setVitalsLog] = useState([]);
  const [newVital, setNewVital] = useState({
    date: new Date(),
    heartRate: "",
    spo2: "",
    bloodSugarFasting: "",
    bloodSugarNonFasting: "",
  });
  const [showAddVital, setShowAddVital] = useState(false);
  const [graphType, setGraphType] = useState("daily"); // Track graph type
  const [showDatePicker, setShowDatePicker] = useState(false); // State for date picker visibility

  // Fetch vitals data
  const fetchVitalsData = async () => {
    try {
      if (!patientPhoneNumber) {
        Alert.alert("Error", "Invalid patient phone number.");
        return;
      }

      const patientDataRef = ref(database, `PatientRecords/${patientPhoneNumber}/Vitals`);
      const snapshot = await get(patientDataRef);

      if (snapshot.exists()) {
        const vitalsArray = Object.values(snapshot.val());
        setVitalsLog(vitalsArray);
      } else {
        setVitalsLog([]);
      }
    } catch (error) {
      console.error("Error fetching vitals data:", error);
    }
  };

  useEffect(() => {
    fetchVitalsData();
  }, [patientPhoneNumber]);

  // Save vital data
  const saveVitalToDB = async (newLog) => {
    try {
      if (!patientPhoneNumber) {
        Alert.alert("Error", "Invalid patient phone number.");
        return;
      }

      const vitalsRef = ref(database, `PatientRecords/${patientPhoneNumber}/Vitals`);
      const newRecordRef = push(vitalsRef);
      await set(newRecordRef, newLog);
      Alert.alert("Success", "Vitals saved successfully!");
      fetchVitalsData();
    } catch (error) {
      console.error("Error saving vitals:", error);
    }
  };

  const handleSaveVital = () => {
    const { heartRate, spo2, bloodSugarFasting, bloodSugarNonFasting } = newVital;

    if (
      heartRate &&
      spo2 &&
      bloodSugarFasting &&
      bloodSugarNonFasting &&
      !isNaN(parseFloat(heartRate)) &&
      !isNaN(parseFloat(spo2)) &&
      !isNaN(parseFloat(bloodSugarFasting)) &&
      !isNaN(parseFloat(bloodSugarNonFasting))
    ) {
      const newLog = {
        ...newVital,
        date: newVital.date.toISOString().split("T")[0],
        heartRate: parseFloat(heartRate),
        spo2: parseFloat(spo2),
        bloodSugarFasting: parseFloat(bloodSugarFasting),
        bloodSugarNonFasting: parseFloat(bloodSugarNonFasting),
      };
      saveVitalToDB(newLog);
      setNewVital({
        date: new Date(),
        heartRate: "",
        spo2: "",
        bloodSugarFasting: "",
        bloodSugarNonFasting: "",
      });
      setShowAddVital(false);
    } else {
      Alert.alert("Validation Error", "Please fill in all fields with valid numbers.");
    }
  };

  const renderGraph = (title, valueKey) => {
    const validVitalsLog = vitalsLog.filter(
      (log) => log[valueKey] !== undefined && !isNaN(parseFloat(log[valueKey]))
    );

    if (validVitalsLog.length === 0) {
      return <Text style={styles.noDataText}>No data available for {title}.</Text>;
    }

    const graphData =
      graphType === "daily"
        ? {
            labels: validVitalsLog.map((log) => log.date),
            datasets: [{ data: validVitalsLog.map((log) => parseFloat(log[valueKey])) }],
          }
        : {
            labels: Object.keys(
              validVitalsLog.reduce((acc, log) => {
                const month = log.date.split("-")[1];
                acc[month] = acc[month] || [];
                acc[month].push(parseFloat(log[valueKey]));
                return acc;
              }, {})
            ),
            datasets: [
              {
                data: Object.values(
                  validVitalsLog.reduce((acc, log) => {
                    const month = log.date.split("-")[1];
                    acc[month] = acc[month] || [];
                    acc[month].push(parseFloat(log[valueKey]));
                    return acc;
                  }, {})
                ).map((arr) => arr.reduce((a, b) => a + b) / arr.length),
              },
            ],
          };

    return (
      <>
        <Text style={styles.graphTitle}>{title}</Text>
        <LineChart
          data={graphData}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: "#1cc910",
            backgroundGradientFrom: "#eff3ff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#ffa726" },
          }}
          style={{ marginVertical: 8, borderRadius: 16 }}
        />
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Patient Record: {patientPhoneNumber}</Text>

      <View style={styles.addVitalsContainer}>
        <Button
          title="Add Vitals"
          onPress={() => setShowAddVital(true)}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>

      <Overlay
        isVisible={showAddVital}
        onBackdropPress={() => setShowAddVital(false)}
        overlayStyle={styles.overlay}
      >
        <ScrollView contentContainerStyle={styles.overlayContent}>
          <Text style={styles.overlayTitle}>Add Vitals</Text>
          <Input
            label="Heart Rate"
            keyboardType="numeric"
            value={newVital.heartRate}
            onChangeText={(val) => setNewVital({ ...newVital, heartRate: val })}
          />
          <Input
            label="SpO2"
            keyboardType="numeric"
            value={newVital.spo2}
            onChangeText={(val) => setNewVital({ ...newVital, spo2: val })}
          />
          <Input
            label="Blood Sugar (Fasting)"
            keyboardType="numeric"
            value={newVital.bloodSugarFasting}
            onChangeText={(val) => setNewVital({ ...newVital, bloodSugarFasting: val })}
          />
          <Input
            label="Blood Sugar (Non-Fasting)"
            keyboardType="numeric"
            value={newVital.bloodSugarNonFasting}
            onChangeText={(val) => setNewVital({ ...newVital, bloodSugarNonFasting: val })}
          />
          <TouchableOpacity
  style={styles.datePickerButton}
  onPress={() => setShowDatePicker(true)}
>
  <Text style={styles.datePickerText}>
    {newVital.date ? `Selected Date: ${newVital.date.toISOString().split("T")[0]}` : "Select Date"}
  </Text>
</TouchableOpacity>
{showDatePicker && (
  <DateTimePicker
    value={newVital.date}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      setShowDatePicker(false);
      if (selectedDate) {
        setNewVital({ ...newVital, date: selectedDate });
      }
    }}
  />
)}
          <Button
            title="Save"
            onPress={handleSaveVital}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />
        </ScrollView>
      </Overlay>

      <View style={styles.graphButtonContainer}>
        <Button
          title="Daily"
          onPress={() => setGraphType("daily")}
          buttonStyle={graphType === "daily" ? styles.activeButton : styles.inactiveButton}
        />
        <Button
          title="Monthly"
          onPress={() => setGraphType("monthly")}
          buttonStyle={graphType === "monthly" ? styles.activeButton : styles.inactiveButton}
        />
      </View>

      {renderGraph("SpO2 Levels", "spo2")}
      {renderGraph("Heart Rate", "heartRate")}
      {renderGraph("Blood Sugar (Fasting)", "bloodSugarFasting")}
      {renderGraph("Blood Sugar (Non-Fasting)", "bloodSugarNonFasting")}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  headerText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
  addVitalsContainer: { marginVertical: 10 },
  button: { backgroundColor: "#1cd4ca", height: 50, justifyContent: "center", borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 16 },
  overlay: { width: "90%", borderRadius: 10, padding: 20 },
  overlayContent: { alignItems: "center" },
  overlayTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  datePickerButton: { backgroundColor: "#a9dce8", padding: 10, borderRadius: 5, marginVertical: 10 },
  datePickerText: { fontSize: 16, color: "#000" },
  graphButtonContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  activeButton: { backgroundColor: "#0bb316", borderRadius: 5 },
  inactiveButton: { backgroundColor: "#e4f0e4", borderRadius: 5 },
  graphTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  noDataText: { textAlign: "center", fontSize: 16, color: "gray", marginVertical: 10 },
});

export default PatientRecord;
