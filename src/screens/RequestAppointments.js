import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

const RequestAppointments = () => {
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const appointmentRef = ref(database, "appointmentRequests");

    const unsubscribe = onValue(appointmentRef, (snapshot) => {
      const requests = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        requests.push({
          id: childSnapshot.key,
          patientEmail: data.patientEmail || "",
          preferredDate: data.preferredDate || "",
          additionalInfo: data.additionalInfo || "",
        });
      });
      setAppointmentRequests(requests);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = (request) => {
    // Only navigate and send the request ID
    navigation.navigate("AddPatient", {
      preferredDate: request.preferredDate,
      patientEmail: request.patientEmail,
      requestId: request.id,
    });
  };

  const handleDecline = async (id) => {
    try {
      await remove(ref(database, `appointmentRequests/${id}`));
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#35A2CD" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Pending Appointment Requests</Text>
      {appointmentRequests.length === 0 ? (
        <Text style={styles.noData}>No pending requests.</Text>
      ) : (
        appointmentRequests.map((request) => (
          <View key={request.id} style={styles.card}>
            <Text style={styles.cardText}>📧 {request.patientEmail}</Text>
            <Text style={styles.cardText}>📅 {request.preferredDate}</Text>
            <Text style={styles.cardText}>📝 {request.additionalInfo}</Text>

            <View style={styles.cardButtons}>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleAccept(request)}
              >
                <Text style={styles.btnText}>Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.declineBtn}
                onPress={() => handleDecline(request.id)}
              >
                <Text style={styles.btnText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default RequestAppointments;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#35A2CD",
  },
  noData: {
    fontSize: 16,
    color: "#777",
    marginTop: 30,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  declineBtn: {
    backgroundColor: "#F44336",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
