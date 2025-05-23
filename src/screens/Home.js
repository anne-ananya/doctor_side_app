import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import Background from "../components/Background";
import { useWindowDimensions } from "react-native";
import ViewPatient from "../components/ViewPatient";
import AuthContext from "../../AuthContext";
import {
  ref,
  onValue,
  query,
  child,
  orderByChild,
  equalTo,
} from "firebase/database";
import { database } from "../../firebaseConfig";
import { RequestAppointments } from "./RequestAppointments"
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from 'expo-linear-gradient';



const Home = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState();
  const [show, setShow] = useState(false);
  const { height, width } = useWindowDimensions();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    // Get a reference to the 'data' node in the database
    const dataRef = ref(database, "patients");

    // Create a query that filters the data based on the doctorID field
    const doctorIDQuery = query(
      dataRef,
      orderByChild("doctorID"),
      equalTo(authContext.user)
    );

    onValue(
      doctorIDQuery,
      (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          const patientArray = Object.keys(data).map((key) => ({
            patientuid: key,
            ...data[key],
          }));
          setPatientData(patientArray);
        } else {
          console.log("No Data to show");
        }
      },
      []
    );
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setDate(selectedDate);
    setSelectedDate(selectedDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  return (
    <Background>
      <View style={{ alignItems: "center", width: width }}>
        <View
          style={{
            paddingTop: 40,
            flexDirection: "row",
            alignItems: "flex-start",
            width: "90%",
          }}
        >
          <View>
            <Text
              style={{
                color: "white",
                fontSize: 30,
                fontWeight: "bold",
                paddingTop: 10,
              }}
            >
              {" "}
              Patient Tracker{" "}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 20,   
                fontStyle: "italic",
                paddingTop: 5,
                paddingBottom: 10,
              }}
            >
              {""}
              A commitment to community.
            </Text>
          </View>
          <Pressable
            style={{marginLeft:-50, marginTop:55, marginRight:30, padding: 10, width: "90%" }}
            onPress={() => navigation.navigate("Profile")}
          >
            <Image
              source={require("../../assets/doctorimg.png")}
              style={styles.topImage}
            />
          </Pressable>
        </View>
        <View style={styles.searchSection}>
          <Image
            style={styles.searchIcon}
            source={require("../../assets/search-bar.png")}
          />
          <TextInput
            style={styles.input}
            placeholder="Search"
            onChangeText={(value) => setSearchText(value)}
          />

          <View>
            <Pressable onPress={showDatePicker}>
              <Image
                style={styles.dateIcon}
                source={require("../../assets/date.png")}
              />
            </Pressable>
            <View
              style={{
                opacity: 0,
                position: "absolute",
                right: 10,
                top: -5,
              }}
            >
              {show && (
                <DateTimePicker
                  style={{ height: 50, width: 50 }}
                  value={date}
                  onChange={handleDateChange}
                />
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "white",
            height: height,
            width: width,
            borderTopLeftRadius: 80,
            borderTopRightRadius: 80,
            alignItems: "center",
          }}
        >
        <LinearGradient
  colors={["#03e5b7", "#037ade"]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{
    borderRadius: 10,
    width: "50%",
    marginTop: 20,
    marginBottom: -20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // ensures rounded corners
  }}
>
  <Pressable
    style={{
      flexDirection: "row",
      padding: 12,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    }}
    onPress={() => navigation.navigate("RequestAppointments")}
  >
    <Text style={{ color: "white", fontWeight: "bold", fontSize: 14, paddingRight: 10 }}>
      Requests
    </Text>
    <Image
      source={require("../../assets/icons8-notification-bell-64.png")}
      style={{ width: 20, height: 20 }}
    />
  </Pressable>
</LinearGradient>

          <ViewPatient
            navigation={navigation}
            searchText={searchText}
            patientData={patientData}
            selectedDate={selectedDate}
          />
        </View>
      </View>
    </Background>
  );
};

export default Home;

const styles = StyleSheet.create({
  searchSection: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    padding: 6,
    borderRadius: 10,
    marginBottom: 25,
    justifyContent: "space-between",
  },
  searchIcon: {
    padding: 10,
    marginLeft: 10,
  },
  dateIcon: {
    width: 32,
    height: 32,
    // paddingRight: 10,
    marginRight: 15,
  },
  input: {
    width: "80%",
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 15,
  },

  topImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "white",
  },
});
